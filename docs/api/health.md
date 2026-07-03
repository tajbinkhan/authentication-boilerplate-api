# Health API

Service health checks for database connectivity and memory usage.

## `GET /health`

Returns the health status of the service. No authentication required. Rate limiting is disabled for this endpoint.

### Parameters, Authentication, and CSRF

- Required parameters: none.
- Optional parameters: none.
- Authentication and authorization: none.
- CSRF: not required because this is a safe `GET` request.
- Validation: health status must be `ok`, `error`, or `shutting_down`; indicator collections are
  keyed records supplied by the registered health indicators.

### Example Request

```http
GET /health
```

### Example Success

```json
{
	"statusCode": 200,
	"message": "Health check completed",
	"data": {
		"status": "ok",
		"info": {
			"database": { "status": "up" },
			"memory_heap": { "status": "up" },
			"memory_rss": { "status": "up" }
		},
		"error": {},
		"details": {
			"database": { "status": "up" },
			"memory_heap": { "status": "up" },
			"memory_rss": { "status": "up" }
		}
	},
	"timestamp": "2026-07-03T12:00:00.000Z",
	"path": "/health"
}
```

### Example Failure

```json
{
	"statusCode": 503,
	"code": "http_error",
	"error": "Service Unavailable",
	"message": "Service Unavailable",
	"meta": {
		"status": "error",
		"error": {
			"memory_heap": {
				"status": "down",
				"message": "Heap memory limit exceeded"
			}
		}
	},
	"timestamp": "2026-07-03T12:00:00.000Z",
	"path": "/health",
	"requestId": "req_123"
}
```

### Health Checks

| Check | Description | Configurable |
|-------|-------------|--------------|
| `database` | PostgreSQL connection pool ping via Drizzle ORM. | No |
| `memory_heap` | Verifies Node.js heap memory is below the configured limit. | Yes — `HEALTH_HEAP_LIMIT_MB` (default: 150) |
| `memory_rss` | Verifies Node.js RSS memory is below the configured limit. | Yes — `HEALTH_RSS_LIMIT_MB` (default: 300) |

### Configuration

Memory limits are set via environment variables:

```env
HEALTH_HEAP_LIMIT_MB="150"
HEALTH_RSS_LIMIT_MB="300"
```

If not set, defaults to 150 MB for heap and 300 MB for RSS.

## Errors

This endpoint returns HTTP 200 for both healthy and unhealthy states. The `status` field in the response body indicates health:

- `"ok"`: All checks passed.
- `"error"`: One or more checks failed.

HTTP 503 is returned when the overall status is `"error"`.

## Response Validation

Successful health results are returned in the standard success envelope with message
`"Health check completed"`. The status, info, error, and details collections are synchronously
parsed by the health Zod response schema before crossing the network seam.
