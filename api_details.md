# API Documentation

This document provides a comprehensive overview of all API endpoints, their parameters, request bodies, and response formats with data types.

**Base URL**: `/api`

---

## Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Withdrawal Endpoints](#withdrawal-endpoints)
- [Profile Endpoints](#profile-endpoints)
- [Account Endpoints](#account-endpoints)

---

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "name": "string (required)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "number",
    "email": "string"
  }
}
```

---

### 2. Login
**Endpoint**: `POST /api/auth/login`

**Rate Limit**: 10 requests per window

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string (JWT token)",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string"
    }
  }
}
```

---

### 3. Verify OTP
**Endpoint**: `POST /api/auth/verify-otp`

**Rate Limit**: 20 requests per window

**Request Body**:
```json
{
  "email": "string (required)",
  "code": "string (required, 4-digit numeric)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string (JWT token)"
  }
}
```

---

### 4. Resend OTP
**Endpoint**: `POST /api/auth/resend-otp`

**Rate Limit**: 5 requests per window

**Request Body**:
```json
{
  "email": "string (required)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "OTP resent please check your mail",
  "data": {
    "message": "string"
  }
}
```

---

## User Management Endpoints

**Authentication Required**: All user endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### 1. Create User
**Endpoint**: `POST /api/user`

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "amount": "number (optional, default: 0)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "password": "string",
    "amount": "number",
    "isDeleted": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 2. Get All Users
**Endpoint**: `GET /api/user`

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "amount": "number",
      "isDeleted": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "payments": [
        {
          "id": "number",
          "userId": "number",
          "amount": "number",
          "type": "string (credit/debit)",
          "status": "string",
          "description": "string | null",
          "transactionDate": "datetime"
        }
      ]
    }
  ]
}
```

---

### 3. Get User by ID
**Endpoint**: `GET /api/user/:id`

**URL Parameters**:
- `id`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "amount": "number",
    "isDeleted": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "payments": [
      {
        "id": "number",
        "userId": "number",
        "amount": "number",
        "type": "string (credit/debit)",
        "status": "string",
        "description": "string | null",
        "transactionDate": "datetime"
      }
    ]
  }
}
```

---

### 4. Update User
**Endpoint**: `PUT /api/user/:id`

**URL Parameters**:
- `id`: number (required)

**Request Body**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "amount": "number (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "amount": "number",
    "isDeleted": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 5. Delete User (Soft Delete)
**Endpoint**: `DELETE /api/user/:id`

**URL Parameters**:
- `id`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

### 6. Add Payment to User
**Endpoint**: `POST /api/user/:id/payments`

**URL Parameters**:
- `id`: number (required, user ID)

**Request Body**:
```json
{
  "amount": "number (required)",
  "type": "string (required, values: 'credit' | 'debit')",
  "description": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment added successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "type": "string",
    "description": "string | null",
    "status": "string",
    "transactionDate": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

## Payment Endpoints

**Authentication Required**: All payment endpoints require a valid JWT token.

### 1. Create Payment
**Endpoint**: `POST /api/payments`

**Request Body**:
```json
{
  "userId": "number (optional, defaults to logged-in user)",
  "amount": "number (required)",
  "type": "string (required, values: 'credit' | 'debit')",
  "method": "string (optional)",
  "description": "string (optional)",
  "referenceNumber": "string (optional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "type": "string",
    "status": "string (pending)",
    "method": "string | null",
    "description": "string | null",
    "referenceNumber": "string | null",
    "transactionDate": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string"
    }
  }
}
```

---

### 3. Get User Payments
**Endpoint**: `GET /api/payments/user/:userId`

**URL Parameters**:
- `userId`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User payment history retrieved",
  "data": [
    {
      "id": "number",
      "userId": "number",
      "amount": "number",
      "type": "string (credit/debit)",
      "status": "string",
      "method": "string | null",
      "description": "string | null",
      "transactionDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

---

### 2. Get All Payments
**Endpoint**: `GET /api/payments`

**Query Parameters**:
- `userId`: number (optional)
- `type`: string (optional, values: 'credit' | 'debit')
- `status`: string (optional)
- `startDate`: datetime (optional, ISO 8601 format)
- `endDate`: datetime (optional, ISO 8601 format)
- `limit`: number (optional, default: 50)
- `offset`: number (optional, default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "payments": [
      {
        "id": "number",
        "userId": "number",
        "amount": "number",
        "type": "string (credit/debit)",
        "status": "string",
        "method": "string | null",
        "description": "string | null",
        "referenceNumber": "string | null",
        "transactionDate": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "user": {
          "id": "number",
          "email": "string",
          "name": "string"
        }
      }
    ],
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

---

### 2. Get Payment by ID
**Endpoint**: `GET /api/payments/:id`

**URL Parameters**:
- `id`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "type": "string (credit/debit)",
    "status": "string",
    "method": "string | null",
    "description": "string | null",
    "referenceNumber": "string | null",
    "transactionDate": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string"
    }
  }
}
```

