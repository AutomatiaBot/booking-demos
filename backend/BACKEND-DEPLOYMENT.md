# Backend Deployment Guide - GCP Serverless

This guide documents all the steps required to deploy the Automatia Booking API backend to Google Cloud Platform using the Serverless Framework.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [GCP Project Configuration](#gcp-project-configuration)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)
7. [Deployed Endpoints](#deployed-endpoints)

---

## Prerequisites

Before deploying, ensure you have the following installed:

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Node.js** (v18+) | Required for Serverless Framework | [nodejs.org](https://nodejs.org) |
| **Python** (3.9+ or 3.12) | Runtime for Cloud Functions | [python.org](https://python.org) |
| **gcloud CLI** | GCP command-line interface | [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install) |
| **GCP Account** | Cloud hosting platform | [console.cloud.google.com](https://console.cloud.google.com) |

### Verify installations:

```bash
node --version    # Should be v18 or higher
python --version  # Should be 3.9 or higher (3.12 recommended for deploy.sh)
gcloud --version  # Should show gcloud CLI version
```

## Deployment Options

| Method | Runtime | Pros | Cons |
|--------|---------|------|------|
| **Serverless Framework** | Python 3.9 | Simple `serverless deploy` | Plugin doesn't support Python 3.10+ |
| **deploy.sh script** | Python 3.12 | Latest runtime, Gen2 functions | Requires `gcloud` CLI |

---

## Initial Setup

### 1. Authenticate with GCP

**Why:** The Serverless Framework and local scripts need credentials to interact with GCP services.

```bash
# Login to your Google account
gcloud auth login

# Set up Application Default Credentials (ADC) for local development
gcloud auth application-default login
```

### 2. Install Python Dependencies

**Why:** Required libraries for the Cloud Functions runtime and local scripts (password hashing, JWT, Firestore, etc.).

```bash
cd backend
pip install -r requirements.txt
```

> **Note:** If you encounter bcrypt compatibility issues with passlib, downgrade bcrypt:
> ```bash
> pip install bcrypt==4.0.1
> ```
> This is necessary because newer bcrypt versions (5.x) have breaking changes that affect passlib.

### 3. Install Node.js Dependencies

**Why:** The Serverless Framework and its GCP plugin are Node.js-based.

```bash
cd backend
npm install
```

This installs:
- `serverless` - The deployment framework
- `serverless-google-cloudfunctions` - GCP Cloud Functions plugin

---

## GCP Project Configuration

### 1. Create or Select a GCP Project

**Why:** All GCP resources (Cloud Functions, Firestore, Secret Manager) must belong to a project.

```bash
# List existing projects
gcloud projects list

# Set your active project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required GCP APIs

**Why:** Each GCP service requires its API to be enabled before use. The deployment will fail if these aren't enabled.

You can enable APIs via the console or CLI. Here are the required APIs:

| API | Purpose | Enable Command |
|-----|---------|----------------|
| **Cloud Deployment Manager V2** | Manages serverless deployments | [Enable Link](https://console.developers.google.com/apis/api/deploymentmanager.googleapis.com/overview) |
| **Cloud Functions** | Hosts the serverless functions | [Enable Link](https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview) |
| **Cloud Firestore** | Database for users and activity | [Enable Link](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview) |
| **Secret Manager** | Stores sensitive configuration | [Enable Link](https://console.developers.google.com/apis/api/secretmanager.googleapis.com/overview) |
| **Cloud Build** | Builds function containers | [Enable Link](https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview) |

Or enable via CLI:

```bash
gcloud services enable deploymentmanager.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Configure IAM Permissions

**Why:** The Compute Engine default service account needs specific permissions to deploy functions and access Cloud Storage buckets where deployment artifacts are stored.

```bash
# Grant Storage Object Viewer permission (required for deployment)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

> **How to find your project number:**
> ```bash
> gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"
> ```

---

## Environment Variables

### Configuration

The project ID and other non-sensitive config are now **hardcoded** in `serverless.yml` and `deploy.sh`:

| Setting | Value | Location |
|---------|-------|----------|
| `GCP_PROJECT_ID` | `backend-471615` | Hardcoded in serverless.yml |
| `CORS_ORIGINS` | `http://localhost:8080,https://www.automatia.bot/` | Hardcoded in serverless.yml |
| `JWT_SECRET` | *(secret)* | GCP Secret Manager (runtime) |

**No environment variables are required for deployment!** Secrets are read from GCP Secret Manager at runtime.

### For Local Development

If testing locally without Secret Manager:

```bash
export USE_ENV_SECRETS=true
export GCP_PROJECT_ID=backend-471615
export JWT_SECRET=your-local-test-secret
```

### Creating Secrets in GCP Secret Manager (Production)

**Why:** In production, secrets should not be in environment variables. Secret Manager provides secure, auditable secret storage.

```bash
# Create JWT_SECRET
gcloud secrets create JWT_SECRET --replication-policy="automatic"
echo -n "your-jwt-secret-value" | gcloud secrets versions add JWT_SECRET --data-file=-

# Grant access to the function's service account
gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Deployment

### 1. Seed Initial Users (Optional)

**Why:** Creates default admin and demo users in Firestore for testing.

```bash
cd backend
export GCP_PROJECT_ID=backend-471615
export USE_ENV_SECRETS=true
python scripts/seed_users.py
```

> **Important:** Change the default passwords immediately after seeding!

### 2. Deploy to GCP

#### Option A: Using Serverless Framework (Python 3.9)

```bash
cd backend
serverless deploy
```

#### Option B: Using deploy.sh Script (Python 3.12 - Recommended)

```bash
cd backend
./deploy.sh
```

**deploy.sh commands:**
```bash
./deploy.sh                    # Deploy all functions
./deploy.sh --stage prod       # Deploy to production stage
./deploy.sh --function login   # Deploy single function
./deploy.sh --list             # List deployed functions
./deploy.sh --delete           # Delete all functions
```

Expected output on success:

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Automatia Demo - Cloud Functions Deployment                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Project:  backend-471615                                                 ║
║  Region:   us-central1                                                    ║
║  Runtime:  python312                                                      ║
║  Stage:    dev                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

Deploying 15 functions...
✓ Deployed: automatia-demo-dev-login
✓ Deployed: automatia-demo-dev-validate
...

Function URLs:
  https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev-login
  https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev-validate
  ...
```

### 3. Verify Deployment

Test the health of deployed functions:

```bash
# Test login endpoint
curl -X POST https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev-login \
  -H "Content-Type: application/json" \
  -d '{"user_id": "admin-automatia", "password": "your-password"}'
```

---

## Troubleshooting

### Error: "Cloud Deployment Manager V2 API has not been used"

**Cause:** The Deployment Manager API is not enabled.

**Solution:**
1. Go to [Deployment Manager API](https://console.developers.google.com/apis/api/deploymentmanager.googleapis.com/overview?project=YOUR_PROJECT_ID)
2. Click "Enable"
3. Wait 1-2 minutes, then retry `serverless deploy`

---

### Error: "Access to bucket gcf-sources-... denied"

**Cause:** The service account lacks permission to read from the Cloud Functions source bucket.

**Solution:**
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

---

### Error: "Cloud Firestore API has not been used in project"

**Cause:** Firestore API is not enabled.

**Solution:**
1. Go to [Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=YOUR_PROJECT_ID)
2. Click "Enable"
3. Also create a Firestore database if not exists (Firebase Console > Firestore)

---

### Error: bcrypt / passlib ValueError

**Cause:** Incompatibility between bcrypt 5.x and passlib 1.7.x.

**Solution:**
```bash
pip install bcrypt==4.0.1
```

---

### Error: "handler property is invalid"

**Cause:** The `serverless.yml` configuration has invalid handler format for GCP.

**Solution:** Ensure handlers in `serverless.yml` are plain function names without paths:
```yaml
# Correct
handler: login

# Incorrect
handler: main.login
```

---

## Deployed Endpoints

After successful deployment, these endpoints are available:

### Authentication
| Endpoint | Function | Method |
|----------|----------|--------|
| `/auth/login` | `login` | POST |
| `/auth/validate` | `validate_session` | POST |
| `/auth/logout` | `logout` | POST |

### User Management
| Endpoint | Function | Method |
|----------|----------|--------|
| `/users/access` | `get_user_access` | GET |
| `/users/check-access` | `check_demo_access` | POST |

### Admin (Protected)
| Endpoint | Function | Method |
|----------|----------|--------|
| `/admin/users` | `create_user` | POST |
| `/admin/users` | `list_users` | GET |
| `/admin/users` | `update_user` | PUT |
| `/admin/users` | `delete_user` | DELETE |
| `/admin/users/reactivate` | `reactivate_user` | POST |

### Activity Tracking
| Endpoint | Function | Method |
|----------|----------|--------|
| `/activity/track` | `track_activity` | POST |
| `/activity/track-batch` | `track_activity_batch` | POST |
| `/activity/me` | `get_my_activity` | GET |
| `/admin/activity/summary` | `get_activity_summary` | GET |
| `/admin/activity/events` | `get_activity_events` | GET |

---

## Quick Reference Commands

```bash
# Deploy all functions
serverless deploy

# View deployment info
serverless info

# View function logs
serverless logs -f login

# Remove deployment
serverless remove

# Deploy a single function
serverless deploy function -f login
```

---

## Project Info

- **Service Name:** `automatia-demo`
- **Project ID:** `backend-471615`
- **Region:** `us-central1`
- **Runtime:** Python 3.9 (Serverless) or Python 3.12 (deploy.sh)
- **Framework:** Serverless Framework v3 or gcloud CLI
- **Function Naming:** `automatia-demo-{stage}-{function_name}`

### GCP Console Links

| Resource | URL |
|----------|-----|
| **Cloud Functions** | [console.cloud.google.com/functions](https://console.cloud.google.com/functions?project=backend-471615) |
| **Cloud Run** | [console.cloud.google.com/run](https://console.cloud.google.com/run?project=backend-471615) |
| **Firestore** | [console.cloud.google.com/firestore](https://console.cloud.google.com/firestore?project=backend-471615) |
| **Logs** | [console.cloud.google.com/logs](https://console.cloud.google.com/logs?project=backend-471615) |
| **Secret Manager** | [console.cloud.google.com/security/secret-manager](https://console.cloud.google.com/security/secret-manager?project=backend-471615) |
