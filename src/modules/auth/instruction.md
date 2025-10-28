## Fields (User Model)

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

| Method | Endpoint     | Description                               | Access        | Cache                    |
| ------ | ------------ | ----------------------------------------- | ------------- | ------------------------ |
| POST   | /register    | Register a new user                       | Public        | -                        |
| POST   | /login       | Authenticate a user and return tokens     | Public        | Redis cache (rate limit) |
| POST   | /refresh     | Refresh access token using refresh token  | Public        | -                        |
| POST   | /logout      | Invalidate the user's token               | Authenticated | Invalidate cache         |
| GET    | /me          | Retrieve the authenticated user's profile | Authenticated | Redis cache              |
| PUT    | /me          | Update the authenticated user's profile   | Authenticated | Invalidate cache         |
| PATCH  | /me/password | Change the authenticated user's password  | Authenticated | Invalidate cache         |
