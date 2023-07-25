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

## create new user

```
cargo make call create_user '{"name": "John Doe", "avatar": "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png", "email": "johndoe@gmail.com", "phone": "202-555-0188", "description": "Hi! I am Blockchain Dev"}' --account-id thanhtung2410.testnet
```

## get_user_metadata_by_user_id

```
cargo make call get_user_metadata_by_user_id '{"user_id": "thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## create_item

```
cargo make call create_item '{"item_id": 1, "name": "Vinhome central park", "description": "Khu can ho cao cap", "media": "https://vinhomecentralpark.com/wp-content/uploads/2021/02/mat-bang-vinhomes-central-park.jpg"}' --account-id thanhtung2410.testnet
```

```
cargo make call create_item '{"item_id": 2, "name": "Pi", "description": "Cong dong Pi lac quan", "media": "https://global-uploads.webflow.com/5fad86e2327507cecea2d5e8/644e2b0746017e63acb2f845_Pi%20Network%20Mobile%20Mining.jpg"}' --account-id thanhtung2410.testnet
```

## get_item_metadata_by_item_id

```
cargo make call get_item_metadata_by_item_id '{"item_id": 1}' --account-id thanhtung2410.testnet
```

## get_all_items_per_user_own

```
cargo make call get_all_items_per_user_own '{"user_id": "thanhtung2410.testnet"}' --account-id thanhtung2410.testnet
```

## create_auction

```
cargo make call create_auction '{"item_id": 1, "auction_id": 1, "closed_at": 1690731834000}' --account-id thanhtung2410.testnet
```

## get_auction_metadata_by_auction_id

```
cargo make view get_auction_metadata_by_auction_id '{"auction_id" : 1}'
```

## delete_auction

```
cargo make call delete_auction '{"auction_id": 1}' --account-id thanhtung2410.testnet
```
