## Fields

| Field Name    | Type     | Description                     |
| ------------- | -------- | ------------------------------- |
| image         | string   | Store image URL                 |
| name          | string   | Store name                      |
| description   | string   | Store description               |
| city          | string   | Store city                      |
| country       | string   | Store country                   |
| division      | string   | Store division/state            |
| zip_code      | string   | Store zip/postal code           |
| map_location  | string   | Store map location URL or embed |
| phone         | string   | Store contact phone number      |
| email         | string   | Store contact email address     |
| working_hours | string   | Store working hours             |
| is_active     | boolean  | Store active status             |
| created_at    | datetime | Store creation timestamp        |
| updated_at    | datetime | Last update timestamp           |

## Routes

| Method | Endpoint                 | Description                                                   | Access     | Cache            |
| ------ | ------------------------ | ------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /stores?is_active&search | List all stores with optional filter, sorting, and pagination | Public     | Redis cache      |
| POST   | /stores                  | Create a new store                                            | Admin only | Invalidate cache |
| GET    | /stores/{id}             | Retrieve a specific store                                     | Public     | Redis cache      |
| PUT    | /stores/{id}             | Update a specific store                                       | Admin only | Invalidate cache |
| PATCH  | /stores/{id}/status      | Change a store's active status                                | Admin only | Invalidate cache |
| DELETE | /stores/{id}             | Delete a specific store                                       | Admin only | Invalidate cache |
