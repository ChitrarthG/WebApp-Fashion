# PostgreSQL Database Setup

## Prerequisites
- PostgreSQL installed and running on your system
- PostgreSQL command-line tool (`psql`) available

## Setup Instructions

### 1. Create the Database

On **Windows**, open PowerShell or Command Prompt and run:
```bash
psql -U postgres -h localhost
```

This will open the PostgreSQL interactive terminal. Then run:
```sql
CREATE DATABASE react_app_db;
```

### 2. Initialize the Database Schema

You have two options:

#### Option A: Using the SQL Script (Recommended)
```bash
psql -U postgres -d react_app_db -h localhost -f database/init.sql
```

#### Option B: Manual SQL Execution
```bash
psql -U postgres -d react_app_db -h localhost
```

Then copy and paste the SQL commands from `database/init.sql`

### 3. Verify the Setup

Connect to the database:
```bash
psql -U postgres -d react_app_db -h localhost
```

Run this query to verify the users table:
```sql
\dt
SELECT * FROM users;
```

## Environment Variables

Make sure your backend `.env` file has the correct database credentials:

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=react_app_db
```

**Note:** Change the `DB_PASSWORD` if your PostgreSQL password is different.

## Resetting the Database

To reset the database and start fresh:

```bash
psql -U postgres -h localhost -c "DROP DATABASE react_app_db;"
psql -U postgres -h localhost -f database/init.sql
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check that the host, port, and credentials are correct

### Authentication Failed
- Verify the password in your `.env` file
- Check PostgreSQL user permissions

### Database Already Exists
- Drop the existing database first:
```bash
psql -U postgres -h localhost -c "DROP DATABASE react_app_db;"
```
