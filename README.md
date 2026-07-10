# JobConnect — Auth Service

Microservice responsible for user authentication in the JobConnect platform.  
Built with **Node.js**, **Express**, **MySQL**, **JWT**, and **Nodemailer**.

---

## Features

- User Registration with role assignment (CANDIDATE / RECRUITER / ADMIN)
- OTP Email Verification using Nodemailer (Gmail)
- Resend OTP
- JWT-based Login
- Get Current Authenticated User
- Get User by ID
- Logout
- Forgot Password (OTP via email)
- Reset Password

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2) |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Email | Nodemailer (Gmail) |

---

## Project Structure

```
auth-service/
├── database/
│   └── schema.sql           # MySQL table creation script
├── src/
│   ├── config/
│   │   ├── db.js            # MySQL connection pool
│   │   └── email.js         # Nodemailer transporter + email templates
│   ├── controller/
│   │   └── authController.js  # All business logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + role authorization
│   ├── routes/
│   │   └── authRoute.js     # Express route definitions
│   ├── utils/
│   │   ├── generateOtp.js   # Random 6-digit OTP generator
│   │   └── jwt.js           # Token generate + verify helpers
│   └── index.js             # Express app entry point
├── .env.example             # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Setup & Run

### 1. Clone and install dependencies
```bash
git clone https://github.com/yourusername/jobconnect-auth-service.git
cd auth-service
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your MySQL credentials, JWT secret, and Gmail credentials
```

### 3. Set up the database
```bash
mysql -u root -p < database/schema.sql
```

### 4. Run the service
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The service will start on `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | None | Register new user |
| POST | /api/auth/verify-otp | None | Verify email OTP |
| POST | /api/auth/resend-otp | None | Resend OTP |
| POST | /api/auth/login | None | Login, get JWT |
| GET | /api/auth/current-user | Bearer Token | Get logged-in user |
| GET | /api/auth/:id | Bearer Token | Get user by ID |
| POST | /api/auth/logout | Bearer Token | Logout |
| POST | /api/auth/forgot-password | None | Send reset OTP |
| POST | /api/auth/reset-password | None | Reset password |

---

## Gmail Setup (for OTP emails)

1. Enable **2-Step Verification** on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate an app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS` in your `.env`

---

## Part of JobConnect Microservices

| Service | Port | Tech |
|---|---|---|
| **Auth Service** | 5000 | Node.js ← You are here |
| Profile Service | 8081 | Spring Boot |
| Feed Service | 8082 | Spring Boot |
| Job Service | 8083 | Spring Boot |
| API Gateway | 8080 | Spring Cloud |