---

### 3. Get User Payments
**Endpoint**: `GET /api/payments/user/:userId`

**URL Parameters**:
- `userId`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User payment history retrieved",
  "data": [
    {
      "id": "number",
      "userId": "number",
      "amount": "number",
      "type": "string (credit/debit)",
      "status": "string",
      "method": "string | null",
      "description": "string | null",
      "transactionDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

---

### 4. Update Payment Status
**Endpoint**: `PATCH /api/payments/:id/status`

**URL Parameters**:
- `id`: number (required)

**Request Body**:
```json
{
  "status": "string (required)",
  "adminNote": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "type": "string",
    "status": "string",
    "description": "string | null",
    "transactionDate": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

## Withdrawal Endpoints

**Authentication Required**: All withdrawal endpoints require a valid JWT token.

### 1. Create Withdrawal
**Endpoint**: `POST /api/withdrawals`

**Request Body**:
```json
{
  "amount": "number (required)",
  "method": "string (required)",
  "bankDetails": "string | object (optional)",
  "description": "string (optional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Withdrawal request created successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "method": "string",
    "bankDetails": "string | object | null",
    "description": "string | null",
    "status": "string (pending)",
    "requestedAt": "datetime",
    "processedAt": "datetime | null",
    "adminNote": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---
### 3. Get My Withdrawals
**Endpoint**: `GET /api/withdrawals/my-withdrawals`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User withdrawal history retrieved",
  "data": [
    {
      "id": "number",
      "userId": "number",
      "amount": "number",
      "method": "string",
      "status": "string",
      "requestedAt": "datetime",
      "processedAt": "datetime | null",
      "adminNote": "string | null",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

---

### 2. Get All Withdrawals
**Endpoint**: `GET /api/withdrawals`

**Query Parameters**:
- `userId`: number (optional)
- `status`: string (optional, values: 'pending' | 'approved' | 'completed' | 'rejected')
- `startDate`: datetime (optional, ISO 8601 format)
- `endDate`: datetime (optional, ISO 8601 format)
- `limit`: number (optional, default: 50)
- `offset`: number (optional, default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Withdrawals retrieved successfully",
  "data": {
    "withdrawals": [
      {
        "id": "number",
        "userId": "number",
        "amount": "number",
        "method": "string",
        "bankDetails": "string | object | null",
        "description": "string | null",
        "status": "string",
        "requestedAt": "datetime",
        "processedAt": "datetime | null",
        "adminNote": "string | null",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "user": {
          "id": "number",
          "email": "string",
          "name": "string"
        }
      }
    ],
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

---


### 4. Get Withdrawal by ID
**Endpoint**: `GET /api/withdrawals/:id`

**URL Parameters**:
- `id`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Withdrawal retrieved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "method": "string",
    "bankDetails": "string | object | null",
    "description": "string | null",
    "status": "string",
    "requestedAt": "datetime",
    "processedAt": "datetime | null",
    "adminNote": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string",
      "amount": "number"
    }
  }
}
```

---

### 5. Update Withdrawal Status
**Endpoint**: `PATCH /api/withdrawals/:id/status`

**URL Parameters**:
- `id`: number (required)

**Request Body**:
```json
{
  "status": "string (required, values: 'pending' | 'approved' | 'completed' | 'rejected')",
  "adminNote": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Withdrawal status updated successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "amount": "number",
    "method": "string",
    "status": "string",
    "requestedAt": "datetime",
    "processedAt": "datetime",
    "adminNote": "string | null",
    "updatedAt": "datetime"
  }
}
```

**Note**: When status is changed to 'approved' or 'completed', the amount is automatically deducted from the user's balance and a debit payment record is created.

---

### 6. Delete Withdrawal
**Endpoint**: `DELETE /api/withdrawals/:id`

**URL Parameters**:
- `id`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Withdrawal deleted successfully",
  "data": null
}
```

**Note**: Only withdrawals with 'pending' status can be deleted.

---

## Profile Endpoints

**Authentication Required**: All profile endpoints require a valid JWT token.

### 1. Get My Profile
**Endpoint**: `GET /api/profile/me`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "phone": "string | null",
    "address": "string | null",
    "idCard": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string",
      "amount": "number"
    }
  }
}
```

---

### 2. Create or Update My Profile
**Endpoint**: `POST /api/profile/me`

**Request Body**:
```json
{
  "phone": "string (optional)",
  "address": "string (optional)",
  "idCard": "string (optional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Profile saved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "phone": "string | null",
    "address": "string | null",
    "idCard": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 3. Update My Profile
**Endpoint**: `PUT /api/profile/me`

**Request Body**:
```json
{
  "phone": "string (optional)",
  "address": "string (optional)",
  "idCard": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "phone": "string | null",
    "address": "string | null",
    "idCard": "string | null",
    "updatedAt": "datetime"
  }
}
```

---

### 4. Delete My Profile
**Endpoint**: `DELETE /api/profile/me`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile deleted successfully",
  "data": null
}
```

---

### 5. Get All Profiles (Admin)
**Endpoint**: `GET /api/profile`

**Query Parameters**:
- `limit`: number (optional, default: 50)
- `offset`: number (optional, default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profiles retrieved successfully",
  "data": {
    "profiles": [
      {
        "id": "number",
        "userId": "number",
        "phone": "string | null",
        "address": "string | null",
        "idCard": "string | null",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "user": {
          "id": "number",
          "email": "string",
          "name": "string",
          "isDeleted": "boolean"
        }
      }
    ],
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

---

### 6. Get Profile by ID (Admin)
**Endpoint**: `GET /api/profile/:id`

**URL Parameters**:
- `id`: number (required, profile ID)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "phone": "string | null",
    "address": "string | null",
    "idCard": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string",
      "amount": "number"
    }
  }
}
```

