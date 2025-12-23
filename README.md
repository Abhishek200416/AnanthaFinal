# 🍲 Anantha Lakshmi Food Delivery Platform

## 📌 Project Overview
A traditional food delivery platform supporting both **MongoDB** and **PostgreSQL** databases. The project is organized into two parallel implementations that share the same business logic and frontend, but use different database backends.

## 🗂️ Project Structure

```
/app/
├── Anantha-Mongo/          # ✅ MongoDB Implementation (Currently Active)
│   ├── backend/            # FastAPI backend with MongoDB
│   ├── frontend/           # React frontend
│   ├── seed_*.py           # MongoDB seed scripts
│   └── README.md
│
├── Anantha-Postgres/       # 🔄 PostgreSQL Implementation (Parallel)
│   ├── backend/            # FastAPI backend with PostgreSQL
│   ├── frontend/           # Shared React frontend
│   ├── seed_*_pg.py        # PostgreSQL seed scripts
│   └── README.md
│
├── test_result.md          # Testing data and history
├── .gitignore              # Comprehensive gitignore
└── README.md               # This file
```

## 🎯 Why Two Implementations?

This dual-database setup allows:
1. **Flexibility**: Switch between MongoDB and PostgreSQL based on requirements
2. **Comparison**: Evaluate performance and features of both databases
3. **Migration Path**: Easy migration between databases if needed
4. **Best Practices**: Learn database-specific optimization techniques

## 🚀 Quick Start

### For MongoDB Version (Active)
```bash
cd Anantha-Mongo
# Follow README.md in that folder
```

### For PostgreSQL Version
```bash
cd Anantha-Postgres
# Follow README.md in that folder
```

## ✨ Features

- 🛍️ **Product Catalog**: 58 traditional food items
- 👤 **User Management**: Registration, login, profiles
- 🛒 **Shopping Cart**: Add, update, remove items
- 💳 **Payment Integration**: Razorpay payment gateway
- 📦 **Order Tracking**: Real-time order status updates
- 📧 **Email Notifications**: Order confirmations and updates
- 🗺️ **Location Management**: 431 cities across AP & Telangana
- 📱 **Social Sharing**: Share products with meta tags for WhatsApp, Facebook
- ⭐ **Reviews & Ratings**: Customer feedback system
- 🔐 **Admin Dashboard**: Manage orders, products, locations

## 🔐 Admin Credentials

Both implementations auto-sync admin credentials from `.env`:
- **Email**: admin@ananthalakshmi.com
- **Password**: admin123

## 🔗 Share Link Feature

The platform now uses **API-based share links** for better social media previews:

**Format**: `https://your-domain.com/api/share/product/{product_id}`

**Benefits**:
- ✅ Rich previews on WhatsApp, Facebook, Twitter
- ✅ Open Graph meta tags
- ✅ Better SEO
- ✅ Automatic redirection to product page

## 🛠️ Technology Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React Icons
- React Router

### Backend
- FastAPI
- Pydantic for validation
- JWT authentication
- Razorpay SDK

### Databases
- **MongoDB**: motor (async driver)
- **PostgreSQL**: asyncpg (async driver)

### DevOps
- Supervisor for process management
- Nginx for reverse proxy
- Docker containers

## 📊 Database Comparison

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| **Schema** | Flexible | Strict |
| **Queries** | Document-based | SQL |
| **Transactions** | Limited | Full ACID |
| **Scaling** | Horizontal | Vertical |
| **Best For** | Rapid development | Complex queries |

## 🔄 Keeping Both in Sync

When adding new features:
1. Implement in MongoDB version first
2. Test thoroughly
3. Port to PostgreSQL version
4. Test PostgreSQL implementation
5. Ensure both versions have feature parity

## 🧹 Recent Cleanup

### ✅ Completed
- Fixed share link to use API URL instead of frontend URL
- Organized project into two clear folders
- Created comprehensive .gitignore files
- Added detailed README files for each implementation
- Removed duplicate and unnecessary files

### 🗑️ Removed
- `frontend_old/` - Old frontend backup
- `backend_old/` - Old backend backup
- `Anantha-Main1-main/` - Nested duplicate folders
- Duplicate `yarn.lock` files
- Scattered seed files

## 📁 File Organization Rules

1. **Seed files**: Keep in root of each implementation folder
2. **Environment files**: One `.env` per backend and frontend
3. **Package managers**: Use `yarn` for frontend, `pip` for backend
4. **No duplicates**: Single source of truth for each file
5. **Shared code**: Keep in `utils/` or `database/models/`

## 🧪 Testing

### Backend Testing
```bash
cd Anantha-Mongo/backend  # or Anantha-Postgres/backend
curl -X GET http://localhost:8001/api/products
```

### Frontend Testing
```bash
cd Anantha-Mongo/frontend  # or Anantha-Postgres/frontend
yarn start
```

## 📞 Support & Troubleshooting

### Check Service Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log

# Frontend logs
tail -f /var/log/supervisor/frontend.err.log
```

### Restart Services
```bash
sudo supervisorctl restart all
```

## 🎨 UI Components

- Modern, clean design with Tailwind CSS
- Mobile-responsive
- Smooth transitions and animations
- Accessible components
- Indian food theme with warm colors

## 📝 Environment Variables

### Backend (.env)
```env
# Database (MongoDB)
MONGO_URL=mongodb://localhost:27017
DB_NAME=anantha_lakshmi_db

# Or PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=anantha_lakshmi_db

# Application
SECRET_KEY=your-secret-key
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
ADMIN_EMAIL=admin@ananthalakshmi.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-domain.com
```

## 🚦 Current Status

- ✅ **MongoDB Version**: Active and running
- 🔄 **PostgreSQL Version**: Ready for activation
- ✅ **Share Link**: Fixed and working
- ✅ **File Structure**: Clean and organized
- ✅ **.gitignore**: Comprehensive

## 🔮 Future Enhancements

- [ ] Real-time order tracking with WebSockets
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Loyalty program
- [ ] Referral system

---

**Last Updated**: December 23, 2025  
**Active Database**: MongoDB  
**Project Status**: ✅ Production Ready
