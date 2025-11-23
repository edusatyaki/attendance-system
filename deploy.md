# Deployment Guide (Vercel)

Since this is a Next.js application, the easiest way to deploy it "for all" is using **Vercel**.

## Prerequisites
1.  A GitHub account.
2.  A Vercel account (can sign up with GitHub).

## Steps

### 1. Push Code to GitHub
First, you need to push your code to a GitHub repository.
```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub, then run:
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel
1.  Go to [vercel.com](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    -   **Framework Preset**: Next.js (should be auto-detected).
    -   **Root Directory**: `./` (default).
    -   **Environment Variables**:
        -   Since we are using `better-sqlite3` (SQLite) which writes to a local file, it **WILL NOT PERSIST** correctly on serverless platforms like Vercel (data will be lost on every redeploy/restart).
        -   **FOR PRODUCTION**: You should switch to a cloud database like **PostgreSQL** (e.g., Vercel Postgres, Neon, Supabase) or **MySQL**.
        -   **FOR DEMO ONLY**: You can try deploying as is, but data won't persist reliably.

### 3. Database Migration (Critical for Production)
To make this "live for all" with persistent data, you need a cloud database.
1.  **Install a Postgres driver**: `npm install pg` (and remove `better-sqlite3`).
2.  **Update `src/lib/db.ts`** to connect to your cloud DB URL.
3.  **Set `DATABASE_URL`** in Vercel Environment Variables.

## Alternative: VPS Deployment (DigitalOcean, AWS EC2)
If you want to keep using SQLite:
1.  Rent a VPS (Virtual Private Server).
2.  Install Node.js and PM2.
3.  Clone repo, run `npm run build`, then `pm2 start npm --name "attendance-app" -- start`.
4.  This keeps the `attendance.db` file on the server disk, preserving data.


