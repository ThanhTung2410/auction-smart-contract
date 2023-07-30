use std::collections::HashMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::Balance;

pub type JointAuctionId = String;

use super::bid_transaction::BidTransaction;
use super::{item::ItemId, user::UserId};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Pool {
    pub map: HashMap<UserId, bool>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct JointAuctionMetadata {
    pub joint_auction_id: JointAuctionId,

    pub set_host_id: Vec<UserId>, // can get from the Pool

    /// timestamp
    pub created_at: u64,

    pub closed_at: u64,

    // A floor price is the minimum net bid price that a seller is willing to accept for a bid in an auction
    pub floor_price: Option<Balance>,

    pub winner: Option<UserId>,

    pub highest_bid: Option<Balance>,

    pub set_item_id: Vec<ItemId>,

    pub is_finish: bool,

    // need to have accept of all user
    pub pool: Pool,

    pub is_open: bool,
}

pub trait ImplJointAuction {
    fn check_collaboration_of_auction(&self, joint_auction_id: JointAuctionId) -> bool;

    /// like the invitation to other user would like to join in
    /// we will have the accept function to change ...
    /// after all ... accept then we will open the auction
    /// create in contract a UnorderSet of joint auction
    /// auction just add in here when satisfy requirement
    fn create_joint_auction(
        &mut self,

        users_invited: Vec<UserId>,

        set_item_id: Vec<ItemId>,

        closed_at: u64,

        floor_price: Option<Balance>,
    ) -> JointAuctionMetadata;

    fn accept_invitation(&mut self, joint_auction_id: JointAuctionId);

    fn get_all_joint_auctions_open(&self) -> Vec<JointAuctionMetadata>; // just for auctions that is open

    /// Get joint auction metadata by auction id
    fn get_joint_auction_metadata_by_joint_auction_id(
        &self,
        joint_auction_id: JointAuctionId,
    ) -> Option<JointAuctionMetadata>;

    fn delete_joint_auction(&mut self, joint_auction_id: JointAuctionId);

    fn bid_joint_auction(&mut self, joint_auction_id: JointAuctionId); // like fn join_auction in normal auction

    // fn get_user_bid_transaction_by_auction_id(
    //     &self,
    //     auction_id: AuctionId,
    //     user_id: UserId,
    // ) -> Option<BidTransaction>;

    // fn get_all_transaction_by_auction_id(&self, auction_id: AuctionId) -> Vec<BidTransaction>;

    // fn finish_auction(&mut self, auction_id: AuctionId);
}
