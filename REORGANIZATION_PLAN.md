# 🗂️ PROJECT REORGANIZATION PLAN

## 📌 Current Issues
1. ❌ Share link using frontend URL instead of API URL
2. ❌ Multiple duplicate folders (frontend_old, backend_old, Anantha-Main1-main)
3. ❌ Scattered seed files (root + backend folders)
4. ❌ Confusing structure with nested folders
5. ❌ Missing comprehensive .gitignore

## 🎯 Target Structure

```
/app/
├── Anantha-Mongo/          # MongoDB Implementation (Current Active)
│   ├── backend/
│   │   ├── database/
│   │   │   ├── connection_mongodb.py
│   │   │   └── models/
│   │   ├── utils/
│   │   ├── server.py
│   │   ├── auth.py
│   │   ├── email_service.py
│   │   ├── gmail_service.py
│   │   ├── cities_data.py
│   │   ├── distance_calculator.py
│   │   ├── requirements.txt
│   │   └── .env
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── .env
│   ├── seed_states.py
│   ├── seed_cities.py
│   ├── seed_all_cities.py
│   ├── seed_anantha_products.py
│   ├── README.md
│   └── .gitignore
│
├── Anantha-Postgres/       # PostgreSQL Implementation (Parallel)
│   ├── backend/
│   │   ├── database/
│   │   │   ├── connection_postgresql.py
│   │   │   └── models/
│   │   ├── utils/
│   │   ├── server_pg.py
│   │   ├── auth.py
│   │   ├── email_service.py
│   │   ├── gmail_service.py
│   │   ├── cities_data.py
│   │   ├── distance_calculator.py
│   │   ├── requirements.txt
│   │   └── .env
│   ├── frontend/          # Shared frontend
│   ├── seed_states_pg.py
│   ├── seed_cities_pg.py
│   ├── seed_all_cities_pg.py
│   ├── seed_anantha_products_pg.py
│   ├── README.md
│   └── .gitignore
│
├── test_result.md
└── README.md
```

## ✅ Tasks Completed
- [x] Fixed share link in ShareModal.js to use API URL

## 📋 Tasks To Do
1. Create Anantha-Mongo folder structure
2. Create Anantha-Postgres folder structure
3. Copy and organize files appropriately
4. Update .gitignore files
5. Remove old/duplicate folders
6. Update README files
7. Test both setups
