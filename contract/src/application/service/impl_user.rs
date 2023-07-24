use crate::models::contract::AuctionContractExt;
use crate::models::{contract::AuctionContract, user::ImplUser};
use near_sdk::near_bindgen;

#[near_bindgen]
/// Implement function for user
impl ImplUser for AuctionContract {
    fn create_user(&mut self) {
        todo!()
    }

    fn update_role(&mut self) -> crate::models::user::JsonUser {
        todo!()
    }

    fn get_user_metadata_by_user_id(
        &self,
        user_id: &crate::models::user::UserId,
    ) -> Option<crate::models::user::JsonUser> {
        todo!()
    }

    fn update_user_information(&mut self) -> crate::models::user::JsonUser {
        todo!()
    }

    fn get_all_user_metadata(
        &self,
        from_index: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<crate::models::user::JsonUser> {
        todo!()
    }

    fn check_user_role(&self, user_id: crate::models::user::UserId) -> crate::models::user::Roles {
        todo!()
    }
}
