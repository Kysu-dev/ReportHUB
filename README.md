# InfraAlert – Tugas Evaluasi 2 Komputasi Awan

**Nama**  : Raelqiansyah Putranta Dibrata  
**NRP**   : 152023167  
**Mata kuliah** : IFB-452 Komputasi Awan  
**Tugas** : Tugas Evaluasi 2

---

## Deskripsi Singkat

InfraAlert adalah aplikasi pelaporan kerusakan infrastruktur kota (jalan berlubang, lampu mati, dll).  
Fitur utama:

- Registrasi & login warga
- Dashboard warga (citizen) dan admin
- Submit laporan dengan upload foto ke **Cloudinary**
- Tracking status laporan (pending, in progress, resolved)
- Manajemen laporan oleh admin

---

## Arsitektur AWS (ECS + ALB + RDS)

- **Frontend**: Next.js, dibuild ke image Docker dan dijalankan di **Amazon ECS (Fargate)**.
- **Backend**: Go + Gin, juga dijalankan sebagai container di **ECS (Fargate)**.
- **Database**: **Amazon RDS for MySQL** (private subnet).
- **Load Balancer**: **Application Load Balancer (ALB)** dengan 2 target group:
  - `tg-frontend` (port 3000) untuk Next.js
  - `tgbackend` (port 8080) untuk Go backend
- **Routing ALB**:
  - Path `/api/*` → `tgbackend` → backend
  - Default (`/`) → `tg-frontend` → frontend
- **Cloudinary**: digunakan untuk menyimpan file gambar laporan.

Frontend mengakses backend melalui base URL:

- `NEXT_PUBLIC_API_URL=/api` (relative ke ALB)

---

## Konfigurasi Environment Penting

### Backend (container ECS / lokal)

Wajib diset:

- `DB_HOST` – endpoint RDS, contoh: `databaserael.cgxgc8wsgidd.us-east-1.rds.amazonaws.com`
- `DB_PORT` – `3306`
- `DB_USER` – `admin`
- `DB_PASSWORD` – `adminadmin`
- `DB_NAME` – `infraalert`
- `JWT_SECRET` – misal `superdupersecretkey`

Untuk Cloudinary:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend

- `NEXT_PUBLIC_API_URL=/api`

Diset sebagai build arg saat `docker build` dan/atau environment di ECS task definition.

---

## Akun Admin (Seed)

Aplikasi otomatis membuat akun admin default di database (RDS) saat backend berjalan.

**Data akun admin default:**

- Email  : `admin@gmail.com`
- Password : `admin123`

