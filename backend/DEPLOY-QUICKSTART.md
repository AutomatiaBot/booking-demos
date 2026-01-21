# Deployment Quick Start

## First Time Setup (New Environment)

```bash
cd backend
./full-setup.sh --stage prod --frontend-url "https://your-frontend-url.com"
```

That's it. The script handles everything automatically.

---

## Just Redeploy Functions (After Initial Setup)

```bash
cd backend
./deploy.sh --stage prod
```

---

## Deploy Single Function Only

```bash
cd backend
./deploy.sh --stage prod --function login
```

---

## Deploy Frontend

```bash
cd frontend
gcloud run deploy automatia-demo-portal --source=. --region=us-central1 --project=backend-471615
```

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| CORS errors | Update `CORS_ORIGINS` secret with your frontend URL |
| 500 errors | Check function logs: `gcloud functions logs read FUNCTION_NAME --region=us-central1 --project=backend-471615 --limit=10` |
| Permission denied | Run `./full-setup.sh --skip-deploy` to re-grant permissions |

---

## What Each Script Does

### `full-setup.sh`
- Enables all GCP APIs
- Creates all secrets
- Grants all permissions
- Deploys all functions
- **Use for:** First-time setup or fixing broken deployments

### `deploy.sh`
- Deploys functions only
- **Use for:** Code updates after initial setup is done
