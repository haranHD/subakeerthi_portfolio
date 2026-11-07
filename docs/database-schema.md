# Subakeerthii MP Portfolio Platform — Database Schema

**Engine**: PostgreSQL 16  
**ORM**: Prisma 5.22  
**Database Name**: `subakeerthii_db`  
**Primary Key Standard**: UUID v4 on all tables

---

## Entity Relationship Overview

```
[admin_users] 1 ──── ∞ [audit_logs]
[profiles]
[services]
[programmes]
[credentials]
[audience_groups]
[enquiries]
[media_assets]
[site_settings]
```

---

## Table Specifications

### 1. `admin_users`
Stores provisioned administrative personnel.
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique, Indexed)
- `passwordHash` (TEXT, bcrypt hashed)
- `role` (VARCHAR, default `'ADMIN'`)
- `isActive` (BOOLEAN, default `true`)
- `createdAt` (TIMESTAMP WITH TIME ZONE)
- `updatedAt` (TIMESTAMP WITH TIME ZONE)

### 2. `profiles`
Single-record store for Subakeerthii MP's official public biographical information.
- `id` (UUID, Primary Key)
- `fullName` (VARCHAR)
- `headline` (VARCHAR)
- `biography` (TEXT)
- `location` (VARCHAR)
- `phone` (VARCHAR)
- `email` (VARCHAR)
- `portraitUrl` (VARCHAR, Nullable)
- `heroPills` (JSONB, Array of service labels)
- `values` (JSONB, 4 core values)
- `updatedAt` (TIMESTAMP WITH TIME ZONE)

### 3. `services`
Dynamic service cards for "Areas of Professional Work".
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `tag` (VARCHAR)
- `category` (VARCHAR)
- `description` (TEXT)
- `audience` (VARCHAR)
- `icon` (VARCHAR, Lucide icon name)
- `displayOrder` (INT, default `0`)
- `isPublished` (BOOLEAN, default `true`)
- `createdAt`, `updatedAt`
- *Index*: `(isPublished, displayOrder)`

### 4. `programmes`
Structured awareness and compliance curriculum modules.
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `category` (VARCHAR)
- `intendedAudience` (VARCHAR)
- `purpose` (TEXT)
- `description` (TEXT)
- `highlights` (JSONB, string array of key curriculum items)
- `duration` (VARCHAR, Nullable)
- `bannerUrl` (VARCHAR, Nullable)
- `displayOrder` (INT)
- `isPublished` (BOOLEAN)
- `createdAt`, `updatedAt`
- *Index*: `(isPublished, displayOrder)`

### 5. `credentials`
Chronological timeline of academic degrees and certified accreditations.
- `id` (UUID, Primary Key)
- `credentialType` (VARCHAR: `'EDUCATION'` or `'ACCREDITATION'`)
- `institution` (VARCHAR)
- `qualification` (VARCHAR)
- `period` (VARCHAR)
- `status` (VARCHAR)
- `details` (TEXT)
- `issuingBody` (VARCHAR, Nullable)
- `statutoryDomain` (VARCHAR, Nullable)
- `certificateUrl` (VARCHAR, Nullable)
- `displayOrder` (INT)
- `isPublished` (BOOLEAN)
- `createdAt`, `updatedAt`
- *Index*: `(credentialType, isPublished, displayOrder)`

### 6. `audience_groups`
Four target beneficiary communities.
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `badge` (VARCHAR)
- `icon` (VARCHAR)
- `description` (TEXT)
- `actionText` (VARCHAR)
- `displayOrder` (INT)
- `isPublished` (BOOLEAN)
- `createdAt`, `updatedAt`

### 7. `enquiries`
Secure storage of inbound training consultation requests.
- `id` (UUID, Primary Key)
- `fullName` (VARCHAR)
- `organisation` (VARCHAR)
- `email` (VARCHAR, Nullable)
- `phone` (VARCHAR, Nullable)
- `category` (VARCHAR)
- `areaOfInterest` (VARCHAR)
- `requirements` (TEXT)
- `status` (VARCHAR, `'NEW'` | `'PENDING'` | `'RESPONDED'` | `'ARCHIVED'`)
- `ipHash` (VARCHAR, Nullable, SHA-256 privacy hash)
- `notes` (TEXT, Nullable, internal notes)
- `createdAt`, `updatedAt`
- *Index*: `(status, createdAt)`

### 8. `media_assets`
Metadata catalog for uploaded assets.
- `id` (UUID, Primary Key)
- `fileName` (VARCHAR)
- `originalName` (VARCHAR)
- `mimeType` (VARCHAR)
- `size` (INT, bytes)
- `storageUrl` (VARCHAR)
- `assetType` (VARCHAR)
- `createdAt` (TIMESTAMP)

### 9. `site_settings`
Configurable key-value store.
- `id` (UUID, Primary Key)
- `key` (VARCHAR, Unique)
- `value` (TEXT)
- `description` (VARCHAR, Nullable)
- `updatedAt` (TIMESTAMP)

### 10. `audit_logs`
Immutable audit log recording operations performed by administrators.
- `id` (UUID, Primary Key)
- `adminUserId` (UUID, Foreign Key referencing `admin_users.id`, `ON DELETE SET NULL`)
- `action` (VARCHAR: `'CREATE'`, `'UPDATE'`, `'DELETE'`, `'LOGIN'`, `'LOGOUT'`, etc.)
- `entityType` (VARCHAR: `'SERVICE'`, `'PROGRAMME'`, `'AUTH'`, `'PROFILE'`, etc.)
- `entityId` (VARCHAR, Nullable)
- `details` (JSONB, Nullable)
- `ipAddress` (VARCHAR, Nullable)
- `createdAt` (TIMESTAMP)
- *Index*: `(entityType, createdAt)`
