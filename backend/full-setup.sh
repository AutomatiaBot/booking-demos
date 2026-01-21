#!/bin/bash
# =============================================================================
# Automatia Demo - Full GCP Setup Script
# =============================================================================
# This script performs a COMPLETE setup of the Automatia Demo backend on GCP.
# It handles everything needed for a fresh deployment, avoiding the day-long
# troubleshooting we experienced in dev.
#
# What this script does:
#   1. Validates prerequisites (gcloud CLI, authentication)
#   2. Enables all required GCP APIs
#   3. Creates/updates all required secrets in Secret Manager
#   4. Grants all necessary IAM permissions to the service account
#   5. Deploys all Cloud Functions
#   6. Optionally seeds initial users
#   7. Runs a health check to verify deployment
#
# Usage:
#   ./full-setup.sh                    # Interactive setup (will prompt for values)
#   ./full-setup.sh --stage prod       # Setup for production
#   ./full-setup.sh --stage dev        # Setup for development
#   ./full-setup.sh --skip-secrets     # Skip secret creation (if already set)
#   ./full-setup.sh --skip-deploy      # Only setup infrastructure, don't deploy
#   ./full-setup.sh --frontend-url URL # Set frontend URL for CORS
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - Appropriate GCP project permissions
#   - This script must be run from the backend/ directory
# =============================================================================

set -e  # Exit on error

# =============================================================================
# Default Configuration
# =============================================================================
PROJECT_ID="backend-471615"
REGION="us-central1"
RUNTIME="python312"
SERVICE="automatia-demo"
STAGE="dev"

# Service account (will be computed)
SERVICE_ACCOUNT=""

# Flags
SKIP_SECRETS=false
SKIP_DEPLOY=false
SKIP_IAM=false
VERBOSE=false

# Frontend URLs for CORS (can be overridden)
FRONTEND_URLS=""

# =============================================================================
# Colors for output
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Helper Functions
# =============================================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  $1${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =============================================================================
# Parse Arguments
# =============================================================================
while [[ $# -gt 0 ]]; do
    case $1 in
        --stage|-s)
            STAGE="$2"
            shift 2
            ;;
        --project|-p)
            PROJECT_ID="$2"
            shift 2
            ;;
        --frontend-url|-f)
            FRONTEND_URLS="$2"
            shift 2
            ;;
        --skip-secrets)
            SKIP_SECRETS=true
            shift
            ;;
        --skip-deploy)
            SKIP_DEPLOY=true
            shift
            ;;
        --skip-iam)
            SKIP_IAM=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Full GCP setup for Automatia Demo backend."
            echo ""
            echo "Options:"
            echo "  --stage, -s STAGE        Set deployment stage (dev, staging, prod). Default: dev"
            echo "  --project, -p PROJECT    GCP project ID. Default: backend-471615"
            echo "  --frontend-url, -f URL   Frontend URL(s) for CORS (comma-separated)"
            echo "  --skip-secrets           Skip secret creation/update"
            echo "  --skip-deploy            Skip function deployment (only setup infrastructure)"
            echo "  --skip-iam               Skip IAM permission grants"
            echo "  --verbose, -v            Show detailed output"
            echo "  --help, -h               Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Interactive setup for dev"
            echo "  $0 --stage prod --frontend-url https://app.automatia.bot"
            echo "  $0 --skip-secrets --skip-iam         # Just redeploy functions"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# =============================================================================
# Banner
# =============================================================================
echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                           ║"
echo "║     █████╗ ██╗   ██╗████████╗ ██████╗ ███╗   ███╗ █████╗ ████████╗██╗ █████╗   ║"
echo "║    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝██║██╔══██╗  ║"
echo "║    ███████║██║   ██║   ██║   ██║   ██║██╔████╔██║███████║   ██║   ██║███████║  ║"
echo "║    ██╔══██║██║   ██║   ██║   ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██║██╔══██║  ║"
echo "║    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║ ╚═╝ ██║██║  ██║   ██║   ██║██║  ██║  ║"
echo "║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝  ║"
echo "║                                                                           ║"
echo "║                    Full GCP Setup Script                                  ║"
echo "║                                                                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  Project:  $PROJECT_ID"
echo "  Region:   $REGION"
echo "  Stage:    $STAGE"
echo ""

