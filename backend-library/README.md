# 📚 Library Management API (Express + Mongoose + TypeScript)

Built with **Express.js**, **Mongoose**, and **TypeScript** with complete authentication and authorization.

---

## 🚀 Overview

This API provides comprehensive endpoints to manage books and their borrowing transactions with features like:

- Full CRUD operations on **Books**  
- Complete **User Authentication & Authorization** with JWT tokens
- Secure borrowing system with ownership checks and business logic enforcement  
- Aggregated summaries of borrowed books  
- Schema validation and error handling with **Zod**  
- Mongoose middleware (pre/post hooks) and static methods  
- Support for filtering, sorting, and pagination  

---

## 🧩 Features

- **Book Management:** Create, Read (single & list including query), Update, and Delete books with strict validation  
- **User Authentication:** Complete JWT-based auth with access/refresh token rotation
- **Borrowing System:** Borrow books with checks on availability, automatic stock updates and get borrowed list
- **Authorization:** Route protection and ownership-based access control
- **Aggregation:** Get summaries of borrowed books using MongoDB aggregation pipeline  
- **Data Integrity:** Cascading deletes — deleting a book also deletes its borrow records  
- **Validation:** Request bodies validated with Zod schemas providing clear error messages  
- **Error Handling:** Standardized JSON error responses for client and server errors  

---

## 🔒 Authentication & Authorization

### ✅ JWT Access & Refresh Token Flow

- On login, the user receives:
  - **Access Token**: Short-lived (2 minutes), used in `Authorization: Bearer <token>` header
  - **Refresh Token**: Long-lived (7 days), stored securely as an **HTTP-only, Secure, SameSite-strict cookie**
- **Token rotation**: On refresh, both a new access token and a new refresh token are issued, and the old refresh token is invalidated

### 🔁 Token Refresh Endpoint

- **Endpoint:** `POST /api/refresh-token`
- Verifies refresh token from the HTTP-only cookie
- Rotates tokens securely, returning a new access token and setting a new refresh token cookie
- If invalid or expired, clears cookie and requires re-login

### 🔒 Route Protection Middleware

- Middleware verifies access token before allowing access to protected routes
- Automatically populates `req.user` with the decoded user info
- Protects sensitive actions such as borrowing books or accessing borrow history

### 🧑‍💼 User Population & Ownership Checks

- On each request, the current logged-in user is **populated automatically** (`req.user`), enabling ownership-based authorization
- **Borrow ownership enforcement:** Users can only view or manage their own borrow records; no cross-user access

### 🛡️ Protected Endpoints

| Endpoint             | Method     | Auth Required | Description                                   |
|----------------------|------------|---------------|-----------------------------------------------|
| `/api/books`         | POST       | ✅            | Add a book (for admins or authorized users)   |
| `/api/books/:id`     | PUT/DELETE | ✅            | Update or delete a book                       |
| `/api/borrow`        | POST       | ✅            | Borrow a book (only for logged-in users)      |
| `/api/borrow`        | GET        | ✅            | Get own borrow summary                        |
| `/api/refresh-token` | POST       | Cookie-based  | Refresh and rotate tokens                     |
| `/api/logout`        | POST       | ✅            | Clear refresh token and log out               |

---

## 🔐 Validations

The API uses **Zod** for strict request body validation, ensuring reliable and consistent data. Here's a breakdown of key validation rules enforced:

### 📘 Book Schema Validation (`zodBookSchema`)

- **Title**: Must be a non-empty string (min 1 character)
- **Author**: Must be a non-empty string (min 1 character)
- **Genre**: Must be one of:
  - `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY` (case-insensitive)
- **ISBN**: Required string with at least 1 character
- **Description** (optional): 8–100 characters long
- **Copies**: Must be a **non-negative integer** (no zero or negative values)
- **available**: Boolean (optional)
- Automatically sets `available: false` when a book's `copies` are set to `0`

### ✏️ Book Update Schema (`zodUpdateBookSchema`)

- All fields are optional, but **at least one** updatable field is required
- Same rules apply as `zodBookSchema` for each field
- Enforces type and format even in partial updates
- Controls the available based on input copies

### 📦 Borrow Schema (`zodBorrowSchema`)

