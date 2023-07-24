use std::time::SystemTime;

use super::user::UserId;

pub type ItemId = u128;

pub struct ItemMetadata {
    item_id: ItemId,

    name: String,

    description: String,

    media: String,

    owner_id: UserId,

    created_at: SystemTime,

    updated_at: SystemTime,

    is_auction: bool,
}

pub trait ImplItem {
    fn create_item(&mut self) -> ItemMetadata;

    fn get_item_metadata_by_item_id(&self, item_id: ItemId) -> Option<ItemMetadata>;

    /// Get all the item per user have. Current but without successful auction items
    fn get_all_items_per_user_own(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<ItemMetadata>;

    fn update_item(&mut self);

    fn delete_item(&mut self) -> ItemMetadata;
}
