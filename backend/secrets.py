"""
GCP Secret Manager helper for centralized secret management.

This module provides a unified way to access secrets across the application.
In production (Cloud Run), it reads from GCP Secret Manager.
For local development, it can fall back to environment variables.

Usage:
    from secrets import get_secret
    
    jwt_secret = get_secret("JWT_SECRET")
    gcp_project = get_secret("GCP_PROJECT_ID")
"""

import os
from typing import Optional, Dict
from functools import lru_cache


# Cache for secrets to avoid repeated API calls
_secrets_cache: Dict[str, str] = {}

# Flag to determine if we should use environment variables as fallback
# Set USE_ENV_SECRETS=true for local development without Secret Manager
_use_env_fallback = os.getenv("USE_ENV_SECRETS", "false").lower() == "true"


def _get_project_id() -> str:
    """
    Get the GCP project ID.
    
    In Cloud Run, this is available via metadata server.
    Otherwise, falls back to environment variable.
    """
    # Check environment variable first
    project_id = os.getenv("GCP_PROJECT_ID")
    if project_id:
        return project_id
    
    # Try to get from GCP metadata server (works in Cloud Run/Functions)
    try:
        import urllib.request
        req = urllib.request.Request(
            "http://metadata.google.internal/computeMetadata/v1/project/project-id",
            headers={"Metadata-Flavor": "Google"}
        )
        with urllib.request.urlopen(req, timeout=2) as response:
            return response.read().decode("utf-8")
    except Exception:
        pass
    
    raise ValueError(
        "GCP_PROJECT_ID environment variable is required. "
        "Set it explicitly or run in a GCP environment."
    )


@lru_cache(maxsize=1)
def _get_secret_manager_client():
    """Get a cached Secret Manager client."""
    from google.cloud import secretmanager
    return secretmanager.SecretManagerServiceClient()


def get_secret(
    secret_id: str,
    default: Optional[str] = None,
    version: str = "latest",
) -> str:
    """
    Get a secret from GCP Secret Manager.
    
    This function:
    1. Checks the in-memory cache first
    2. If USE_ENV_SECRETS=true, uses environment variables
    3. Otherwise, fetches from GCP Secret Manager
    
    Args:
        secret_id: The name of the secret in Secret Manager
                   (e.g., "JWT_SECRET", "CORS_ORIGINS")
        default: Default value if secret is not found (only used with env fallback)
        version: Secret version to fetch (default: "latest")
    
    Returns:
        The secret value as a string
        
    Raises:
        ValueError: If secret is not found and no default is provided
        
    Example:
        >>> jwt_secret = get_secret("JWT_SECRET")
        >>> cors_origins = get_secret("CORS_ORIGINS", default="http://localhost:8080")
    """
    # Check cache first
    cache_key = f"{secret_id}:{version}"
    if cache_key in _secrets_cache:
        return _secrets_cache[cache_key]
    
    # Use environment variables if fallback is enabled (for local development)
    if _use_env_fallback:
        value = os.getenv(secret_id, default)
        if value is None:
            raise ValueError(
                f"Secret '{secret_id}' not found in environment variables. "
                f"Set {secret_id} or disable USE_ENV_SECRETS to use Secret Manager."
            )
        _secrets_cache[cache_key] = value
        return value
    
    # Fetch from GCP Secret Manager
    try:
        project_id = _get_project_id()
        client = _get_secret_manager_client()
        
        name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
        response = client.access_secret_version(request={"name": name})
        value = response.payload.data.decode("UTF-8")
        
        # Cache the value
        _secrets_cache[cache_key] = value
        return value
        
    except Exception as e:
        # If we have a default, use it
        if default is not None:
            _secrets_cache[cache_key] = default
            return default
        
        raise ValueError(
            f"Failed to fetch secret '{secret_id}' from Secret Manager: {e}. "
            f"Ensure the secret exists and your service account has access. "
            f"For local development, set USE_ENV_SECRETS=true and use environment variables."
        ) from e


def get_secret_int(
    secret_id: str,
    default: Optional[int] = None,
    version: str = "latest",
) -> int:
    """
    Get a secret as an integer.
    
    Args:
        secret_id: The name of the secret
        default: Default value if secret is not found
        version: Secret version to fetch
        
    Returns:
        The secret value as an integer
    """
    default_str = str(default) if default is not None else None
    value = get_secret(secret_id, default=default_str, version=version)
    return int(value)


def clear_cache() -> None:
    """
    Clear the secrets cache.
    
    Useful for testing or when you need to refresh secrets.
    """
    global _secrets_cache
    _secrets_cache = {}
    _get_secret_manager_client.cache_clear()


def preload_secrets(secret_ids: list[str]) -> None:
    """
    Preload multiple secrets into cache.
    
    Useful during application startup to fail fast if secrets are missing.
    
    Args:
        secret_ids: List of secret IDs to preload
        
    Raises:
        ValueError: If any secret is not found
    """
    for secret_id in secret_ids:
        get_secret(secret_id)


# List of required secrets for this application
REQUIRED_SECRETS = [
    "JWT_SECRET",
    "GCP_PROJECT_ID",
]

# List of optional secrets with defaults
OPTIONAL_SECRETS = {
    "JWT_ALGORITHM": "HS256",
    "JWT_EXPIRATION_HOURS": "24",
    "CORS_ORIGINS": "http://localhost:8080",
}


def validate_secrets() -> None:
    """
    Validate that all required secrets are available.
    
    Call this during application startup to fail fast.
    
    Raises:
        ValueError: If any required secret is missing
    """
    missing = []
    
    for secret_id in REQUIRED_SECRETS:
        try:
            get_secret(secret_id)
        except ValueError:
            missing.append(secret_id)
    
    if missing:
        raise ValueError(
            f"Missing required secrets: {', '.join(missing)}. "
            f"Create them in GCP Secret Manager or set USE_ENV_SECRETS=true "
            f"and provide them as environment variables."
        )
