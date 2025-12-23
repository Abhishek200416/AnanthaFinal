# 🗄️ BACKEND DATABASE GUIDE

## 📋 Overview
This backend supports **TWO DATABASE OPTIONS**:
1. **MongoDB** (Currently Active) ✅
2. **PostgreSQL** (Ready for Use) 🔄

---

## 🟢 CURRENT SETUP: MongoDB

### ✅ Active Configuration
- **Connection File**: `database/connection_mongodb.py`
- **Database**: `anantha_lakshmi_db`
- **Server File**: `server.py` (using MongoDB)
- **Status**: **RUNNING** ✅

### 📊 Current Database Contents
- **States**: 2 (Andhra Pradesh, Telangana)
- **Cities**: 431 locations
- **Products**: 58 traditional food items
- **Admin Profile**: Auto-synced from .env

### 🔐 Admin Credentials (Auto-Sync from .env)
```env
ADMIN_EMAIL="admin@ananthalakshmi.com"
ADMIN_PASSWORD="admin123"
```
**Auto-Update**: ✅ Yes
- Credentials automatically sync from `.env` file on server restart
- Change `.env` → Restart backend → Database updates automatically

### 📁 Seed Files (Already Run)
1. `seed_states.py` - Andhra Pradesh & Telangana
2. `seed_cities.py` - 431 cities from both states
3. `seed_anantha_products.py` - 58 products

---

## 🔵 ALTERNATIVE: PostgreSQL (Ready but Not Active)

### 📦 What's Ready
- **Connection File**: `database/connection_postgresql.py` ✅
- **Table Schemas**: Fully defined ✅
- **Admin Manager**: `utils/admin_manager.py` has `ensure_admin_exists_postgresql()` ✅
- **Auto-Sync**: ✅ Same .env-based credential sync

### 🔄 How to Switch to PostgreSQL

#### Step 1: Start PostgreSQL Service
```bash
sudo service postgresql start
```

#### Step 2: Configure .env
```env
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your_password"
POSTGRES_DB="anantha_lakshmi_db"
```

#### Step 3: Update database/__init__.py
Change priority to load PostgreSQL first:
```python
# PostgreSQL connection (primary)
try:
    from .connection_postgresql import (
        init_db_pool,
        get_db_pool,
        close_db_pool,
        create_tables
    )
    DATABASE_TYPE = "postgresql"
except Exception as e:
    print(f"PostgreSQL connection not available: {e}")
    DATABASE_TYPE = None

# MongoDB connection (fallback)
if DATABASE_TYPE is None:
    try:
        from .connection_mongodb import get_database, get_client
        DATABASE_TYPE = "mongodb"
    except Exception as e:
        print(f"MongoDB connection not available: {e}")
```

#### Step 4: Update server.py
Find this line (around line 28):
```python
from utils.admin_manager import ensure_admin_exists_mongodb
```

Replace with:
```python
from utils.admin_manager import ensure_admin_exists_postgresql
```

And update the startup event (around line 79):
```python
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting Anantha Lakshmi API Server (PostgreSQL)")
    
    # Initialize PostgreSQL
    from database import init_db_pool, create_tables
    await init_db_pool()
    await create_tables()
    
    # Ensure admin exists (from .env)
    pool = await get_db_pool()
    await ensure_admin_exists_postgresql(pool)
    
    logger.info("✅ Server startup completed successfully")
```

#### Step 5: Create PostgreSQL Seed Files
You'll need to create PostgreSQL versions of seed files that use `asyncpg` instead of `motor`:

**seed_states_pg.py** (PostgreSQL version)
**seed_cities_pg.py** (PostgreSQL version)
**seed_products_pg.py** (PostgreSQL version)

#### Step 6: Run Seeds & Restart
```bash
python seed_states_pg.py
python seed_cities_pg.py
python seed_products_pg.py
sudo supervisorctl restart backend
```

---

## 🔄 Keeping Both Databases in Sync

### For Future Updates:
When you update server logic:

1. **MongoDB Changes**: Update current `server.py`
2. **PostgreSQL Changes**: Update the same `server.py` (it's designed to work with both)

### Database-Specific Code:
- Use `database/__init__.py` to detect which database is active
- Write conditional logic if needed:

```python
from database import DATABASE_TYPE

if DATABASE_TYPE == "mongodb":
    # MongoDB-specific code
    pass
elif DATABASE_TYPE == "postgresql":
    # PostgreSQL-specific code
    pass
```

---

## 🎯 Quick Reference

### Check Current Database
```python
from database import DATABASE_TYPE
print(f"Current database: {DATABASE_TYPE}")
```

### Test Admin Login
```bash
curl -X POST http://localhost:8001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ananthalakshmi.com", "password": "admin123"}'
```

### Verify Data
```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017')
db = client['anantha_lakshmi_db']

print("States:", db.states.count_documents({}))
print("Cities:", db.locations.count_documents({}))
print("Products:", db.products.count_documents({}))
```

---

## 📞 Need Help?

- **MongoDB Issues**: Check `database/connection_mongodb.py`
- **PostgreSQL Issues**: Check `database/connection_postgresql.py`
- **Admin Sync Issues**: Check `utils/admin_manager.py`
- **Server Issues**: Check logs at `/var/log/supervisor/backend.err.log`

---

**Last Updated**: 2025-12-23
**Current Database**: MongoDB ✅
**Backend Status**: Running on port 8001
