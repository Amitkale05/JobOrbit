# JobOrbit — Smart Recruitment Platform

A full-stack Java microservices recruitment platform built for a CDAC final project. Job seekers search and apply to jobs, recruiters post and manage openings and applicants, and admins oversee the whole platform.

## Tech Stack

**Backend:** Java 21, Spring Boot 3.3, Spring Security, JWT, Spring Data JPA (Hibernate), MySQL, Maven, Lombok, Bean Validation, Spring Cloud Gateway
**Frontend:** React 18, React Router DOM, Axios, Bootstrap 5

## Architecture

JobOrbit is split into 5 independently-deployable Spring Boot applications plus a React SPA. The frontend talks **only** to the API Gateway; the Gateway is the sole entry point into the system.

```
React Frontend (3000)
        │
        ▼
API Gateway (8080)  ── JWT validation, CORS, routing, logging
        │
        ├──► Auth Service (8081)         → auth_db
        ├──► User Service (8082)         → user_db
        ├──► Job Service (8083)          → job_db
        └──► Application Service (8084)  → application_db
```

Each microservice owns its own MySQL database. **No shared database, no direct service-to-service calls.** Services trust the Gateway: once the Gateway verifies a caller's JWT, it forwards `X-User-Id` / `X-User-Name` / `X-User-Role` headers downstream, so individual services never need to re-parse a JWT.

See `docs/architecture.md`, `docs/erd.md`, and `docs/sequence-diagrams.md` for diagrams, and `docs/api-documentation.md` for the full REST API reference.

## Project Structure

```
App_JobOrbit/
├── api-gateway/            (port 8080)
├── auth-service/           (port 8081) → auth_db
├── user-service/           (port 8082) → user_db
├── job-service/            (port 8083) → job_db
├── application-service/    (port 8084) → application_db
├── frontend/                React SPA
├── database/                 raw SQL scripts (one per DB)
└── docs/                    ERD, architecture, sequence diagrams, API docs
```

Every backend service follows the same layered package structure:

```
config      - Spring configuration beans (security, multipart, etc.)
controller  - REST endpoints (thin - HTTP <-> DTO translation only)
dto         - request/response payloads (entities are NEVER exposed directly)
entity      - JPA entities
repository  - Spring Data JPA repositories
service     - business logic interfaces
service.impl- business logic implementations
security    - identity/role resolution from Gateway-forwarded headers
exception   - custom exceptions + @RestControllerAdvice global handler
util        - JWT utilities, JPA Specifications, etc.
```

## Getting Started

### Prerequisites
- JDK 21
- Maven 3.9+
- MySQL 8.x running on `localhost:3306` (default credentials in each `application.properties`: `root` / `root` — change for your environment)
- Node.js 18+ and npm

### 1. Database
Each service auto-creates its schema on startup (`spring.jpa.hibernate.ddl-auto=update` + `createDatabaseIfNotExist=true`). If you'd rather run scripts manually, use the files in `database/` in order (`01_auth_db.sql` → `04_application_db.sql`).

### 2. Start the backend services (in this order)
```bash
cd auth-service        && mvn spring-boot:run     # 8081
cd user-service         && mvn spring-boot:run    # 8082
cd job-service          && mvn spring-boot:run    # 8083
cd application-service  && mvn spring-boot:run    # 8084
cd api-gateway          && mvn spring-boot:run    # 8080  (start LAST - it routes to the others)
```
Each service is a completely standalone Maven project — there is no parent POM, config server, or Eureka registry. Ports and routing are static (see `api-gateway/src/main/resources/application.yml`).

### 3. Start the frontend
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000` and talks to the Gateway at `http://localhost:8080/api`.

### 4. Try it out
1. Register an account as a **Recruiter** → create a Company → post a Job.
2. Register a second account as a **Job Seeker** (use a different browser/incognito) → search jobs → apply.
3. Log back in as the Recruiter → **Applicants** → shortlist/reject/hire.
4. To test Admin features, manually update a user's `role_id` in `auth_db.users` to the ADMIN role's id (or seed an admin — see the commented INSERT in `database/01_auth_db.sql`), then log in with that account.

## Authentication Flow (short version)
1. `POST /api/auth/register` or `/api/auth/login` (public, no token needed) → Auth Service returns a signed JWT containing `userId`, `role`, and `sub` (email).
2. Every other request must include `Authorization: Bearer <token>`.
3. The Gateway verifies the signature/expiry, then injects `X-User-Id`, `X-User-Name`, `X-User-Role` headers before forwarding to the target microservice.
4. Downstream services read those headers (never the raw JWT) to know who's calling and enforce ownership/role rules (e.g. a recruiter can only edit their own job postings).

## Notable Design Decisions
- **Spring Cloud Gateway only** — no Eureka/Config Server/OpenFeign, per project constraints. Routes are static `http://localhost:PORT` URIs in `application.yml`.
- **JPA Specifications** for job search/filter (`job-service`) instead of dozens of `@Query` method variants — keyword + location + job type + salary range all compose into a single dynamic query.
- **DTOs everywhere** — entities never cross the controller boundary.
- **Ownership checks in the service layer**, not the controller — a recruiter editing someone else's job, or a job seeker withdrawing someone else's application, is rejected with a 403 regardless of which endpoint they hit.
- **No shared database** — cross-service references (e.g. a Job's `recruiterId`, an Application's `jobId`) are stored as plain `Long` columns, not JPA relationships, since the referenced row lives in a different physical database.