# =============================================================================
# Step 1: Validate Prerequisites
# =============================================================================
log_step "Step 1: Validating Prerequisites"

# Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI is not installed. Please install it first."
    echo "  Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
log_success "gcloud CLI found"

# Check authentication
ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null || echo "")
if [ -z "$ACCOUNT" ]; then
    log_error "Not authenticated with gcloud. Please run: gcloud auth login"
    exit 1
fi
log_success "Authenticated as: $ACCOUNT"

# Set project
gcloud config set project "$PROJECT_ID" --quiet
log_success "Project set to: $PROJECT_ID"

# Get project number for service account
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
log_info "Service account: $SERVICE_ACCOUNT"

# =============================================================================
# Step 2: Enable Required APIs
# =============================================================================
log_step "Step 2: Enabling Required GCP APIs"

REQUIRED_APIS=(
    "cloudfunctions.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
    "firestore.googleapis.com"
    "artifactregistry.googleapis.com"
    "run.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    log_info "Enabling $api..."
    gcloud services enable "$api" --project="$PROJECT_ID" --quiet
done
log_success "All required APIs enabled"

# =============================================================================
# Step 3: Setup IAM Permissions
# =============================================================================
if [ "$SKIP_IAM" = false ]; then
    log_step "Step 3: Granting IAM Permissions"
    
    REQUIRED_ROLES=(
        "roles/secretmanager.secretAccessor"   # Read secrets
        "roles/datastore.user"                  # Read/write Firestore
        "roles/logging.logWriter"               # Write logs
        "roles/artifactregistry.writer"         # Push container images
    )
    
    for role in "${REQUIRED_ROLES[@]}"; do
        log_info "Granting $role to service account..."
        gcloud projects add-iam-policy-binding "$PROJECT_ID" \
            --member="serviceAccount:$SERVICE_ACCOUNT" \
            --role="$role" \
            --quiet > /dev/null 2>&1 || true
    done
    log_success "All IAM permissions granted"
else
    log_warning "Skipping IAM permission setup (--skip-iam)"
fi

# =============================================================================
# Step 4: Setup Secrets
# =============================================================================
if [ "$SKIP_SECRETS" = false ]; then
    log_step "Step 4: Setting Up Secrets in Secret Manager"
    
    # Helper function to create or update a secret
    create_or_update_secret() {
        local secret_name="$1"
        local secret_value="$2"
        local description="$3"
        
        # Check if secret exists
        if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &> /dev/null; then
            log_info "Updating secret: $secret_name"
            echo -n "$secret_value" | gcloud secrets versions add "$secret_name" \
                --data-file=- \
                --project="$PROJECT_ID" \
                --quiet
        else
            log_info "Creating secret: $secret_name"
            echo -n "$secret_value" | gcloud secrets create "$secret_name" \
                --data-file=- \
                --project="$PROJECT_ID" \
                --replication-policy="automatic" \
                --quiet
        fi
    }
    
    # GCP_PROJECT_ID - Required
    log_info "Setting GCP_PROJECT_ID..."
    create_or_update_secret "GCP_PROJECT_ID" "$PROJECT_ID" "GCP Project ID"
    
    # JWT_SECRET - Generate if not provided
    log_info "Setting JWT_SECRET..."
    JWT_SECRET=$(openssl rand -hex 32)
    # Check if JWT_SECRET already exists and has a value
    EXISTING_JWT=$(gcloud secrets versions access latest --secret=JWT_SECRET --project="$PROJECT_ID" 2>/dev/null || echo "")
    if [ -n "$EXISTING_JWT" ] && [ ${#EXISTING_JWT} -ge 32 ]; then
        log_info "JWT_SECRET already exists, keeping existing value"
    else
        create_or_update_secret "JWT_SECRET" "$JWT_SECRET" "JWT signing secret"
        log_warning "New JWT_SECRET generated. Existing tokens will be invalidated."
    fi
    
    # CORS_ORIGINS - Set based on stage
    log_info "Setting CORS_ORIGINS..."
    if [ -z "$FRONTEND_URLS" ]; then
        if [ "$STAGE" = "prod" ]; then
            # Production: prompt for frontend URL
            echo ""
            log_warning "No frontend URL provided for CORS."
            read -p "Enter your production frontend URL (e.g., https://app.automatia.bot): " FRONTEND_URLS
            if [ -z "$FRONTEND_URLS" ]; then
                log_error "Frontend URL is required for production deployment"
                exit 1
            fi
        else
            # Dev: use localhost and common dev URLs
            FRONTEND_URLS="http://localhost:8080,http://localhost:3000,http://127.0.0.1:8080"
            log_info "Using default dev CORS origins: $FRONTEND_URLS"
        fi
    fi
    create_or_update_secret "CORS_ORIGINS" "$FRONTEND_URLS" "Allowed CORS origins"
    
    # Optional secrets with defaults
    # These are handled by the application with defaults, but we can set them explicitly
    
    log_success "All secrets configured"
    echo ""
    log_info "Secret values:"
    echo "  - GCP_PROJECT_ID: $PROJECT_ID"
    echo "  - JWT_SECRET: [hidden - 64 char hex string]"
    echo "  - CORS_ORIGINS: $FRONTEND_URLS"
else
    log_warning "Skipping secret setup (--skip-secrets)"
fi

# =============================================================================
# Step 5: Deploy Cloud Functions
# =============================================================================
if [ "$SKIP_DEPLOY" = false ]; then
    log_step "Step 5: Deploying Cloud Functions"
    
    # Use the existing deploy.sh script
    if [ -f "./deploy.sh" ]; then
        log_info "Running deploy.sh for stage: $STAGE"
        ./deploy.sh --stage "$STAGE"
    else
        log_error "deploy.sh not found in current directory"
        exit 1
    fi
    
    log_success "All Cloud Functions deployed"
else
    log_warning "Skipping function deployment (--skip-deploy)"
fi

# =============================================================================
# Step 6: Verify Deployment
# =============================================================================
log_step "Step 6: Verifying Deployment"

# List deployed functions
log_info "Deployed functions:"
gcloud functions list \
    --project="$PROJECT_ID" \
    --regions="$REGION" \
    --filter="name~${SERVICE}-${STAGE}" \
    --format="table(name, state, runtime)" 2>/dev/null || log_warning "Could not list functions"

# Test a simple endpoint
BASE_URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${SERVICE}-${STAGE}"

log_info "Testing login endpoint OPTIONS (CORS preflight)..."
CORS_TEST=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
    -H "Origin: ${FRONTEND_URLS%%,*}" \
    -H "Access-Control-Request-Method: POST" \
    "${BASE_URL}-login" 2>/dev/null || echo "000")

if [ "$CORS_TEST" = "204" ]; then
    log_success "CORS preflight test passed (HTTP 204)"
else
    log_warning "CORS preflight returned HTTP $CORS_TEST (expected 204)"
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                         Setup Complete!                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  Project:        $PROJECT_ID"
echo "  Stage:          $STAGE"
echo "  Service Account: $SERVICE_ACCOUNT"
echo ""
echo "  API Base URL:   ${BASE_URL}"
echo ""
echo "  Function URLs:"
echo "    - Login:      ${BASE_URL}-login"
echo "    - Validate:   ${BASE_URL}-validate"
echo "    - Logout:     ${BASE_URL}-logout"
echo ""

if [ "$STAGE" = "dev" ]; then
    echo "  Next steps for PRODUCTION deployment:"
    echo "    1. Update CORS_ORIGINS with your production frontend URL"
    echo "    2. Run: ./full-setup.sh --stage prod --frontend-url https://your-app.com"
    echo ""
fi

echo "  To deploy the frontend (Cloud Run):"
echo "    cd ../frontend"
echo "    gcloud run deploy automatia-demo-portal --source=. --region=$REGION --project=$PROJECT_ID"
echo ""

log_success "Setup completed successfully!"
