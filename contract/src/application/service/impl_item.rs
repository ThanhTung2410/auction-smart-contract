use crate::models::contract::AuctionContractExt;
use crate::models::{contract::AuctionContract, item::ImplItem};
use near_sdk::near_bindgen;

#[near_bindgen]
/// Implement function for item
impl ImplItem for AuctionContract {
    fn create_item(&mut self) -> crate::models::item::ItemMetadata {
        todo!()
    }

    fn get_item_metadata_by_item_id(
        &self,
        item_id: crate::models::item::ItemId,
    ) -> Option<crate::models::item::ItemMetadata> {
        todo!()
    }

    fn get_all_items_per_user_own(
        &self,
        user_id: crate::models::user::UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<crate::models::item::ItemMetadata> {
        todo!()
    }

    fn update_item(&mut self) {
        todo!()
    }

    fn delete_item(&mut self) -> crate::models::item::ItemMetadata {
        todo!()
    }
}
