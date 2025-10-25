# Database Setup Instructions

## Problem
The error `The table main.events does not exist` means the database file exists but has no schema/tables.

## Solution

### Option 1: Using the Helper Script (Recommended)

Run the initialization script:
```bash
node scripts/init-db.js
```

### Option 2: Manual Setup (If Option 1 Fails)

#### Step 1: Set Environment Variable

**Windows Command Prompt:**
```cmd
set DATABASE_URL=file:./dev.db
set PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="file:./dev.db"
$env:PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING="1"
```

**Linux/Mac:**
```bash
export DATABASE_URL="file:./dev.db"
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

#### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

#### Step 3: Create Database Schema
```bash
npx prisma db push
```

#### Step 4: Seed Database with Sample Data
```bash
npm run db:seed
```

#### Step 5: Start Development Server
```bash
npm run dev
```

## Verification

After completing the steps above, you should be able to:
1. Visit http://localhost:3000
2. Navigate to any page (Services, Events, etc.) without errors
3. Login with admin credentials:
   - Email: `admin@ton-platform.vn`
   - Password: `admin123`

## Troubleshooting

### If you get "403 Forbidden" errors:
This is a network issue with Prisma binaries. The `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` environment variable should fix it.

### If Prisma commands fail:
1. Delete `node_modules/.prisma` folder
2. Run `npm install` again
3. Try the setup steps again

### If database is locked:
1. Stop the dev server (Ctrl+C)
2. Delete `dev.db` file
3. Run setup steps again

## Database Schema

The database will be created with the following tables:
- users
- organizations
- events
- products (merchandise)
- services
- orders
- tickets
- workspaces
- notifications
- calendar_events
- mentor_sessions
- discount_codes
- And more...

## Sample Data

After seeding, you'll have:
- 1 Admin user
- 20 Test users (students, partners, mentors)
- 5 Organizations
- 30 Events (TEDx and workshops)
- 30 Products
- 20 Services
- Sample orders, tickets, and workspace data

## Need Help?

If you continue to have issues:
1. Make sure `.env` file exists with `DATABASE_URL=file:./dev.db`
2. Make sure you're in the project root directory
3. Try deleting `dev.db` and running setup again
4. Check that Node.js and npm are properly installed
