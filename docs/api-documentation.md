# JobOrbit API Documentation

All requests go through the **API Gateway**: `http://localhost:8080`. Paths below are relative to that base. Every response is wrapped in:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... },
  "timestamp": "2026-08-04T10:00:00"
}
```

Authenticated endpoints require: `Authorization: Bearer <jwt>`

---

## Auth Service — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user. Body: `{fullName, email, password, role}` (`role`: `ADMIN`\|`RECRUITER`\|`JOB_SEEKER`) |
| POST | `/api/auth/login` | Public | Login. Body: `{email, password}`. Returns JWT. |
| GET | `/api/auth/admin/users` | ADMIN | List all users |
| PATCH | `/api/auth/admin/users/{id}/status` | ADMIN | Body: `{enabled: true\|false}` — enable/disable an account |

**Register/Login response `data` shape:**
```json
{
  "userId": 12,
  "fullName": "Jordan Patel",
  "email": "jordan@example.com",
  "role": "JOB_SEEKER",
  "token": "eyJhbGciOi...",
  "tokenType": "Bearer"
}
```

---

## User Service — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/users/profile` | Any | Get (or lazily create) the caller's profile |
| PUT | `/api/users/profile` | Any | Update basic profile fields |
| POST | `/api/users/profile/resume` | Any | Multipart upload, field name `file` |
| GET | `/api/users/profile/resume/{fileName}` | Any | Download a resume file |
| POST | `/api/users/profile/education` | Any | Add an education entry |
| PUT | `/api/users/profile/education/{id}` | Owner only | Update an education entry |
| DELETE | `/api/users/profile/education/{id}` | Owner only | Delete an education entry |
| POST | `/api/users/profile/experience` | Any | Add an experience entry |
| PUT | `/api/users/profile/experience/{id}` | Owner only | Update an experience entry |
| DELETE | `/api/users/profile/experience/{id}` | Owner only | Delete an experience entry |
| POST | `/api/users/profile/skills` | Any | Add a skill |
| DELETE | `/api/users/profile/skills/{id}` | Owner only | Delete a skill |

---

## Job Service — `/api/jobs`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/jobs` | RECRUITER, ADMIN | Create a job posting |
| PUT | `/api/jobs/{id}` | Owner (RECRUITER) or ADMIN | Update a job posting |
| DELETE | `/api/jobs/{id}` | Owner (RECRUITER) or ADMIN | Delete a job posting |
| GET | `/api/jobs/{id}` | Any | Get a single job by id |
| GET | `/api/jobs/search` | Any | Search/filter/paginate open jobs |
| GET | `/api/jobs/my-jobs` | RECRUITER, ADMIN | List the caller's own postings |
| GET | `/api/jobs/admin/all` | ADMIN | List every job on the platform, any status |
| GET | `/api/jobs/companies` | Any | List all companies |
| POST | `/api/jobs/companies` | RECRUITER, ADMIN | Create a company |
| GET | `/api/jobs/companies/{id}` | Any | Get a company by id |

**`GET /api/jobs/search` query params (all optional):**
`keyword`, `location`, `jobType` (`FULL_TIME`\|`PART_TIME`\|`INTERNSHIP`\|`CONTRACT`\|`REMOTE`), `minSalary`, `maxSalary`, `page` (default 0), `size` (default 10)

**Job create/update request body:**
```json
{
  "title": "Java Full Stack Developer",
  "description": "...",
  "location": "Pune",
  "jobType": "FULL_TIME",
  "experienceRequired": "2-4 years",
  "minSalary": 600000,
  "maxSalary": 1200000,
  "skillsRequired": "Java, Spring Boot, React",
  "companyId": 3
}
```

**Paged response shape (used by search / my-jobs / admin/all / applications lists):**
```json
{
  "content": [ ... ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 42,
  "totalPages": 5,
  "last": false
}
```

---

## Application Service — `/api/applications`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/applications` | JOB_SEEKER | Apply to a job. Body: `{jobId, recruiterId, coverLetter?, resumeUrl?}` |
| DELETE | `/api/applications/{id}` | Owner (JOB_SEEKER) | Withdraw an application |
| GET | `/api/applications/my-applications` | JOB_SEEKER | Paginated list of the caller's applications |
| GET | `/api/applications/job/{jobId}` | RECRUITER, ADMIN | Paginated list of applicants for a specific job |
| GET | `/api/applications/recruiter` | RECRUITER, ADMIN | Paginated list of all applications across the caller's jobs (optional `status` filter) |
| PATCH | `/api/applications/{id}/status` | Owner recruiter or ADMIN | Body: `{status}` (`APPLIED`\|`SHORTLISTED`\|`REJECTED`\|`WITHDRAWN`\|`HIRED`) |

---

## Error Responses

All errors use the same envelope with `success: false`:

| HTTP Status | Meaning | Example trigger |
|---|---|---|
| 400 | Validation failed | Missing/invalid field on a `@Valid` DTO |
| 401 | Invalid credentials / missing or expired JWT | Wrong password; Gateway rejects a bad token before it reaches a service |
| 403 | Unauthorized action | Recruiter tries to edit someone else's job |
| 404 | Resource not found | Job/application/company id doesn't exist |
| 409 | Duplicate resource | Registering an email that already exists; applying twice to the same job |
| 500 | Unexpected server error | Uncaught exception |
