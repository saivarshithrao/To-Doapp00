# VaultDo — VS Code / Local / Docker / Kubernetes Setup Guide

Complete, copy-paste-ready instructions to run and deploy the app on your machine.

---

## 0. Prerequisites

Install these once:

| Tool | Version | macOS | Windows | Linux |
|---|---|---|---|---|
| **Node.js** | 20 LTS | `brew install node@20` | [nodejs.org](https://nodejs.org) | `nvm install 20` |
| **Yarn** | 1.22+ | `npm i -g yarn` | `npm i -g yarn` | `npm i -g yarn` |
| **Python** | 3.11 | `brew install python@3.11` | [python.org](https://python.org) | `sudo apt install python3.11 python3.11-venv` |
| **MongoDB** | 7 | `brew install mongodb-community` | [MongoDB Installer](https://www.mongodb.com/try/download/community) | `apt install mongodb` |
| **Docker Desktop** | latest | [docker.com](https://docker.com) | [docker.com](https://docker.com) | `apt install docker.io docker-compose-plugin` |
| **kubectl** | 1.29+ | `brew install kubectl` | `choco install kubernetes-cli` | `apt install kubectl` |
| **minikube** (for local K8s) | latest | `brew install minikube` | `choco install minikube` | `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64` |
| **VS Code** | latest | [code.visualstudio.com](https://code.visualstudio.com) | same | same |

---

## 1. Recommended VS Code Extensions

Install these in VS Code (`Cmd/Ctrl + Shift + X`):

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Python** — `ms-python.python`
- **Pylance** — `ms-python.vscode-pylance`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **Docker** — `ms-azuretools.vscode-docker`
- **Kubernetes** — `ms-kubernetes-tools.vscode-kubernetes-tools`
- **DotENV** — `mikestead.dotenv`
- **Thunder Client** (API testing) — `rangav.vscode-thunder-client`

One-liner: open VS Code, press `Cmd/Ctrl + Shift + P`, run `Extensions: Install Extensions`, and search each.

---

## 2. Clone & Open in VS Code

```bash
git clone <your-repo-url> vaultdo
cd vaultdo
code .
```

Project structure:
```
vaultdo/
├── backend/            # FastAPI
│   ├── server.py
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
├── frontend/           # React
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── k8s/
│   └── all-in-one.yaml
├── docker-compose.yml
└── VSCODE_SETUP.md     # (this file)
```

---

## 3. Local development (no Docker) — RECOMMENDED FOR DEV

### 3a. Start MongoDB

```bash
# macOS
brew services start mongodb-community
# Windows (as service) — auto-starts after install
# Linux
sudo systemctl start mongod
# Or with Docker (any OS):
docker run -d --name mongo -p 27017:27017 mongo:7
```

### 3b. Backend (Terminal 1 in VS Code)

```bash
cd backend
python3.11 -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# make sure backend/.env exists (copy from repo); MONGO_URL should be:
# MONGO_URL="mongodb://localhost:27017"

uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend is now at **http://localhost:8001** with docs at **http://localhost:8001/docs**.

### 3c. Frontend (Terminal 2 in VS Code)

```bash
cd frontend
yarn install            # install all dependencies

# edit frontend/.env and set:
# REACT_APP_BACKEND_URL=http://localhost:8001

yarn start
```

Frontend is now at **http://localhost:3000**.

### 3d. Log in

Demo user is auto-seeded on backend startup:
- Email: `demo@todoapp.com`
- Password: `Demo@1234`

When MFA is enabled, the 6-digit OTP is printed to the backend terminal (DEV_MODE).

---

## 4. Run with Docker Compose — RECOMMENDED FOR "PROD-LIKE" LOCAL

This spins up MongoDB + Redis + backend + frontend in one command.

```bash
# from repo root
docker compose up --build

# in another terminal, view logs
docker compose logs -f backend

# stop
docker compose down

# stop AND wipe the MongoDB volume
docker compose down -v
```

Services:
- Frontend → http://localhost:3000
- Backend → http://localhost:8001
- MongoDB → localhost:27017
- Redis → localhost:6379

Edit `docker-compose.yml` to change env vars (`JWT_SECRET`, `AES_KEY_B64`, etc.) before shipping to production.

---

## 5. Deploy to Kubernetes (minikube for local) 

### 5a. Start minikube

```bash
minikube start --driver=docker --cpus=4 --memory=4g
kubectl get nodes     # confirm 'Ready'
```

### 5b. Build images into minikube's Docker daemon

```bash
# Point your shell to minikube's Docker
eval $(minikube docker-env)          # macOS/Linux
# Windows PowerShell:  & minikube -p minikube docker-env | Invoke-Expression

# Build (images now live inside minikube)
docker build -t vaultdo-backend:latest ./backend
docker build -t vaultdo-frontend:latest ./frontend
```

### 5c. Apply manifests

```bash
kubectl apply -f k8s/all-in-one.yaml
kubectl -n vaultdo get pods -w          # wait until all Running

# Expose the frontend LoadBalancer
minikube tunnel                          # keep this terminal open
# OR
kubectl -n vaultdo port-forward svc/frontend 3000:80
```

Open **http://localhost:3000**.

### 5d. Useful kubectl commands

```bash
kubectl -n vaultdo get pods,svc
kubectl -n vaultdo logs deploy/backend -f
kubectl -n vaultdo exec -it deploy/backend -- /bin/sh
kubectl -n vaultdo rollout restart deploy/backend
kubectl delete namespace vaultdo          # tear down
```

### 5e. Rotating secrets in the Kubernetes manifest

Before you ship, regenerate `JWT_SECRET` and `AES_KEY_B64` and update the Secret in `k8s/all-in-one.yaml`:

```bash
# Generate new JWT secret
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate new AES-256 key (32 bytes, base64)
python3 -c "import secrets, base64; print(base64.b64encode(secrets.token_bytes(32)).decode())"
```

Paste into the `backend-secrets` Secret in `k8s/all-in-one.yaml`, then:
```bash
kubectl apply -f k8s/all-in-one.yaml
kubectl -n vaultdo rollout restart deploy/backend
```

> ⚠️ If you rotate `AES_KEY_B64`, all existing encrypted todos will no longer decrypt. Rotate BEFORE you have real data, or implement a key-rotation migration.

---

## 6. Environment variables reference

### backend/.env

| Variable | Purpose | Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `todo_app_db` |
| `CORS_ORIGINS` | Allowed origins (comma-sep) | `http://localhost:3000` |
| `JWT_SECRET` | Token signing key (min 32 chars) | generated |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | `60` |
| `AES_KEY_B64` | 32-byte AES-256 key, base64 | generated |
| `DEV_MODE` | Prints OTP to logs when `true` | `true` for dev, `false` for prod |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | Email OTP delivery | optional |

### frontend/.env

| Variable | Purpose | Example |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Backend base URL (no trailing slash, no `/api`) | `http://localhost:8001` |

---

## 7. Enabling real email OTP (SMTP)

With any SMTP provider (Gmail, SendGrid, Mailgun, Resend, AWS SES…):

```env
# backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=your_app_password         # Gmail → Account → Security → App Passwords
SMTP_FROM=VaultDo <you@gmail.com>
DEV_MODE=false                          # hides OTP from logs
```

Restart backend. Toggle MFA in **You** page and re-login to receive a real email.

---

## 8. Testing

### Backend (pytest)

```bash
cd backend
source venv/bin/activate
pip install pytest httpx pytest-asyncio
pytest -v
```

### Quick curl checks

```bash
# Health
curl http://localhost:8001/api/

# Login
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@todoapp.com","password":"Demo@1234"}' | jq -r .access_token)

# Create todo
curl -X POST http://localhost:8001/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","priority":"high"}'

# List todos
curl http://localhost:8001/api/todos -H "Authorization: Bearer $TOKEN"
```

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `mongoDB connection refused` | Start MongoDB (`brew services start mongodb-community` / `systemctl start mongod` / Docker container) |
| `CORS error` in browser | Add your frontend origin to backend `CORS_ORIGINS` and restart |
| `Invalid token` on every request | Clear localStorage (`localStorage.clear()` in DevTools) and re-login |
| Frontend can't reach backend | Ensure `REACT_APP_BACKEND_URL` matches the backend URL (no trailing slash), and restart `yarn start` after changing `.env` |
| Supervisor/Emergent: backend not restarting | `sudo supervisorctl restart backend` |
| Minikube pod `ImagePullBackOff` | Forgot `eval $(minikube docker-env)` before building, or wrong image tag |
| Need a fresh DB | `docker compose down -v` or drop collection in `mongosh` |

---

## 10. Security checklist before shipping to production

- [ ] Rotate `JWT_SECRET` and `AES_KEY_B64` to cryptographically random values
- [ ] Set `DEV_MODE=false`
- [ ] Configure real SMTP (so OTP isn't in logs)
- [ ] Restrict `CORS_ORIGINS` to your production domain only
- [ ] Use HTTPS in front of the frontend and backend (Nginx/Traefik/K8s Ingress + cert-manager)
- [ ] Enable MongoDB auth (username/password) and TLS
- [ ] Add rate limiting (e.g., `slowapi`) in front of `/api/auth/login` and `/api/auth/mfa/verify`
- [ ] Store secrets in a real vault (Kubernetes SealedSecrets, AWS Secrets Manager, HashiCorp Vault) — not in `all-in-one.yaml`
- [ ] Set up automated backups for MongoDB
- [ ] Enable application logs shipping (Loki, CloudWatch, Datadog, etc.)

---

Happy shipping!
