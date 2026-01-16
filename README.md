# Automatia Bot - Demo Portal

A sales demo portal for Automatia Bot that allows sellers to present live client demos to prospects. Features secure server-side authentication, bilingual support (English/Spanish), and a clean interface matching the Automatia brand.

---

## Architecture

This is a **monorepo** containing:
- **Frontend**: Static HTML/CSS/JS demo pages (`frontend/`) - Deployed to **Cloudflare Pages**
- **Backend**: Python serverless API (`backend/`) - Deployed to **GCP Cloud Functions**

```
booking-demos/
├── frontend/                        # Static web pages (Cloudflare Pages)
│   ├── index.html                   # Main demo portal
│   ├── _redirects                   # Cloudflare URL redirects
│   ├── FRONTEND-DEPLOYMENT.md       # Frontend deployment guide
│   ├── js/
│   │   └── activity-tracker.js      # User activity tracking
│   ├── manhattan-smiles/
│   │   └── manhattan-smiles.html    # Dental demo
│   ├── gbc/
│   │   └── gbc-booking.html         # Medical tourism demo
│   ├── dr-michael-doe/
│   │   └── automatia-booking.html   # Kate AI demo
│   └── ray-avila/
│       └── ray-avila.html           # Custom demo
├── backend/                         # Python serverless API (GCP)
│   ├── serverless.yml               # GCP deployment config
│   ├── main.py                      # Cloud Functions handlers
│   ├── requirements.txt             # Python dependencies
│   ├── auth/                        # JWT authentication
│   ├── database/                    # Firestore operations
│   └── scripts/                     # Utility scripts
└── README.md
```

### Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://demo.automatia.bot |
| **Backend API** | https://us-central1-backend-471615.cloudfunctions.net/automatia-booking-api-dev-* |

---

## Quick Start

### Production URLs
- **Frontend**: https://demo.automatia.bot
- **Backend API**: https://us-central1-backend-471615.cloudfunctions.net/automatia-booking-api-dev-login

### Local Development
```bash
cd booking-demos/frontend
python3 -m http.server 8080
# Open http://localhost:8080
```

