## Fields

- first_name: string
- last_name: string
- email: string
- password: string
- is_active: boolean
- role: string
- last_login: datetime
- phone :string
- avatar :string
- created_at: datetime
- updated_at: datetime

## routes

- GET /users?search&role: List all users (admin only) [ with optional search, filter, sorting, and pagination ] [added caching with Redis]
- POST /users: Create a new user (admin only) [Invalidate cache in Redis]
- PATCH /users/{id}/status: Change a user's active status (admin only) [Invalidate cache in Redis]
- PATCH /users/{id}/change-password: Change a user's password (admin only) [Invalidate cache in Redis]
- GET /users/{id}: Retrieve a specific user's profile (admin only) [added caching with Redis]
- PUT /users/{id}: Update a specific user's profile (admin only) [Invalidate cache in Redis]
- DELETE /users/{id}: Delete a specific user (admin only) [Invalidate cache in Redis]
