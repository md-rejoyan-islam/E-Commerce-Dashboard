## Items

| Field Name | Type     | Description             |
| ---------- | -------- | ----------------------- |
| product    | string   | Product ID              |
| quantity   | number   | Number of items         |
| created_at | datetime | Item addition timestamp |
| updated_at | datetime | Item update timestamp   |

## Cart

| Field Name | Type   | Description                |
| ---------- | ------ | -------------------------- |
| user       | string | User ID                    |
| items      | array  | Array of cart item objects |

## Routes

| Method | Endpoint                                             | Description                            | Access     | Cache            |
| ------ | ---------------------------------------------------- | -------------------------------------- | ---------- | ---------------- | ---------------- |
| GET    | /cart?includeUser&includeProduct&fields              | Retrieve the current user's cart       | User only  | Redis cache      |
| POST   | /cart                                                | Add an item to the cart                |            | User only        | Invalidate cache |
| PUT    | /cart/items/{itemId}                                 | Update the quantity of a specific item | User only  | Invalidate cache |
| DELETE | /cart/items/{itemId}                                 | Remove a specific item from the cart   |            | User only        | Invalidate cache |
| DELETE | /cart                                                | Clear all items from the cart          | User only  | Invalidate cache |
| GET    | /cart/all-carts?includeUser&includeProduct&fields    | Retrieve all carts for admin           | Admin only | Redis cache      |
| GET    | /cart/user/:userId?includeUser&includeProduct&fields | Retrieve cart for a specific user      | Admin only | Redis cache      |
| DELETE | /cart/user/:userId                                   | Clear cart for a specific user         | Admin only | Invalidate cache |
