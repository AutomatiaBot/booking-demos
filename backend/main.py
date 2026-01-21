"""
Main entry point for GCP Cloud Functions.
All HTTP function handlers are defined here.
"""

import functions_framework
from flask import jsonify, Request
from functools import wraps
from typing import Callable, Any, Tuple, Optional
import json

from auth import (
    create_access_token,
    verify_token,
    decode_token,
    hash_password,
    verify_password,
    TokenPayload,
)
from database import get_db
from secret_manager import get_secret


# ============================================
# CORS and Response Helpers
# ============================================

def get_cors_headers(request: Request = None) -> dict:
    """Get CORS headers for responses.
    
    Dynamically sets Access-Control-Allow-Origin based on the request's
    Origin header if it matches one of the allowed origins.
    This is required when using credentials (cookies, auth headers).
    """
    origins = get_secret("CORS_ORIGINS", default="http://localhost:8080")
    allowed_origins = [o.strip() for o in origins.split(",")]
    
    # Determine which origin to allow based on the request
    origin = None
    if request:
        request_origin = request.headers.get("Origin", "")
        if request_origin in allowed_origins:
            origin = request_origin
    
    # Fallback to first origin if request origin not in allowed list
    if not origin:
        origin = allowed_origins[0]
    
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "3600",
    }


def cors_response(data: Any, status: int = 200, request: Request = None) -> Tuple[str, int, dict]:
    """Create a response with CORS headers."""
    return (
        json.dumps(data, default=str),
        status,
        {**get_cors_headers(request), "Content-Type": "application/json"},
    )


def error_response(message: str, status: int = 400, request: Request = None) -> Tuple[str, int, dict]:
    """Create an error response."""
    return cors_response({"error": message, "success": False}, status, request)


def success_response(data: Any = None, message: str = "Success", request: Request = None) -> Tuple[str, int, dict]:
    """Create a success response."""
    response = {"success": True, "message": message}
    if data is not None:
        response["data"] = data
    return cors_response(response, 200, request)


# ============================================
# Authentication Decorators
# ============================================

def get_token_from_request(request: Request) -> Optional[str]:
    """Extract JWT token from Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def require_auth(f: Callable) -> Callable:
    """Decorator to require valid authentication."""
    @wraps(f)
    def decorated(request: Request, *args, **kwargs):
        token = get_token_from_request(request)
        if not token:
            return error_response("Missing authorization token", 401, request)
        
        payload = decode_token(token)
        if not payload:
            return error_response("Invalid or expired token", 401, request)
        
        # Add user info to request for handler use
        request.user = payload
        return f(request, *args, **kwargs)
    
    return decorated


def require_admin(f: Callable) -> Callable:
    """Decorator to require admin privileges."""
    @wraps(f)
    @require_auth
    def decorated(request: Request, *args, **kwargs):
        if not request.user.is_admin:
            return error_response("Admin privileges required", 403, request)
        return f(request, *args, **kwargs)
    
    return decorated


# ============================================
# Authentication Endpoints
# ============================================

@functions_framework.http
def login(request: Request) -> Tuple[str, int, dict]:
    """
    Authenticate user and return JWT token.
    
    POST /auth/login
    Body: {"user_id": "string", "password": "string"}
    
    Returns: {"success": true, "data": {"token": "...", "user": {...}}}
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    user_id = body.get("user_id", "").strip().lower()
    password = body.get("password", "")
    
    if not user_id or not password:
        return error_response("user_id and password are required", 400, request)
    
    # Normalize user_id (lowercase, replace spaces with hyphens)
    user_id = user_id.replace(" ", "-")
    
    # Get user from database
    db = get_db()
    user = db.get_user_by_id(user_id)
    
    if not user:
        # Log failed attempt
        db.log_action(
            action="login_failed",
            user_id=user_id,
            details={"reason": "user_not_found"},
            ip_address=request.remote_addr,
        )
        return error_response("Invalid credentials", 401, request)
    
    if not user.get("is_active", True):
        db.log_action(
            action="login_failed",
            user_id=user_id,
            details={"reason": "account_disabled"},
            ip_address=request.remote_addr,
        )
        return error_response("Account is disabled", 401, request)
    
    # Verify password
    if not verify_password(password, user.get("password_hash", "")):
        db.log_action(
            action="login_failed",
            user_id=user_id,
            details={"reason": "invalid_password"},
            ip_address=request.remote_addr,
        )
        return error_response("Invalid credentials", 401, request)
    
    # Create JWT token
    token = create_access_token(
        user_id=user_id,
        name=user.get("name", user_id),
        access=user.get("access", []),
        is_admin=user.get("is_admin", False),
    )
    
    # Update last login
    db.update_last_login(user_id)
    
    # Log successful login
    db.log_action(
        action="login_success",
        user_id=user_id,
        ip_address=request.remote_addr,
    )
    
    return success_response(
        data={
            "token": token,
            "user": {
                "id": user_id,
                "name": user.get("name"),
                "access": user.get("access", []),
                "quick_access": user.get("quick_access", True),
                "is_admin": user.get("is_admin", False),
            },
        },
        message="Login successful",
        request=request,
    )


