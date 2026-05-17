# Users API

Admin-only user directory and access-management endpoints.

All routes require the `access-token` HTTP-only cookie and the caller must have an admin role.
Unsafe methods require a CSRF token from `GET /csrf` sent as `x-csrf-token`.

## `GET /users`

Lists users for the dashboard directory.

### Query Parameters

Required: none.

Optional:

- `page`: positive integer, defaults to `1`.
- `pageSize`: positive integer, defaults to `25`, maximum `500`.
- `search`: searches name, email, and phone.
- `role`: comma-separated roles from `ADMIN`, `MANAGER`, `USER`, `SUPER_ADMIN`.
- `emailVerified`: `true` or `false`.
- `fromDate`: created-at lower bound.
- `toDate`: created-at upper bound.
- `sort`: one of `name`, `email`, `emailVerified`, `is2faEnabled`, `role`,
  `activeSessionCount`, `createdAt`, `updatedAt`.
- `dir`: `asc` or `desc`.

### Example Request

```http
GET /users?page=1&pageSize=25&role=USER,MANAGER&emailVerified=true&sort=createdAt&dir=desc
```

### Example Success

```json
{
	"statusCode": 200,
	"message": "Users fetched successfully",
	"data": {
		"rows": [
			{
				"id": "9c0b55fe-4e2f-4fd0-8ce2-fc0f8f39a0c7",
				"name": "Avery Stone",
				"email": "avery@example.com",
				"image": null,
				"phone": null,
				"emailVerified": true,
				"is2faEnabled": false,
				"role": "USER",
				"activeSessionCount": 2,
				"createdAt": "2026-05-17T10:00:00.000Z",
				"updatedAt": "2026-05-17T10:00:00.000Z"
			}
		],
		"total": 1,
		"page": 1,
		"pageSize": 25
	},
	"timestamp": "2026-05-17T10:00:00.000Z",
	"path": "/users"
}
```

## `PATCH /users/:id/role`

Updates a user's role. `:id` is the public user UUID.

Authorization rules:

- `SUPER_ADMIN` can update any non-self user's role.
- `ADMIN` can update only `USER` and `MANAGER` users and can assign only `USER` or `MANAGER`.
- Users cannot update their own role through this endpoint.

### Body

```json
{
	"role": "MANAGER"
}
```

### Example Success

```json
{
	"statusCode": 200,
	"message": "User role updated successfully",
	"data": {
		"id": "9c0b55fe-4e2f-4fd0-8ce2-fc0f8f39a0c7",
		"name": "Avery Stone",
		"email": "avery@example.com",
		"image": null,
		"phone": null,
		"emailVerified": true,
		"is2faEnabled": false,
		"role": "MANAGER",
		"activeSessionCount": 2,
		"createdAt": "2026-05-17T10:00:00.000Z",
		"updatedAt": "2026-05-17T10:05:00.000Z"
	},
	"timestamp": "2026-05-17T10:05:00.000Z",
	"path": "/users/9c0b55fe-4e2f-4fd0-8ce2-fc0f8f39a0c7/role"
}
```

## `POST /users/:id/sessions/revoke`

Revokes all non-revoked sessions for a target user. `:id` is the public user UUID.

The same conservative management rules from role updates apply.

### Example Success

```json
{
	"statusCode": 200,
	"message": "User sessions revoked successfully",
	"data": {
		"revokedCount": 2
	},
	"timestamp": "2026-05-17T10:10:00.000Z",
	"path": "/users/9c0b55fe-4e2f-4fd0-8ce2-fc0f8f39a0c7/sessions/revoke"
}
```

## Errors

Validation errors use `code: "validation_failed"`. Missing or invalid auth uses `unauthorized`.
Insufficient role or hierarchy violations use `forbidden`. Missing target users use
`user_not_found`.

```json
{
	"statusCode": 403,
	"code": "forbidden",
	"error": "Forbidden",
	"message": "You don't have permission to manage this user.",
	"meta": {},
	"timestamp": "2026-05-17T10:10:00.000Z",
	"path": "/users/9c0b55fe-4e2f-4fd0-8ce2-fc0f8f39a0c7/role",
	"requestId": "req_123"
}
```
