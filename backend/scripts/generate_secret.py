"""
Generate a secure JWT secret key.

Usage:
    python scripts/generate_secret.py
"""

import secrets


def generate_jwt_secret(length: int = 64) -> str:
    """Generate a cryptographically secure secret key."""
    return secrets.token_urlsafe(length)


if __name__ == "__main__":
    secret = generate_jwt_secret()
    print("\n🔐 Generated JWT Secret:\n")
    print(f"   {secret}")
    print(f"\n   Length: {len(secret)} characters")
    print("\n📋 Add this to your .env file or GCP Secret Manager:")
    print(f"   JWT_SECRET={secret}")
    print()
