use crate::models::auction::{AuctionId, AuctionMetadata};
use crate::models::contract::AuctionContractExt;
use crate::models::item::ItemId;
use crate::models::user::UserId;
use crate::models::{auction::ImplAuction, contract::AuctionContract};
use near_sdk::__private::schemars::Set;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen, Balance, Promise};

#[near_bindgen]
/// Implement function for auction
impl ImplAuction for AuctionContract {
    fn create_auction(
        &mut self,
        item_id: ItemId,

        auction_id: AuctionId,

        closed_at: u64,

        floor_price: Option<Balance>,
    ) {
        let owner_id = env::signer_account_id();
        let auction = AuctionMetadata {
            item_id,
            auction_id,
            host_id: owner_id.clone(),
            created_at: env::block_timestamp_ms(),
            closed_at,
            floor_price,
            winner: None,
            highest_bid: None,
            users_join_auction: Set::new(),
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
        self.auction_metadata_by_id.remove(&auction_id);
    }

    #[payable]
    fn join_auction(&mut self, auction_id: AuctionId) {
        let mut auction = self.get_auction_metadata_by_auction_id(auction_id).unwrap();
        let highest_bid = auction.highest_bid.or_else(|| Some(0)).unwrap();

        let bid = env::attached_deposit() / 10u128.pow(24);

        // check condition
        assert!(
            bid > highest_bid,
            "You need to pay more than the highest bid"
        );
        assert!(
            env::block_timestamp_ms() < auction.closed_at,
            "The auction is closed"
        );

        auction.winner = Some(env::signer_account_id());
        auction.highest_bid = Some(bid);
        auction.users_join_auction.insert(env::signer_account_id());
        self.auction_metadata_by_id.insert(&auction_id, &auction);

        let mut set_auction_user_join = self
            .auctions_join_per_user
            .get(&env::signer_account_id())
            .or_else(|| {
                Some(UnorderedSet::new(
                    env::signer_account_id().clone().to_string().into_bytes(),
                ))
            })
            .unwrap();
        set_auction_user_join.insert(&auction_id);
        self.auctions_join_per_user
            .insert(&env::signer_account_id(), &set_auction_user_join);

        Promise::new(auction.host_id).transfer(env::attached_deposit());
    }
}
