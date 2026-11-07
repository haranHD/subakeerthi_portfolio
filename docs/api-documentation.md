# Subakeerthii MP Portfolio Platform — API Documentation

**Base Path**: `/api/v1`

---

## 1. Public Endpoints (Unauthenticated)

### `GET /health`
- **Description**: Service health check
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-11-07T17:17:13.145Z",
  "service": "Subakeerthii MP Portfolio Backend API",
  "version": "1.0.0"
}
```

### `GET /api/v1/profile`
- **Description**: Returns Subakeerthii MP's public biographical summary, professional headline, and core values.
- **Response**: `200 OK`

### `GET /api/v1/services`
- **Description**: Returns the list of 6 published areas of professional work ordered by `displayOrder`.
- **Response**: `200 OK`

### `GET /api/v1/programmes`
- **Description**: Returns the list of structured training programme modules with intended audiences, purposes, and curriculum highlights.
- **Response**: `200 OK`

### `GET /api/v1/credentials`
- **Description**: Returns the academic education and certified trainer accreditations timeline.
- **Response**: `200 OK`

### `GET /api/v1/audiences`
- **Description**: Returns the 4 beneficiary stakeholder groups (Schools, Parents, Children, Workplaces).
- **Response**: `200 OK`

### `GET /api/v1/site-settings`
- **Description**: Key-value map of global contact information, site tags, and helpline notices.
- **Response**: `200 OK`

### `POST /api/v1/enquiries`
- **Description**: Submits a training or consultation enquiry.
- **Rate Limit**: 10 submissions per 15 minutes per IP.
- **Request Body**:
```json
{
  "fullName": "Dr. Ramesh Kumar",
  "organisation": "Greenwood School",
  "email": "contact@greenwood.edu.in",
  "phone": "+91 9876543210",
  "category": "School / Educational Institution",
  "areaOfInterest": "POCSO School Awareness",
  "requirements": "Need a faculty sensitisation session for 50 teachers."
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Your training enquiry has been submitted successfully.",
  "data": { "id": "uuid", "createdAt": "timestamp" }
}
```

---

## 2. Authentication Endpoints

### `POST /api/v1/auth/login`
- **Description**: Authenticates administrator and establishes HTTP-only cookie session.
- **Rate Limit**: 8 attempts per 15 minutes.
- **Request Body**: `{ "email": "admin@subakeerthii.com", "password": "..." }`
- **Response**: `200 OK` with `Set-Cookie: subakeerthii.sid=...`

### `POST /api/v1/auth/logout`
- **Description**: Destroys server-side session and clears cookie.
- **Response**: `200 OK`

### `GET /api/v1/auth/me`
- **Description**: Returns current authenticated user session data.
- **Response**: `200 OK` or `401 Unauthorized`

---

## 3. Administrative Endpoints (Requires Session Cookie)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Returns operational stats, recent enquiries, and audit events |
| `GET` | `/api/v1/admin/profile` | Returns full profile data |
| `PUT` | `/api/v1/admin/profile` | Updates profile fields and headline |
| `GET` | `/api/v1/admin/services` | Lists all services (including drafts) |
| `POST` | `/api/v1/admin/services` | Creates a new service card |
| `PUT` | `/api/v1/admin/services/:id` | Updates an existing service card |
| `DELETE` | `/api/v1/admin/services/:id` | Deletes a service card |
| `GET` | `/api/v1/admin/programmes` | Lists all programmes |
| `POST` | `/api/v1/admin/programmes` | Creates a training programme |
| `PUT` | `/api/v1/admin/programmes/:id` | Updates programme details & highlights |
| `DELETE` | `/api/v1/admin/programmes/:id` | Deletes a programme |
| `GET` | `/api/v1/admin/credentials` | Lists credentials |
| `POST` | `/api/v1/admin/credentials` | Creates a credential item |
| `PUT` | `/api/v1/admin/credentials/:id` | Updates a credential |
| `DELETE` | `/api/v1/admin/credentials/:id` | Deletes a credential |
| `GET` | `/api/v1/admin/audiences` | Lists audience groups |
| `POST` | `/api/v1/admin/audiences` | Creates an audience group |
| `PUT` | `/api/v1/admin/audiences/:id` | Updates an audience group |
| `DELETE` | `/api/v1/admin/audiences/:id` | Deletes an audience group |
| `GET` | `/api/v1/admin/enquiries` | Lists enquiries (with optional `?status=NEW`) |
| `GET` | `/api/v1/admin/enquiries/:id` | Retrieves single enquiry |
| `PUT` | `/api/v1/admin/enquiries/:id/status` | Updates enquiry status & notes |
| `GET` | `/api/v1/admin/media` | Lists uploaded media files |
| `POST` | `/api/v1/admin/media` | Uploads multipart file |
| `DELETE` | `/api/v1/admin/media/:id` | Deletes media file |
| `GET` | `/api/v1/admin/settings` | Lists site settings |
| `PUT` | `/api/v1/admin/settings` | Updates site setting key-value pair |
| `GET` | `/api/v1/admin/audit-logs` | Retrieves administrative activity audit trail |
