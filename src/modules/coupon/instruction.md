## Fields

- name
- description
- code (unique)
- discount_type
  - percentage
  - fixed_amount
- discount_value
- usage_limit_per_user
- total_usage_limit
- expiration_date
- minimum_purchase_amount

## Fields

| Field Name              | Type     | Description                                |
| ----------------------- | -------- | ------------------------------------------ |
| name                    | string   | Coupon name                                |
| description             | string   | Coupon description                         |
| code                    | string   | Unique coupon code                         |
| discount_type           | string   | Discount type (percentage or fixed_amount) |
| discount_value          | number   | Discount value                             |
| usage_limit_per_user    | number   | Usage limit per user                       |
| total_usage_limit       | number   | Total usage limit for the coupon           |
| expiration_date         | datetime | Coupon expiration date                     |
| minimum_purchase_amount | number   | Minimum purchase amount for coupon usage   |

## Routes

| Method | Endpoint                         | Description                                                            | Access     | Cache            |
| ------ | -------------------------------- | ---------------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /coupons?search&is_active&fields | List all coupons with optional search, filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /coupons                         | Create a new coupon                                                    | Admin only | Invalidate cache |
| GET    | /coupons/{id}?fields             | Retrieve a specific coupon                                             | Public     | Redis cache      |
| PUT    | /coupons/{id}                    | Update a specific coupon                                               | Admin only | Invalidate cache |
| PATCH  | /coupons/{id}/status             | Change a coupon's active status                                        | Admin only | Invalidate cache |
| DELETE | /coupons/{id}                    | Delete a specific coupon                                               | Admin only | Invalidate cache |
