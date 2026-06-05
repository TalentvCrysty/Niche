# Niche Agency Project Setup

This guide explains how to set up and run the Niche Agency application, which consists of a Next.js frontend and an Express.js backend.

## Prerequisites
- Node.js installed
- Bun (recommended) or npm installed

## Project Structure
- `/` - Frontend (Next.js)
- `/backend` - Backend (Express.js + SQLite)

## Setup Instructions (Development)

### 1. Backend Setup (Run this first)

The backend handles authentication, database (SQLite), and file uploads.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. (Optional) Create a `.env` file in the `backend` directory if you want to override defaults:
   ```env
   PORT=3005
   JWT_SECRET=your-secure-secret-key
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-pass
   LEADS_FROM_EMAIL=hello@yourdomain.com
   LEADS_NOTIFY_EMAIL=team@yourdomain.com
   ```
   *Defaults: Port 3005, JWT_SECRET is dev default.*

4. Start the backend server:
   ```bash
   bun run --hot server.js
   # or
   node server.js
   ```
   The server will run on `http://localhost:3005`.

### 2. Frontend Setup

The frontend is a Next.js application.

1. Open a new terminal and make sure you are in the project root.

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Create or verify the `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3005
   ```

4. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Production Deployment

Since this project uses **SQLite** (a file-based database) and local filesystem storage for image uploads, the architecture assumes persistent disk storage.

### Option 1: VPS / Dedicated Server (Recommended)
Hosting on a VPS (like DigitalOcean, AWS EC2, Hetzner, or generic Linux hosting) is the most robust method for this stack.

#### 1. Backend Deployment
1. Upload the `backend` folder to your server.
2. Install dependencies:
   ```bash
   cd backend
   bun install --production
   ```
3. Set environment variables (create a `.env` file):
   ```env
   NODE_ENV=production
   PORT=3005
   JWT_SECRET=your-strong-random-secret
   ```
4. Use a process manager like **PM2** to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "niche-backend"
   pm2 save
   ```

#### 2. Frontend Deployment
1. Upload the root files (excluding `backend`).
2. Install dependencies:
   ```bash
   bun install
   ```
3. **Build the application**:
   *Important: Environment variables must be set BEFORE building.*
   ```bash
   # Linux/Mac
   export NEXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
   bun run build
   
   # Windows (PowerShell)
   $env:NEXT_PUBLIC_BACKEND_URL="https://your-api-domain.com"
   bun run build
   ```
4. Start the production server:
   ```bash
   pm2 start npm --name "niche-frontend" -- start
   ```

### Option 2: Separate Hosting (Vercel + Railway/Render)
If you prefer deploying the frontend to **Vercel**, you must host the backend separately on a service that supports **persistent storage** (Volumes).

1. **Backend**: Deploy the `backend` folder to a service like **Railway** or **Render**.
   *   **Crucial**: You MUST configure a **Persistent Volume** (Disk) for `/backend/database.sqlite` and `/backend/uploads`. If you don't, your data will be wiped every time the server restarts.

2. **Frontend**: Deploy the root folder to **Vercel**.
   *   Add the Environment Variable `NEXT_PUBLIC_BACKEND_URL` in your Vercel Project Settings pointing to your live backend (e.g., `https://niche-backend.railway.app`).

## Environment Variables Reference

| Component | Variable | Description | Default |
|-----------|----------|-------------|---------|
| **Frontend** | `NEXT_PUBLIC_BACKEND_URL` | URL where the backend API is running | `http://localhost:3005` |
| **Backend** | `PORT` | Port for the backend server | `3005` |
| **Backend** | `JWT_SECRET` | Secret key for session tokens | `your-secret-key...` |

## Troubleshooting
- **Database**: The backend uses a local SQLite file (`database.sqlite`). If you encounter DB errors, ensuring the backend folder has write permissions usually fixes it.
- **Images**: Uploaded images are stored in `backend/uploads`. Ensure this directory exists (the server creates it automatically on start).

<!-- pr-bot-update: 2026-06-05T04:02:58.154Z -->
