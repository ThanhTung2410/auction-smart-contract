use crate::models::contract::AuctionContractExt;
use crate::models::{auction::ImplAuction, contract::AuctionContract};
use near_sdk::near_bindgen;

#[near_bindgen]
/// Implement function for auction
impl ImplAuction for AuctionContract {
    fn create_auction(&mut self, item_id: crate::models::item::ItemId) {
        todo!()
    }

    fn get_all_auctions_per_user(
        &self,
        user_id: crate::models::user::UserId,
    ) -> Vec<crate::models::auction::AuctionMetadata> {
        todo!()
    }

    fn get_all_auction_metadata_by_auction_id(
        &self,
        auction_id: crate::models::auction::AuctionId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<crate::models::auction::AuctionId> {
        todo!()
    }

    fn join_auction(&mut self, auction_id: crate::models::auction::AuctionId) {
        todo!()
    }
}
