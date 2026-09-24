# Medorc Backend API Server

Main API server for the **Medorc Platform**. Built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

---

## 🚀 Features

* **JWT Authentication**: Role-based access control (`patient`, `doctor`, `hospital`, `extern`).
* **Prisma ORM & PostgreSQL**: Database schema management with Neon PostgreSQL.
* **Patient Management**: Health profile, blood group tracking, emergency contacts, data access logs.
* **Medical Records**: Digital medical history records, surgery details, hospitalization records, and document attachments.
* **Signed Cloudinary Uploads**: Backend endpoint for uploading patient profile photos and verification documents securely.
* **Daily Health Tips**: REST API serving curated health and wellness tips.

---

## 🌱 Demo Data Seeding

To populate the database with complete demo datasets for all 4 roles (Patient, Doctor, Hospital, External Viewer):

```bash
npm run seed:demo
```

This seeds:
- **Patient**: `ilakkiyanj.pt@medorc.in` / `password123`
- **Doctor**: `dr.ananya@medorc.in` / `password123`
- **Hospital**: `apollo@medorc.in` / `password123`
- **External Viewer**: `diagnostic@medorc.in` / `password123`
- Emergency contacts, comprehensive medical records, surgery & hospitalization details.

---

## 🛠 Local Setup

```bash
npm install
npx prisma db push
npx prisma generate
npm run dev
```

Refer to `.env.example` for environment variable names.
