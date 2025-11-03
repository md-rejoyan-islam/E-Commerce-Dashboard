## Fields

- id (unique , number)
- user_id (string , reference)
- coupon (string , reference)
- order_items (array of objects)
  - product_id (string , reference)
  - quantity (number)
  - price (number)
- total_amount (number)
- payment_method (string , enum: bkash, rocket, nagad, credit_card, debit_card, cash_on_delivery)
- order_status (string , enum: pending, processing, shipped, delivered, cancelled, returned)
- transaction_id (string , unique)
- shipped_date (datetime)
- delivered_date (datetime)
- cancellation_date (datetime)
- cancellation_reason (string)
- return_reason (string)
- is_returned (boolean)
- return_date (datetime)
- refund_amount (number)
- refund_status (string , enum: pending, processed, failed)
- tracking_number (string)
- is_active (boolean)
- shipping_address (object)
  - street (string)
  - phone (string)
  - email (string)
  - city (string)
  - state (string)
  - zip_code (string)
  - country (string)
- created_at (datetime)
- updated_at (datetime)

## Fields

| Field Name          | Type     | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| id                  | number   | Unique order ID                          |
| user_id             | string   | User ID (reference)                      |
| coupon              | string   | Coupon code applied (reference)          |
| order_items         | array    | Array of order item objects              |
| total_amount        | number   | Total order amount                       |
| payment_method      | string   | Payment method (bkash, rocket, etc.)     |
| order_status        | string   | Order status (pending, shipped, etc.)    |
| transaction_id      | string   | Unique transaction ID                    |
| shipped_date        | datetime | Date when the order was shipped          |
| delivered_date      | datetime | Date when the order was delivered        |
| cancellation_date   | datetime | Date when the order was cancelled        |
| cancellation_reason | string   | Reason for order cancellation            |
| return_reason       | string   | Reason for order return                  |
| is_returned         | boolean  | Return status                            |
| return_date         | datetime | Date when the order was returned         |
| refund_amount       | number   | Refund amount                            |
| refund_status       | string   | Refund status (pending, processed, etc.) |
| tracking_number     | string   | Shipping tracking number                 |
| is_active           | boolean  | Order active status                      |
| shipping_address    | object   | Shipping address object                  |
| created_at          | datetime | Order creation timestamp                 |
| updated_at          | datetime | Last update timestamp                    |

## Routes

| Method | Endpoint                            | Description                                          | Access        | Cache            |
| ------ | ----------------------------------- | ---------------------------------------------------- | ------------- | ---------------- |
| POST   | /orders                             | Create a new order                                   | Authenticated | Invalidate cache |
| GET    | /orders?user_id&order_status&fields | List all orders with optional filters and pagination | Authenticated | Redis cache      |
| GET    | /orders/{id}?fields                 | Retrieve a specific order                            | Authenticated | Redis cache      |
| PUT    | /orders/{id}                        | Update a specific order                              | Admin only    | Invalidate cache |
| PATCH  | /orders/{id}/status                 | Change an order's status                             | Admin only    | Invalidate cache |
| DELETE | /orders/{id}                        | Delete a specific order                              | Admin only    | Invalidate cache |
| POST   | /orders/{id}/cancel                 | Cancel a specific order                              | Authenticated | Invalidate cache |
| POST   | /orders/{id}/return                 | Return a specific order                              | Authenticated | Invalidate cache |
| POST   | /orders/{id}/refund                 | Process a refund for a specific order                | Admin only    | Invalidate cache |
| GET    | /orders/user/{user_id}?fields       | List all orders for a specific user                  | Authenticated | Redis cache      |
| GET    | /orders/stats?start_date&end_date   | Get order statistics within a date range             | Admin only    | Redis cache      |
| GET    | /orders/report?start_date&end_date  | Generate order report within a date range            | Admin only    | Redis cache      |
| POST   | /orders/{id}/track                  | Update tracking information for a specific order     | Admin only    | Invalidate cache |
| GET    | /orders/tracking/{tracking_number}  | Retrieve order by tracking number                    | Authenticated | Redis cache      |
