# 📦 Smart Life — Hướng dẫn cài đặt v0.1

> **Yêu cầu hệ thống:** Node.js ≥ 18, npm ≥ 9, Docker Desktop (để chạy PostgreSQL)

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
