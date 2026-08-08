# Entity Relationship Diagram

JobOrbit uses **4 independent MySQL databases** (one per microservice). There are no cross-database foreign keys — relationships between databases are logical (`Long` id values), shown below as dashed lines.

```mermaid
erDiagram
    %% ===================== auth_db =====================
    ROLES {
        bigint id PK
        varchar name "ADMIN | RECRUITER | JOB_SEEKER"
    }
    USERS {
        bigint id PK
        varchar full_name
        varchar email "unique"
        varchar password "BCrypt hash"
        bigint role_id FK
        boolean enabled
        datetime created_at
    }
    USERS }o--|| ROLES : "has role"

    %% ===================== user_db =====================
    PROFILES {
        bigint id PK
        bigint user_id "logical FK -> USERS.id"
        varchar full_name
        varchar email
        varchar phone
        varchar headline
        varchar location
        text summary
        varchar resume_file_name
        varchar resume_file_url
        datetime created_at
        datetime updated_at
    }
    EDUCATION {
        bigint id PK
        varchar institution
        varchar degree
        varchar field_of_study
        int start_year
        int end_year
        varchar grade
        bigint profile_id FK
    }
    EXPERIENCE {
        bigint id PK
        varchar company_name
        varchar job_title
        date start_date
        date end_date
        boolean currently_working
        text description
        bigint profile_id FK
    }
    SKILLS {
        bigint id PK
        varchar name
        varchar proficiency
        bigint profile_id FK
    }
    PROFILES ||--o{ EDUCATION : "has"
    PROFILES ||--o{ EXPERIENCE : "has"
    PROFILES ||--o{ SKILLS : "has"

    %% ===================== job_db =====================
    COMPANIES {
        bigint id PK
        varchar name
        varchar industry
        varchar location
        text description
        varchar website
        varchar logo_url
    }
    JOBS {
        bigint id PK
        varchar title
        text description
        varchar location
        varchar job_type "FULL_TIME | PART_TIME | INTERNSHIP | CONTRACT | REMOTE"
        varchar experience_required
        double min_salary
        double max_salary
        text skills_required
        varchar status "OPEN | CLOSED"
        bigint recruiter_id "logical FK -> USERS.id"
        bigint company_id FK
        datetime created_at
        datetime updated_at
    }
    COMPANIES ||--o{ JOBS : "posts"

    %% ===================== application_db =====================
    APPLICATIONS {
        bigint id PK
        bigint job_id "logical FK -> JOBS.id"
        bigint applicant_id "logical FK -> USERS.id"
        bigint recruiter_id "logical FK -> USERS.id"
        text cover_letter
        varchar resume_url
        varchar status "APPLIED | SHORTLISTED | REJECTED | WITHDRAWN | HIRED"
        datetime applied_at
        datetime updated_at
    }
```

## Cross-database logical relationships

| From (table.column) | Database | To (table.column) | Database | Enforced by |
|---|---|---|---|---|
| `profiles.user_id` | user_db | `users.id` | auth_db | application logic (User Service reads `X-User-Id` header) |
| `jobs.recruiter_id` | job_db | `users.id` | auth_db | application logic (Job Service reads `X-User-Id` header) |
| `applications.job_id` | application_db | `jobs.id` | job_db | application logic |
| `applications.applicant_id` | application_db | `users.id` | auth_db | application logic |
| `applications.recruiter_id` | application_db | `users.id` | auth_db | application logic |

There is a unique constraint on `applications (job_id, applicant_id)` so a job seeker cannot apply to the same job twice.
