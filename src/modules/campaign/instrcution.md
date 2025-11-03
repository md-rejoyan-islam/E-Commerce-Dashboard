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
- applies_to
  - all_products => boolean
  - productsIds => array of product IDs
  - categoryIds => array of category IDs
  - brandIds => array of brand IDs
- minimum_purchase_amount
- free_shipping (boolean)
- usage_limit
- is_active
- created_at
- updated_at

## Fields

| Field Name              | Type     | Description                                |
| ----------------------- | -------- | ------------------------------------------ |
| name                    | string   | Campaign name                              |
| description             | string   | Campaign description                       |
| image                   | string   | Campaign image URL                         |
| start_date              | datetime | Campaign start date                        |
| end_date                | datetime | Campaign end date                          |
| discount_type           | string   | Discount type (percentage or fixed_amount) |
| discount_value          | number   | Discount value                             |
| applies_to              | object   | Applicability details                      |
| applies_to.all_products | boolean  | Applies to all products                    |
| applies_to.productsIds  | array    | Array of product IDs                       |
| applies_to.categoryIds  | array    | Array of category IDs                      |
| applies_to.brandIds     | array    | Array of brand IDs                         |
| minimum_purchase_amount | number   | Minimum purchase amount for campaign       |
| free_shipping           | boolean  | Free shipping status                       |
| usage_limit             | number   | Maximum usage limit for the campaign       |
| is_active               | boolean  | Campaign active status                     |
| created_at              | datetime | Campaign creation timestamp                |
| updated_at              | datetime | Last update timestamp                      |

## Routes

| Method | Endpoint                                           | Description                                                              | Access     | Cache            |
| ------ | -------------------------------------------------- | ------------------------------------------------------------------------ | ---------- | ---------------- |
| GET    | /campaigns?search&is_active&fields&includeProducts | List all campaigns with optional search, filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /campaigns                                         | Create a new campaign                                                    | Admin only | Invalidate cache |
| GET    | /campaigns/{id}?fields&includeProducts             | Retrieve a specific campaign                                             | Public     | Redis cache      |
| PUT    | /campaigns/{id}                                    | Update a specific campaign                                               | Admin only | Invalidate cache |
| PATCH  | /campaigns/{id}/status                             | Change a campaign's active status                                        | Admin only | Invalidate cache |
| DELETE | /campaigns/{id}                                    | Delete a specific campaign                                               | Admin only | Invalidate cache |
