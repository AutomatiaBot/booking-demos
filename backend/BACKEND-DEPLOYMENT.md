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
| **Python** (3.9+) | Runtime for Cloud Functions | [python.org](https://python.org) |
| **gcloud CLI** | GCP command-line interface | [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install) |
| **GCP Account** | Cloud hosting platform | [console.cloud.google.com](https://console.cloud.google.com) |

### Verify installations:

```bash
node --version    # Should be v18 or higher
python --version  # Should be 3.9 or higher
gcloud --version  # Should show gcloud CLI version
```

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

### Required Environment Variables

**Why:** The deployment needs to know your project ID and JWT secret for the Cloud Functions.

Set these before deploying:

```bash
# Your GCP project ID (required)
export GCP_PROJECT_ID=your-project-id

# JWT secret for token signing (required)
# Generate a secure secret with:
# python -c "import secrets; print(secrets.token_urlsafe(64))"
export JWT_SECRET=your-super-secret-jwt-key

# Optional: CORS origins for your frontend
export CORS_ORIGINS=http://localhost:8080,https://your-domain.com
```

### For Local Development

If testing locally without Secret Manager:

```bash
export USE_ENV_SECRETS=true
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
python scripts/seed_users.py
```

> **Important:** Change the default passwords immediately after seeding!

### 2. Deploy to GCP

**Why:** Uploads and deploys all Cloud Functions to your GCP project.

```bash
cd backend
serverless deploy
```

Expected output on success:

```
Service Information
service: automatia-booking-api
project: your-project-id
stage: dev
region: us-central1

Deployed functions
login
  https://us-central1-your-project-id.cloudfunctions.net/automatia-booking-api-dev-login
validate
  https://us-central1-your-project-id.cloudfunctions.net/automatia-booking-api-dev-validate
...
```

### 3. Verify Deployment

Test the health of deployed functions:

```bash
# Test login endpoint
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/automatia-booking-api-dev-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin-automatia", "password": "your-password"}'
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

- **Service Name:** automatia-booking-api
- **Region:** us-central1
- **Runtime:** Python 3.9
- **Framework:** Serverless Framework v3
