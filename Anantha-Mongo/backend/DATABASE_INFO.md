# Backend Database Configuration

## Current Active Database: **MongoDB**

This backend is configured to use **MongoDB** as the database.

### Configuration Files:
- **MongoDB Connection**: `database/connection_mongodb.py`
- **PostgreSQL Connection**: `database/connection_postgresql.py` (Alternative, ready to use)
- **Main Server**: `server.py` (Currently using MongoDB)

### Database Details:
- **MongoDB URL**: Configured in `.env` as `MONGO_URL`
- **Database Name**: `anantha_lakshmi_db`
- **Connection**: Motor AsyncIOMotorClient

### Admin Credentials (Auto-synced from .env):
- **Email**: `ADMIN_EMAIL` from .env (default: admin@ananthalakshmi.com)
- **Password**: `ADMIN_PASSWORD` from .env (default: admin123)
- **Auto-Update**: Yes - Changes in .env automatically update database on server restart

### Switching to PostgreSQL:
If you need to switch to PostgreSQL in the future:
1. Update `database/__init__.py` to use PostgreSQL connection
2. Ensure PostgreSQL is running and configured in `.env`
3. Run `create_tables()` to initialize PostgreSQL schema
4. Update `server.py` to use `ensure_admin_exists_postgresql` instead of `ensure_admin_exists_mongodb`

### Seed Files:
- `seed_states.py` - Seeds Andhra Pradesh & Telangana states
- `seed_cities.py` - Seeds all cities from both states (431 cities)
- `seed_anantha_products.py` - Seeds 58 traditional food products
