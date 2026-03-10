# Full Stack Roadmap App

A gamified learning tracker for the Java/Spring Boot/React full-stack path. Features JWT auth, XP system, streak tracking, activity heatmap, and skill radar.

---

## Quick Start (Docker — Recommended)

**Requirements:** Docker + Docker Compose

```bash
# 1. Clone / unzip the project
cd fullstack-roadmap

# 2. Build and run everything
docker-compose up --build

# 3. Open in browser
#    App:  http://localhost:3000
#    API:  http://localhost:8080
```

Register an account, then start checking off tasks!

---

## Manual Local Development

### Backend (Spring Boot)

**Requirements:** Java 17+, Maven 3.8+

```bash
cd backend

# Run the Spring Boot app
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run

# Backend runs at: http://localhost:8080
# H2 Console:      http://localhost:8080/h2-console
#   JDBC URL: jdbc:h2:file:./data/roadmapdb
#   Username: sa  |  Password: (empty)
```

### Frontend (React)

**Requirements:** Node.js 16+, npm

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start dev server (proxies /api to localhost:8080)
npm start

# Frontend runs at: http://localhost:3000
```

---

## Project Structure

```
fullstack-roadmap/
├── backend/
│   ├── src/main/java/com/roadmap/
│   │   ├── RoadmapApplication.java     # Entry point
│   │   ├── config/SecurityConfig.java  # JWT + CORS config
│   │   ├── controller/
│   │   │   ├── AuthController.java     # POST /api/auth/login, /register
│   │   │   └── ProgressController.java # GET/POST /api/progress
│   │   ├── model/
│   │   │   ├── User.java               # User entity
│   │   │   ├── Progress.java           # Task completion records
│   │   │   └── DailyActivity.java      # Daily streak data
│   │   ├── repository/                 # Spring Data JPA repos
│   │   ├── security/
│   │   │   ├── JwtUtil.java            # JWT generate/validate
│   │   │   └── JwtFilter.java          # Request filter
│   │   └── service/
│   │       ├── UserService.java        # Auth + XP system
│   │       └── ProgressService.java    # Task toggle + streak
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   └── src/
│       ├── App.js                      # Router setup
│       ├── data.js                     # All roadmap content
│       ├── api/client.js               # Axios + JWT interceptors
│       ├── hooks/useAuth.js            # Auth context
│       └── pages/
│           ├── LoginPage.js            # Login + Register
│           ├── DashboardPage.js        # Stats + Heatmap + Radar
│           └── RoadmapPage.js          # Checklist tracker
│
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Auth (public)
| Method | URL | Body | Response |
|--------|-----|------|----------|
| POST | `/api/auth/login` | `{username, password}` | `{token, username, level, xp}` |
| POST | `/api/auth/register` | `{username, password, displayName}` | `{token, username, level, xp}` |

### Progress (requires Bearer token)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/progress` | Get all completed task keys + stats |
| POST | `/api/progress/toggle` | Toggle a task `{taskKey}` |
| GET | `/api/progress/activity` | Last 30 days activity + streak |

---

## Features

### Gamification
- **XP System** — earn 50 XP per task completed
- **Level System** — level up every 200 XP
- **Rank System** — E → D → C → B → A → S rank based on % complete
- **Streaks** — tracks consecutive daily activity

### Dashboard
- **Skill Radar** — hexagonal chart showing progress across all 6 phases
- **Activity Heatmap** — GitHub-style 30-day activity grid
- **Phase Breakdown** — click any phase to jump into the roadmap

### Roadmap Tracker
- 3-column layout: phases / topics / checklist
- Progress bars on every level (phase, topic, task)
- Learning resources for every topic
- Phase capstone projects shown at end of each phase

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.11.5) |
| Database | H2 (file-based, persists between restarts) |
| Frontend | React 18, React Router v6, Axios |
| Styling | Pure CSS-in-JS (JetBrains Mono + Playfair Display) |
| Containerization | Docker + Docker Compose |

---

## Customization

### Change XP per task
Edit `ProgressService.java` line with `userService.addXp(user, 50)` → change `50`.

### Add new phases / topics
Edit `frontend/src/data.js` — the `DATA` array defines all content.

### Use PostgreSQL instead of H2
Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/roadmapdb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
Add `postgresql` driver dependency to `pom.xml`.
