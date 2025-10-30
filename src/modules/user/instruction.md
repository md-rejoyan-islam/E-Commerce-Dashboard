## Fields

| Field Name | Type     | Description                       |
| ---------- | -------- | --------------------------------- |
| first_name | string   | User's first name                 |
| last_name  | string   | User's last name                  |
| email      | string   | User's email address (unique)     |
| password   | string   | User's password (hashed)          |
| is_active  | boolean  | User account active status        |
| role       | string   | User role (admin/user/superadmin) |
| last_login | datetime | Last login timestamp              |
| phone      | string   | User's phone number               |
| avatar     | string   | User's avatar URL                 |
| created_at | datetime | Account creation timestamp        |
| updated_at | datetime | Last update timestamp             |

## Routes

| Method | Endpoint                    | Description                                                          | Access     | Cache            |
| ------ | --------------------------- | -------------------------------------------------------------------- | ---------- | ---------------- |
| GET    | /users?search&role&fields   | List all users with optional search, filter, sorting, and pagination | Admin only | Redis cache      |
| POST   | /users                      | Create a new user                                                    | Admin only | Invalidate cache |
| GET    | /users/{id}?fields          | Retrieve a specific user's profile                                   | Admin only | Redis cache      |
| PUT    | /users/{id}                 | Update a specific user's profile                                     | Admin only | Invalidate cache |
| PATCH  | /users/{id}/status          | Change a user's active status                                        | Admin only | Invalidate cache |
| PATCH  | /users/{id}/change-password | Change a user's password                                             | Admin only | Invalidate cache |
| DELETE | /users/{id}                 | Delete a specific user                                               | Admin only | Invalidate cache |