### Full Stack Setup
See [Backend Setup](#backend-setup) and [Frontend Deployment](#frontend-deployment) sections below.

---

## Features

### Secure Authentication
- **Server-side JWT authentication** (no credentials in client code)
- **Bcrypt password hashing** for secure credential storage
- **Firestore database** for user management
- **Audit logging** for all authentication events

### Access Control
- Role-based permissions (admin vs regular users)
- Per-user demo access configuration
- Session validation on protected routes

### Bilingual Support (EN/ES)
- Toggle language with one click
- All content translates: titles, descriptions, buttons
- Language preference saved across pages

### Dashboard Integration
Each demo page includes a "Demo Steps" section:
1. **Chat with the Bot** - Start a conversation as a test patient
2. **Check the Dashboard** - View captured data at https://dash.automatia.bot/sign-in

---

# Backend Setup

## Prerequisites

- Python 3.9+ (serverless uses python39 runtime)
- GCP Account with billing enabled
- Serverless Framework (`npm install -g serverless`)
- Google Cloud SDK (`gcloud`)

## Step 1: GCP Project Setup

```bash
# Set your GCP project (this project uses: backend-471615)
gcloud config set project backend-471615

# Sync quota project (fixes common warning)
gcloud auth application-default set-quota-project backend-471615

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create Firestore database (Native mode, us-central1 region)
gcloud firestore databases create --location=us-central1
```

## Step 2: Configure Environment

```bash
cd backend

# Copy example environment file
cp env.example .env

# Generate a secure JWT secret
python scripts/generate_secret.py

# Edit .env with your values
# - GCP_PROJECT_ID
# - JWT_SECRET (from previous command)
# - CORS_ORIGINS (your frontend domain)
```

## Step 3: Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Fix bcrypt compatibility issue (if you get passlib errors)
pip install bcrypt==4.0.1
```

## Step 4: Seed Initial Users

```bash
# Authenticate with GCP
gcloud auth application-default login

# Set environment variables (USE_ENV_SECRETS=true for local scripts)
export GCP_PROJECT_ID=backend-471615
export USE_ENV_SECRETS=true

# Run seed script
python scripts/seed_users.py
```

**⚠️ IMPORTANT**: Change the default passwords immediately after seeding!

Default seeded users (password: `ChangeMe123!`):
- `admin-automatia` - Full access to all demos
- `gbc-demos` - Access to Kate AI and GBC demos
- `ray-avila` - Access to Kate AI and Ray Avila demos

## Step 5: Deploy to GCP

```bash
# Install Serverless Google plugin
npm install -g serverless
npm install --save-dev serverless-google-cloudfunctions

# Deploy
serverless deploy

# Or deploy a single function
serverless deploy function -f login
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate and get JWT token |
| POST | `/auth/validate` | Validate JWT token |
| POST | `/auth/logout` | Logout (audit log) |

### User Access

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/access` | Get user's permitted demos |
| POST | `/users/check-access` | Check if user can access a specific demo |

### Admin (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/users` | Create new user |
| GET | `/admin/users` | List all users |
| PUT | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Deactivate user (soft delete) |
| POST | `/admin/users/{id}/reactivate` | Reactivate a deactivated user |
| GET | `/admin/activity/{id}/summary` | Get user's activity summary |
| GET | `/admin/activity/{id}/events` | Get user's activity events |

### Activity Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/activity/track` | Track a single activity event |
| POST | `/activity/track-batch` | Track multiple events at once |
| GET | `/activity/me` | Get your own activity summary |

### Example: Login Request

```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_id": "admin-automatia", "password": "your-password"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "admin-automatia",
      "name": "Admin",
      "access": ["manhattan-smiles", "gbc", "dr-michael-doe", "ray-avila"],
      "is_admin": true
    }
  }
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GCP_PROJECT_ID` | Yes | Your GCP project ID |
| `JWT_SECRET` | Yes | Secret key for JWT signing (min 32 chars) |
| `JWT_ALGORITHM` | No | JWT algorithm (default: HS256) |
| `JWT_EXPIRATION_HOURS` | No | Token expiration (default: 24) |
| `CORS_ORIGINS` | No | Allowed origins, comma-separated |

---

## Firestore Database Schema

Firestore is a NoSQL document database organized into **Collections** (like folders) containing **Documents** (JSON objects).

### Database Structure Overview

```
Firestore Database
│
├── users/                          ← Collection
│   ├── admin-automatia             ← Document (user ID as key)
│   ├── gbc-demos
│   └── ray-avila
│
└── audit_logs/                     ← Collection
    ├── ABC123xyz...                ← Document (auto-generated ID)
    └── DEF456abc...
```

### Collection: `users`

Stores user accounts and their permissions.

**Document ID**: The user's ID (e.g., `admin-automatia`, `ray-avila`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name shown in UI |
| `password_hash` | string | Yes | Bcrypt hashed password |
| `access` | array | Yes | List of demo IDs user can access |
| `is_admin` | boolean | Yes | Can manage other users |
| `quick_access` | boolean | No | Show quick access section (default: true) |
| `is_active` | boolean | No | Account enabled (default: true) |
| `created_at` | timestamp | Auto | When account was created |
| `updated_at` | timestamp | Auto | Last modification time |
| `last_login` | timestamp | Auto | Last successful login |
| `deactivated_at` | timestamp | Auto | When account was deactivated |
| `reactivated_at` | timestamp | Auto | When account was reactivated |

**Example Document** (`users/admin-automatia`):
```json
{
  "name": "Admin",
  "password_hash": "$2b$12$LQv3c1yqBwe...",
  "access": ["manhattan-smiles", "gbc", "dr-michael-doe", "ray-avila"],
  "is_admin": true,
  "quick_access": true,
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "last_login": "2024-01-15T14:30:00Z"
}
```

### Collection: `audit_logs`

Tracks all authentication events for security and debugging.

**Document ID**: Auto-generated by Firestore

| Field | Type | Description |
|-------|------|-------------|
| `action` | string | Event type (see table below) |
| `user_id` | string | User who triggered the action |
| `details` | object | Additional context |
| `ip_address` | string | Client IP address |
| `timestamp` | timestamp | When event occurred |

**Action Types**:

| Action | Description |
|--------|-------------|
| `login_success` | User logged in successfully |
| `login_failed` | Failed login attempt |
| `logout` | User logged out |
| `user_created` | Admin created a new user |
| `user_updated` | Admin modified a user |
| `user_deleted` | Admin deleted a user |

**Example Document**:
```json
{
  "action": "login_failed",
  "user_id": "unknown-user",
  "details": { "reason": "user_not_found" },
  "ip_address": "73.42.155.23",
  "timestamp": "2024-01-15T14:31:00Z"
}
```

### Collection: `user_activity` (Per-User Activity Tracking)

Each user has their own activity document with an `events` subcollection for detailed tracking.

**Structure:**
```
user_activity/
└── {user_id}/                      ← Document (user metadata)
    ├── user_id: "admin-automatia"
    ├── name: "Admin"
    ├── total_events: 1542
    ├── total_sessions: 47
    ├── total_time_seconds: 28800
    ├── demos_visited: ["manhattan-smiles", "gbc"]
    ├── last_activity: timestamp
    └── events/                     ← Subcollection (all events)
        ├── {event_id_1}
        ├── {event_id_2}
        └── ...
```

**Event Document Schema:**
```json
{
  "event_type": "chat_message_sent",
  "timestamp": "2024-01-15T14:30:00Z",
  "session_id": "abc123-uuid",
  "page_url": "https://demos.automatia.bot/manhattan-smiles/",
  "demo_id": "manhattan-smiles",
  "data": {
    "message_text": "I'd like to book an appointment"
  },
  "ip_address": "73.42.155.23",
  "user_agent": "Mozilla/5.0..."
}
```

**Supported Event Types:**

| Event Type | Description | Data Fields |
|------------|-------------|-------------|
| `session_start` | User started a new session | `{}` |
| `session_end` | User ended session | `{duration_seconds}` |
| `page_view` | User viewed a page | `{page_title}` |
| `page_exit` | User left a page | `{duration_seconds}` |
| `button_click` | User clicked a button | `{button_id, button_text}` |
| `link_click` | User clicked a link | `{link_url, link_text}` |
| `chat_opened` | User opened chat widget | `{}` |
| `chat_closed` | User closed chat widget | `{duration_seconds}` |
| `chat_message_sent` | User sent a message | `{message_text}` |
| `chat_message_received` | Bot responded | `{message_text}` |
| `scroll_depth` | User scrolled | `{depth_percent}` |
| `demo_launched` | User launched a demo | `{demo_id}` |
| `form_interaction` | User interacted with form | `{form_id, field_name}` |
| `error` | An error occurred | `{error_message}` |
| `custom` | Custom event | `{custom_type, ...}` |

### How Functions Interact with Database

```
LOGIN FLOW (/auth/login)
─────────────────────────
User: { "user_id": "admin-automatia", "password": "secret" }
                    ↓
Function queries: Firestore → users/admin-automatia
                    ↓
Verify password against password_hash (bcrypt)
                    ↓
✅ Success: Create JWT, log "login_success", update last_login
❌ Failure: Log "login_failed", return 401 error


ACTIVITY TRACKING FLOW (/activity/track)
────────────────────────────────────────
Frontend sends: { "event_type": "chat_message_sent", "data": {...} }
                    ↓
Backend validates JWT token
                    ↓
Writes to: user_activity/{user_id}/events/{new_event_id}
                    ↓
Updates: user_activity/{user_id} (totals, last_activity)


USER DEACTIVATION FLOW (Soft Delete)
────────────────────────────────────
DELETE /admin/users/{user_id}
                    ↓
Sets is_active = false (user cannot login)
                    ↓
ALL DATA PRESERVED: user info, activity logs, events
                    ↓
Can be reactivated with POST /admin/users/{user_id}/reactivate
```

## Frontend Activity Tracking

Include the activity tracker script on any demo page to automatically track:
- Page views and time on page
- Button and link clicks
- Scroll depth
- Chat widget interactions
- Session duration

### Quick Setup

```html
<!-- Add to any demo page -->
<script 
  src="/js/activity-tracker.js" 
  data-api-url="https://your-api-url"
  data-demo-id="manhattan-smiles"
></script>
```

### Manual Initialization

```javascript
// After user logs in
ActivityTracker.init({
  apiUrl: 'https://us-central1-backend-471615.cloudfunctions.net',
  demoId: 'manhattan-smiles',
  debug: true  // Enable console logging
});

// Set auth token (from login response)
ActivityTracker.setToken(loginResponse.data.token);
```

### Tracking Custom Events

```javascript
// Track custom events
ActivityTracker.trackCustomEvent('video_played', { 
  video_id: 'intro-video',
  duration: 120 
});

// Track errors
ActivityTracker.trackError('Failed to load chat widget', error.stack);

// Track chat messages manually (if auto-detection doesn't work)
ActivityTracker.trackChatMessageSent('Hello, I need help');
ActivityTracker.trackChatMessageReceived('Hi! How can I assist you today?');

// Track demo launches
ActivityTracker.trackDemoLaunched('manhattan-smiles');
```

### Auto-Tracked Events

The tracker automatically captures:

| Event | Trigger |
|-------|---------|
| `session_start` | Page load |
| `session_end` | Page unload/close |
| `page_view` | Page load, tab visibility |
| `page_exit` | Page unload, tab hidden |
| `button_click` | Click on buttons |
| `link_click` | Click on links |
| `scroll_depth` | Scroll to 25%, 50%, 75%, 90%, 100% |
| `chat_opened` | Chatwoot widget opened |
| `chat_closed` | Chatwoot widget closed |
| `chat_message_sent` | User sends message (auto-detected) |
| `chat_message_received` | Bot responds (auto-detected) |

---

# AWS Developers Guide

This section is for developers familiar with AWS who need to understand, maintain, or migrate this GCP-based backend.

## Current Deployment

| Setting | Value |
|---------|-------|
| **GCP Project ID** | `backend-471615` |
| **Region** | `us-central1` |
| **Runtime** | Python 3.9 (serverless plugin limitation) |
| **Database** | Firestore (Native mode) |
| **Deployment Tool** | Serverless Framework |

## GCP to AWS Service Mapping

| This Project (GCP) | AWS Equivalent | Notes |
|--------------------|----------------|-------|
| **Cloud Functions** | AWS Lambda | Serverless compute |
| **Firestore** | DynamoDB | NoSQL document database |
| **Cloud Build** | CodeBuild | CI/CD build service |
| **Secret Manager** | Secrets Manager | Secure credential storage |
| **Cloud Storage** | S3 | Object storage (for deployments) |
| **IAM** | IAM | Identity and access management |
| **Cloud Logging** | CloudWatch Logs | Centralized logging |

## Key Differences from AWS

### 1. Database (Firestore vs DynamoDB)

| Firestore | DynamoDB |
|-----------|----------|
| Collections → Documents | Tables → Items |
| Document ID as primary key | Partition Key + Sort Key |
| Auto-indexing on all fields | Must define GSIs manually |
| Real-time listeners built-in | Requires DynamoDB Streams + Lambda |

**Firestore query example** (current code):
```python
doc_ref = db.collection("users").document(user_id)
doc = doc_ref.get()
```

**DynamoDB equivalent**:
```python
table = dynamodb.Table("users")
response = table.get_item(Key={"user_id": user_id})
```

### 2. Functions (Cloud Functions vs Lambda)

| Cloud Functions | Lambda |
|-----------------|--------|
| `functions-framework` | Built-in Lambda runtime |
| `request` object (Flask-like) | `event` and `context` |
| Direct HTTP trigger | API Gateway + Lambda |
| Auto-scaling included | Configure provisioned concurrency |

**Cloud Functions handler** (current code):
```python
@functions_framework.http
def login(request):
    body = request.get_json()
    # ...
```

**Lambda equivalent**:
```python
def login(event, context):
    body = json.loads(event["body"])
    # ...
```

### 3. Environment Variables

| GCP | AWS |
|-----|-----|
| Set in `serverless.yml` or GCP Console | Lambda environment or Parameter Store |
| Secret Manager for sensitive values | Secrets Manager or SSM Parameter Store |

## Deploying to AWS (Migration Guide)

If you need to deploy this to AWS instead of GCP:

### Step 1: Update serverless.yml

```yaml
# Change provider from google to aws
provider:
  name: aws
  runtime: python3.10
  region: us-east-1
  environment:
    JWT_SECRET: ${env:JWT_SECRET}
    USERS_TABLE: ${self:service}-users
    AUDIT_TABLE: ${self:service}-audit-logs

# Add DynamoDB tables
resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-users
        AttributeDefinitions:
          - AttributeName: user_id
            AttributeType: S
        KeySchema:
          - AttributeName: user_id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
    
    AuditLogsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-audit-logs
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
```

### Step 2: Replace Firestore with DynamoDB

Create `database/dynamodb.py`:
```python
import boto3
from datetime import datetime
import uuid

dynamodb = boto3.resource("dynamodb")

class DynamoDB:
    def __init__(self):
        self.users_table = dynamodb.Table(os.environ["USERS_TABLE"])
        self.audit_table = dynamodb.Table(os.environ["AUDIT_TABLE"])
    
    def get_user_by_id(self, user_id: str):
        response = self.users_table.get_item(Key={"user_id": user_id})
        return response.get("Item")
    
    def create_user(self, user_id: str, **kwargs):
        item = {"user_id": user_id, **kwargs}
        self.users_table.put_item(Item=item)
        return item
    
    def log_action(self, action: str, user_id: str, **kwargs):
        self.audit_table.put_item(Item={
            "id": str(uuid.uuid4()),
            "action": action,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            **kwargs
        })
```

### Step 3: Update Function Handlers

Change from Flask-style to Lambda-style:
```python
import json

def login(event, context):
    # Parse body
    body = json.loads(event.get("body", "{}"))
    
    # Your logic here...
    
    # Return response
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"success": True, "data": {...}})
    }
```

### Step 4: Deploy to AWS

```bash
# Install AWS plugin (remove Google plugin)
npm uninstall serverless-google-cloudfunctions
npm install --save-dev serverless-python-requirements

# Configure AWS credentials
aws configure

# Deploy
serverless deploy
```

## Monitoring & Debugging

### GCP (Current)

```bash
# View function logs
gcloud functions logs read login --region=us-central1

# View all logs in console
# https://console.cloud.google.com/logs
```

### AWS (Equivalent)

```bash
# View Lambda logs
aws logs tail /aws/lambda/automatia-booking-api-login --follow

# Or use serverless CLI
serverless logs -f login -t
```

---

# Frontend Deployment

The frontend is deployed to **Cloudflare Pages** (not GCP) due to organization policy restrictions that prevent public access to GCP-hosted resources.

See [`frontend/FRONTEND-DEPLOYMENT.md`](frontend/FRONTEND-DEPLOYMENT.md) for detailed deployment instructions.

## Quick Deploy

```bash
# Via Git integration (recommended)
# Connect repo to Cloudflare Pages with:
#   - Build output directory: frontend
#   - Build command: (empty)

# Or via Wrangler CLI
cd frontend
wrangler pages deploy . --project-name=automatia-demo-portal
```

## File Structure

```
frontend/
├── index.html                    # Main demo portal
├── _redirects                    # Clean URL redirects
├── FRONTEND-DEPLOYMENT.md        # Deployment documentation
├── js/
│   └── activity-tracker.js       # User activity tracking
├── manhattan-smiles/
│   └── manhattan-smiles.html     # Dental demo
├── gbc/
│   └── gbc-booking.html          # Medical tourism demo
├── dr-michael-doe/
│   └── automatia-booking.html    # Kate AI general demo
└── ray-avila/
    └── ray-avila.html            # Ray Avila custom demo
```

---

# Developer Guide

## Current User IDs

| User ID | SHA-256 Hash | Access | Name Displayed |
|---------|--------------|--------|----------------|
| `admin-automatia` | `834f98eef8e411c3c8639447617f06be08b05b163feb190aefeec9e63722e8c6` | All demos | Admin |
| `gbc-demos` | `1303a7ac100381762de7765e8b28dd0535387f59803fe9392a335d33d365e591` | Kate AI, GBC | GBC Team |
| `ray-avila` | `1f9dcbc177af9f94768b94f5c021b39442eafc858e79c2e2068b90418654f94b` | Kate AI, Ray Avila | Ray Avila |

### ID Format Rules
- All **lowercase**
- Words separated by **hyphens** (`-`)
- No spaces or special characters
- Examples: `john-smith`, `sales-team-nyc`, `client-name`

---

## Adding a New User

### Step 1: Choose the User ID

Pick an ID following the format rules:
```
new-seller-name
```

### Step 2: Generate the SHA-256 Hash

**On Mac/Linux terminal:**
```bash
echo -n "new-seller-name" | shasum -a 256
```

**Output example:**
```
a1b2c3d4e5f6...  -
```

Copy the hash (everything before the spaces and dash).

### Step 3: Add to ACCESS_CONFIG

Open `index.html` and find the `ACCESS_CONFIG` object (around line 929). Add your new user:

```javascript
const ACCESS_CONFIG = {
  // Existing users...
  
  // New user - paste your hash as the key
  'a1b2c3d4e5f6...your-full-hash-here...': {
    name: 'Display Name',           // Shown in header after login
    access: ['dr-michael-doe', 'manhattan-smiles'],  // Demo IDs they can access
    quickAccess: true               // Show Quick Access section (voice demos, etc.)
  }
};
```

### Step 4: Test the Login

1. Open `http://localhost:8080` (or your server)
2. Enter the new user ID (e.g., `new-seller-name`)
3. Verify they only see their permitted demos

---

## Adding a New Demo Page

### Step 1: Create the Folder and File

```bash
mkdir new-client
touch new-client/new-client.html
```

### Step 2: Copy a Template

Copy an existing demo page as a starting point:
```bash
cp ray-avila/ray-avila.html new-client/new-client.html
```

### Step 3: Customize the Demo Page

Edit `new-client/new-client.html`:
- Update branding (colors, logo, name)
- Change Chatwoot widget token (get from inbox.automatia.bot)
- Update translations for EN/ES
- Modify content to match the client

### Step 4: Add Demo Card to Portal

Open `index.html` and find the `<div class="demo-grid">` section. Add a new card:

```html
<a href="new-client/new-client.html" class="demo-card" data-demo-id="new-client" data-keywords="keyword1 keyword2 industry">
  <div class="card-header">
    <div class="card-icon">🏢</div>
    <span class="card-industry" data-i18n="industry_type">Industry</span>
  </div>
  <h3 data-i18n="demo_newclient_title">New Client Name</h3>
  <p data-i18n="demo_newclient_desc">Description of the demo and what it showcases.</p>
  <div class="card-features">
    <span class="feature-tag" data-i18n="tag_chatbot">Chatbot</span>
    <span class="feature-tag" data-i18n="tag_booking">Appointment Booking</span>
  </div>
  <div class="card-action">
    <span data-i18n="launch_demo">Launch Demo</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </div>
</a>
```

**Important attributes:**
- `data-demo-id` - Unique ID used for access control (must match ACCESS_CONFIG)
- `data-keywords` - Search terms (name, industry, features)
- `data-i18n` - Translation key for bilingual support

### Step 5: Add Translations

Find the `translations` object in `index.html` and add entries for both languages:

```javascript
const translations = {
  en: {
    // ... existing translations ...
    demo_newclient_title: 'New Client Name',
    demo_newclient_desc: 'Description of what this demo showcases.',
  },
  es: {
    // ... existing translations ...
    demo_newclient_title: 'Nombre del Cliente',
    demo_newclient_desc: 'Descripción de lo que muestra este demo.',
  }
};
```

### Step 6: Grant Access to Users

Update `ACCESS_CONFIG` to include the new demo ID:

```javascript
const ACCESS_CONFIG = {
  '834f98eef8e411c3c8639447617f06be08b05b163feb190aefeec9e63722e8c6': {
    name: 'Admin',
    access: ['manhattan-smiles', 'gbc', 'dr-michael-doe', 'ray-avila', 'new-client'], // Added!
    quickAccess: true
  },
  // Add to other users who need access...
};
```

---

## Demo Page Checklist

When creating a new demo page, ensure it has:

- [ ] **Header** with logo and language toggle
- [ ] **Back to Portal** link (`../index.html`)
- [ ] **Chat widget** with correct Chatwoot token
- [ ] **Dashboard section** with link to `https://dash.automatia.bot/sign-in`
- [ ] **Translations** object for EN/ES
- [ ] **Language toggle** function
- [ ] **Responsive design** for mobile

---

## Modifying Access Permissions

### Give a User Access to More Demos

Find their entry in `ACCESS_CONFIG` and add demo IDs to the `access` array:

```javascript
'1f9dcbc177af9f94768b94f5c021b39442eafc858e79c2e2068b90418654f94b': {
  name: 'Ray Avila',
  access: ['dr-michael-doe', 'ray-avila', 'new-client'],  // Added new-client
  quickAccess: true
}
```

### Remove Access

Simply remove the demo ID from the `access` array.

### Delete a User

Remove their entire entry from `ACCESS_CONFIG`.

---

## Technical Reference

### Local Storage Keys

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `automatia_user` | Hashed user ID for session | `834f98eef8e4...` |
| `automatia_lang` | Language preference | `en` or `es` |

### Demo Card Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-demo-id` | Access control identifier | `manhattan-smiles` |
| `data-keywords` | Search terms | `dental nyc booking` |
| `data-i18n` | Translation key | `demo_ms_title` |

### CSS Variables (index.html)

```css
--automatia-blue: #4A5DFF;     /* Primary accent */
--automatia-navy: #1E2E6D;     /* Dark blue for buttons */
--bg-main: #F6F7F4;            /* Background */
--text: #1a1a2e;               /* Main text */
--text-muted: #6B7280;         /* Secondary text */
```

---

## Running Locally

### Option 1: Simple HTTP Server (Python)
```bash
cd booking-demos
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Direct File
Open `index.html` directly in browser (some features may not work due to CORS).

---

## Troubleshooting

### "Invalid ID" error when logging in
- Check the ID is **lowercase** with **hyphens**
- Verify the hash in `ACCESS_CONFIG` matches exactly
- Try regenerating the hash

### Demo card not showing
- Check `data-demo-id` matches an entry in the user's `access` array
- Verify the user has access to that demo
- Check browser console for JavaScript errors

### Translations not working
- Ensure the `data-i18n` attribute matches a key in `translations`
- Check both `en` and `es` sections have the key
- Call `updateLanguage()` after adding dynamic content

### Dashboard section not appearing
- Clear browser cache or add `?t=123` to URL
- Verify the HTML structure matches other demo pages
- Check CSS for `.dashboard-section` class

---

## Production Deployment Checklist

Before deploying to production:

- [x] **Backend deployed** to GCP Cloud Functions (`backend-471615`)
- [x] **Firestore** database created and populated
- [x] **JWT_SECRET** configured in environment variables
- [ ] **CORS_ORIGINS** updated to include `https://demo.automatia.bot`
- [ ] **Default passwords changed** for all seeded users
- [x] **Frontend deployed** to Cloudflare Pages
- [x] **Custom domain** configured (`demo.automatia.bot`)
- [ ] **Audit logs** verified working

---

## Future Enhancements

- [ ] **Admin Panel**: Web UI for managing users and permissions
- [ ] **Dynamic Demo Loading**: Load demo cards from API
- [ ] **Analytics Dashboard**: Track demo views and user activity
- [ ] **Rate Limiting**: Protect against brute force attacks
- [ ] **Two-Factor Authentication**: Optional 2FA for admin users

---

## Support

For questions or issues, contact the Automatia team:
- Website: [automatia.bot](https://www.automatia.bot/)
- Dashboard: [dash.automatia.bot](https://dash.automatia.bot/)
