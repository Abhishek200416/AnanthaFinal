# 🍲 Anantha Lakshmi Food Delivery - PostgreSQL Version

## 📌 Overview
This is the **PostgreSQL implementation** of the Anantha Lakshmi traditional food delivery platform. This version uses PostgreSQL for data storage and is maintained in parallel with the MongoDB version.

## 🏗️ Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React (Shared with MongoDB version)
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Payment**: Razorpay
- **Email**: Gmail SMTP

## 📁 Project Structure
```
Anantha-Postgres/
├── backend/
│   ├── server.py              # Main FastAPI server
│   ├── auth.py                # Authentication logic
│   ├── email_service.py       # Email notifications
│   ├── gmail_service.py       # Gmail integration
│   ├── cities_data.py         # City/location data
│   ├── distance_calculator.py # Distance calculations
│   ├── database/
│   │   ├── connection_postgresql.py
│   │   └── models/            # Pydantic models
│   ├── utils/
│   │   ├── helpers.py
│   │   └── admin_manager.py
│   ├── requirements.txt
│   └── .env
├── frontend/                  # Shared with MongoDB version
├── seed_states_pg.py          # Seed states (PostgreSQL)
├── seed_cities_pg.py          # Seed cities (PostgreSQL)
├── seed_all_cities_pg.py      # Seed all cities (PostgreSQL)
├── seed_anantha_products_pg.py # Seed products (PostgreSQL)
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
pip install asyncpg  # PostgreSQL async driver
```

**Frontend:**
```bash
cd frontend
yarn install
```

### 2. Start PostgreSQL
```bash
sudo service postgresql start
```

### 3. Create Database
```bash
sudo -u postgres psql
CREATE DATABASE anantha_lakshmi_db;
\q
```

### 4. Configure Environment Variables

**Backend (.env):**
```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=anantha_lakshmi_db

# Application Configuration
SECRET_KEY=your-secret-key-here
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
ADMIN_EMAIL=admin@ananthalakshmi.com
ADMIN_PASSWORD=admin123
```

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

### 5. Update server.py for PostgreSQL

In `backend/server.py`, ensure the startup event uses PostgreSQL:

```python
from utils.admin_manager import ensure_admin_exists_postgresql

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

### 6. Seed the Database
```bash
python seed_states_pg.py
python seed_all_cities_pg.py
python seed_anantha_products_pg.py
```

### 7. Start Services

**Backend:**
```bash
cd backend
sudo supervisorctl restart backend
```

**Frontend:**
```bash
cd frontend
sudo supervisorctl restart frontend
```

## 🔐 Admin Access
Admin credentials are automatically synced from the `.env` file:
- **Email**: admin@ananthalakshmi.com
- **Password**: admin123

To update admin credentials:
1. Edit `backend/.env` file
2. Restart backend: `sudo supervisorctl restart backend`
3. Credentials will auto-update in PostgreSQL

## 🗄️ Database Tables

- **users**: Customer accounts
- **admins**: Admin accounts (auto-synced from .env)
- **products**: Food products
- **orders**: Customer orders
- **states**: Available states (AP, Telangana)
- **locations**: 431 cities/towns
- **reviews**: Product reviews

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/share/product/{id}` - Share product with meta tags

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/{user_id}` - Get user orders
- `GET /api/orders/admin` - Get all orders (admin)

### Locations
- `GET /api/states` - List states
- `GET /api/cities` - List cities
- `POST /api/cities` - Request new city

## 🧪 Testing
```bash
# Check PostgreSQL connection
psql -U postgres -d anantha_lakshmi_db -c "\dt"

# Backend testing
curl -X GET http://localhost:8001/api/products

# Admin login test
curl -X POST http://localhost:8001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ananthalakshmi.com", "password": "admin123"}'
```

## 📱 Features
- ✅ User authentication & registration
- ✅ Admin dashboard
- ✅ Product catalog with 58 traditional food items
- ✅ Shopping cart & checkout
- ✅ Razorpay payment integration
- ✅ Order tracking
- ✅ Email notifications
- ✅ City/location management
- ✅ Distance-based delivery charges
- ✅ Product reviews & ratings
- ✅ Social media sharing with meta tags

## 🔄 Sync with MongoDB Version
This PostgreSQL version is kept in parallel with the MongoDB version in `../Anantha-Mongo/`. When making feature updates:
1. Update code in both versions
2. Test both databases independently
3. Maintain feature parity

## 📊 PostgreSQL Advantages
- ACID compliance for data integrity
- Complex queries with JOINs
- Better for relational data
- Strong consistency guarantees
- Transaction support

## 📞 Support
For issues or questions:
- Check logs: `/var/log/supervisor/backend.err.log`
- PostgreSQL connection: `backend/database/connection_postgresql.py`
- Admin sync: `backend/utils/admin_manager.py`
- PostgreSQL logs: `/var/log/postgresql/postgresql-*.log`

---

**Last Updated**: December 23, 2025  
**Status**: 🔄 Ready for Activation  
**Database**: PostgreSQL
