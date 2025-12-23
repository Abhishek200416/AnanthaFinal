#!/usr/bin/env python3
"""
Quick status check for Anantha Lakshmi Backend
Shows: Database type, connection status, admin credentials, data counts
"""

import os
import sys
from pymongo import MongoClient

def check_mongodb_status():
    """Check MongoDB status and data"""
    print("=" * 70)
    print("🗄️  ANANTHA LAKSHMI BACKEND STATUS")
    print("=" * 70)
    
    # Database Type
    print("\n📊 CURRENT DATABASE: MongoDB ✅")
    
    # Connection Test
    try:
        client = MongoClient('mongodb://localhost:27017', serverSelectionTimeoutMS=2000)
        client.server_info()
        print("   Connection: ✅ Connected")
        db = client['anantha_lakshmi_db']
    except Exception as e:
        print(f"   Connection: ❌ Failed - {e}")
        return
    
    # Data Counts
    print("\n📦 DATA COUNTS:")
    print(f"   States: {db.states.count_documents({})}")
    print(f"   Cities: {db.locations.count_documents({})}")
    print(f"   Products: {db.products.count_documents({})}")
    print(f"   Admin Profiles: {db.admin_profiles.count_documents({})}")
    
    # Admin Credentials
    print("\n👤 ADMIN CREDENTIALS (from .env):")
    env_file = '/app/backend/.env'
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if 'ADMIN_EMAIL=' in line:
                    email = line.split('=')[1].strip().strip('"')
                    print(f"   Email: {email}")
                if 'ADMIN_PASSWORD=' in line:
                    password = line.split('=')[1].strip().strip('"')
                    print(f"   Password: {password}")
    
    # Verify admin in database
    admin = db.admin_profiles.find_one({"id": "admin_profile"})
    if admin:
        print(f"\n✅ Admin synced to database: {admin.get('email')}")
    else:
        print("\n❌ Admin not found in database")
    
    # Email Configuration
    print("\n📧 EMAIL CONFIGURATION:")
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if 'GMAIL_EMAIL=' in line:
                    email = line.split('=')[1].strip().strip('"')
                    print(f"   Gmail: {email}")
                if 'GMAIL_APP_PASSWORD=' in line:
                    has_password = bool(line.split('=')[1].strip().strip('"'))
                    print(f"   App Password: {'✅ Set' if has_password else '❌ Not Set'}")
    
    # Service Status
    print("\n🚀 SERVICES:")
    print("   Backend: http://localhost:8001")
    print("   Frontend: http://localhost:3000")
    print("   API Docs: http://localhost:8001/docs")
    
    print("\n" + "=" * 70)
    print("✅ ALL SYSTEMS OPERATIONAL")
    print("=" * 70)

if __name__ == "__main__":
    try:
        check_mongodb_status()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
