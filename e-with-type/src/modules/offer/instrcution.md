## Fields

- name
- description
- image
- start_date
- end_date
- discount_type
  - percentage
  - fixed_amount
- discount_value
- applicable_products (array of product IDs)
- free_shipping (boolean)
- is_active
- created_at
- updated_at

## Fields

| Field Name          | Type     | Description                                |
| ------------------- | -------- | ------------------------------------------ | --- |
| name                | string   | Offer name                                 |
| description         | string   | Offer description                          |
| image               | string   | Offer image URL                            |
| start_date          | datetime | Offer start date                           |
| end_date            | datetime | Offer end date                             |
| discount_type       | string   | Discount type (percentage or fixed_amount) |
| discount_value      | number   | Discount value                             |     |
| applicable_products | array    | Array of applicable product IDs            |
| free_shipping       | boolean  | Free shipping status                       |
| is_active           | boolean  | Offer active status                        |
| created_at          | datetime | Offer creation timestamp                   |
| updated_at          | datetime | Last update timestamp                      |

## Routes

| Method | Endpoint                                        | Description                                                           | Access     | Cache            |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /offers?search&is_active&fields&includeProducts | List all offers with optional search, filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /offers                                         | Create a new offer                                                    | Admin only | Invalidate cache |
| GET    | /offers/{id}?fields&includeProducts             | Retrieve a specific offer                                             | Public     | Redis cache      |
| PUT    | /offers/{id}                                    | Update a specific offer                                               | Admin only | Invalidate cache |
| PATCH  | /offers/{id}/status                             | Change an offer's active status                                       | Admin only | Invalidate cache |
| DELETE | /offers/{id}                                    | Delete a specific offer                                               | Admin only | Invalidate cache |