@functions_framework.http
def validate_session(request: Request) -> Tuple[str, int, dict]:
    """
    Validate JWT token and return user info.
    
    POST /auth/validate
    Headers: Authorization: Bearer <token>
    
    Returns: {"success": true, "data": {"user": {...}}}
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    # Get fresh quick_access from database
    db = get_db()
    user = db.get_user_by_id(payload.user_id)
    quick_access = user.get("quick_access", True) if user else True
    
    return success_response(
        data={
            "user": {
                "id": payload.user_id,
                "name": payload.name,
                "access": payload.access,
                "is_admin": payload.is_admin,
                "quick_access": quick_access,
            },
            "expires_at": payload.exp.isoformat(),
        },
        message="Token is valid",
        request=request,
    )


@functions_framework.http
def logout(request: Request) -> Tuple[str, int, dict]:
    """
    Logout user (for audit logging purposes).
    
    POST /auth/logout
    Headers: Authorization: Bearer <token>
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if token:
        payload = decode_token(token)
        if payload:
            db = get_db()
            db.log_action(
                action="logout",
                user_id=payload.user_id,
                ip_address=request.remote_addr,
            )
    
    return success_response(message="Logged out successfully", request=request)


# ============================================
# User Access Endpoints
# ============================================

@functions_framework.http
def get_user_access(request: Request) -> Tuple[str, int, dict]:
    """
    Get list of demos the authenticated user can access.
    
    GET /users/access
    Headers: Authorization: Bearer <token>
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "GET":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    # Get fresh user data from database
    db = get_db()
    user = db.get_user_by_id(payload.user_id)
    
    if not user or not user.get("is_active", True):
        return error_response("User not found or inactive", 401, request)
    
    return success_response(
        data={
            "access": user.get("access", []),
            "quick_access": user.get("quick_access", True),
        },
        request=request,
    )


@functions_framework.http
def check_demo_access(request: Request) -> Tuple[str, int, dict]:
    """
    Check if user can access a specific demo.
    
    POST /users/check-access
    Headers: Authorization: Bearer <token>
    Body: {"demo_id": "manhattan-smiles"}
    
    Returns: {"success": true, "data": {"allowed": true/false}}
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    demo_id = body.get("demo_id", "").strip().lower()
    if not demo_id:
        return error_response("demo_id is required", 400, request)
    
    # Get fresh user data from database to check current permissions
    db = get_db()
    user = db.get_user_by_id(payload.user_id)
    
    if not user or not user.get("is_active", True):
        return error_response("User not found or inactive", 401, request)
    
    user_access = user.get("access", [])
    allowed = demo_id in user_access
    
    # Log access attempt for audit
    db.log_action(
        action="demo_access_check",
        user_id=payload.user_id,
        details={"demo_id": demo_id, "allowed": allowed},
        ip_address=request.remote_addr,
    )
    
    if not allowed:
        return success_response(
            data={"allowed": False, "demo_id": demo_id},
            message="Access denied to this demo",
            request=request,
        )
    
    return success_response(
        data={"allowed": True, "demo_id": demo_id},
        message="Access granted",
        request=request,
    )


# ============================================
# Admin Endpoints
# ============================================

