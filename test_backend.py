#!/usr/bin/env python3

import requests
import json

def test_backend():
    base_url = "http://localhost:5001"
    
    print("Testing VisionBot Backend...")
    print("=" * 40)
    
    # Test 1: Check if backend is running
    try:
        response = requests.get(f"{base_url}/test", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is running")
            print(f"   Status: {data.get('status')}")
            print(f"   YOLO loaded: {data.get('yolo_loaded')}")
        else:
            print("❌ Backend test failed")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Test 2: Test query endpoint
    try:
        query_data = {
            "query": "test query",
            "image_data": "test"
        }
        response = requests.post(f"{base_url}/query", 
                               json=query_data, 
                               timeout=10)
        if response.status_code == 200:
            print("✅ Query endpoint working")
        else:
            print("❌ Query endpoint failed")
    except Exception as e:
        print(f"❌ Query test failed: {e}")
    
    print("\nBackend tests completed!")
    return True

if __name__ == "__main__":
    test_backend()