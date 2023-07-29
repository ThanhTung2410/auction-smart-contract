use crate::models::auction::{self, AuctionId, AuctionMetadata};
use crate::models::bid_transaction::BidTransaction;
use crate::models::contract::AuctionContractExt;
use crate::models::item::ItemId;
use crate::models::user::UserId;
use crate::models::{auction::ImplAuction, contract::AuctionContract};
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen, Balance, Promise, ONE_NEAR};

fn convert_to_auction_id(host: UserId, item_name: String) -> String {
    let auction = "auction ".to_ascii_lowercase();
    let host_convert = host.to_string().to_ascii_lowercase();
    let result = auction + &item_name + " " + &host_convert;
    result.replace(' ', "_")
}

#[near_bindgen]
/// Implement function for auction
impl ImplAuction for AuctionContract {
    fn create_auction(&mut self, item_id: ItemId, closed_at: u64, floor_price: Option<Balance>) {
        let owner_id = env::signer_account_id();
        let item = self.item_metadata_by_id.get(&item_id).unwrap();
        let auction_id = convert_to_auction_id(owner_id.clone(), item.name);
        let auction = AuctionMetadata {
            item_id,
            auction_id: auction_id.clone(),
            host_id: owner_id.clone(),
            created_at: env::block_timestamp_ms(),
            closed_at,
            floor_price,
            winner: None,
            highest_bid: None,
            is_finish: false,
        };

        let mut set_auction_user_host = self
            .auctions_host_per_user
            .get(&owner_id)
            .or_else(|| Some(UnorderedSet::new(owner_id.clone().to_string().into_bytes())))
            .unwrap();
        set_auction_user_host.insert(&auction_id);
        self.auctions_host_per_user
            .insert(&owner_id, &set_auction_user_host);
        self.auction_metadata_by_id.insert(&auction_id, &auction);
        self.all_auctions.insert(&auction_id);
    }

    fn get_all_auctions(&self) -> Vec<AuctionMetadata> {
        let mut result = Vec::new();
        if self.all_auctions.is_empty() {
            return result;
        }
        for auction_id in self.all_auctions.iter() {
            result.push(self.get_auction_metadata_by_auction_id(auction_id).unwrap());
        }
        result
    }