@functions_framework.http
def create_user(request: Request) -> Tuple[str, int, dict]:
    """
    Create a new user (admin only).
    
    POST /admin/users
    Body: {
        "user_id": "string",
        "name": "string",
        "password": "string",
        "access": ["demo-id-1", "demo-id-2"],
        "is_admin": false,
        "quick_access": true
    }
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    user_id = body.get("user_id", "").strip().lower().replace(" ", "-")
    name = body.get("name", "").strip()
    password = body.get("password", "")
    access = body.get("access", [])
    is_admin = body.get("is_admin", False)
    quick_access = body.get("quick_access", True)
    
    # Validation
    if not user_id:
        return error_response("user_id is required", 400, request)
    if not name:
        return error_response("name is required", 400, request)
    if not password or len(password) < 8:
        return error_response("password must be at least 8 characters", 400, request)
    if not isinstance(access, list):
        return error_response("access must be a list of demo IDs", 400, request)
    
    db = get_db()
    
    # Check if user already exists
    existing = db.get_user_by_id(user_id)
    if existing:
        return error_response(f"User '{user_id}' already exists", 409, request)
    
    # Create user
    password_hash = hash_password(password)
    user = db.create_user(
        user_id=user_id,
        name=name,
        password_hash=password_hash,
        access=access,
        is_admin=is_admin,
        quick_access=quick_access,
    )
    
    # Initialize user activity tracking (creates their personal activity collection)
    db.initialize_user_activity(user_id=user_id, name=name)
    
    # Log action
    db.log_action(
        action="user_created",
        user_id=payload.user_id,
        details={"created_user": user_id},
        ip_address=request.remote_addr,
    )
    
    # Remove password hash from response
    user.pop("password_hash", None)
    
    return success_response(data=user, message=f"User '{user_id}' created successfully", request=request)


@functions_framework.http
def list_users(request: Request) -> Tuple[str, int, dict]:
    """
    List all users (admin only).
    
    GET /admin/users
    Query params: include_inactive=true (optional)
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "GET":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    
    db = get_db()
    users = db.list_users(include_inactive=include_inactive)
    
    return success_response(data={"users": users, "count": len(users)}, request=request)


@functions_framework.http
def update_user(request: Request) -> Tuple[str, int, dict]:
    """
    Update a user (admin only).
    
    PUT /admin/users/{user_id}
    Body: {
        "name": "string" (optional),
        "password": "string" (optional),
        "access": ["demo-id-1"] (optional),
        "is_admin": false (optional),
        "quick_access": true (optional),
        "is_active": true (optional)
    }
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "PUT":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    # Get user_id from path
    # In GCP Cloud Functions, path params need to be extracted from the path
    path_parts = request.path.rstrip("/").split("/")
    if len(path_parts) < 1:
        return error_response("user_id is required in path", 400, request)
    user_id = path_parts[-1]
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    db = get_db()
    
    # Check if user exists
    existing = db.get_user_by_id(user_id)
    if not existing:
        return error_response(f"User '{user_id}' not found", 404, request)
    
    # Build updates
    updates = {}
    if "name" in body:
        updates["name"] = body["name"].strip()
    if "password" in body:
        if len(body["password"]) < 8:
            return error_response("password must be at least 8 characters", 400, request)
        updates["password_hash"] = hash_password(body["password"])
    if "access" in body:
        if not isinstance(body["access"], list):
            return error_response("access must be a list", 400, request)
        updates["access"] = body["access"]
    if "is_admin" in body:
        updates["is_admin"] = bool(body["is_admin"])
    if "quick_access" in body:
        updates["quick_access"] = bool(body["quick_access"])
    if "is_active" in body:
        updates["is_active"] = bool(body["is_active"])
    
    if not updates:
        return error_response("No valid fields to update", 400, request)
    
    # Update user
    updated_user = db.update_user(user_id, updates)
    
    # Log action
    db.log_action(
        action="user_updated",
        user_id=payload.user_id,
        details={"updated_user": user_id, "fields": list(updates.keys())},
        ip_address=request.remote_addr,
    )
    
    # Remove sensitive data
    updated_user.pop("password_hash", None)
    
    return success_response(data=updated_user, message=f"User '{user_id}' updated successfully", request=request)


@functions_framework.http
def delete_user(request: Request) -> Tuple[str, int, dict]:
    """
    Deactivate a user (soft delete - admin only).
    User data and activity logs are preserved forever.
    
    DELETE /admin/users/{user_id}
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "DELETE":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    # Get user_id from path
    path_parts = request.path.rstrip("/").split("/")
    if len(path_parts) < 1:
        return error_response("user_id is required in path", 400, request)
    user_id = path_parts[-1]
    
    # Prevent self-deactivation
    if user_id == payload.user_id:
        return error_response("Cannot deactivate your own account", 400, request)
    
    db = get_db()
    
    # Check if user exists
    user = db.get_user_by_id(user_id)
    if not user:
        return error_response(f"User '{user_id}' not found", 404, request)
    
    if not user.get("is_active", True):
        return error_response(f"User '{user_id}' is already deactivated", 400, request)
    
    # Soft delete: just deactivate the user (keep all data and logs)
    db.update_user(user_id, {"is_active": False})
    
    # Log action
    db.log_action(
        action="user_deactivated",
        user_id=payload.user_id,
        details={"deactivated_user": user_id},
        ip_address=request.remote_addr,
    )
    
    return success_response(message=f"User '{user_id}' deactivated successfully. All data and activity logs are preserved.", request=request)


