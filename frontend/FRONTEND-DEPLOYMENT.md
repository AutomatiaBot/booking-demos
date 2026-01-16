# Frontend Deployment Guide

This guide documents how to deploy the Automatia Demo Portal frontend.

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Method 1: GCP Cloud Run (Recommended)](#method-1-gcp-cloud-run-recommended)
3. [Method 2: Cloudflare Pages](#method-2-cloudflare-pages)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Deployment Options

| Platform | URL | Best For |
|----------|-----|----------|
| **GCP Cloud Run** | `https://automatia-demo-portal-*.run.app` | Integrated with backend, same project |
| **Cloudflare Pages** | `https://demo.automatia.bot` | Global CDN, custom domain |

---

## Method 1: GCP Cloud Run (Recommended)

Deploy directly to Cloud Run alongside your backend functions.

### Quick Deploy

```bash
cd frontend
gcloud run deploy automatia-demo-portal \
  --source=. \
  --region=us-central1 \
  --project=backend-471615
```

> **Note:** If `--allow-unauthenticated` fails due to org policy, enable public access manually in Cloud Run console.

### Enable Public Access (if needed)

1. Go to [Cloud Run Console](https://console.cloud.google.com/run?project=backend-471615)
2. Click on `automatia-demo-portal`
3. Go to **Security** tab
4. Select **Allow unauthenticated invocations**
5. Click **Save**

### Current Cloud Run URL

```
https://automatia-demo-portal-1016893210029.us-central1.run.app
```

---

## Method 2: Cloudflare Pages

### Why Cloudflare Pages?

We chose Cloudflare Pages over GCP hosting due to organization policy restrictions:

### GCP Organization Policy Restriction

The GCP project has an organization-level policy (`iam.allowedPolicyMemberDomains`) that restricts IAM bindings to only `automatia.bot` domain members. This means:

- Cannot grant `allUsers` access to Cloud Run services
- Cannot make any GCP-hosted pages publicly accessible
- Would require modifying organization-wide security policies

```
ERROR: (gcloud.run.services.add-iam-policy-binding) FAILED_PRECONDITION: 
One or more users named in the policy do not belong to a permitted customer, 
perhaps due to an organization policy.
```

### Benefits of Cloudflare Pages

- Free tier with generous limits (500 builds/month, unlimited bandwidth)
- Global CDN with edge caching
- Automatic HTTPS
- Simple public access (no IAM configuration needed)
- Easy custom domain setup
- Git-based deployments with preview URLs

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| **Cloudflare Account** | Free account at [dash.cloudflare.com](https://dash.cloudflare.com) |
| **Git Repository** | GitHub, GitLab, or Bitbucket for automatic deployments |
| **Node.js** (optional) | Only needed for Wrangler CLI method |

---

## Frontend Directory Structure

```
frontend/
├── index.html                              # Main portal page
├── _redirects                              # Cloudflare Pages URL redirects
├── js/
│   └── activity-tracker.js                 # User activity tracking
├── manhattan-smiles/
│   └── manhattan-smiles.html               # Dental demo
├── gbc/
│   └── gbc-booking.html                    # Medical tourism demo
├── dr-michael-doe/
│   └── automatia-booking.html              # Kate AI demo
├── ray-avila/
│   └── ray-avila.html                      # Custom demo
└── FRONTEND-DEPLOYMENT.md                  # This file
```

---

## Deployment Methods

Choose the method that best fits your workflow:

| Method | Best For | Automatic Deploys |
|--------|----------|-------------------|
| **Git Integration** | Production, teams | Yes (on push) |
| **Direct Upload** | Quick testing | No |
| **Wrangler CLI** | CI/CD pipelines | Scriptable |

---

## Method 1: Git Integration (Recommended)

**Why:** Automatic deployments on every push, preview URLs for branches.

### Step 1: Connect Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** > **Create application** > **Pages**
3. Click **Connect to Git**
4. Select your Git provider (GitHub/GitLab/Bitbucket)
5. Authorize Cloudflare and select the `booking-demos` repository

### Step 2: Configure Build Settings

Since this is a static site (no build step needed), use these settings:

| Setting | Value |
|---------|-------|
| **Project name** | `automatia-demo-portal` |
| **Production branch** | `main` |
| **Framework preset** | None |
| **Build command** | *(leave empty)* |
| **Build output directory** | `frontend` |
| **Root directory** | `/` |

> **Note:** The `frontend` folder contains all static files. No build step is required.

### Step 3: Deploy

1. Click **Save and Deploy**
2. Wait for deployment (usually 30-60 seconds)
3. Your site is live at: `https://automatia-demo-portal.pages.dev`

### Automatic Deployments

After initial setup:
- **Push to `main`** → Deploys to production
- **Push to other branches** → Creates preview URL (e.g., `https://feature-branch.automatia-demo-portal.pages.dev`)

---

## Method 2: Direct Upload

**Why:** Quick one-time deployments without Git setup.

### Step 1: Prepare Files

Ensure you're in the `frontend` directory:

```bash
cd frontend
```

### Step 2: Upload via Dashboard

1. Go to **Workers & Pages** > **Create application** > **Pages**
2. Click **Upload assets**
3. Enter project name: `automatia-demo-portal`
4. Drag and drop the entire `frontend` folder contents, or click to select files
5. Click **Deploy site**

---

## Method 3: Wrangler CLI

**Why:** Scriptable deployments, good for CI/CD pipelines.

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Authenticate

```bash
wrangler login
```

This opens a browser for Cloudflare authentication.

### Step 3: Deploy

```bash
cd frontend
wrangler pages deploy . --project-name=automatia-demo-portal
```

### First-time Deployment

On first run, Wrangler will prompt:

```
? No project found with the name "automatia-demo-portal". 
  Would you like to create one? (Y/n)
```

Select `Y` to create the project.

### CI/CD Integration

For automated deployments (e.g., GitHub Actions):

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy frontend --project-name=automatia-demo-portal
```

---

## Custom Domain Setup

### Step 1: Add Custom Domain

1. Go to your Pages project in Cloudflare Dashboard
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain: `demo.automatia.bot`

### Step 2: Configure DNS

If your domain is already on Cloudflare:
- Cloudflare automatically adds the required CNAME record

If your domain is elsewhere:
- Add a CNAME record pointing to `automatia-demo-portal.pages.dev`

### DNS Record

| Type | Name | Target |
|------|------|--------|
| CNAME | `demo` | `automatia-demo-portal.pages.dev` |

### Step 3: SSL/TLS

Cloudflare automatically provisions an SSL certificate. No configuration needed.

---

## Environment Configuration

### Backend API URL

The frontend calls the backend API hosted on GCP Cloud Functions:

```
https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev-{function_name}
```

**API Base URL used in frontend:**
```javascript
const API_BASE_URL = 'https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev';
```

### Activity Tracker Configuration

The activity tracker uses Cloud Functions URL pattern:
```javascript
ActivityTracker.init({
  apiBaseUrl: 'https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev',
  demoId: 'manhattan-smiles'
});
```

### CORS Configuration

The backend CORS_ORIGINS is configured in `serverless.yml` (hardcoded):
```
http://localhost:8080,https://www.automatia.bot/
```

To add more origins, update `serverless.yml` and redeploy the backend.

---

## URL Redirects

The `_redirects` file enables clean URLs:

| Short URL | Redirects To |
|-----------|--------------|
| `/manhattan-smiles` | `/manhattan-smiles/manhattan-smiles.html` |
| `/gbc` | `/gbc/gbc-booking.html` |
| `/dr-michael-doe` | `/dr-michael-doe/automatia-booking.html` |
| `/ray-avila` | `/ray-avila/ray-avila.html` |

---

## Troubleshooting

### Build Output Directory Not Found

**Error:** "Build output directory not found"

**Solution:** Ensure the build output directory is set to `frontend`, not `/frontend` or `./frontend`.

---

### 404 Errors on Direct URLs

**Cause:** Cloudflare Pages serves static files, so direct navigation to `/manhattan-smiles` may fail.

**Solution:** The `_redirects` file handles this. If issues persist, access via full paths:
- `https://demo.automatia.bot/manhattan-smiles/manhattan-smiles.html`

---

### CORS Errors

**Error:** "Access to fetch blocked by CORS policy"

**Solution:** 
1. Add your Cloudflare Pages URL to backend CORS_ORIGINS
2. Redeploy the backend

```bash
export CORS_ORIGINS="https://automatia-demo-portal.pages.dev,https://demo.automatia.bot"
cd backend && serverless deploy
```

---

### Wrangler Authentication Failed

**Error:** "Authentication failed"

**Solution:**
```bash
wrangler logout
wrangler login
```

---

## Quick Reference Commands

```bash
# Deploy via Wrangler CLI
cd frontend
wrangler pages deploy . --project-name=automatia-demo-portal

# View deployment logs
wrangler pages deployment list --project-name=automatia-demo-portal

# Delete a deployment
wrangler pages deployment delete <deployment-id> --project-name=automatia-demo-portal
```

---

## Project URLs

After deployment, your frontend is available at:

| URL | Platform | Description |
|-----|----------|-------------|
| `https://automatia-demo-portal-1016893210029.us-central1.run.app` | Cloud Run | GCP hosted |
| `https://automatia-demo-portal.pages.dev` | Cloudflare | Default Cloudflare Pages URL |
| `https://demo.automatia.bot` | Cloudflare | Custom domain |

### Demo Pages

| Demo | Clean URL | Full Path |
|------|-----------|-----------|
| Portal Home | `/` | `/index.html` |
| Manhattan Smiles | `/manhattan-smiles` | `/manhattan-smiles/manhattan-smiles.html` |
| Global Beauty Circle | `/gbc` | `/gbc/gbc-booking.html` |
| Kate AI Demo | `/dr-michael-doe` | `/dr-michael-doe/automatia-booking.html` |
| Ray Avila Demo | `/ray-avila` | `/ray-avila/ray-avila.html` |

---

## Comparison: Cloud Run vs Cloudflare Pages

| Feature | GCP Cloud Run | Cloudflare Pages |
|---------|---------------|------------------|
| **Public Access** | Manual setup (Security tab) | Works out of the box |
| **Setup Complexity** | `gcloud run deploy --source=.` | Upload files or Git integration |
| **Cost** | Free tier available | Free tier (generous) |
| **Global CDN** | Regional (us-central1) | Global edge network |
| **Custom Domains** | Cloud Run domains | Simple CNAME |
| **Preview Deployments** | Manual | Automatic per branch |
| **Build Time** | ~1-2 minutes | ~30 seconds |
| **Same Project as Backend** | Yes | No (separate platform) |

### Recommendation

- Use **Cloud Run** if you want everything in one GCP project
- Use **Cloudflare Pages** for best performance with global CDN and custom domains