- **Book**: Must be a valid MongoDB ObjectId (string)
- **Quantity**: Must be a **positive integer** (minimum 1)
- **Due Date**: Must be a valid future date (not past or current)
- Automatically sets `available: false` when a book's `copies` are updated to `0`

### 🔎 Filtering & Query (`zodFilterSchema`)

- **filter** (optional): Must be one of the allowed `Genre` values
- **sortBy**: Must be one of: `title`, `author`, `genre`, `isbn`, `description`, `copies`, `available`, `createdAt`, `updatedAt`
- **sort**: Can be `"asc"` or `"desc"`
- **limit**: Defaults to 10, casted from string to number

### 👤 User Schema Validation

- **Name**: Must be a non-empty string
- **Email**: Must be a valid email format
- **Password**: Must meet security requirements (minimum length, complexity)

---

## 📋 Tech Stack

| Technology       | Purpose                             |
|------------------|-------------------------------------|
| Express.js       | Web framework                       |
| TypeScript       | Static typing and tooling           |
| MongoDB          | NoSQL document database             |
| Mongoose         | ODM for MongoDB                     |
| Zod              | Schema validation and parsing       |
| JWT              | Authentication tokens               |
| bcrypt           | Password hashing                    |

---

## ⚙️ Project Setup

### Requirements

- Node.js (v14 or higher)
- MongoDB (Atlas or local instance)  
- npm or yarn  

### Installation

```bash
# Clone repository
git clone https://github.com/muhamash/assignment-4-redux-ph-l-2.git
cd library-backend

# Install dependencies
npm install

# Copy environment variables
cp .env

# Edit .env to set your MongoDB connection string and JWT secrets
```

### .env File

```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/library-db
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=2m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### Running the Server

```bash
# Start development server with live reload
npm run dev

# Or build and start production server
npm run build
npm start
```

---

## 📚 API Endpoints & Usage

## 🗝️ Authentication Endpoints

### 1. Register a User

**URL:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Stephen Hawking",
  "email": "hawking@example.com",
  "password": "blackholes123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "64f12a4abc4567890def0001",
    "name": "Stephen Hawking",
    "email": "hawking@example.com"
  }
}
```

### 2. Login

**URL:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "hawking@example.com",
  "password": "blackholes123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "64f12a4abc4567890def0001",
    "email": "hawking@example.com",
    "name": "Stephen Hawking",
    "accessToken": "<jwt_access_token>",
    "accessTokenExpiresAt": "2025-07-04T23:34:52.831Z",
    "expire": "2 minutes only"
  }
}
```

💡 **Note:** Refresh token is set as a secure, HTTP-only cookie automatically.

### 3. Refresh Access Token

**URL:** `POST /api/auth/refresh-token`

**Response (200):**
```json
{
  "success": true,
  "message": "Access token successfully retrieved",
  "data": {
    "accessToken": "<new_jwt_access_token>",
    "accessTokenExpiresAt": "2025-07-05T00:01:15.123Z",
    "expire": "2 minutes only"
  }
}
```

💡 **Note:** New refresh token is also rotated and set in the cookie.

### 4. Logout

**URL:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

💡 **Note:** Refresh token cookie is cleared on logout.

---

## 📖 Book Management Endpoints

### 1. Create a Book

**URL:** `POST /api/books`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

### 2. Get All Books

**URL:** `GET /api/books`

**Query Parameters:**
- `filter` (optional): Filter by book genre (e.g., SCIENCE, FANTASY)
- `sortBy` (optional): Field to sort by, default `createdAt`
- `sort` (optional): `asc` or `desc`, default `asc`
- `limit` (optional): Number of books to return, default `10`

**Example:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

**Response (200):**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  ]
}
```

### 3. Get Book by ID

**URL:** `GET /api/books/:bookId`

**Response (200):**
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

**Error 404:** If book not found
```json
{
  "success": false,
  "message": "Book not found",
  "data": null
}
```

### 4. Update Book

**URL:** `PUT /api/books/:bookId`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:** Any subset of book fields
```json
{
  "copies": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:25:30.456Z"
  }
}
```

**Validation Notes:**
- At least one field must be present
- Automatically sets `available: false` when a book's `copies` are updated to `0`
- Prevents setting `available: true` while `copies` is zero

### 5. Delete Book

**URL:** `DELETE /api/books/:bookId`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

**Note:** Deleting a book also deletes all borrow records referencing that book (handled by Mongoose post middleware).

