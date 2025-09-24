Backend API Endpoints (minimum required):

POST /api/auth/register - User registration
  Request Body:
    {
      "username": "string (required, unique)",
      "email": "string (required, unique, valid email)",
      "password": "string (required, min length 6)",
      "full_name": "string (optional)"
    }
  Response (201):
    {
      "message": "User registered successfully",
      "user": {
        "id": "number",
        "username": "string",
        "email": "string",
        "full_name": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      },
      "token": "string (JWT)"
    }
  Error Responses:
    400: { "error": "Username, email, and password are required" }
    409: { "error": "User with this email already exists" } or { "error": "Username already taken" }
    500: { "error": "Internal server error" }

  Test Requirements:
    - Successful registration with valid data
    - Registration fails with duplicate email
    - Registration fails with duplicate username
    - Registration fails with missing username
    - Registration fails with missing email
    - Registration fails with missing password
    - Registration succeeds with optional full_name
    - Password is hashed and not returned in user object

POST /api/auth/login - User login
  Request Body:
    {
      "email": "string (required)",
      "password": "string (required)"
    }
  Response (200):
    {
      "message": "Login successful",
      "user": {
        "id": "number",
        "username": "string",
        "email": "string",
        "full_name": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      },
      "token": "string (JWT)"
    }
  Error Responses:
    400: { "error": "Email and password are required" }
    401: { "error": "Invalid credentials" }
    500: { "error": "Internal server error" }

  Test Requirements:
    - Successful login with valid credentials
    - Login fails with invalid email
    - Login fails with wrong password
    - Login fails with missing email
    - Login fails with missing password
    - Token is returned and valid

GET /api/user/profile - Get user profile
  Headers:
    Authorization: Bearer <token>
  Response (200):
    {
      "user": {
        "id": "number",
        "username": "string",
        "email": "string",
        "full_name": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
  Error Responses:
    401: { "error": "Access token required" } or { "error": "Invalid token" }
    403: { "error": "Invalid token" }
    500: { "error": "Internal server error" }

  Test Requirements:
    - Successful profile retrieval with valid token
    - Profile retrieval fails without token
    - Profile retrieval fails with invalid token
    - Profile retrieval fails with expired token
    - Returned user data excludes password

PUT /api/user/profile - Update user profile
  Headers:
    Authorization: Bearer <token>
  Request Body:
    {
      "username": "string (required, unique)",
      "email": "string (required, unique, valid email)",
      "full_name": "string (optional)"
    }
  Response (200):
    {
      "message": "Profile updated successfully",
      "user": {
        "id": "number",
        "username": "string",
        "email": "string",
        "full_name": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
  Error Responses:
    400: { "error": "Username and email are required" }
    401: { "error": "Access token required" } or { "error": "Invalid token" }
    403: { "error": "Invalid token" }
    409: { "error": "Email already taken" } or { "error": "Username already taken" }
    500: { "error": "Internal server error" }

  Test Requirements:
    - Successful profile update with valid data
    - Profile update fails without token
    - Profile update fails with invalid token
    - Profile update fails with duplicate email
    - Profile update fails with duplicate username
    - Profile update fails with missing username
    - Profile update fails with missing email
    - Profile update succeeds with optional full_name
    - Updated user data is returned