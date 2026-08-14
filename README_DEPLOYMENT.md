# Medorc Backend Deployment Guide

This repository contains the Node.js / Express / Prisma API for Medorc.

## Deployment Steps (Render / Railway / AWS / VPS)

### 1. Database Requirement
This backend requires a PostgreSQL database (e.g. Neon.tech, Supabase, or AWS RDS).

Run Prisma migration to set up database tables:
```bash
npx prisma db push
```

### 2. Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://...`) |
| `PORT` | Dynamic port binding provided by host (defaults to `3000`) |
| `JWT_SECRET` | Secret key for JWT signing |
| `CORS_ORIGIN` | Allowed origins (e.g. `https://medorc-frontend.vercel.app` or `*`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |

### 3. Deploying on Render.com
1. Create a new **Web Service** on Render and select this repository.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. Enter the Environment Variables listed above.
