## Fields

| Field Name  | Type     | Description                 | Field key description                        |
| ----------- | -------- | --------------------------- | -------------------------------------------- |
| name        | string   | Category name               | This is the name of the category             |
| description | string   | Category description        | This provides details about the category     |
| image       | string   | Category image URL          | URL of the category's image                  |
| parent_id   | string   | Parent category ID          | ID of the parent category, if any            |
| featured    | boolean  | Is category featured        | Indicates if the category is featured        |
| slug        | string   | Category slug (unique)      | URL-friendly identifier for the category     |
| order       | number   | Category display order      | Defines the order of categories in listings  |
| is_active   | boolean  | Category active status      | Indicates if the category is active          |
| created_at  | datetime | Category creation timestamp | Timestamp when the category was created      |
| updated_at  | datetime | Last update timestamp       | Timestamp of the last update to the category |

## Routes

| Method | Endpoint                                            | Description                                                               | Access     | Cache            |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /categories?search&featured&is_active&includeParent | List all categories with optional search, filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /categories                                         | Create a new category                                                     | Admin only | Invalidate cache |
| GET    | /categories/{id}                                    | Retrieve a specific category                                              | Public     | Redis cache      |
| PUT    | /categories/{id}                                    | Update a specific category                                                | Admin only | Invalidate cache |
| PATCH  | /categories/{id}/status                             | Change a category's active status                                         | Admin only | Invalidate cache |
| DELETE | /categories/{id}                                    | Delete a specific category                                                | Admin only | Invalidate cache |
