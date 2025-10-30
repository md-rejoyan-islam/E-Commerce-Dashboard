## Fields

| Field Name | Type     | Description             |
| ---------- | -------- | ----------------------- |
| product    | string   | Product ID              |
| timestamp  | datetime | Item addition timestamp |

## Cart

| Field Name | Type   | Description                |
| ---------- | ------ | -------------------------- |
| user       | string | User ID                    |
| items      | array  | Array of cart item objects |

## Routes

| Method | Endpoint                                                 | Description                                 | Access          | Cache            |
| ------ | -------------------------------------------------------- | ------------------------------------------- | --------------- | ---------------- |
| GET    | /wishlist?includeUser&includeProduct&fields              | Retrieve the current user's wishlist        | User only       | Redis cache      |
| POST   | /wishlist                                                | Add an item to the wishlist                 | User only       | Invalidate cache |
| GET    | /wishlist/:id?includeUser&includeProduct&fields          | Retrieve a specific wishlist item           | User/Admin only | Redis cache      |
| DELETE | /wishlist/:id                                            | Remove a specific item from the wishlist    | User/Admin only | Invalidate cache |
| DELETE | /wishlist                                                | Clear all items from the wishlist           | User only       | Invalidate cache |
| GET    | /wishlist/all-items?includeUser&includeProduct&fields    | Retrieve all wishlist items for admin       | Admin only      | Redis cache      |
| GET    | /wishlist/user/:userId?includeUser&includeProduct&fields | Retrieve wishlist items for a specific user | Admin only      | Redis cache      |
| DELETE | /wishlist/user/:userId                                   | Clear wishlist items for a specific user    | Admin only      | Invalidate cache |
