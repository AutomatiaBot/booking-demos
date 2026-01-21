"""
Configuration management for the Automatia Booking API.
All sensitive values are loaded from GCP Secret Manager.
"""

from dataclasses import dataclass
from typing import List

from secret_manager import get_secret, get_secret_int


@dataclass
class Config:
    """Application configuration loaded from GCP Secret Manager."""
    
    # JWT Settings
    jwt_secret: str
    jwt_algorithm: str
    jwt_expiration_hours: int
    
    # CORS Settings
    cors_origins: List[str]
    
    # GCP Settings
    gcp_project_id: str
    
    # Firestore Collections
    users_collection: str = "users"
    sessions_collection: str = "sessions"
    audit_log_collection: str = "audit_logs"
    
    @classmethod
    def from_secrets(cls) -> "Config":
        """Load configuration from GCP Secret Manager."""
        cors_origins_str = get_secret("CORS_ORIGINS", default="http://localhost:8080")
        cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]
        
        return cls(
            jwt_secret=get_secret("JWT_SECRET"),
            jwt_algorithm=get_secret("JWT_ALGORITHM", default="HS256"),
            jwt_expiration_hours=get_secret_int("JWT_EXPIRATION_HOURS", default=2),
            cors_origins=cors_origins,
            gcp_project_id=get_secret("GCP_PROJECT_ID"),
        )
    
    def validate(self) -> None:
        """Validate that required configuration is present."""
        if not self.jwt_secret:
            raise ValueError("JWT_SECRET is required in Secret Manager")
        if len(self.jwt_secret) < 32:
            raise ValueError("JWT_SECRET should be at least 32 characters")
        if not self.gcp_project_id:
            raise ValueError("GCP_PROJECT_ID is required in Secret Manager")


# Global config instance
config = Config.from_secrets()
