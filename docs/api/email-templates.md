# Email Templates API

Administrator routes for listing, reading, and versioning transactional email templates.

## Endpoints

### `GET /email-templates`

Returns a paginated template list. Authentication requires the `access-token` cookie and `ADMIN`
role. CSRF is not required. Optional query parameters are `page`, `pageSize`, `search`, `sort`,
`dir`, `fromDate`, `toDate`, and `isActive`. There are no required parameters.

### `GET /email-templates/:publicId`

Returns one template. `publicId` is required. Authentication requires the `access-token` cookie and
`ADMIN` role. CSRF is not required.

### `PATCH /email-templates/:publicId`

Creates the next version of a template and deactivates the previous version. Authentication
requires the `access-token` cookie and `ADMIN` role. CSRF is required. `publicId` is required.
Optional body fields are `subject`, `html`, `text`, and `isActive`; at least one must be present.
Unknown body fields are rejected.

## Example Update Request

```http
PATCH /email-templates/4d95ad1f-0c6b-46b9-8f9d-6ef8ad99a111
Cookie: access-token=eyJ...
x-csrf-token: csrf-token-value
Content-Type: application/json

{
  "subject": "Your secure sign-in link",
  "isActive": true
}
```

## Example Successful Response

```json
{
  "statusCode": 200,
  "message": "Email template updated successfully",
  "data": {
    "publicId": "4d95ad1f-0c6b-46b9-8f9d-6ef8ad99a111",
    "key": "auth_magic_link",
    "subject": "Your secure sign-in link",
    "html": "<p>Use your secure link.</p>",
    "text": "Use your secure link.",
    "variables": [],
    "version": 2,
    "isActive": true,
    "createdAt": "2026-07-03T12:00:00.000Z",
    "updatedAt": "2026-07-03T12:00:00.000Z"
  },
  "timestamp": "2026-07-03T12:00:00.000Z",
  "path": "/email-templates/4d95ad1f-0c6b-46b9-8f9d-6ef8ad99a111"
}
```

## Validation and Errors

- `401 unauthorized`: missing or invalid authentication.
- `403 forbidden`: caller lacks the `ADMIN` role.
- `403 csrf_invalid`: missing or invalid CSRF token on `PATCH`.
- `404 email_template_not_found`: template does not exist.
- `422 validation_failed`: query or body validation failed.

```json
{
  "statusCode": 422,
  "code": "validation_failed",
  "error": "Unprocessable Entity",
  "message": "At least one field must be provided",
  "meta": {},
  "timestamp": "2026-07-03T12:00:00.000Z",
  "path": "/email-templates/4d95ad1f-0c6b-46b9-8f9d-6ef8ad99a111",
  "requestId": "req_123"
}
```

All successful payloads are synchronously parsed by email-template Zod response schemas. Dates are
serialized to ISO strings and unknown persistence fields are removed before the network seam.
