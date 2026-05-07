# Production Ready Node API

Production-oriented backend project built with **Node.js + Express**, running in a containerized environment with real-world backend concepts.

This project is intentionally small enough to build fast, but includes infrastructure patterns commonly seen in production systems.

---

## What This Project Simulates

This project simulates a real backend service that includes:

* REST API architecture
* JWT authentication flow (`register`, `login`, `me`)
* Persistent user storage with entity["software","PostgreSQL","database system"]
* Rate limiting with entity["software","Redis","in-memory data store"]
* Health monitoring endpoints
* Basic operational endpoints
* CI pipeline with smoke testing
* Dockerized deployment workflow

The goal is to demonstrate that this is more than a basic CRUD API.

---

## Tech Stack

### Backend

* Node.js 20
* Express 5

### Database

* entity["software","PostgreSQL","database system"] (`pg`)

### Infrastructure / DevOps

* entity["software","Redis","in-memory data store"]
* entity["software","Docker","container platform"]
* entity["software","Docker Compose","container orchestration tool"]
* entity["software","GitHub Actions","CI/CD platform"]

### Security / Utilities

* JWT
* Helmet
* Morgan
* Dotenv
* express-rate-limit
* rate-limit-redis

---

## Architecture

Using `docker-compose.yml`, the project runs 3 services together:

* **app** → Express API (`localhost:3000`)
* **postgres** → Stores user data
* **redis** → Handles rate limiting

---

## Quick Start (Recommended)

Run everything with Docker:

```bash
docker compose up -d --build
```

Available endpoints:

* `http://localhost:3000`
* `http://localhost:3000/auth/register`
* `http://localhost:3000/auth/login`
* `http://localhost:3000/health`

Stop containers:

```bash
docker compose down
```

---

## Local Development (Without Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

> Make sure `DATABASE_URL` and optionally `REDIS_URL` are configured correctly.

---

## Environment Variables

Reference: `.env.example`

| Variable             | Description           |
| -------------------- | --------------------- |
| PORT                 | Application port      |
| NODE_ENV             | Environment mode      |
| JWT_SECRET           | JWT signing secret    |
| JWT_EXPIRES_IN       | Token expiration      |
| DATABASE_URL         | PostgreSQL connection |
| REDIS_URL            | Redis connection      |
| RATE_LIMIT_WINDOW_MS | Rate limit window     |
| RATE_LIMIT_MAX       | Max requests          |

---

## API Endpoints

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/`              | API status       |
| GET    | `/health`        | Health check     |
| GET    | `/env`           | Environment info |
| POST   | `/auth/register` | Register user    |
| POST   | `/auth/login`    | Login user       |
| GET    | `/me`            | Get current user |

> `/me` requires a Bearer token.

---

## Example API Usage

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"secret123"}'
```

### Get Current User

```bash
curl http://localhost:3000/me \
-H "Authorization: Bearer YOUR_TOKEN"
```

---

## Available Scripts

```bash
npm run dev
```

Runs the app with nodemon.

```bash
npm start
```

Runs the app in production mode.

```bash
npm run smoke
```

Runs a health-check smoke test.

---

## CI Pipeline

Located in:

```bash
.github/workflows/ci.yml
```

Pipeline steps:

1. Install dependencies
2. Run smoke tests
3. Build Docker image

> No automatic deployment included.

---

## Project Structure

```bash
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  routes/
  db/

public/
  ui/
```

---

## Why This Project Matters

Most junior backend projects stop at CRUD.

This project demonstrates:

* Authentication
* Database integration
* Rate limiting
* Containerization
* CI workflow
* Production thinking

Perfect for GitHub portfolio, internship applications, and backend interviews.
