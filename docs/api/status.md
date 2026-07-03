# Status API

## `GET /`

Returns the public HTML status page describing major routes and documentation locations. No
authentication, authorization, parameters, or CSRF token are required. The endpoint accepts no
request body and performs no database access.

The response has content type `text/html; charset=utf-8`. Before Express sends it, the generated HTML
is synchronously parsed by the status Zod response schema.

## Example Request

```http
GET /
```

## Example Successful Response

```html
<!doctype html>
<html lang="en">
  <head><title>Boilerplate API — Status</title></head>
  <body>...</body>
</html>
```

## Errors

No domain-level errors are expected. An unexpected response-validation or framework failure uses
the global error envelope.

```json
{
  "statusCode": 500,
  "code": "internal_server_error",
  "error": "Internal Server Error",
  "message": "Internal server error",
  "meta": {},
  "timestamp": "2026-07-03T12:00:00.000Z",
  "path": "/",
  "requestId": "req_123"
}
```
