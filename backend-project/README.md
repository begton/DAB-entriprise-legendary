# HRMS Backend

1. Import the SQL file into XAMPP/MySQL (phpMyAdmin) or run from command line:

```sql
-- In mysql CLI or phpMyAdmin import
SOURCE hrms.sql;
```

2. Copy `.env.example` to `.env` and set DB credentials.

3. Install dependencies and start server:

```bash
cd backend-project
npm install
npm run start
```

Server runs on `http://localhost:4000` and exposes endpoints under `/api`.

Notes:
- Default demo user: `admin` / `password123` (linked to sample employee). Replace with real hashing in production.
