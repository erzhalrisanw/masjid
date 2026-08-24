# CMS Masjid Sayyidina Abubakar

Sistem Manajemen Konten (CMS) untuk Masjid Sayyidina Abubakar, fokus pada Manajemen Keuangan dan Manajemen Pengguna.

## Tech Stack

- **Frontend**: React + TypeScript, Vite, TailwindCSS, React Router, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Autentikasi**: JWT (Access + Refresh Token)

## Struktur Proyek

```
masjid/
├── backend/    # API Server (Express + Prisma)
├── frontend/   # Web UI (React + Vite)
└── package.json
```

## Persiapan

Butuh: Node.js 20+, PostgreSQL 14+, npm 10+.

### 1. Install dependencies

```bash
npm install
```

### 2. Setup database

Buat database PostgreSQL, lalu salin `.env.example` menjadi `.env` di folder `backend/` dan sesuaikan.

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL
npx prisma migrate dev
npx prisma db seed
```

### 3. Jalankan development server

```bash
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

## Kredensial default (seed)

- Email: `admin@masjid.local`
- Password: `admin123`

## Modul

### User Management
- Registrasi & login jamaah
- Peran (roles): Super Admin, Bendahara, Pengurus, Jamaah
- CRUD pengguna oleh admin

### Finance Management
- Kas masuk: Infaq, Sedekah, Zakat, Donasi
- Kas keluar: dengan kategori
- Laporan bulanan & saldo real-time
