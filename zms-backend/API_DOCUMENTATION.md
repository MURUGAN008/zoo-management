# ZMS Backend API Documentation

## Overview
Zoo Management System (ZMS) Backend API provides endpoints for managing zoo operations including authentication, animal management, ticket booking, and admin operations.

**Base URL:** `http://localhost:3000`

## Table of Contents
- [Authentication](#authentication)
- [Invitation System](#invitation-system)
- [Animal Management](#animal-management)
- [Ticket Management](#ticket-management)
- [Error Responses](#error-responses)
- [Data Models](#data-models)

---

## Authentication

### Login Admin
**POST** `/api/auth/login`

Authenticates an admin and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid-string",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
```json
// Invalid credentials (401)
{
  "error": "Invalid credentials"
}

// Invalid inputs (400)
{
  "error": "Invalid inputs"
}

// Server error (500)
{
  "error": "Login failed"
}
```

---

### Register with Invitation
**POST** `/api/auth/register-with-invitation`

Creates a new admin account using an invitation token. **No authentication required**.

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123",
  "token": "invitation-token-here"
}
```

**Success Response (201):**
```json
{
  "message": "ADMIN account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "role": "ADMIN"
  }
}
```

**OR for staff account:**
```json
{
  "message": "STAFF account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "fullName": "John Staff",
    "email": "john@example.com",
    "role": "STAFF"
  }
}
```

**Error Responses:**
```json
// Invalid inputs (400)
{
  "error": "Invalid inputs"
}

// Invalid invitation token (404)
{
  "error": "Invalid invitation token"
}

// Invitation no longer valid (400)
{
  "error": "Invitation is no longer valid"
}

// Invitation expired (400)
{
  "error": "Invitation has expired"
}

// Email mismatch (400)
{
  "error": "Email does not match invitation"
}

// Admin already exists (400)
{
  "error": "Admin with this email already exists"
}

// Server error (500)
{
  "error": "Failed to create account"
}
```

---

## Invitation System

### Send Admin/Staff Invitation
**POST** `/api/invitation/send`

Sends an invitation to create an admin or staff account. **Requires Admin Authentication**.

**⚠️ Important Restrictions:**
- Only **ADMIN** users can send invitations
- Only **ADMIN** users can create **STAFF** accounts
- **STAFF** users cannot send any invitations

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "role": "ADMIN"
}
```

**OR for creating a staff account:**
```json
{
  "email": "newstaff@example.com",
  "role": "STAFF"
}
```

**Note:** The `role` field is optional and defaults to `"ADMIN"` if not specified.

**Success Response (201):**
```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "uuid-string",
    "email": "newadmin@example.com",
    "token": "invitation-token-here",
    "role": "ADMIN",
    "expiresAt": "2024-01-22T10:30:00.000Z",
    "status": "PENDING",
    "invitedBy": {
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
```json
// Invalid inputs (400)
{
  "error": "Invalid inputs"
}

// Admin already exists (400)
{
  "error": "Admin with this email already exists"
}

// Invitation already sent (400)
{
  "error": "Invitation already sent to this email"
}

// Only admins can create staff accounts (403)
{
  "error": "Only admins can create staff accounts"
}

// Staff cannot send invitations (403)
{
  "error": "Staff members cannot create accounts. Only admins can send invitations."
}

// Server error (500)
{
  "error": "Failed to send invitation"
}
```

---

### Get Sent Invitations
**GET** `/api/invitation/sent`

Retrieves all invitations sent by the current admin. **Requires Admin Authentication**.

**⚠️ Restriction:** Only **ADMIN** users can view invitations. **STAFF** users will receive a 403 error.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-string-1",
    "email": "newadmin1@example.com",
    "token": "invitation-token-1",
    "role": "ADMIN",
    "expiresAt": "2024-01-22T10:30:00.000Z",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "inviter": {
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  },
  {
    "id": "uuid-string-2",
    "email": "newstaff@example.com",
    "token": "invitation-token-2",
    "role": "STAFF",
    "expiresAt": "2024-01-20T15:00:00.000Z",
    "status": "ACCEPTED",
    "createdAt": "2024-01-13T15:00:00.000Z",
    "updatedAt": "2024-01-14T09:30:00.000Z",
    "inviter": {
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

**Error Responses:**
```json
// Staff cannot view invitations (403)
{
  "error": "Staff members cannot view invitations. Only admins have access to invitation management."
}

// Server error (500)
{
  "error": "Failed to fetch invitations"
}
```

---

### Validate Invitation
**GET** `/api/invitation/validate/:token`

Validates an invitation token. **No authentication required**.

**Path Parameters:**
- `token` (string): Invitation token

**Success Response (200):**
```json
{
  "message": "Invitation is valid",
  "invitation": {
    "id": "uuid-string",
    "email": "newadmin@example.com",
    "role": "ADMIN",
    "expiresAt": "2024-01-22T10:30:00.000Z",
    "invitedBy": {
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
```json
// Token required (400)
{
  "error": "Token is required"
}

// Invalid token (404)
{
  "error": "Invalid invitation token"
}

// Invitation no longer valid (400)
{
  "error": "Invitation is no longer valid"
}

// Invitation expired (400)
{
  "error": "Invitation has expired"
}

// Server error (500)
{
  "error": "Failed to validate invitation"
}
```

---
 
## Animal Management

### Create Animal
**POST** `/api/animal/create`

Creates a new animal record. **Requires Authentication** (Admin or Staff).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 5,
  "weight": 180.5
}
```

**Success Response (201):**
```json
{
  "id": "uuid-string",
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 5,
  "weight": 180.5,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid inputs"
}
```

---

### Get All Animals
**GET** `/api/animal/get`

Retrieves all animals. **Requires Authentication** (Admin or Staff).

**Success Response (200):**
```json
[
  {
    "id": "uuid-string-1",
    "species": "African Lion",
    "gender": "MALE",
    "isChild": false,
    "age": 5,
    "weight": 180.5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "uuid-string-2",
    "species": "Asian Elephant",
    "gender": "FEMALE",
    "isChild": true,
    "age": 2,
    "weight": 800.0,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Error Response (404):**
```json
{
  "error": "No animals found"
}
```

---

### Get Animal by ID
**GET** `/api/animal/get/:id`

Retrieves a specific animal by ID. **Requires Authentication** (Admin or Staff).

**Path Parameters:**
- `id` (string): Animal UUID

**Success Response (200):**
```json
{
  "id": "uuid-string",
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 5,
  "weight": 180.5,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Animal not found"
}
```

---

### Update Animal
**PUT** `/api/animal/update/:id`

Updates an existing animal. **Requires Authentication** (Admin or Staff).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `id` (string): Animal UUID

**Request Body:**
```json
{
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 6,
  "weight": 185.0
}
```

**Success Response (200):**
```json
{
  "id": "uuid-string",
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 6,
  "weight": 185.0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses:**
```json
// Invalid inputs (400)
{
  "error": "Invalid inputs"
}

// Update failed (400)
{
  "error": "Failed to update animal"
}
```

---

### Delete Animal
**DELETE** `/api/animal/delete/:id`

Deletes an animal. **Requires Admin Authentication**.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `id` (string): Animal UUID

**Success Response (200):**
```json
{
  "id": "uuid-string",
  "species": "African Lion",
  "gender": "MALE",
  "isChild": false,
  "age": 6,
  "weight": 185.0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Animal not found"
}
```

---

## Ticket Management

### Create Ticket
**POST** `/api/ticket/create`

Creates a new ticket/booking. **No authentication required**.

**Request Body:**
```json
{
  "name": "John Smith",
  "dateOfVisit": "2024-02-15T09:00:00.000Z",
  "description": "Family visit with 2 adults and 2 children",
  "passType": "ONE_TIME",
  "passStatus": "NORMAL",
  "userType": "GROUP"
}
```

**Success Response (201):**
```json
{
  "id": "uuid-string",
  "name": "John Smith",
  "dateOfVisit": "2024-02-15T09:00:00.000Z",
  "description": "Family visit with 2 adults and 2 children",
  "passType": "ONE_TIME",
  "passStatus": "NORMAL",
  "userType": "GROUP",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
```json
// Invalid inputs (400)
{
  "error": "Invlid inputs"
}

// Creation failed (400)
{
  "error": "Failed to create ticket"
}
```

---

### Get Ticket Statistics
**GET** `/api/ticket/stats`

Retrieves ticket statistics for administrators. **Requires Admin Authentication**.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "totalTickets": 1250,
  "todayTickets": 45,
  "ticketsByType": [
    {
      "type": "ONE_TIME",
      "count": 800
    },
    {
      "type": "MONTHLY", 
      "count": 350
    },
    {
      "type": "YEARLY",
      "count": 100
    }
  ],
  "ticketsByStatus": [
    {
      "status": "NORMAL",
      "count": 1000
    },
    {
      "status": "VIP",
      "count": 250
    }
  ]
}
```

**Error Responses:**
```json
// Access denied for non-admin users (403)
{
  "error": "Access denied. Only administrators can view ticket statistics."
}

// Server error (500)
{
  "error": "Failed to fetch ticket statistics"
}
```

---

### Get Ticket by ID
**GET** `/api/ticket/get/:id`

Retrieves a specific ticket by ID. **No authentication required**.

**Path Parameters:**
- `id` (string): Ticket UUID

**Success Response (200):**
```json
{
  "id": "uuid-string",
  "name": "John Smith",
  "dateOfVisit": "2024-02-15T09:00:00.000Z",
  "description": "Family visit with 2 adults and 2 children",
  "passType": "ONE_TIME",
  "passStatus": "NORMAL",
  "userType": "GROUP",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Ticket not found"
}
```

---

## Error Responses

### Authentication Errors
```json
// Unauthorized (401)
{
  "message": "Unauthorized"
}

// Insufficient permissions (401)
{
  "message": "You are not authorized to access or modify this resource"
}
```

### Validation Errors
```json
// Invalid input data (400)
{
  "error": "Invalid inputs"
}
```

---

## Data Models

### Admin
```typescript
{
  id: string;           // UUID
  fullName: string;     // Full name
  email: string;        // Email address (unique)
  password: string;     // Hashed password
  role: "ADMIN" | "STAFF";  // User role
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Animal
```typescript
{
  id: string;           // UUID
  species: string;      // Animal species
  gender: "MALE" | "FEMALE";  // Animal gender
  isChild: boolean;     // Whether animal is a child
  age: number;          // Age in years (minimum 0)
  weight: number;       // Weight in kg (minimum 0)
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Ticket
```typescript
{
  id: string;           // UUID
  name: string;         // Visitor name
  dateOfVisit: Date;    // Planned visit date
  description: string;  // Visit description
  passType: "ONE_TIME" | "MONTHLY" | "YEARLY";  // Pass type
  passStatus: "NORMAL" | "VIP";  // Pass status
  userType: "INDIVIDUAL" | "GROUP";  // User type
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Invitation
```typescript
{
  id: string;           // UUID
  email: string;        // Email of invited person (unique)
  token: string;        // Invitation token (unique)
  invitedBy: string;    // Admin ID who sent invitation
  role: "ADMIN" | "STAFF";  // Role for the invited user
  expiresAt: Date;      // Expiration date
  status: "PENDING" | "ACCEPTED" | "EXPIRED";  // Invitation status
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
  inviter: Admin;       // Relation to admin who sent invitation
}
```

---

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Admin Middleware
Some endpoints require admin-level access. The middleware checks:
1. Valid JWT token is provided
2. User role is "ADMIN"

### Auth Middleware
Some endpoints require any authenticated user. The middleware checks:
1. Valid JWT token is provided

---

## Development Setup

1. **Environment Variables:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zms_db"
   JWT_SECRET="your-jwt-secret-key"
   ```

2. **Server Configuration:**
   - Port: 3000
   - CORS enabled for: `http://localhost:5173`
   - Database: PostgreSQL with Prisma ORM

3. **Database Setup:**
   ```bash
   # Install dependencies
   npm install
   
   # Run database migration
   npx prisma migrate dev --name add-invitation-system
   
   # Seed initial admin (optional - creates admin@zms.com with password: admin123)
   npm run db:seed
   ```

4. **Running the Server:**
   ```bash
   npm run dev
   ```

5. **Initial Admin Credentials:**
   ```
   Email: admin@zms.com
   Password: admin123
   ```
   
   **⚠️ Important**: Change the default admin password after first login!

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all primary keys
- The API uses PostgreSQL as the database
- CORS is configured to allow requests from `http://localhost:5173`
- **Admin Invitation System**: Only existing admins can invite new users (admin or staff)
- **Staff Creation Restrictions**: Only **ADMIN** users can create **STAFF** accounts
- **Staff Limitations**: **STAFF** users cannot send invitations or create any accounts
- **Invitation Tokens**: Expire after 1 day and are single-use
- **JWT Tokens**: Expire after 24 hours (increased from 1 hour)
- **Security**: Direct admin registration endpoint has been removed for security
- Admin management is handled through the secure invitation system only
