use crate::models::{contract::AuctionContract, user::ImplUser};

#[near_bindgen]
/// Implement function for user
impl ImplUser for AuctionContract {}
