# 📦 Smart Life — Hướng dẫn cài đặt v2.0

> **Yêu cầu hệ thống tối thiểu:**
>
> - [Node.js](https://nodejs.org/) ≥ 18 + npm ≥ 9
> - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (thay thế cài PostgreSQL thủ công)
> - Git

---

## Mục lục

1. [Clone repository](#1-clone-repository)
2. [Tạo file `.env`](#2-tạo-file-env)
3. [Khởi động Database qua Docker](#3-khởi-động-database-qua-docker)
4. [Cài đặt & chạy Backend](#4-cài-đặt--chạy-backend)
5. [Cài đặt & chạy Frontend](#5-cài-đặt--chạy-frontend)
6. [Tạo dữ liệu mẫu (bắt buộc)](#6-tạo-dữ-liệu-mẫu-bắt-buộc)
7. [Thứ tự khởi động chuẩn](#7-thứ-tự-khởi-động-chuẩn)
8. [Kiểm tra API](#8-kiểm-tra-api)
9. [Dừng tất cả dịch vụ](#9-dừng-tất-cả-dịch-vụ)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Clone repository

```bash
git clone <your-repo-url>
cd Smart-Life
```

> Nếu chưa có Git, tải tại: https://git-scm.com/downloads

---

## 2. Tạo file `.env`

Backend cần file `.env` để kết nối Database và Gemini AI. File này **không được commit lên Git**.

### Bước 2.1 — Tạo file `backend/.env`

```bash
# Linux / macOS
cp backend/.env.example backend/.env

# Windows (PowerShell)
Copy-Item backend\.env.example backend\.env
```

### Bước 2.2 — Điền thông tin vào `backend/.env`

Mở file `backend/.env` và chỉnh sửa (nội dung mẫu bên dưới):

```env
# ─── Server ────────────────────────────────────────────────────────
PORT=5000

# ─── PostgreSQL (khớp với docker-compose.yml) ──────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartlife
DB_USER=root
DB_PASSWORD=rootpassword

# ─── Google Gemini AI ───────────────────────────────────────────────
# Lấy key miễn phí tại: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Quan trọng:** Nếu không có `GEMINI_API_KEY`, tính năng AI Scheduler sẽ không hoạt động.  
> Key Gemini **miễn phí** cho tài khoản Google thường — đăng ký tại https://aistudio.google.com/app/apikey

### Bước 2.3 — Tạo file `.env.example` (để commit lên Git)

Tạo file `backend/.env.example` với nội dung:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartlife
DB_USER=root
DB_PASSWORD=rootpassword
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 3. Khởi động Database qua Docker

> Bước này thay thế việc cài PostgreSQL thủ công hoàn toàn.

### Bước 3.1 — Đảm bảo Docker Desktop đang chạy

Mở Docker Desktop và chờ đến khi icon Docker ở taskbar chuyển sang **xanh/trắng** (không còn loading).

### Bước 3.2 — Khởi động container PostgreSQL

Chạy lệnh từ thư mục gốc `Smart-Life/`:

```bash
docker compose up -d
```

### Bước 3.3 — Kiểm tra container đang chạy

```bash
docker ps
```

Kết quả mong đợi:

```
CONTAINER ID   IMAGE         COMMAND                  STATUS         PORTS
abc123def456   postgres:15   "docker-entrypoint.s…"   Up 10 seconds  0.0.0.0:5432->5432/tcp   smartlife_db
```

Thông tin kết nối database:

| Thông số | Giá trị        |
| -------- | -------------- |
| Host     | `localhost`    |
| Port     | `5432`         |
| Database | `smartlife`    |
| Username | `root`         |
| Password | `rootpassword` |

---

## 4. Cài đặt & chạy Backend

### Bước 4.1 — Di chuyển vào thư mục backend và cài dependencies

```bash
cd backend
npm install
```

> Quá trình này tải về: Express, Sequelize, pg, dotenv, @google/generative-ai, v.v.

### Bước 4.2 — Khởi chạy Backend (development mode)

```bash
# Chế độ development — tự restart khi sửa file (dùng nodemon)
npm run dev

# Hoặc chế độ production
npm start
```

### Bước 4.3 — Xác nhận Backend hoạt động

Khi khởi động thành công, terminal hiển thị:

```
✅ Đã kết nối và tạo bảng trên Database PostgreSQL thành công!
🚀 Server is running on http://localhost:5000
```

Mở trình duyệt và truy cập: **http://localhost:5000**  
Kết quả: `Welcome to the Smart Life API - Server đang chạy rất mượt!`

> **Lưu ý:** Sequelize tự động tạo/đồng bộ các bảng (`Users`, `Tasks`, `Courses`, `Schedules`, `Exams`, `Statistics`) lúc khởi động — không cần chạy migration thủ công.

---

## 5. Cài đặt & chạy Frontend

### Bước 5.1 — Mở terminal mới, di chuyển vào thư mục frontend

```bash
# Từ thư mục gốc Smart-Life/
cd frontend
npm install
```

### Bước 5.2 — Khởi chạy Frontend

```bash
npm run dev
```

### Bước 5.3 — Xác nhận Frontend hoạt động

Terminal hiển thị:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Mở trình duyệt tại: **http://localhost:5173**

---

## 6. Tạo dữ liệu mẫu (bắt buộc)

Vì ứng dụng bỏ qua phần đăng nhập (Hackathon shortcut), cần tạo **1 User mẫu** trong database trước khi thêm task.

### Bước 6.1 — Kết nối vào PostgreSQL trong container Docker

```bash
docker exec -it smartlife_db psql -U root -d smartlife
```

### Bước 6.2 — Tạo User mẫu

```sql
INSERT INTO "Users" (id, name, email, password, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo User',
  'demo@smartlife.com',
  'hackathon123',
  NOW(),
  NOW()
);
```

### Bước 6.3 — Kiểm tra User đã được tạo

```sql
SELECT id, name, email FROM "Users";
```

Kết quả mong đợi:

```
                  id                   |   name    |        email
---------------------------------------+-----------+----------------------
 00000000-0000-0000-0000-000000000001  | Demo User | demo@smartlife.com
```

### Bước 6.4 — Thoát khỏi psql

```sql
\q
```

> **Lưu ý:** `HARDCODED_USER_ID` trong `frontend/src/components/KanbanBoard.jsx` đã được đặt sẵn là `'00000000-0000-0000-0000-000000000001'` — khớp với UUID trên.

---

## 7. Thứ tự khởi động chuẩn

Mỗi lần muốn chạy lại dự án, thực hiện theo thứ tự:

```bash
# Terminal 1 — Database (chạy 1 lần, tự động ở background)
docker compose up -d

# Terminal 2 — Backend
cd backend
npm run dev

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Sau đó mở **http://localhost:5173** trên trình duyệt.

---

## 8. Kiểm tra API

```bash
# Kiểm tra server hoạt động
curl http://localhost:5000/

# Lấy danh sách tasks
curl http://localhost:5000/api/tasks

# Lấy danh sách môn học
curl http://localhost:5000/api/courses

# Lấy lịch học
curl http://localhost:5000/api/schedules

# Test AI Scheduler (cần có task ở trạng thái 'todo' trong DB)
curl -X POST http://localhost:5000/api/ai/auto-schedule \
  -H "Content-Type: application/json" \
  -d '{"tasks": [], "availableHours": 4}'
```

---

## 9. Dừng tất cả dịch vụ

```bash
# Dừng Docker (giữ nguyên data)
docker compose down

# Dừng Docker VÀ xóa toàn bộ data (reset DB về trống)
docker compose down -v
```

> Ctrl+C trong terminal Backend/Frontend để dừng các server đó.

---

## 10. Troubleshooting

| Triệu chứng                    | Nguyên nhân                     | Giải pháp                                                              |
| ------------------------------ | ------------------------------- | ---------------------------------------------------------------------- |
| `ECONNREFUSED ::1:5432`        | Docker chưa chạy                | Mở Docker Desktop → `docker compose up -d`                             |
| `Invalid API key` (AI lỗi)     | `GEMINI_API_KEY` sai hoặc thiếu | Kiểm tra `backend/.env`, lấy key tại aistudio.google.com               |
| Frontend báo "lỗi kết nối"     | Backend chưa chạy               | Kiểm tra terminal Backend, đảm bảo port 5000 hoạt động                 |
| `Cannot find module`           | Chưa `npm install`              | Chạy `npm install` trong thư mục `backend/` **và** `frontend/`         |
| Kanban trống sau khi thêm task | Thiếu User mẫu trong DB         | Thực hiện Bước 6                                                       |
| Port 5173 bị chiếm             | App khác dùng port              | Vite tự chuyển sang port 5174, 5175... — kiểm tra terminal             |
| Port 5000 bị chiếm             | App khác dùng port 5000         | Đổi `PORT=5001` trong `backend/.env`                                   |
| Tables không được tạo          | Sequelize lỗi kết nối           | Xem log lỗi trong terminal Backend, kiểm tra thông tin DB trong `.env` |

---

## Cấu trúc thư mục

```
Smart-Life/
├── backend/
│   ├── src/
│   │   ├── config/database.js    # Kết nối Sequelize
│   │   ├── controllers/          # Business logic
│   │   ├── models/               # Sequelize models (tự tạo bảng)
│   │   └── routes/               # API routes (chuẩn *Route.js)
│   ├── server.js                 # Entry point
│   ├── package.json
│   ├── .env                      # ← TỰ TẠO (xem Bước 2)
│   └── .env.example              # ← Mẫu .env để commit Git
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── KanbanBoard.jsx   # Drag & Drop task management
│       │   └── AiScheduler.jsx   # AI-powered schedule generator
│       └── App.jsx               # Sidebar layout + tab navigation
├── docker-compose.yml            # PostgreSQL container
├── INSTALL.md                    # File này
└── README_v2.md                  # Tài liệu dự án V2
```

---

## 1. Clone repository

```bash
git clone <your-repo-url>
cd Smart-Life
```

---

## 2. Khởi động Database (PostgreSQL qua Docker)

> Bước này thay thế việc cài PostgreSQL thủ công.

```bash
docker compose up -d
```

Kiểm tra container đang chạy:

```bash
docker ps
```

Bạn sẽ thấy container `smartlife_db` với port `5432`.

| Thông số | Giá trị        |
| -------- | -------------- |
| Host     | `localhost`    |
| Port     | `5432`         |
| Database | `smartlife`    |
| Username | `root`         |
| Password | `rootpassword` |

---

## 3. Cài đặt Backend

```bash
cd backend
npm install
```

### 3.1 Tạo file `.env`

Tạo file `backend/.env` với nội dung sau:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartlife
DB_USER=root
DB_PASSWORD=rootpassword
GEMINI_API_KEY=your_gemini_api_key_here
```

> Lấy `GEMINI_API_KEY` tại: https://aistudio.google.com/app/apikey

### 3.2 Chạy Backend

```bash
# Chế độ development (tự restart khi sửa file)
npm run dev

# Hoặc chế độ production
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

Khi khởi động thành công:

```
✅ Đã kết nối và tạo bảng trên Database PostgreSQL thành công!
🚀 Server is running on http://localhost:5000
```

---

## 4. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 4.1 Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 5. Tạo dữ liệu mẫu (Hackathon shortcut)

Vì bỏ qua phần Login, cần tạo 1 User mẫu trong database:

```bash
# Kết nối vào PostgreSQL trong Docker
docker exec -it smartlife_db psql -U root -d smartlife
```

Chạy lệnh SQL sau:

```sql
INSERT INTO "Users" (id, name, email, password, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo User',
  'demo@smartlife.com',
  'hackathon123',
  NOW()
);

-- Kiểm tra
SELECT id, name, email FROM "Users";

-- Thoát
\q
```

> **Lưu ý:** `user_id` hardcode trong Frontend đang là `'1'`. Nếu dùng UUID ở trên, hãy cập nhật giá trị `HARDCODED_USER_ID` trong `frontend/src/components/KanbanBoard.jsx` và `AiScheduler.jsx` thành `'00000000-0000-0000-0000-000000000001'`.

---

## 6. Kiểm tra API (tuỳ chọn)

```bash
# Test server
curl http://localhost:5000/

# Lấy danh sách tasks
curl http://localhost:5000/api/tasks

# Lấy danh sách môn học
curl http://localhost:5000/api/courses

# Lấy lịch học
curl http://localhost:5000/api/schedules
```

---

## 7. Thứ tự khởi động chuẩn

```
1. docker compose up -d        ← Database
2. cd backend && npm run dev   ← Backend  (port 5000)
3. cd frontend && npm run dev  ← Frontend (port 5173)
```

---

## 8. Dừng tất cả

```bash
# Dừng Docker
docker compose down

# Xoá luôn data (reset DB)
docker compose down -v
```

---

## Cấu trúc thư mục

```
Smart-Life/
├── backend/              # Node.js + Express + Sequelize
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Sequelize models
│   │   └── routes/       # API routes
│   ├── server.js
│   └── .env              # ← Tự tạo, KHÔNG commit
├── frontend/             # React + Vite + TailwindCSS v4
│   └── src/
│       └── components/
│           ├── KanbanBoard.jsx
│           └── AiScheduler.jsx
├── docker-compose.yml    # PostgreSQL
└── INSTALL.md            # File này
```

---

## Troubleshooting

| Vấn đề                           | Giải pháp                                   |
| -------------------------------- | ------------------------------------------- |
| `ECONNREFUSED 5432`              | Docker chưa chạy → `docker compose up -d`   |
| `GEMINI_API_KEY invalid`         | Kiểm tra lại key trong `.env`               |
| Frontend không gọi được API      | Đảm bảo Backend đang chạy ở port `5000`     |
| `Cannot find module '../models'` | Chạy `npm install` trong thư mục `backend/` |
| Cột Kanban trống                 | Chưa tạo User mẫu — xem Bước 5              |