---

## 📚 Borrowing Endpoints

### 1. Borrow a Book

**URL:** `POST /api/borrow`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 1,
  "dueDate": "2025-07-20T00:00:00.000Z"
}
```

**Business Logic:**
- Checks if requested quantity is available
- Deducts the quantity from the book's copies
- Sets available to false if copies reach zero
- Saves the borrow record with user ownership

**Response (200):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 1,
    "dueDate": "2025-07-20T00:00:00.000Z",
    "user": "64f12a4abc4567890def0001",
    "createdAt": "2025-07-04T17:45:12.456Z",
    "updatedAt": "2025-07-04T17:45:12.456Z"
  }
}
```

**Possible Errors:**
- **404:** If Book is not found
- **400:** If Book is not available
- **400:** If Not enough copies available

### 2. Borrowed Books Summary

**URL:** `GET /api/borrow`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Purpose:** Returns summary of borrowed books for the authenticated user, including total borrowed quantity per book

**Response (200):**
```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## ⚠️ Error Handling

The API provides consistent and meaningful error responses to help clients understand and debug issues easily.

### 🛡️ Authentication Errors

**Unauthorized Access (401):**
```json
{
  "message": "Token expired or invalid",
  "success": false
}
```

**Missing Authorization (401):**
```json
{
  "message": "Access token required",
  "success": false
}
```

### ❗ Standardized Error Responses

| Status Code | Meaning                  | Description                                                                 |
|-------------|--------------------------|-----------------------------------------------------------------------------|
| **400**     | Bad Request              | Validation failures or malformed input. Includes detailed Zod error messages. |
| **401**     | Unauthorized             | Invalid or missing authentication credentials.                              |
| **404**     | Not Found                | Requested resource (book, user, borrow record) does not exist.             |
| **500**     | Internal Server Error    | Unexpected server errors. Includes a descriptive error message for debugging. |

### 🔁 Example Error Response Format

**Validation Error (400):**
```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---

## 💬 Example Authentication Flow

1️⃣ **User Registration/Login** → Receives access token + refresh token (cookie)  
2️⃣ **API Requests** → Access token used in headers: `Authorization: Bearer <accessToken>`  
3️⃣ **Token Expiry** → Frontend automatically calls `/api/auth/refresh-token`, gets new access & refresh tokens  
4️⃣ **Refresh Token Expiry** → User is logged out and must re-authenticate  

---

## 🛠 Architecture & Code Highlights

- **Mongoose Models:** User, Book, and Borrow schemas with validation and references
- **Interfaces and Types:** TypeScript interfaces for User, Book, and Borrow schemas
- **JWT Implementation:** Secure token generation, verification, and rotation
- **Middleware:** Authentication middleware for route protection and user context
- **Static Methods:** e.g., adjusting book copies after borrowing
- **Mongoose Query Middleware:**
  - `pre` middleware to normalize queries (genre uppercase)
  - `post` middleware to cascade delete borrow records when a book is deleted
- **Aggregation Pipeline:** For summary endpoint to group and sum borrowed books by user
- **Controllers:** Separate controllers handle authentication, business logic, and data validation
- **Validation:** Using Zod schemas for request validation, with reusable and extendable schemas

---

## 🚀 Additional Business Logic

- ❌ **Cannot borrow more copies than are available**
- ✅ **On successful borrow, available copies are automatically decreased**
- 🔒 **Users can only view and manage their own borrow records**
- ♻️ **When a book is deleted, all related borrow records are cascaded and removed**
- 📚 **Borrow summary endpoints ensure consistent and real-time aggregation of user's book data**
- 🔐 **Token rotation enhances security by invalidating old refresh tokens**

---

## 🎯 Key Benefits

- **Enhanced Security:** JWT token rotation and HTTP-only cookie storage
- **Ownership Enforcement:** Users can only access their own data
- **Seamless Session Management:** Automatic token refresh for better UX
- **Scalable Architecture:** Clean separation of concerns with TypeScript
- **Comprehensive Validation:** Zod schemas ensure data integrity
- **Real-time Updates:** Automatic stock management and availability checks

---

## 📝 License

© 2025 Md Ashraful Alam. All rights reserved.

## 🛜 Repository

https://github.com/muhamash/library-api-express-ts-monggose