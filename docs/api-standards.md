# Kadal2Kadaai — API Standards

## Versioning Strategy

All API endpoints are versioned and prefixed:

```
https://api.kadal2kadaai.com/api/v1/
```

- **v1** is the current active version
- Breaking changes create a new version (`/api/v2/`)
- Old versions are deprecated with a `Sunset` response header before removal
- Version is in the URL path, not headers

## Standard Response Envelope

Every API response **must** use this envelope:

### Success Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": { ... } ,
  "pagination": null,
  "meta": {
    "version": "1.0",
    "timestamp": "2026-06-05T06:00:00Z",
    "request_id": "01J3X9YZABCDEF123456789ABC"
  }
}
```

### Paginated Success Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [ ... ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 120,
    "last_page": 8,
    "from": 1,
    "to": 15,
    "next_page_url": "https://api.kadal2kadaai.com/api/v1/products?page=2",
    "prev_page_url": null
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2026-06-05T06:00:00Z",
    "request_id": "01J3X9YZABCDEF123456789ABC"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "phone": ["The phone must be 10 digits."]
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2026-06-05T06:00:00Z",
    "request_id": "01J3X9YZABCDEF123456789ABC"
  }
}
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST (resource created) |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Malformed request syntax |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Resource conflict (duplicate email, etc.) |
| `422 Unprocessable Entity` | Validation errors |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
| `503 Service Unavailable` | Maintenance mode |

## Pagination Standards

- Default page size: `15`
- Maximum page size: `100`
- Query params: `?page=1&per_page=15`
- Sorting: `?sort=created_at&direction=desc`
- Filtering: `?filter[status]=active&filter[category_id]=uuid`

## Request Headers

All authenticated requests must include:

```
Authorization: Bearer {sanctum_token}
Accept: application/json
Content-Type: application/json
X-Requested-With: XMLHttpRequest
```

## Input Validation Standards

- All inputs validated via Laravel Form Request classes
- Validation rules defined with strict typing
- Custom error messages in Tamil/English (future)
- Boolean: accept `true/false`, `1/0`, `"true"/"false"`
- Dates: ISO 8601 format (`2026-06-05T06:00:00Z`)
- UUIDs: Standard UUID v4 format

## Rate Limiting

| Endpoint Group | Limit |
|---|---|
| OTP Send | 3 requests / 10 minutes per phone |
| Login attempts | 5 requests / 15 minutes per IP |
| General API | 60 requests / minute per token |
| Unauthenticated | 30 requests / minute per IP |
| File upload | 10 uploads / minute per user |

## Authentication

- Token-based via Laravel Sanctum
- Tokens expire after 7 days (configurable)
- Refresh via `POST /api/v1/auth/refresh`
- Token stored in `Authorization: Bearer` header (not cookies for API)

## Filtering & Search

Use `spatie/laravel-query-builder` conventions:

```
GET /api/v1/products?filter[category_id]=uuid&filter[status]=active
GET /api/v1/products?sort=-created_at,name
GET /api/v1/products?include=images,category
GET /api/v1/products?fields[products]=id,name,price
```

## Health Check Endpoints

```
GET /api/health          → 200 OK, database/redis/storage status
GET /api/v1/ping         → 200 OK, { "pong": true, "timestamp": "..." }
```

## Error Code Reference

Custom application error codes in `meta.error_code`:

| Code | Meaning |
|------|---------|
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Token expired |
| `AUTH_003` | OTP expired or invalid |
| `AUTH_004` | Account suspended |
| `AUTH_005` | Email not verified |
| `AUTH_006` | Phone not verified |
| `VAL_001` | Generic validation error |
| `STOR_001` | File too large |
| `STOR_002` | Invalid file type |
| `RATE_001` | Rate limit exceeded |
