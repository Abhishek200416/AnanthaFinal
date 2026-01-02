#!/usr/bin/env python3
"""
Newsletter API Testing Script
Tests all newsletter-related endpoints for the Anantha Lakshmi Food Delivery API
"""

import requests
import json
import sys
import os
from datetime import datetime

# Configuration
BACKEND_URL = "https://email-subscribe-test.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@ananthalakshmi.com"
ADMIN_PASSWORD = "admin123"

# Test data
TEST_EMAILS = [
    "test.cookie@example.com",
    "test.checkout@example.com", 
    "test.footer@example.com",
    "test.duplicate@example.com"
]

class NewsletterTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def admin_login(self):
        """Login as admin to get authentication token"""
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/admin-login",
                json={
                    "email": ADMIN_EMAIL,
                    "password": ADMIN_PASSWORD
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("token")
                self.log_result("Admin Login", True, "Successfully logged in as admin")
                return True
            else:
                self.log_result("Admin Login", False, f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Login", False, f"Login error: {str(e)}")
            return False
    
    def get_auth_headers(self):
        """Get authorization headers for admin requests"""
        if not self.admin_token:
            return {}
        return {"Authorization": f"Bearer {self.admin_token}"}
    
    def test_newsletter_subscribe(self):
        """Test newsletter subscription with different sources"""
        print("\n=== Testing Newsletter Subscription ===")
        
        sources = ["cookie", "checkout", "footer"]
        
        for i, source in enumerate(sources):
            email = TEST_EMAILS[i]
            try:
                response = self.session.post(
                    f"{BACKEND_URL}/newsletter/subscribe",
                    json={
                        "email": email,
                        "source": source
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(
                        f"Newsletter Subscribe ({source})", 
                        True, 
                        f"Successfully subscribed {email} via {source}",
                        data.get("message")
                    )
                else:
                    self.log_result(
                        f"Newsletter Subscribe ({source})", 
                        False, 
                        f"Subscription failed for {email}",
                        f"Status: {response.status_code}, Response: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Newsletter Subscribe ({source})", 
                    False, 
                    f"Error subscribing {email}",
                    str(e)
                )
    
    def test_duplicate_subscription(self):
        """Test duplicate email subscription handling"""
        print("\n=== Testing Duplicate Subscription ===")
        
        email = TEST_EMAILS[3]  # test.duplicate@example.com
        
        # First subscription
        try:
            response1 = self.session.post(
                f"{BACKEND_URL}/newsletter/subscribe",
                json={
                    "email": email,
                    "source": "footer"
                }
            )
            
            # Second subscription (duplicate)
            response2 = self.session.post(
                f"{BACKEND_URL}/newsletter/subscribe",
                json={
                    "email": email,
                    "source": "checkout"
                }
            )
            
            if response1.status_code == 200 and response2.status_code == 200:
                data2 = response2.json()
                message = data2.get("message", "")
                if "already subscribed" in message.lower() or "resubscribed" in message.lower():
                    self.log_result(
                        "Duplicate Subscription Handling", 
                        True, 
                        "Correctly handled duplicate subscription",
                        message
                    )
                else:
                    self.log_result(
                        "Duplicate Subscription Handling", 
                        False, 
                        "Unexpected response for duplicate subscription",
                        message
                    )
            else:
                self.log_result(
                    "Duplicate Subscription Handling", 
                    False, 
                    "Failed to test duplicate subscription",
                    f"Response1: {response1.status_code}, Response2: {response2.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Duplicate Subscription Handling", 
                False, 
                "Error testing duplicate subscription",
                str(e)
            )
    
    def test_email_validation(self):
        """Test email validation"""
        print("\n=== Testing Email Validation ===")
        
        invalid_emails = ["invalid-email", "test@", "@example.com", ""]
        
        for invalid_email in invalid_emails:
            try:
                response = self.session.post(
                    f"{BACKEND_URL}/newsletter/subscribe",
                    json={
                        "email": invalid_email,
                        "source": "footer"
                    }
                )
                
                if response.status_code == 422:  # Validation error expected
                    self.log_result(
                        f"Email Validation ({invalid_email})", 
                        True, 
                        "Correctly rejected invalid email",
                        "Validation error as expected"
                    )
                else:
                    self.log_result(
                        f"Email Validation ({invalid_email})", 
                        False, 
                        "Should have rejected invalid email",
                        f"Status: {response.status_code}"
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Email Validation ({invalid_email})", 
                    False, 
                    "Error testing email validation",
                    str(e)
                )
    
    def test_newsletter_unsubscribe(self):
        """Test newsletter unsubscription"""
        print("\n=== Testing Newsletter Unsubscription ===")
        
        # Test unsubscribing an existing email
        email = TEST_EMAILS[0]  # Should be subscribed from earlier test
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/newsletter/unsubscribe",
                json={"email": email}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_result(
                    "Newsletter Unsubscribe", 
                    True, 
                    f"Successfully unsubscribed {email}",
                    data.get("message")
                )
            else:
                self.log_result(
                    "Newsletter Unsubscribe", 
                    False, 
                    f"Unsubscription failed for {email}",
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Newsletter Unsubscribe", 
                False, 
                f"Error unsubscribing {email}",
                str(e)
            )
        
        # Test unsubscribing non-existent email
        try:
            response = self.session.post(
                f"{BACKEND_URL}/newsletter/unsubscribe",
                json={"email": "nonexistent@example.com"}
            )
            
            if response.status_code == 404:
                self.log_result(
                    "Unsubscribe Non-existent Email", 
                    True, 
                    "Correctly handled non-existent email",
                    "404 error as expected"
                )
            else:
                self.log_result(
                    "Unsubscribe Non-existent Email", 
                    False, 
                    "Should have returned 404 for non-existent email",
                    f"Status: {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Unsubscribe Non-existent Email", 
                False, 
                "Error testing non-existent email unsubscribe",
                str(e)
            )
    
    def test_admin_get_subscribers(self):
        """Test admin endpoint to get all subscribers"""
        print("\n=== Testing Admin Get Subscribers ===")
        
        if not self.admin_token:
            self.log_result("Admin Get Subscribers", False, "No admin token available")
            return
        
        try:
            response = self.session.get(
                f"{BACKEND_URL}/admin/newsletter/subscribers",
                headers=self.get_auth_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                subscribers = data.get("subscribers", [])
                total = data.get("total", 0)
                
                self.log_result(
                    "Admin Get Subscribers", 
                    True, 
                    f"Successfully retrieved {total} subscribers",
                    f"Active subscribers: {len([s for s in subscribers if s.get('is_active', True)])}"
                )
                
                # Verify data structure
                if subscribers and len(subscribers) > 0:
                    sample = subscribers[0]
                    required_fields = ["id", "email", "source", "subscribed_at", "is_active"]
                    missing_fields = [field for field in required_fields if field not in sample]
                    
                    if not missing_fields:
                        self.log_result(
                            "Subscriber Data Structure", 
                            True, 
                            "Subscriber data has all required fields"
                        )
                    else:
                        self.log_result(
                            "Subscriber Data Structure", 
                            False, 
                            f"Missing fields in subscriber data: {missing_fields}"
                        )
                        
            else:
                self.log_result(
                    "Admin Get Subscribers", 
                    False, 
                    "Failed to retrieve subscribers",
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Get Subscribers", 
                False, 
                "Error retrieving subscribers",
                str(e)
            )
    
    def test_admin_get_campaigns(self):
        """Test admin endpoint to get all campaigns"""
        print("\n=== Testing Admin Get Campaigns ===")
        
        if not self.admin_token:
            self.log_result("Admin Get Campaigns", False, "No admin token available")
            return
        
        try:
            response = self.session.get(
                f"{BACKEND_URL}/admin/newsletter/campaigns",
                headers=self.get_auth_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                campaigns = data.get("campaigns", [])
                total = data.get("total", 0)
                
                self.log_result(
                    "Admin Get Campaigns", 
                    True, 
                    f"Successfully retrieved {total} campaigns"
                )
                
                # Verify data structure if campaigns exist
                if campaigns and len(campaigns) > 0:
                    sample = campaigns[0]
                    required_fields = ["id", "subject", "content", "sent_at", "recipients_count", "status"]
                    missing_fields = [field for field in required_fields if field not in sample]
                    
                    if not missing_fields:
                        self.log_result(
                            "Campaign Data Structure", 
                            True, 
                            "Campaign data has all required fields"
                        )
                    else:
                        self.log_result(
                            "Campaign Data Structure", 
                            False, 
                            f"Missing fields in campaign data: {missing_fields}"
                        )
                        
            else:
                self.log_result(
                    "Admin Get Campaigns", 
                    False, 
                    "Failed to retrieve campaigns",
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Get Campaigns", 
                False, 
                "Error retrieving campaigns",
                str(e)
            )
    
    def test_admin_send_newsletter(self):
        """Test admin endpoint to send newsletter"""
        print("\n=== Testing Admin Send Newsletter ===")
        
        if not self.admin_token:
            self.log_result("Admin Send Newsletter", False, "No admin token available")
            return
        
        # First, get a product to include in newsletter
        try:
            products_response = self.session.get(f"{BACKEND_URL}/products")
            product_id = None
            
            if products_response.status_code == 200:
                products = products_response.json()
                if products and len(products) > 0:
                    product_id = products[0].get("id")
            
            # Send newsletter
            newsletter_data = {
                "subject": "Test Newsletter - Delicious Traditional Foods",
                "content": "Welcome to our test newsletter! We're excited to share our latest traditional homemade delicacies with you.",
                "product_id": product_id
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/admin/newsletter/send",
                headers=self.get_auth_headers(),
                json=newsletter_data
            )
            
            if response.status_code == 200:
                data = response.json()
                campaign_id = data.get("campaign_id")
                recipients_count = data.get("recipients_count", 0)
                
                self.log_result(
                    "Admin Send Newsletter", 
                    True, 
                    f"Successfully sent newsletter to {recipients_count} subscribers",
                    f"Campaign ID: {campaign_id}"
                )
                
                # Check if emails were actually sent (based on response)
                emails_sent = data.get("emails_sent", 0)
                emails_failed = data.get("emails_failed", 0)
                
                if emails_sent > 0:
                    self.log_result(
                        "Newsletter Email Delivery", 
                        True, 
                        f"Successfully sent {emails_sent} emails"
                    )
                elif emails_failed > 0:
                    self.log_result(
                        "Newsletter Email Delivery", 
                        False, 
                        f"Failed to send {emails_failed} emails",
                        "Check Gmail credentials and configuration"
                    )
                else:
                    self.log_result(
                        "Newsletter Email Delivery", 
                        True, 
                        "No active subscribers to send emails to"
                    )
                    
            else:
                self.log_result(
                    "Admin Send Newsletter", 
                    False, 
                    "Failed to send newsletter",
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Admin Send Newsletter", 
                False, 
                "Error sending newsletter",
                str(e)
            )
    
    def test_unauthorized_access(self):
        """Test that admin endpoints require authentication"""
        print("\n=== Testing Unauthorized Access ===")
        
        admin_endpoints = [
            "/admin/newsletter/subscribers",
            "/admin/newsletter/campaigns"
        ]
        
        for endpoint in admin_endpoints:
            try:
                # Test without token
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                
                if response.status_code == 401:
                    self.log_result(
                        f"Unauthorized Access {endpoint}", 
                        True, 
                        "Correctly rejected request without authentication"
                    )
                else:
                    self.log_result(
                        f"Unauthorized Access {endpoint}", 
                        False, 
                        "Should have rejected request without authentication",
                        f"Status: {response.status_code}"
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Unauthorized Access {endpoint}", 
                    False, 
                    "Error testing unauthorized access",
                    str(e)
                )
    
    def run_all_tests(self):
        """Run all newsletter tests"""
        print("🧪 Starting Newsletter API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Admin Email: {ADMIN_EMAIL}")
        print("=" * 60)
        
        # Login as admin first
        if not self.admin_login():
            print("❌ Cannot proceed without admin authentication")
            return False
        
        # Run all tests
        self.test_newsletter_subscribe()
        self.test_duplicate_subscription()
        self.test_email_validation()
        self.test_newsletter_unsubscribe()
        self.test_admin_get_subscribers()
        self.test_admin_get_campaigns()
        self.test_admin_send_newsletter()
        self.test_unauthorized_access()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if "✅ PASS" in r["status"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = NewsletterTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)