# Development Environment Setup Guide

This guide will help you set up your development environment to run the React + Node.js + PostgreSQL application.

## ✅ Prerequisites Installation

### Step 1: Install Node.js and npm

1. **Download Node.js**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version
   - Choose the Windows Installer (.msi)

2. **Install Node.js**
   - Run the installer
   - Follow the installation wizard
   - Accept the default settings
   - Make sure to check "Add to PATH" during installation

3. **Verify Installation**
   - Open a new PowerShell or Command Prompt window
   - Run: `node --version`
   - Run: `npm --version`
   - You should see version numbers for both

### Step 2: Install PostgreSQL

1. **Download PostgreSQL**
   - Visit [postgresql.org/download](https://www.postgresql.org/download/)
   - Click on Windows
   - Download the latest version

2. **Install PostgreSQL**
   - Run the installer
   - Choose installation directory (default is fine)
   - Set a password for the `postgres` superuser (remember this!)
   - Keep port 5432 as default
   - Complete the installation

3. **Verify Installation**
   - PostgreSQL should be running as a service
   - Open PowerShell and run: `psql --version`

4. **Access PostgreSQL**
   - Open PowerShell
   - Run: `psql -U postgres -h localhost`
   - Enter the password you set during installation
   - If successful, you'll see the `postgres=#` prompt

## 🚀 Project Setup

Once you have Node.js and PostgreSQL installed, follow these steps:

### Step 1: Set Up Database

```bash
# Open PowerShell in the project directory
cd C:\Users\india\OneDrive\Desktop\ReactAppWS

# Initialize the database
psql -U postgres -h localhost -f database/init.sql
```

**Note:** You'll be prompted for the postgres password.

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express
- pg (PostgreSQL client)
- dotenv
- cors
- body-parser
- nodemon (dev dependency)

### Step 3: Start Backend Server

```bash
# Still in the backend directory
npm start
```

Expected output:
```
Server is running on http://localhost:5000
```

### Step 4: Install Frontend Dependencies (new terminal)

```bash
cd C:\Users\india\OneDrive\Desktop\ReactAppWS\frontend
npm install
```

This will install:
- react
- react-dom
- axios
- react-scripts

### Step 5: Start Frontend Application (new terminal)

```bash
# Still in the frontend directory
npm start
```

Your browser will automatically open with the application at `http://localhost:3000`

## 📊 Verify Setup is Complete

You should now have:
- ✅ Node.js and npm installed and accessible from command line
- ✅ PostgreSQL running locally
- ✅ Database `react_app_db` created with users table
- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend application running on `http://localhost:3000`

## 🧪 Test the Application

1. **Add a User:**
   - Type a name and email in the form
   - Click "Add User"
   - The new user should appear in the Users List

2. **Delete a User:**
   - Click "Delete" button next to any user
   - Confirm the deletion
   - The user should be removed from the list

## ⚠️ Troubleshooting

### "npm: The term 'npm' is not recognized"
- Node.js may not be installed or not added to PATH
- Restart your terminal/PowerShell after installation
- Or reinstall Node.js, making sure to check "Add to PATH"

### "psql: The term 'psql' is not recognized"
- PostgreSQL may not be in your PATH
- Try using the full path: `C:\Program Files\PostgreSQL\15\bin\psql`
- Or reinstall PostgreSQL with PATH configuration

### "Cannot connect to PostgreSQL"
- Ensure PostgreSQL service is running
- Check Windows Services (services.msc)
- Look for "postgresql-x64-XX" service
- Start it if not running

### "Database already exists" error during setup
```bash
# Drop existing database
psql -U postgres -h localhost -c "DROP DATABASE react_app_db;"

# Then run the init script again
psql -U postgres -h localhost -f database/init.sql
```

### "Port 5000 already in use"
```bash
# Find and kill process on port 5000
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process
```

### "Port 3000 already in use"
- Stop the React development server (press Ctrl+C in the terminal)
- Or close other applications using port 3000

## 📝 Next Steps

- Read the [README.md](./README.md) for API documentation
- Read the [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database details
- Explore the frontend code in `frontend/src/`
- Explore the backend code in `backend/src/`

## 💡 Tips

- Keep terminals organized by using separate windows or tabs
- Use VS Code terminal for better integration
- Use `npm run dev` in backend for automatic restart on changes
- Check browser developer tools (F12) for frontend errors
- Check terminal output for backend errors

## 🆘 Still Having Issues?

1. Check all error messages carefully
2. Verify each prerequisite is properly installed
3. Make sure ports 3000, 5000, and 5432 are available
4. Try restarting your computer
5. Reinstall Node.js or PostgreSQL if issues persist

---

**You're ready to start developing! Happy coding! 🎉**
