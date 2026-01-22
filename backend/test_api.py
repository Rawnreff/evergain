import requests
import json

BASE_URL = "http://localhost:8080"

def test_health_check():
    """Test health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_register():
    """Test user registration"""
    print("🔍 Testing user registration...")
    data = {
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
    return response.json() if response.status_code == 201 else None

def test_login():
    """Test user login"""
    print("🔍 Testing user login...")
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
    return response.json() if response.status_code == 200 else None

def test_workout_submission():
    """Test workout submission"""
    print("🔍 Testing workout submission...")
    data = {
        "weight": 80.5,
        "reps": 10,
        "sets": 3,
        "feeling": "Strong and energized!"
    }
    response = requests.post(f"{BASE_URL}/api/workouts/", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_workout_history():
    """Test workout history retrieval"""
    print("🔍 Testing workout history...")
    response = requests.get(f"{BASE_URL}/api/workouts/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("EverGain Backend API Tests")
    print("=" * 60)
    print()
    
    try:
        test_health_check()
        test_register()
        test_login()
        test_workout_submission()
        test_workout_history()
        
        print("✅ All tests completed!")
    except Exception as e:
        print(f"❌ Error: {e}")
