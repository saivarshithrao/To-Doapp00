# VaultDo — Encrypted To-Do App

A modern, secure to-do application with a sleek Swiss-style dark/light UI, built for people who care about privacy and speed.

## Features

- **Sidebar-nav dashboard** with 4 pages — Dashboard · Tasks · Calendar · You
- **GitHub-style activity heatmap** + streak tracker on the dashboard
- **⌘K command palette** for quick task creation and navigation
- **Tasks**: priorities, categories, tags, due dates, search, filters
- **Calendar** view with click-a-day to view or add tasks
- **JWT authentication** (email+password) + **Google OAuth** (Emergent-managed)
- **Email-based OTP MFA** (2FA) with lockout after 5 failed attempts
- **AES-256-GCM encryption at rest** for task titles and descriptions
- **Dark / Light theme** (Swiss high-contrast)
- **Dockerized** — `docker compose up --build`
- **Kubernetes** manifests — `kubectl apply -f k8s/all-in-one.yaml`

## Stack

- **Frontend:** React 19 · Tailwind · shadcn/ui · Framer Motion · cmdk
- **Backend:** FastAPI (Python 3.11) · bcrypt · PyJWT · cryptography (AES-GCM)
- **Database:** MongoDB
- **Redis** (available in Docker/K8s manifests for future caching/rate-limit layer)

## Quick start

Full step-by-step instructions with commands for **VS Code**, **local dev**, **Docker Compose**, and **Kubernetes (minikube)** are in:

## **→ [VSCODE_SETUP.md](./VSCODE_SETUP.md) ←**

### TL;DR

```bash
# 1. Run everything with Docker
docker compose up --build
# → frontend http://localhost:3000, backend http://localhost:8001

# 2. Or run locally
cd backend && python3.11 -m venv venv && source venv/bin/activate \
  && pip install -r requirements.txt && uvicorn server:app --port 8001 --reload
cd frontend && yarn install && yarn start

# 3. Or deploy to Kubernetes
minikube start
eval $(minikube docker-env)
docker build -t vaultdo-backend:latest ./backend
docker build -t vaultdo-frontend:latest ./frontend
kubectl apply -f k8s/all-in-one.yaml
minikube tunnel
```

## Demo credentials

- Email: `demo@todoapp.com`
- Password: `Demo@1234`

## License

MIT
