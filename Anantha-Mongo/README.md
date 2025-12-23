# 🍲 Anantha Lakshmi Food Delivery - MongoDB Version

## 📌 Overview
This is the **MongoDB implementation** of the Anantha Lakshmi traditional food delivery platform. This version uses MongoDB for data storage and is currently the active implementation.

## 🏗️ Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Payment**: Razorpay
- **Email**: Gmail SMTP

## 📁 Project Structure
```
Anantha-Mongo/
├── backend/
│   ├── server.py              # Main FastAPI server
│   ├── auth.py                # Authentication logic
│   ├── email_service.py       # Email notifications
│   ├── gmail_service.py       # Gmail integration
│   ├── cities_data.py         # City/location data
│   ├── distance_calculator.py # Distance calculations
│   ├── database/
│   │   ├── connection_mongodb.py
│   │   └── models/            # Pydantic models
│   ├── utils/
│   │   ├── helpers.py
│   │   └── admin_manager.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── .env
├── seed_states.py            # Seed states data
├── seed_cities.py            # Seed cities data
├── seed_all_cities.py        # Seed all cities at once
├── seed_anantha_products.py  # Seed products
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
yarn install
```

### 2. Start MongoDB
```bash
sudo service mongodb start
```

### 3. Configure Environment Variables

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=anantha_lakshmi_db
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

### 4. Seed the Database
```bash
python seed_states.py
python seed_all_cities.py
python seed_anantha_products.py
```

### 5. Start Services

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
3. Credentials will auto-update in MongoDB

## 🗄️ Database Collections

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

## 🔄 Sync with PostgreSQL Version
This MongoDB version is kept in parallel with the PostgreSQL version in `../Anantha-Postgres/`. When making feature updates:
1. Update code in both versions
2. Test both databases independently
3. Maintain feature parity

## 📞 Support
For issues or questions:
- Check logs: `/var/log/supervisor/backend.err.log`
- MongoDB connection: `backend/database/connection_mongodb.py`
- Admin sync: `backend/utils/admin_manager.py`

---

**Last Updated**: December 23, 2025  
**Status**: ✅ Active & Running  
**Database**: MongoDB