@functions_framework.http
def reactivate_user(request: Request) -> Tuple[str, int, dict]:
    """
    Reactivate a deactivated user (admin only).
    
    POST /admin/users/{user_id}/reactivate
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    # Get user_id from path
    path_parts = request.path.rstrip("/").split("/")
    if len(path_parts) < 2:
        return error_response("user_id is required in path", 400, request)
    user_id = path_parts[-2]  # /admin/users/{user_id}/reactivate
    
    db = get_db()
    
    # Check if user exists
    user = db.get_user_by_id(user_id)
    if not user:
        return error_response(f"User '{user_id}' not found", 404, request)
    
    if user.get("is_active", True):
        return error_response(f"User '{user_id}' is already active", 400, request)
    
    # Reactivate the user
    db.update_user(user_id, {"is_active": True})
    
    # Log action
    db.log_action(
        action="user_reactivated",
        user_id=payload.user_id,
        details={"reactivated_user": user_id},
        ip_address=request.remote_addr,
    )
    
    return success_response(message=f"User '{user_id}' reactivated successfully", request=request)


# ============================================
# Activity Tracking Endpoints
# ============================================

@functions_framework.http
def track_activity(request: Request) -> Tuple[str, int, dict]:
    """
    Track user activity events from the frontend.
    
    POST /activity/track
    Headers: Authorization: Bearer <token>
    Body: {
        "event_type": "page_view|button_click|chat_message_sent|...",
        "session_id": "client-generated-uuid",
        "page_url": "https://...",
        "demo_id": "manhattan-smiles" (optional),
        "data": { ... event-specific data ... }
    }
    
    Event Types:
        - session_start: User started a new session
        - session_end: User ended session {duration_seconds: number}
        - page_view: User viewed a page
        - page_exit: User left a page {duration_seconds: number}
        - button_click: User clicked a button {button_id, button_text}
        - link_click: User clicked a link {link_url, link_text}
        - chat_opened: User opened chat widget
        - chat_closed: User closed chat widget {duration_seconds}
        - chat_message_sent: User sent message {message_text}
        - chat_message_received: Bot responded {message_text}
        - scroll_depth: User scrolled {depth_percent: number}
        - demo_launched: User launched a demo {demo_id}
        - error: An error occurred {error_message, error_stack}
        - custom: Custom event {custom_type, ...}
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    event_type = body.get("event_type", "").strip()
    if not event_type:
        return error_response("event_type is required", 400, request)
    
    # Valid event types
    valid_events = [
        "session_start", "session_end",
        "page_view", "page_exit",
        "button_click", "link_click",
        "chat_opened", "chat_closed",
        "chat_message_sent", "chat_message_received",
        "scroll_depth", "demo_launched",
        "form_interaction", "error", "custom"
    ]
    
    if event_type not in valid_events:
        return error_response(f"Invalid event_type. Must be one of: {', '.join(valid_events)}", 400, request)
    
    session_id = body.get("session_id")
    page_url = body.get("page_url")
    demo_id = body.get("demo_id")
    event_data = body.get("data", {})
    
    db = get_db()
    
    # Log the activity event
    event_id = db.log_user_activity(
        user_id=payload.user_id,
        event_type=event_type,
        event_data=event_data,
        page_url=page_url,
        demo_id=demo_id,
        session_id=session_id,
        ip_address=request.remote_addr,
        user_agent=request.headers.get("User-Agent"),
    )
    
    return success_response(
        data={"event_id": event_id},
        message="Activity tracked successfully",
        request=request,
    )


