# Architecture Diagram

## High-Level Component Diagram

```mermaid
graph TB
    subgraph Client
        FE[React Frontend<br/>localhost:3000]
    end

    subgraph Gateway Layer
        GW[API Gateway :: 8080<br/>Spring Cloud Gateway<br/>JWT Filter · CORS · Routing · Logging]
    end

    subgraph Microservices
        AUTH[Auth Service :: 8081<br/>Register · Login · JWT · Roles]
        USER[User Service :: 8082<br/>Profile · Resume · Skills · Education · Experience]
        JOB[Job Service :: 8083<br/>Jobs · Companies · Search · Filter · Pagination]
        APP[Application Service :: 8084<br/>Apply · Withdraw · Shortlist · Reject]
    end

    subgraph Databases
        AUTHDB[(auth_db)]
        USERDB[(user_db)]
        JOBDB[(job_db)]
        APPDB[(application_db)]
    end

    FE -->|HTTPS REST + JWT| GW
    GW -->|/api/auth/**| AUTH
    GW -->|/api/users/**| USER
    GW -->|/api/jobs/**| JOB
    GW -->|/api/applications/**| APP

    AUTH --> AUTHDB
    USER --> USERDB
    JOB --> JOBDB
    APP --> APPDB
```

## Key Points

- **Single entry point:** the frontend never talks to a microservice directly — every request goes through the Gateway.
- **No inter-service calls:** Job Service, User Service, and Application Service never call each other. Any cross-domain data the frontend needs (e.g. "who is this applicant") is fetched by the frontend making a separate call to the relevant service through the Gateway.
- **Static routing:** the Gateway routes by URL path prefix to a fixed `http://localhost:PORT` — no service discovery (Eureka) is used, per project constraints.
- **Security boundary:** JWT signature/expiry is verified exactly once, at the Gateway. Downstream services trust the `X-User-Id` / `X-User-Name` / `X-User-Role` headers the Gateway injects.
- **Database-per-service:** each service has exclusive ownership of its schema; there are no foreign keys across databases, only logical `Long` id references.

## Layered Architecture (inside every microservice)

```mermaid
graph LR
    C[Controller<br/>HTTP <-> DTO] --> S[Service<br/>Business rules]
    S --> R[Repository<br/>Spring Data JPA]
    R --> D[(MySQL Database)]
    S -.uses.-> U[Util / Security<br/>JWT, Specifications, header resolver]
```

Controllers never contain business logic; they validate input (`@Valid`), call the service, and wrap the result in a standard `ApiResponse` envelope with the correct HTTP status.
