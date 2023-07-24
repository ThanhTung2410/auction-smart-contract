use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{Balance, __private::schemars::Set};

use super::{item::ItemId, user::UserId};

pub type AuctionId = u128;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionMetadata {
    auction_id: AuctionId,

    host_id: UserId,

    /// timestamp
    created_at: u128,

    closed_at: u128,

    // A floor price is the minimum net bid price that a seller is willing to accept for a bid in an auction
    floor_price: Balance,

    winner: Option<UserId>,

    highest_bid: Balance,

    users_join_auction: Set<UserId>,
}

pub trait ImplAuction {
    /// Create new auction by user
    fn create_auction(&mut self, item_id: ItemId);

    /// Get all auctions per user
    fn get_all_auctions_per_user(&self, user_id: UserId) -> Vec<AuctionMetadata>;

    /// Get auction metadata by auction id
    fn get_all_auction_metadata_by_auction_id(
        &self,
        auction_id: AuctionId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<AuctionId>;
    fn join_auction(&mut self, auction_id: AuctionId); // payment
}
