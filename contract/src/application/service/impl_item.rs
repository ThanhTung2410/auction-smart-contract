use crate::models::contract::AuctionContractExt;
use crate::models::item::{ItemId, ItemMetadata};

use crate::models::user::UserId;
use crate::models::{contract::AuctionContract, item::ImplItem};
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen};

#[near_bindgen]
/// Implement function for item
impl ImplItem for AuctionContract {
    fn create_item(
        &mut self,
        item_id: ItemId,

        name: String,

        description: String,

        media: String,
    ) -> ItemMetadata {
        let owner_id = env::signer_account_id();
        let item = ItemMetadata {
            item_id,

            name,

            description,

            media,

            owner_id: owner_id.clone(),

            created_at: env::block_timestamp(),

            updated_at: env::block_timestamp(),

            is_auction: false,
        };
        let mut set_items = self
            .items_per_user
            .get(&owner_id)
            .or_else(|| Some(UnorderedSet::new(owner_id.clone().to_string().into_bytes()))) // convert string to byte string
            .unwrap();
        set_items.insert(&item_id);

        self.items_per_user.insert(&owner_id, &set_items);
        self.item_metadata_by_id.insert(&item_id, &item);

        item
    }

    fn get_item_metadata_by_item_id(&self, item_id: ItemId) -> Option<ItemMetadata> {
        self.item_metadata_by_id.get(&item_id)
    }

    fn get_all_items_per_user_own(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<ItemMetadata> {
        let items = self.items_per_user.get(&user_id).unwrap();
        let mut vec_items = Vec::new();
        for item_id in items.iter() {
            let item_metadata = self.get_item_metadata_by_item_id(item_id).unwrap();
            vec_items.push(item_metadata);
        }
        vec_items
    }

    fn update_item(
        &mut self,
        item_id: ItemId,
        name: String,
        description: String,
        media: String,
    ) -> Option<ItemMetadata> {
        let owner_id = env::signer_account_id();
    
        if let Some(mut item_metadata) = self.get_item_metadata_by_item_id(item_id) {
            assert_eq!(
                item_metadata.owner_id, owner_id,
                "User does not own the item"
            );
    
            item_metadata.name = name;
            item_metadata.description = description;
            item_metadata.media = media;
            item_metadata.updated_at = env::block_timestamp();
    
            self.item_metadata_by_id.insert(&item_id, &item_metadata);
            Some(item_metadata) 
        } else {
            None 
        }
    }    

    fn delete_item(&mut self, item_id: ItemId) -> ItemMetadata {
        let item_found = self.item_metadata_by_id.get(&item_id).unwrap();
        let owner_id = env::signer_account_id();
        let mut set_items = self.items_per_user.get(&owner_id).unwrap();
        set_items.remove(&item_id);
        self.items_per_user.insert(&owner_id, &set_items);
        self.item_metadata_by_id.remove(&item_id);
        item_found
    }
}
