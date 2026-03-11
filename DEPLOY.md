# Deployment Guide — Railway (Free)

Railway is the easiest free platform for this stack.
You get: Spring Boot backend + PostgreSQL + React frontend all free.

---

## Step 1 — Push to GitHub

```bash
# In the fullstack-roadmap folder
git init
git add .
git commit -m "initial commit"

# Create a repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/fullstack-roadmap.git
git push -u origin main
```

---

## Step 2 — Deploy Backend on Railway

1. Go to https://railway.app → Sign up with GitHub (free)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repo → choose the **`backend`** folder as root
4. Railway auto-detects the Dockerfile ✓

### Add PostgreSQL database:
5. In your project dashboard → **New** → **Database** → **PostgreSQL**
6. Railway auto-creates `DATABASE_URL` and links it to your service ✓

### Set environment variables on the backend service:
| Variable | Value |
|----------|-------|
| `SPRING_PROFILE` | `prod` |
| `JWT_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |
| `DATABASE_URL` | auto-set by Railway when you add PostgreSQL |

7. Click **Deploy** — wait ~3 minutes for Maven build
8. Go to **Settings** → **Networking** → **Generate Domain**
9. Copy your backend URL: `https://your-backend.up.railway.app`

---

## Step 3 — Deploy Frontend on Railway

1. In the same Railway project → **New Service** → **GitHub Repo**
2. Select your repo → choose the **`frontend`** folder as root
3. Railway auto-detects the Dockerfile ✓

### Set environment variables on the frontend service:
| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://your-backend.up.railway.app` (from Step 2) |

4. Click **Deploy** — wait ~2 minutes
5. Go to **Settings** → **Networking** → **Generate Domain**
6. Your app is live at `https://your-frontend.up.railway.app` 🎉

---

## Alternative: Render (also free)

### Backend:
1. https://render.com → New → **Web Service**
2. Connect GitHub repo, set **Root Directory** to `backend`
3. Runtime: **Docker**
4. Add env vars: `SPRING_PROFILE=prod`, `JWT_SECRET=yourSecret`

### Database:
5. New → **PostgreSQL** (free 90 days)
6. Copy the **Internal Database URL** → add as `DATABASE_URL` on backend service

### Frontend:
7. New → **Static Site**
8. Root Directory: `frontend`
9. Build Command: `npm install && npm run build`
10. Publish Directory: `build`
11. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`

⚠️ Render free tier **sleeps after 15 min** of inactivity. First request takes ~30s.

---

## Local Development (unchanged)

```bash
# Backend — uses H2, no setup needed
cd backend
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # Mac/Linux

# Frontend
cd frontend
npm start
```

---

## Environment Variables Summary

### Backend
| Variable | Local default | Production |
|----------|--------------|------------|
| `SPRING_PROFILE` | `local` (H2) | `prod` (PostgreSQL) |
| `JWT_SECRET` | hardcoded fallback | set a strong secret |
| `DATABASE_URL` | not used | set by Railway/Render |
| `PORT` | `8080` | set by platform |

### Frontend
| Variable | Local | Production |
|----------|-------|------------|
| `REACT_APP_API_URL` | empty (proxy) | your backend URL |

