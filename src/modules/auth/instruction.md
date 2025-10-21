## Fields ( User Model)

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

- POST /register: Register a new user
- POST /login: Authenticate a user and return a token [ added caching with Redis]
- POST /logout: Invalidate the user's token [ Invalidate cache in Redis]
- GET /me: Retrieve the authenticated user's profile [ added caching with Redis]
- PUT /me: Update the authenticated user's profile [ Invalidate cache in Redis]
- PATCH /me/password: Change the authenticated user's password [ Invalidate cache in Redis]