@functions_framework.http
def track_activity_batch(request: Request) -> Tuple[str, int, dict]:
    """
    Track multiple activity events at once (for batching/efficiency).
    
    POST /activity/track-batch
    Headers: Authorization: Bearer <token>
    Body: {
        "events": [
            {"event_type": "...", "session_id": "...", "data": {...}, "timestamp": "ISO8601"},
            ...
        ]
    }
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "POST":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    try:
        body = request.get_json(silent=True) or {}
    except Exception:
        return error_response("Invalid JSON body", 400, request)
    
    events = body.get("events", [])
    if not isinstance(events, list) or len(events) == 0:
        return error_response("events must be a non-empty array", 400, request)
    
    if len(events) > 100:
        return error_response("Maximum 100 events per batch", 400, request)
    
    db = get_db()
    event_ids = []
    errors = []
    
    for i, event in enumerate(events):
        try:
            event_type = event.get("event_type", "")
            if not event_type:
                errors.append({"index": i, "error": "event_type is required"})
                continue
            
            event_id = db.log_user_activity(
                user_id=payload.user_id,
                event_type=event_type,
                event_data=event.get("data", {}),
                page_url=event.get("page_url"),
                demo_id=event.get("demo_id"),
                session_id=event.get("session_id"),
                ip_address=request.remote_addr,
                user_agent=request.headers.get("User-Agent"),
            )
            event_ids.append(event_id)
        except Exception as e:
            errors.append({"index": i, "error": str(e)})
    
    return success_response(
        data={
            "tracked_count": len(event_ids),
            "event_ids": event_ids,
            "errors": errors if errors else None,
        },
        message=f"Tracked {len(event_ids)} events",
        request=request,
    )


@functions_framework.http
def get_activity_summary(request: Request) -> Tuple[str, int, dict]:
    """
    Get activity summary for a user (admin only).
    
    GET /admin/activity/{user_id}/summary
    Headers: Authorization: Bearer <token>
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "GET":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    # Get user_id from path
    path_parts = request.path.rstrip("/").split("/")
    if len(path_parts) < 2:
        return error_response("user_id is required in path", 400, request)
    user_id = path_parts[-2]  # /admin/activity/{user_id}/summary
    
    db = get_db()
    
    # Check if user exists
    user = db.get_user_by_id(user_id)
    if not user:
        return error_response(f"User '{user_id}' not found", 404, request)
    
    # Get activity summary
    summary = db.get_user_activity_summary(user_id)
    
    if not summary:
        return success_response(
            data={
                "user_id": user_id,
                "total_events": 0,
                "total_sessions": 0,
                "total_time_seconds": 0,
                "demos_visited": [],
                "message": "No activity recorded yet",
            },
            request=request,
        )
    
    return success_response(data=summary, request=request)


@functions_framework.http
def get_activity_events(request: Request) -> Tuple[str, int, dict]:
    """
    Get activity events for a user (admin only).
    
    GET /admin/activity/{user_id}/events
    Headers: Authorization: Bearer <token>
    Query params:
        - limit: Max events to return (default 100, max 500)
        - event_type: Filter by event type
        - demo_id: Filter by demo ID
        - session_id: Filter by session ID
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "GET":
        return error_response("Method not allowed", 405, request)
    
    # Check admin auth
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    if not payload.is_admin:
        return error_response("Admin privileges required", 403, request)
    
    # Get user_id from path
    path_parts = request.path.rstrip("/").split("/")
    if len(path_parts) < 2:
        return error_response("user_id is required in path", 400, request)
    user_id = path_parts[-2]  # /admin/activity/{user_id}/events
    
    # Parse query params
    limit = min(int(request.args.get("limit", 100)), 500)
    event_type = request.args.get("event_type")
    demo_id = request.args.get("demo_id")
    session_id = request.args.get("session_id")
    
    db = get_db()
    
    # Check if user exists
    user = db.get_user_by_id(user_id)
    if not user:
        return error_response(f"User '{user_id}' not found", 404, request)
    
    # Get events
    events = db.get_user_events(
        user_id=user_id,
        limit=limit,
        event_type=event_type,
        demo_id=demo_id,
        session_id=session_id,
    )
    
    return success_response(
        data={
            "user_id": user_id,
            "events": events,
            "count": len(events),
        },
        request=request,
    )


@functions_framework.http
def get_my_activity(request: Request) -> Tuple[str, int, dict]:
    """
    Get your own activity summary (for regular users).
    
    GET /activity/me
    Headers: Authorization: Bearer <token>
    """
    if request.method == "OPTIONS":
        return cors_response({}, 204, request)
    
    if request.method != "GET":
        return error_response("Method not allowed", 405, request)
    
    token = get_token_from_request(request)
    if not token:
        return error_response("Missing authorization token", 401, request)
    
    payload = decode_token(token)
    if not payload:
        return error_response("Invalid or expired token", 401, request)
    
    db = get_db()
    summary = db.get_user_activity_summary(payload.user_id)
    
    if not summary:
        return success_response(
            data={
                "user_id": payload.user_id,
                "total_events": 0,
                "total_sessions": 0,
                "total_time_seconds": 0,
                "demos_visited": [],
            },
            request=request,
        )
    
    # Remove internal fields
    summary.pop("is_tracking_active", None)
    
    return success_response(data=summary, request=request)
