# Backend Setup Guide

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Turso connection details and secrets

   ```bash
   cp .env.local.example .env.local
   ```

3. **Configure Turso Database**
   - The database is already configured with the provided credentials
   - Database URL: `libsql://ccd-garenov.aws-eu-west-1.turso.io`
   - Schema has been pushed to Turso

4. **Push Database Schema** (if needed)
   ```bash
   bun run db:push
   ```

## API Endpoints

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Purchases

#### Create Purchase
```bash
POST /api/purchases
Authorization: Bearer {token}
Content-Type: application/json

{
  "planName": "PREMIUM",
  "price": 999,
  "devices": 2,
  "years": 1,
  "currency": "Kč",
  "transactionId": "TXN123456"
}
```

#### Get User Purchases
```bash
GET /api/purchases
Authorization: Bearer {token}
```

## Admin Dashboard

Access the admin panel at `/admin`

**Admin Key:** Set via `ADMIN_KEY` in `.env.local`

### Features:
- View all registered users
- View all purchases with details
- Statistics (total users, revenue, purchases by plan)
- User and purchase details

## Database Schema

### Users Table
- `id` (Integer, primary key, auto-increment)
- `name` (Text, required)
- `email` (Text, required, unique)
- `password` (Text, hashed with bcrypt)
- `phone` (Text, optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Purchases Table
- `id` (Integer, primary key, auto-increment)
- `userId` (Integer, foreign key to users)
- `planName` (Text: ESSENTIAL, PREMIUM, ULTIMATE)
- `price` (Integer, required)
- `currency` (Text, default: "Kč")
- `devices` (Integer, default: 1)
- `years` (Integer, default: 1)
- `status` (Text: pending, completed, cancelled, default: pending)
- `transactionId` (Text, optional)
- `purchaseDate` (Timestamp)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Technology Stack

- **Database:** Turso (SQLite-based edge database)
- **ORM:** Drizzle ORM
- **Runtime:** Node.js (Bun-compatible)
- **Authentication:** JWT with bcryptjs
- **Framework:** Next.js 15.5.4

## Security Notes

1. **Change the Admin Key** in `.env.local`
2. **Use strong JWT_SECRET** in production
3. **Turso Auth Token** - Keep your auth token secure
4. **Use HTTPS** in production
5. **Implement rate limiting** for API endpoints
6. **Password hashing** - Automatically handled by bcryptjs

## Development Commands

### Start Development Server
```bash
npm run dev
# or
bun run dev
```

### Push Database Schema
```bash
bun run db:push
```

### Open Drizzle Studio (Database GUI)
```bash
bun run db:studio
```

### Build for Production
```bash
npm run build
```

## Testing with PowerShell

### Register
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test User","email":"test@example.com","password":"password123","phone":"1234567890"}' `
  | Select-Object -ExpandProperty Content
```

### Login
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"password123"}' `
  | Select-Object -ExpandProperty Content
```

### Create Purchase
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-WebRequest -Uri "http://localhost:3000/api/purchases" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} `
  -Body '{"planName":"PREMIUM","price":999,"devices":2,"years":1}' `
  | Select-Object -ExpandProperty Content
```

### Admin Data
```powershell
$adminKey = "YOUR_ADMIN_KEY_HERE"
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/data" `
  -Method GET `
  -Headers @{"x-admin-key"=$adminKey} `
  | Select-Object -ExpandProperty Content
```

## Migration from MongoDB

This backend has been migrated from MongoDB to Turso. Key changes:
- Mongoose models → Drizzle schema
- MongoDB connection → Turso client
- Mongoose queries → Drizzle ORM queries
- Mongoose middleware → Manual bcrypt hashing

See the migration walkthrough for detailed information.
