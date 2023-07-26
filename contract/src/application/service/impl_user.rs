use crate::models::contract::AuctionContractExt;
use crate::models::user::{JsonUser, Roles, UserId, UserMetadata};
use crate::models::{contract::AuctionContract, user::ImplUser};
use near_sdk::{env, near_bindgen};

#[near_bindgen]
/// Implement function for user
impl ImplUser for AuctionContract {
    fn create_user(&mut self, name: String, avatar: Option<String>, email: String, phone: String, description: String,) {
        let owner_id = env::signer_account_id();
        // assert!(
        //     !self.user_metadata_by_id.contains_key(&owner_id),
        //     "Account exists"
        // );
        let user = UserMetadata {
            user_id: owner_id.clone(),
            name,
            avatar,
            email,
            phone,
            description,
            role: Roles::Participant,
        };
        let json_user = JsonUser {
            user_id: owner_id.clone(),
            metadata: user,
            items: Vec::new(),
            auctions_host: Vec::new(),
            auctions_join: Vec::new(),
        };
        self.participant_users.insert(&owner_id);
        self.user_metadata_by_id.insert(&owner_id, &json_user);
    }

    fn update_role(&mut self, role: Roles) -> crate::models::user::JsonUser {
        let owner_id = env::signer_account_id();
        
        let mut user_account = self.get_user_metadata_by_user_id(&owner_id).expect("Account does not exists");

        self.update_user_information( 
            user_account.metadata.name.clone(), 
            user_account.metadata.avatar.clone(), 
            user_account.metadata.email.clone(), 
            user_account.metadata.phone.clone(), 
            user_account.metadata.description.clone()
        );

        if role == Roles::Participant {
            user_account.metadata.role = role;
            self.participant_users.insert(&owner_id);
            self.auctioneer_users.remove(&owner_id); // Remove from Auctioneer if present
        } else if role == Roles::Auctioneer {
            user_account.metadata.role = role;
            self.auctioneer_users.insert(&owner_id);
            self.participant_users.remove(&owner_id); // Remove from Participant if present
        } else {
            // Handle other roles if needed
        }

        self.user_metadata_by_id.insert(&owner_id, &user_account);
        user_account
    }

    fn get_user_metadata_by_user_id(&self, user_id: &UserId) -> Option<JsonUser> {
        self.user_metadata_by_id.get(user_id)
    }

    fn update_user_information(&mut self, name: String, avatar: Option<String>, email: String, phone: String, description: String) -> crate::models::user::JsonUser {
        let owner_id = env::signer_account_id();
        
        let mut user_account = self.get_user_metadata_by_user_id(&owner_id).expect("Account does not exists");

        user_account.metadata.name = name;
        user_account.metadata.avatar = avatar;
        user_account.metadata.email = email;
        user_account.metadata.phone = phone;
        user_account.metadata.description = description;
        
        self.user_metadata_by_id.insert(&owner_id, &user_account);
        user_account
    }

    fn get_all_user_metadata(
        &self,
        from_index: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<crate::models::user::JsonUser> {
        todo!()
    }

    fn check_user_role(&self , user_id: crate::models::user::UserId) -> crate::models::user::Roles {
        let user_account = self.get_user_metadata_by_user_id(&user_id).expect("Account does not exists");
        user_account.metadata.role
    }
}