---

### 7. Get Profile by User ID (Admin)
**Endpoint**: `GET /api/profile/user/:userId`

**URL Parameters**:
- `userId`: number (required)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "number",
    "userId": "number",
    "phone": "string | null",
    "address": "string | null",
    "idCard": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string",
      "amount": "number"
    }
  }
}
```

---

## Account Endpoints

**Authentication Required**: All account endpoints require a valid JWT token.

### 1. Get Account Balance
**Endpoint**: `GET /api/account/balance`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Account balance retrieved successfully",
  "data": {
    "userId": "number",
    "email": "string",
    "name": "string",
    "balance": "number",
    "accountCreated": "datetime"
  }
}
```

---

### 2. Get Account Summary
**Endpoint**: `GET /api/account/summary`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Account summary retrieved successfully",
  "data": {
    "userId": "number",
    "email": "string",
    "name": "string",
    "currentBalance": "number",
    "totalCredits": "number",
    "totalDebits": "number",
    "pendingWithdrawals": "number",
    "accountCreated": "datetime",
    "recentPayments": [
      {
        "id": "number",
        "amount": "number",
        "type": "string (credit/debit)",
        "status": "string",
        "description": "string | null",
        "transactionDate": "datetime"
      }
    ],
    "recentWithdrawals": [
      {
        "id": "number",
        "amount": "number",
        "status": "string",
        "requestedAt": "datetime"
      }
    ]
  }
}
```

**Note**: Returns the last 5 payments and last 5 withdrawal requests.

---

### 3. Get Transaction History
**Endpoint**: `GET /api/account/transactions`

**Query Parameters**:
- `limit`: number (optional, default: 20)
- `offset`: number (optional, default: 0)
- `type`: string (optional, values: 'credit' | 'debit')
- `status`: string (optional)
- `startDate`: datetime (optional, ISO 8601 format)
- `endDate`: datetime (optional, ISO 8601 format)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Transaction history retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "number",
        "amount": "number",
        "type": "string (credit/debit)",
        "status": "string",
        "method": "string | null",
        "description": "string | null",
        "transactionDate": "datetime",
        "createdAt": "datetime"
      }
    ],
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

---

## Error Response Format

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message description",
  "data": null
}
```

**Common HTTP Status Codes**:
- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation error or invalid input
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Data Type Reference

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"example"` |
| `number` | Numeric value (integer or float) | `100` or `99.99` |
| `boolean` | True or false | `true` or `false` |
| `datetime` | ISO 8601 datetime string | `"2024-12-22T15:30:00.000Z"` |
| `null` | Null value | `null` |
| `object` | JSON object | `{"key": "value"}` |
| `array` | JSON array | `[1, 2, 3]` |

---

## Notes

1. **Authentication**: Most endpoints require authentication. Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

2. **Rate Limiting**: Authentication endpoints have rate limiting enabled to prevent abuse.

3. **Pagination**: Endpoints that return lists support pagination via `limit` and `offset` query parameters.

4. **Soft Delete**: User deletion is implemented as a soft delete (sets `isDeleted` flag to `true`).

5. **Transaction Flow**: 
   - When a withdrawal is approved/completed, the amount is automatically deducted from the user's balance
   - A corresponding debit payment record is created automatically

6. **Authentication Flow**: 
   - Login returns a JWT token directly upon successful email/password verification
   - OTP endpoints (`/verify-otp` and `/resend-otp`) are still available for optional two-factor authentication if needed

---

**Generated**: 2025-12-22
**Version**: 1.0
