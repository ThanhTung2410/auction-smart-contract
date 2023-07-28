use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{Balance, __private::schemars::Set};

use super::{item::ItemId, user::UserId};

pub type AuctionId = u128;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionMetadata {
    pub auction_id: AuctionId,

    pub host_id: UserId,

    /// timestamp
    pub created_at: u64,

    pub closed_at: u64,

    // A floor price is the minimum net bid price that a seller is willing to accept for a bid in an auction
    pub floor_price: Option<Balance>,

    pub winner: Option<UserId>,

    pub highest_bid: Option<Balance>,

    pub users_join_auction: Set<UserId>,

    pub item_id: ItemId,
}

pub trait ImplAuction {
    /// Create new auction by user
    fn create_auction(
        &mut self,
        item_id: ItemId,

        auction_id: AuctionId,

        closed_at: u64,

        floor_price: Option<Balance>,
    );

    fn get_all_auctions(&self) -> Vec<AuctionMetadata>;

    /// Get all auctions per user
    fn get_all_auctions_host_per_user(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<AuctionMetadata>;

    /// Get auction metadata by auction id
    fn get_auction_metadata_by_auction_id(&self, auction_id: AuctionId) -> Option<AuctionMetadata>;

    fn delete_auction(&mut self, auction_id: AuctionId);

    fn join_auction(&mut self, auction_id: AuctionId); // payment
}
