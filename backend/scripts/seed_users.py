"""
Seed script to create initial users in Firestore.
Run this once after setting up the database.

Usage:
    cd backend
    export GCP_PROJECT_ID=your-project-id
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
    python scripts/seed_users.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from auth import hash_password


# Initial users to create (matching your current ACCESS_CONFIG)
INITIAL_USERS = [
    {
        "user_id": "admin-automatia",
        "name": "Admin",
        "password": "ChangeMe123!",  # CHANGE THIS!
        "access": ["manhattan-smiles", "gbc", "dr-michael-doe", "ray-avila"],
        "is_admin": True,
        "quick_access": True,
    },
    {
        "user_id": "gbc-demos",
        "name": "GBC Team",
        "password": "ChangeMe123!",  # CHANGE THIS!
        "access": ["dr-michael-doe", "gbc"],
        "is_admin": False,
        "quick_access": True,
    },
    {
        "user_id": "ray-avila",
        "name": "Ray Avila",
        "password": "ChangeMe123!",  # CHANGE THIS!
        "access": ["dr-michael-doe", "ray-avila"],
        "is_admin": False,
        "quick_access": True,
    },
]


def seed_users():
    """Create initial users in Firestore."""
    print("🌱 Seeding users...")
    
    db = get_db()
    
    for user_data in INITIAL_USERS:
        user_id = user_data["user_id"]
        
        # Check if user already exists
        existing = db.get_user_by_id(user_id)
        if existing:
            print(f"  ⏭️  User '{user_id}' already exists, skipping...")
            continue
        
        # Create user
        password_hash = hash_password(user_data["password"])
        db.create_user(
            user_id=user_id,
            name=user_data["name"],
            password_hash=password_hash,
            access=user_data["access"],
            is_admin=user_data["is_admin"],
            quick_access=user_data["quick_access"],
        )
        print(f"  ✅ Created user: {user_id}")
        
        # Initialize activity tracking for this user
        db.initialize_user_activity(user_id=user_id, name=user_data["name"])
        print(f"  📊 Initialized activity tracking for: {user_id}")
    
    print("\n✨ Seeding complete!")
    print("\n⚠️  IMPORTANT: Change the default passwords immediately!")
    print("   Use the admin panel or update directly in Firestore.")


if __name__ == "__main__":
    # Check environment
    if not os.getenv("GCP_PROJECT_ID"):
        print("❌ Error: GCP_PROJECT_ID environment variable is required")
        print("   export GCP_PROJECT_ID=your-project-id")
        sys.exit(1)
    
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        print("⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS not set")
        print("   Make sure you have authenticated with GCP (gcloud auth application-default login)")
    
    seed_users()
