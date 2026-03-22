# Quick Start Guide

Once you have Node.js and PostgreSQL installed, use this guide to run the application.

## One-Time Setup (First Time Only)

```bash
# 1. Navigate to the project directory
cd C:\Users\india\OneDrive\Desktop\ReactAppWS

# 2. Initialize the database
psql -U postgres -h localhost -f database/init.sql

# 3. Install backend dependencies
cd backend
npm install

# 4. Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd C:\Users\india\OneDrive\Desktop\ReactAppWS\backend
npm start
```

Expected: `Server is running on http://localhost:5000`

### Terminal 2: Start Frontend Application

```bash
cd C:\Users\india\OneDrive\Desktop\ReactAppWS\frontend
npm start
```

Expected: Browser opens with app at `http://localhost:3000`

## Available URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints Quick Reference

```
GET    /api/users          - Get all users
GET    /api/users/:id      - Get user by ID
POST   /api/users          - Create new user
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user
GET    /api/health         - Server health check
```

## Common Commands

```bash
# Backend development with auto-reload
npm run dev

# Frontend build for production
npm run build

# Stop server
Ctrl + C

# Check port usage (if getting "port already in use")
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

## Stopping Everything

1. In Backend Terminal: Press `Ctrl + C`
2. In Frontend Terminal: Press `Ctrl + C`
3. PostgreSQL service continues running (this is fine)

## Reset Database

```bash
psql -U postgres -h localhost -c "DROP DATABASE react_app_db;"
psql -U postgres -h localhost -f database/init.sql
```

---

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
