#!/bin/bash
# =============================================================================
# Automatia Demo - Cloud Functions Deployment Script
# =============================================================================
# This script deploys all functions using gcloud CLI directly, supporting
# Python 3.12 runtime (which serverless-google-cloudfunctions doesn't support).
#
# Secrets (JWT_SECRET) are read from GCP Secret Manager at runtime.
# Only non-sensitive configuration is passed as environment variables.
#
# Usage:
#   ./deploy.sh              # Deploy all functions (default: dev stage)
#   ./deploy.sh --stage prod # Deploy to production
#   ./deploy.sh --function login  # Deploy single function
#   ./deploy.sh --list       # List deployed functions
#   ./deploy.sh --delete     # Delete all functions (use with caution!)
# =============================================================================

set -e  # Exit on error

# =============================================================================
# Configuration
# =============================================================================
PROJECT_ID="backend-471615"
REGION="us-central1"
RUNTIME="python312"
SERVICE="automatia-demo"
STAGE="dev"  # Default stage

# Environment variables file (used to avoid escaping issues with special chars)
ENV_VARS_FILE=".env-vars.yaml"

# =============================================================================
# Function Definitions
# Format: "function_name:entry_point"
# =============================================================================
FUNCTIONS=(
  # Authentication
  "login:login"
  "validate:validate_session"
  "logout:logout"
  # User Management
  "get_user_access:get_user_access"
  "check_demo_access:check_demo_access"
  # Admin - Users
  "create_user:create_user"
  "list_users:list_users"
  "update_user:update_user"
  "delete_user:delete_user"
  "reactivate_user:reactivate_user"
  # Admin - Demos
  "list_demos:list_demos"
  "create_demo:create_demo"
  "update_demo:update_demo"
  "delete_demo:delete_demo"
  "reactivate_demo:reactivate_demo"
  # Activity Tracking
  "track_activity:track_activity"
  "track_activity_batch:track_activity_batch"
  "get_my_activity:get_my_activity"
  "get_activity_summary:get_activity_summary"
  "get_activity_events:get_activity_events"
)

# =============================================================================
# Parse Arguments
# =============================================================================
SINGLE_FUNCTION=""
ACTION="deploy"

while [[ $# -gt 0 ]]; do
  case $1 in
    --stage|-s)
      STAGE="$2"
      shift 2
      ;;
    --function|-f)
      SINGLE_FUNCTION="$2"
      shift 2
      ;;
    --list|-l)
      ACTION="list"
      shift
      ;;
    --delete|-d)
      ACTION="delete"
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --stage, -s STAGE      Set deployment stage (dev, staging, prod). Default: dev"
      echo "  --function, -f NAME    Deploy only a single function"
      echo "  --list, -l             List all deployed functions"
      echo "  --delete, -d           Delete all functions (requires confirmation)"
      echo "  --help, -h             Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                     # Deploy all functions to dev"
      echo "  $0 --stage prod        # Deploy all functions to prod"
      echo "  $0 -f login -s prod    # Deploy only login function to prod"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# =============================================================================
# Helper Functions
# =============================================================================
get_full_name() {
  local func_name="$1"
  echo "${SERVICE}-${STAGE}-${func_name}"
}

deploy_function() {
  local func_name="$1"
  local entry_point="$2"
  local full_name=$(get_full_name "$func_name")
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Deploying: $full_name (entry point: $entry_point)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  gcloud functions deploy "$full_name" \
    --gen2 \
    --runtime="$RUNTIME" \
    --region="$REGION" \
    --source=. \
    --entry-point="$entry_point" \
    --trigger-http \
    --env-vars-file="$ENV_VARS_FILE" \
    --project="$PROJECT_ID" \
    --quiet
  
  # Note: --allow-unauthenticated removed due to org policy restrictions.
  # Set public access manually in GCP Console: Cloud Functions → [function] → Permissions → Add allUsers with Cloud Functions Invoker role
  
  echo "✓ Deployed: $full_name"
  echo ""
}

list_functions() {
  echo "Deployed functions for ${SERVICE}-${STAGE}-*:"
  echo ""
  gcloud functions list \
    --project="$PROJECT_ID" \
    --regions="$REGION" \
    --filter="name~${SERVICE}-${STAGE}" \
    --format="table(name, state, runtime)"
}

delete_functions() {
  echo "⚠️  WARNING: This will delete ALL functions matching ${SERVICE}-${STAGE}-*"
  echo ""
  read -p "Are you sure? Type 'yes' to confirm: " confirmation
  
  if [[ "$confirmation" != "yes" ]]; then
    echo "Aborted."
    exit 1
  fi
  
  for func_def in "${FUNCTIONS[@]}"; do
    local func_name="${func_def%%:*}"
    local full_name=$(get_full_name "$func_name")
    
    echo "Deleting: $full_name"
    gcloud functions delete "$full_name" \
      --region="$REGION" \
      --project="$PROJECT_ID" \
      --quiet || true
  done
  
  echo "✓ All functions deleted"
}

# =============================================================================
# Main
# =============================================================================

# Create environment variables file
# Only GCP_PROJECT_ID is needed here - all other config (JWT_ALGORITHM, 
# JWT_EXPIRATION_HOURS, CORS_ORIGINS) is managed in GCP Secret Manager
cat > "$ENV_VARS_FILE" << 'ENVEOF'
GCP_PROJECT_ID: backend-471615
ENVEOF

# Cleanup env vars file on exit
trap "rm -f $ENV_VARS_FILE" EXIT

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║  Automatia Demo - Cloud Functions Deployment                              ║"
echo "╠═══════════════════════════════════════════════════════════════════════════╣"
echo "║  Project:  $PROJECT_ID                                            ║"
echo "║  Region:   $REGION                                                ║"
echo "║  Runtime:  $RUNTIME                                                  ║"
echo "║  Stage:    $STAGE                                                       ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

case $ACTION in
  "list")
    list_functions
    ;;
  "delete")
    delete_functions
    ;;
  "deploy")
    if [[ -n "$SINGLE_FUNCTION" ]]; then
      # Deploy single function
      found=false
      for func_def in "${FUNCTIONS[@]}"; do
        func_name="${func_def%%:*}"
        entry_point="${func_def##*:}"
        if [[ "$func_name" == "$SINGLE_FUNCTION" ]]; then
          deploy_function "$func_name" "$entry_point"
          found=true
          break
        fi
      done
      if [[ "$found" == "false" ]]; then
        echo "Error: Function '$SINGLE_FUNCTION' not found"
        echo "Available functions:"
        for func_def in "${FUNCTIONS[@]}"; do
          echo "  - ${func_def%%:*}"
        done
        exit 1
      fi
    else
      # Deploy all functions
      echo "Deploying ${#FUNCTIONS[@]} functions..."
      echo ""
      
      for func_def in "${FUNCTIONS[@]}"; do
        func_name="${func_def%%:*}"
        entry_point="${func_def##*:}"
        deploy_function "$func_name" "$entry_point"
      done
      
      echo "═══════════════════════════════════════════════════════════════════════════"
      echo "✓ All ${#FUNCTIONS[@]} functions deployed successfully!"
      echo "═══════════════════════════════════════════════════════════════════════════"
      echo ""
      echo "Function URLs:"
      for func_def in "${FUNCTIONS[@]}"; do
        func_name="${func_def%%:*}"
        full_name=$(get_full_name "$func_name")
        echo "  https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${full_name}"
      done
    fi
    ;;
esac

echo ""
echo "Done!"
