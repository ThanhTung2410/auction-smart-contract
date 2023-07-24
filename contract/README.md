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