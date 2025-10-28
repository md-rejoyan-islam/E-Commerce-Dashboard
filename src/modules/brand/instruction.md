## Fields

| Field Name  | Type     | Description              |
| ----------- | -------- | ------------------------ |
| name        | string   | Brand name               |
| description | string   | Brand description        |
| logo        | string   | Brand logo URL           |
| slug        | string   | Brand slug (unique)      |
| featured    | boolean  | Is brand featured        |
| order       | number   | Brand display order      |
| website     | string   | Brand website URL        |
| is_active   | boolean  | Brand active status      |
| created_at  | datetime | Brand creation timestamp |
| updated_at  | datetime | Last update timestamp    |

## Routes

| Method | Endpoint                 | Description                                                           | Access     | Cache            |
| ------ | ------------------------ | --------------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /brands?search&is_active | List all brands with optional search, filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /brands                  | Create a new brand                                                    | Admin only | Invalidate cache |
| GET    | /brands/{id}             | Retrieve a specific brand                                             | Public     | Redis cache      |
| PUT    | /brands/{id}             | Update a specific brand                                               | Admin only | Invalidate cache |
| PATCH  | /brands/{id}/status      | Change a brand's active status                                        | Admin only | Invalidate cache |
| DELETE | /brands/{id}             | Delete a specific brand                                               | Admin only | Invalidate cache |
