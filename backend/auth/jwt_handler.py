"""
JWT Token handling for authentication.
Uses PyJWT for token creation and validation.
"""

import jwt
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass
from typing import Optional, List

from secrets import get_secret, get_secret_int


@dataclass
class TokenPayload:
    """JWT token payload structure."""
    user_id: str
    name: str
    access: List[str]
    is_admin: bool
    exp: datetime
    iat: datetime
    
    def to_dict(self) -> dict:
        """Convert payload to dictionary for JWT encoding."""
        return {
            "user_id": self.user_id,
            "name": self.name,
            "access": self.access,
            "is_admin": self.is_admin,
            "exp": self.exp,
            "iat": self.iat,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "TokenPayload":
        """Create TokenPayload from decoded JWT dictionary."""
        return cls(
            user_id=data["user_id"],
            name=data["name"],
            access=data.get("access", []),
            is_admin=data.get("is_admin", False),
            exp=datetime.fromtimestamp(data["exp"], tz=timezone.utc),
            iat=datetime.fromtimestamp(data["iat"], tz=timezone.utc),
        )


def get_jwt_secret() -> str:
    """Get JWT secret from GCP Secret Manager."""
    return get_secret("JWT_SECRET")


def get_jwt_algorithm() -> str:
    """Get JWT algorithm from GCP Secret Manager."""
    return get_secret("JWT_ALGORITHM", default="HS256")


def get_jwt_expiration_hours() -> int:
    """Get JWT expiration time in hours from GCP Secret Manager."""
    return get_secret_int("JWT_EXPIRATION_HOURS", default=24)


def create_access_token(
    user_id: str,
    name: str,
    access: List[str],
    is_admin: bool = False,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a new JWT access token.
    
    Args:
        user_id: Unique identifier for the user
        name: Display name for the user
        access: List of demo IDs the user can access
        is_admin: Whether user has admin privileges
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
    """
    now = datetime.now(timezone.utc)
    
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(hours=get_jwt_expiration_hours())
    
    payload = TokenPayload(
        user_id=user_id,
        name=name,
        access=access,
        is_admin=is_admin,
        exp=expire,
        iat=now,
    )
    
    token = jwt.encode(
        payload.to_dict(),
        get_jwt_secret(),
        algorithm=get_jwt_algorithm(),
    )
    
    return token


def verify_token(token: str) -> bool:
    """
    Verify if a JWT token is valid.
    
    Args:
        token: JWT token string
        
    Returns:
        True if token is valid, False otherwise
    """
    try:
        jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[get_jwt_algorithm()],
        )
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


def decode_token(token: str) -> Optional[TokenPayload]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        TokenPayload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[get_jwt_algorithm()],
        )
        return TokenPayload.from_dict(payload)
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
