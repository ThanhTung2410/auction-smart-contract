use crate::models::{contract::AuctionContract, item::ImplItem};

#[near_bindgen]
/// Implement function for item
impl ImplItem for AuctionContract {}
