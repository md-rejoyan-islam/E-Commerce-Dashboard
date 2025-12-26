## Fields

| Field Name  | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| title       | string   | Banner title                      |
| description | string   | Banner description                |
| image       | string   | Banner image URL                  |
| link        | string   | Banner link URL                   |
| is_active   | boolean  | Banner active status              |
| type        | string   | Banner type (popup/slider/static) |
| created_at  | datetime | Banner creation timestamp         |
| updated_at  | datetime | Last update timestamp             |

## Routes

| Method | Endpoint                              | Description                                                    | Access     | Cache            |
| ------ | ------------------------------------- | -------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /banners?type&is_active&search&fields | List all banners with optional filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /banners                              | Create a new banner                                            | Admin only | Invalidate cache |
| GET    | /banners/{id}&fields                  | Retrieve a specific banner                                     | Public     | Redis cache      |
| PUT    | /banners/{id}                         | Update a specific banner                                       | Admin only | Invalidate cache |
| PATCH  | /banners/{id}/status                  | Change a banner's active status                                | Admin only | Invalidate cache |
| DELETE | /banners/{id}                         | Delete a specific banner                                       | Admin only | Invalidate cache |
