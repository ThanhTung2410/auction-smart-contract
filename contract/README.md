## Remove neardev folder

```
cargo make clean
```

## build and deploy

```
cargo make dev-deploy
```

## init contract

```
cargo make call-self init
```

# User

## create user

```
cargo make call create_user '{"name": "John Doe", "avatar": "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png", "email": "johndoe@gmail.com", "phone": "202-555-0188", "description": "Hi! I am Blockchain Dev"}' --account-id thanhtung2410.testnet
```

```
cargo make call create_user '{"name": "Sang", "avatar": "None", "email": "abc@gmail.com", "phone": "091201", "description":"None"}' --account-id calocnuong.testnet
```

## get_user_metadata_by_user_id

```
cargo make call get_user_metadata_by_user_id '{"user_id": "thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## update user information

```
cargo make call update_user_information '{"name": "Tran Phuoc Sang", "avatar": "None", "email": "transhack09@gmail.com", "phone": "0123456789", "description":"None"}' --account-id calocnuong.testnet
```

# Item

## create_item

```
cargo make call create_item '{"name": "Vinhome central park", "description": "Khu can ho cao cap", "media": "https://vinhomecentralpark.com/wp-content/uploads/2021/02/mat-bang-vinhomes-central-park.jpg"}' --account-id thanhtung2410.testnet
```

```
cargo make call create_item '{"name": "Pi", "description": "Cong dong Pi lac quan", "media": "https://global-uploads.webflow.com/5fad86e2327507cecea2d5e8/644e2b0746017e63acb2f845_Pi%20Network%20Mobile%20Mining.jpg"}' --account-id test_auction_contract.testnet
```

## update_item

```
cargo make call update_item '{"item_id": "item_Vinhome_central_park_thanhtung2410.testnet", "name": "VinHome Central Park VIP", "description": "Khu can ho cao cap hoang gia", "media": "https://vinhomecentralpark.com/wp-content/uploads/2021/02/mat-bang-vinhomes-central-park.jpg"}' --account-id thanhtung2410.testnet
```

```
cargo make call update_item '{"item_id": "item_Pi_test_auction_contract.testnet", "name": "Pi", "description": "Cong dong Pi lac quan so mot Viet Nam", "media": "https://global-uploads.webflow.com/5fad86e2327507cecea2d5e8/644e2b0746017e63acb2f845_Pi%20Network%20Mobile%20Mining.jpg"}' --account-id test_auction_contract.testnet
```

## get_item_metadata_by_item_id

```
cargo make call get_item_metadata_by_item_id '{"item_id": "item_Vinhome_central_park_thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## get_all_items_per_user_own

```
cargo make call get_all_items_per_user_own '{"user_id": "thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## delete_item

```
cargo make call delete_item '{"item_id": "item_Vinhome_central_park_thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

# Auction

## create_auction

```
cargo make call create_auction '{"item_id": "item_Vinhome_central_park_thanhtung2410.testnet", "closed_at": 1690731834000, "floor_price": 0}' --account-id thanhtung2410.testnet
```

```
cargo make call create_auction '{"item_id": "item_Pi_test_auction_contract.testnet", "auction_id": 2, "closed_at": 1690731834000, "floor_price": 1}' --account-id test_auction_contract.testnet
```

## get_auction_metadata_by_auction_id

```
cargo make view get_auction_metadata_by_auction_id '{"auction_id" : "auction_Vinhome_central_park_thanhtung2410.testnet"}'
```

## delete_auction

```
cargo make call delete_auction '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## join_auction

```
cargo make call join_auction '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}' --account-id test_auction_contract.testnet --amount 1
```

```
cargo make call join_auction '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}' --account-id auction_escrow_account.testnet --amount 1
```

## get_all_auctions

```
cargo make view get_all_auctions
```

## get_user_bid_transaction_by_auction_id

```
cargo make view get_user_bid_transaction_by_auction_id '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet", "user_id": "test_auction_contract.testnet"}'
```

```
cargo make view get_user_bid_transaction_by_auction_id '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet", "user_id": "auction_escrow_account.testnet"}'
```

## get_all_transaction_by_auction_id

```
cargo make view get_all_transaction_by_auction_id '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}'
```

## finish_auction

```
cargo make call finish_auction '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}' --account-id thanhtung2410.testnet --amount 2
```

## get_sum_total_bid_transactions_of_auction

```
cargo make view get_sum_total_bid_transactions_of_auction '{"auction_id": "auction_Vinhome_central_park_thanhtung2410.testnet"}'
```