    fn get_all_auctions_host_per_user(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<AuctionMetadata> {
        todo!()
    }

    fn get_auction_metadata_by_auction_id(&self, auction_id: AuctionId) -> Option<AuctionMetadata> {
        assert!(
            self.auction_metadata_by_id.contains_key(&auction_id),
            "Auction does not exist"
        );
        self.auction_metadata_by_id.get(&auction_id)
    }

    fn delete_auction(&mut self, auction_id: AuctionId) {
        // self.auctions_host_per_user
        let owner_id = env::signer_account_id();
        let auction = self.auction_metadata_by_id.get(&auction_id).unwrap();
        assert_eq!(
            owner_id, auction.host_id,
            "You do not have permission to delete"
        );
        self.all_auctions.remove(&auction_id);
        self.auction_metadata_by_id.remove(&auction_id);
    }

    #[payable]
    fn join_auction(&mut self, auction_id: AuctionId) {
        let mut auction = self
            .get_auction_metadata_by_auction_id(auction_id.clone())
            .unwrap();

        assert!(!auction.is_finish, "The auction had finished");

        let highest_bid = auction.highest_bid.or_else(|| auction.floor_price).unwrap();

        let mut bid = env::attached_deposit() / ONE_NEAR;

        let user_join_id = env::signer_account_id();

        // each auction if user join will have one bid transaction
        // if user want to bid higher in that auction than the previous we will update that old transaction

        // same to set auctions user join
        let mut set_transactions_user_have = self
            .transactions_per_user_have
            .get(&user_join_id)
            .or_else(|| {
                Some(UnorderedSet::new(
                    user_join_id.clone().to_string().into_bytes(),
                ))
            })
            .unwrap();

        let transaction_found = set_transactions_user_have.iter().find(|transaction| {
            transaction.owner_id == user_join_id && transaction.auction_id == auction_id
        });

        if !transaction_found.is_none() {
            let tmp = transaction_found.unwrap(); // rename var
            let mut update_transaction = tmp.clone();
            let bid_clone = bid.clone(); // rename var
            bid += update_transaction.total_bid; // correct
            update_transaction.total_bid += bid_clone;
            update_transaction.updated_at = env::block_timestamp_ms();
            set_transactions_user_have.remove(&tmp);
            set_transactions_user_have.insert(&update_transaction);
        } else {
            let bid_transaction = BidTransaction {
                updated_at: env::block_timestamp_ms(),
                total_bid: bid,
                owner_id: user_join_id.clone(),
                auction_id: auction_id.clone(),
            };
            set_transactions_user_have.insert(&bid_transaction);
        }

        // check condition
        assert!(
            bid > highest_bid,
            "You need to pay more than the highest bid"
        );
        assert!(
            env::block_timestamp_ms() < auction.closed_at,
            "The auction is closed"
        );

        let mut set_auctions_user_join = self
            .auctions_join_per_user
            .get(&auction_id)
            .or_else(|| {
                let key = user_join_id.to_string() + "_" + &auction_id;
                Some(UnorderedSet::new(key.into_bytes()))
            })
            .unwrap();

        set_auctions_user_join.insert(&user_join_id);

        auction.winner = Some(env::signer_account_id());
        auction.highest_bid = Some(bid);

        self.auction_metadata_by_id.insert(&auction_id, &auction);

        self.transactions_per_user_have
            .insert(&env::signer_account_id(), &set_transactions_user_have);

        self.auctions_join_per_user
            .insert(&auction_id, &set_auctions_user_join);

        Promise::new(auction.host_id).transfer(env::attached_deposit());
    }

    fn get_user_bid_transaction_by_auction_id(
        &self,
        auction_id: AuctionId,
        user_id: UserId,
    ) -> Option<BidTransaction> {
        if let Some(set_transactions_user_have) = self.transactions_per_user_have.get(&user_id) {
            for transaction in set_transactions_user_have.iter() {
                if transaction.owner_id == user_id && transaction.auction_id == auction_id {
                    return Some(transaction);
                }
            }
        }
        None
    }

    fn get_all_transaction_by_auction_id(&self, auction_id: AuctionId) -> Vec<BidTransaction> {
        let mut result = Vec::new();
        if self.auctions_join_per_user.get(&auction_id).is_none() {
            return result;
        }
        let set_user_join_this_auction = self.auctions_join_per_user.get(&auction_id).unwrap();
        if set_user_join_this_auction.is_empty() {
            return result;
        }
        for user_id in set_user_join_this_auction.iter() {
            result.push(
                self.get_user_bid_transaction_by_auction_id(auction_id.clone(), user_id)
                    .unwrap(),
            )
        }
        result
    }

    // except the winner
    fn get_sum_total_bid_transactions_of_auction(&self, auction_id: AuctionId) -> u128 {
        let auction = self
            .get_auction_metadata_by_auction_id(auction_id.clone())
            .unwrap();
        let transactions = self.get_all_transaction_by_auction_id(auction_id.clone());
        transactions
            .iter()
            .filter(|transaction| transaction.owner_id != *auction.winner.as_ref().unwrap())
            .fold(0, |acc, transaction| acc + transaction.total_bid)
    }

    // send back money to others after auction finish & change the owner of item to the winner
    #[payable]
    fn finish_auction(&mut self, auction_id: AuctionId) {
        // update auction
        let mut auction = self
            .get_auction_metadata_by_auction_id(auction_id.clone())
            .unwrap();

        assert!(!auction.is_finish, "The auction had finished");

        auction.is_finish = true;
        self.auction_metadata_by_id.insert(&auction_id, &auction);

        // update owner_item
        let mut item = self.item_metadata_by_id.get(&auction.item_id).unwrap();
        item.owner_id = auction.winner.unwrap();
        self.item_metadata_by_id.insert(&item.item_id, &item);

        // send back money
        let transactions = self.get_all_transaction_by_auction_id(auction_id.clone());
        for transaction in transactions.iter() {
            if transaction.owner_id != auction.host_id {
                Promise::new(transaction.owner_id.clone())
                    .transfer(transaction.total_bid.clone() * ONE_NEAR);
            }
        }
    }
}
