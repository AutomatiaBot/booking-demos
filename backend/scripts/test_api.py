"""
Test script to verify API functionality locally.
Run the functions locally with: functions-framework --target=login --debug

Usage:
    # Terminal 1: Start a function
    cd backend
    source venv/bin/activate
    export JWT_SECRET="test-secret-key-at-least-32-characters-long"
    export GCP_PROJECT_ID="backend-471615"
    functions-framework --target=login --debug --port=8081

    # Terminal 2: Run tests
    python scripts/test_api.py
"""

import requests
import json

BASE_URL = "http://localhost:8081"

def print_response(name: str, response: requests.Response):
    """Pretty print a response."""
    print(f"\n{'='*50}")
    print(f"TEST: {name}")
    print(f"{'='*50}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Response: {response.text}")
    return response

def test_login_success():
    """Test successful login."""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"user_id": "admin-automatia", "password": "ChangeMe123!"},
        headers={"Content-Type": "application/json"}
    )
    return print_response("Login Success", response)

def test_login_wrong_password():
    """Test login with wrong password."""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"user_id": "admin-automatia", "password": "wrong-password"},
        headers={"Content-Type": "application/json"}
    )
    return print_response("Login Wrong Password", response)

def test_login_user_not_found():
    """Test login with non-existent user."""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"user_id": "non-existent-user", "password": "any-password"},
        headers={"Content-Type": "application/json"}
    )
    return print_response("Login User Not Found", response)

def test_login_missing_fields():
    """Test login with missing fields."""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"user_id": "admin-automatia"},  # Missing password
        headers={"Content-Type": "application/json"}
    )
    return print_response("Login Missing Fields", response)

def test_validate_session(token: str):
    """Test session validation."""
    response = requests.post(
        f"{BASE_URL}/auth/validate",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    return print_response("Validate Session", response)

def test_validate_invalid_token():
    """Test validation with invalid token."""
    response = requests.post(
        f"{BASE_URL}/auth/validate",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer invalid-token-here"
        }
    )
    return print_response("Validate Invalid Token", response)

def test_check_demo_access_allowed(token: str):
    """Test demo access check - allowed."""
    response = requests.post(
        f"{BASE_URL}/users/check-access",
        json={"demo_id": "manhattan-smiles"},
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    return print_response("Check Demo Access (Allowed)", response)

def test_check_demo_access_denied(token: str):
    """Test demo access check - denied."""
    response = requests.post(
        f"{BASE_URL}/users/check-access",
        json={"demo_id": "non-existent-demo"},
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    return print_response("Check Demo Access (Denied)", response)

def run_all_tests():
    """Run all tests."""
    print("\n" + "="*60)
    print("AUTOMATIA BOOKING API - TEST SUITE")
    print("="*60)
    
    # Test login scenarios
    login_response = test_login_success()
    test_login_wrong_password()
    test_login_user_not_found()
    test_login_missing_fields()
    
    # If login succeeded, test authenticated endpoints
    if login_response.status_code == 200:
        data = login_response.json()
        token = data.get("data", {}).get("token")
        
        if token:
            test_validate_session(token)
            test_validate_invalid_token()
            test_check_demo_access_allowed(token)
            test_check_demo_access_denied(token)
    
    print("\n" + "="*60)
    print("TEST SUITE COMPLETE")
    print("="*60)

if __name__ == "__main__":
    print("\nNote: Make sure you have a function running locally!")
    print("Example: functions-framework --target=login --debug --port=8081")
    print("\nRunning tests against:", BASE_URL)
    
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the API.")
        print("   Make sure a function is running locally.")
        print("   Run: functions-framework --target=login --debug --port=8081")
