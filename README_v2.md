# Smart Life — Tài liệu Dự án v2.0

> Ứng dụng quản lý học tập thông minh dành cho sinh viên, xây dựng cho Hackathon 2026.  
> Stack: **NodeJS + Express + Sequelize + PostgreSQL** (Backend) | **React + Vite + TailwindCSS v4** (Frontend)

---

## Tính năng MVP đã hoàn thành

### 1. Kanban Board — Quản lý công việc (`/api/tasks`)

| Tính năng         | Chi tiết                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| Hiển thị task     | Chia 3 cột: **To Do / In Progress / Done**                              |
| Kéo thả           | Dùng `@dnd-kit/core` — HTML5 Drag & Drop                                |
| Cập nhật realtime | `PUT /api/tasks/:id/status` — optimistic UI update với rollback tự động |
| Thêm task         | Modal form với validation (title, deadline, priority, status)           |
| Xóa task          | Xóa khỏi UI ngay lập tức, gọi `DELETE /api/tasks/:id` ngầm              |
| Làm mới           | Nút **Làm mới** fetch lại toàn bộ task từ server                        |
| Error handling    | Hiển thị lỗi + nút "Thử lại" khi không kết nối được backend             |

### 2. AI Auto Scheduler — Xếp lịch tự động (`/api/ai/auto-schedule`)

| Tính năng     | Chi tiết                                                                   |
| ------------- | -------------------------------------------------------------------------- |
| Input         | Số giờ rảnh/ngày (slider 1–24h) + danh sách task To Do                     |
| AI Engine     | Google Gemini API (`@google/generative-ai`)                                |
| Output        | Timeline dọc với tên task, giờ bắt đầu/kết thúc, badge ưu tiên, ghi chú AI |
| Loading state | Skeleton shimmer animation trong khi chờ AI phản hồi                       |
| Fallback      | Hiển thị raw JSON nếu AI trả về định dạng không chuẩn                      |
| Stats panel   | Đếm số task To Do và số slot đã được xếp lịch                              |

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (port 5173)                    │
│   React + Vite + TailwindCSS v4 + @dnd-kit/core + lucide-react  │
│                                                                  │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │   KanbanBoard.jsx   │    │      AiScheduler.jsx         │   │
│  │  - DnD drag/drop    │    │  - Hours input (slider)       │   │
│  │  - Optimistic UI    │    │  - POST /api/ai/auto-schedule │   │
│  │  - Add/Delete task  │    │  - Timeline result renderer   │   │
│  └─────────────────────┘    └──────────────────────────────┘   │
└─────────────────┬──────────────────────────┬───────────────────┘
                  │ fetch / REST API          │
┌─────────────────▼──────────────────────────▼───────────────────┐
│                      BACKEND (port 5000)                        │
│              NodeJS + Express + Sequelize ORM                   │
│                                                                  │
│  routes/index.js                                                 │
│  ├── /api/tasks      → taskRoute.js      → taskController.js    │
│  ├── /api/courses    → courseRoute.js    → courseController.js  │
│  ├── /api/schedules  → scheduleRoute.js  → scheduleController.js│
│  ├── /api/ai         → aiRoute.js        → aiController.js      │
│  ├── /api/users      → userRoute.js      → userController.js    │
│  ├── /api/exams      → examRoute.js      → examController.js    │
│  └── /api/statistics → statisticsRoute.js→ statisticsController │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ Sequelize ORM
┌─────────────────────────────────▼───────────────────────────────┐
│              PostgreSQL (Docker — port 5432)                     │
│   Tables: Users, Tasks, Courses, Schedules, Exams, Statistics    │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method   | Endpoint                | Mô tả                                                 |
| -------- | ----------------------- | ----------------------------------------------------- |
| `GET`    | `/api/tasks`            | Lấy danh sách task, hỗ trợ `?status=todo,in_progress` |
| `POST`   | `/api/tasks`            | Tạo task mới                                          |
| `PUT`    | `/api/tasks/:id/status` | Cập nhật trạng thái (Kanban drag & drop)              |
| `PUT`    | `/api/tasks/:id`        | Cập nhật toàn bộ thông tin task                       |
| `DELETE` | `/api/tasks/:id`        | Xóa task                                              |
| `GET`    | `/api/courses`          | Lấy danh sách môn học                                 |
| `GET`    | `/api/schedules`        | Lấy lịch học (sắp xếp theo thời gian)                 |
| `POST`   | `/api/ai/auto-schedule` | Gọi AI xếp lịch tự động                               |

---

## Cập nhật ở phiên bản V2 — Refactoring & Cleanup

### Backend

| Thay đổi               | Chi tiết                                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Chuẩn hóa tên file** | Đổi tên `users.js`, `exams.js`, `statistics.js` → `userRoute.js`, `examRoute.js`, `statisticsRoute.js`                                 |
| **Xóa trùng lặp**      | `tasks.js`, `courses.js`, `schedules.js` chỉ là redirect stub → canonical files là `*Route.js`                                         |
| **Full CRUD**          | `taskController` bổ sung `getTaskById`, `updateTask`; `courseController` và `scheduleController` bổ sung `getById`, `update`, `delete` |
| **index.js sạch**      | Import thống nhất 100% theo chuẩn `[Name]Route.js`                                                                                     |

### Frontend

| Thay đổi           | Chi tiết                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **TailwindCSS v4** | Thay toàn bộ `bg-gradient-to-*` → `bg-linear-to-*` (API mới của TW v4)                                          |
| **ESLint fix**     | `TaskBadge` trong `AiScheduler.jsx` — thêm `dot` vào `PRIORITY_CONFIG`, dùng `priority.dot` thay inline ternary |
| **KanbanBoard**    | `fetchTasks` tách thành hàm riêng, thêm nút **Làm mới** và **Thử lại**, sửa các ký tự tiếng Việt bị corrupt     |
| **AiScheduler**    | Sửa toàn bộ ký tự corrupt, thêm `dot` key vào `PRIORITY_CONFIG`                                                 |

---

## Cấu trúc thư mục (V2)

```
Smart-Life/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── courseController.js      ← Full CRUD
│   │   │   ├── examController.js
│   │   │   ├── scheduleController.js    ← Full CRUD
│   │   │   ├── statisticsController.js
│   │   │   ├── taskController.js        ← Full CRUD + updateTaskStatus
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── Course.js
│   │   │   ├── Exam.js
│   │   │   ├── Schedule.js
│   │   │   ├── Statistics.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   └── routes/
│   │       ├── index.js                 ← Gộp toàn bộ routes
│   │       ├── aiRoute.js               ✅ Canonical
│   │       ├── courseRoute.js           ✅ Canonical
│   │       ├── examRoute.js             ✅ Canonical (mới)
│   │       ├── scheduleRoute.js         ✅ Canonical
│   │       ├── statisticsRoute.js       ✅ Canonical (mới)
│   │       ├── taskRoute.js             ✅ Canonical
│   │       ├── userRoute.js             ✅ Canonical (mới)
│   │       ├── courses.js               ⚠️ Redirect stub
│   │       ├── exams.js                 ⚠️ Redirect stub
│   │       ├── schedules.js             ⚠️ Redirect stub
│   │       ├── statistics.js            ⚠️ Redirect stub
│   │       ├── tasks.js                 ⚠️ Redirect stub
│   │       └── users.js                 ⚠️ Redirect stub
│   ├── server.js
│   ├── package.json
│   └── .env                             ← Tự tạo (xem INSTALL.md)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiScheduler.jsx          ← ESLint fixed, gradient fixed
│   │   │   └── KanbanBoard.jsx          ← Refresh UX, gradient fixed
│   │   ├── App.jsx                      ← Sidebar layout + tab navigation
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── INSTALL.md
└── README_v2.md                         ← File này
```

---

## Tech Stack

| Layer      | Công nghệ         | Phiên bản                     |
| ---------- | ----------------- | ----------------------------- |
| Runtime    | Node.js           | ≥ 18                          |
| Framework  | Express           | ^4.22                         |
| ORM        | Sequelize         | ^6.37                         |
| Database   | PostgreSQL        | 15 (Docker)                   |
| AI         | Google Gemini API | `@google/generative-ai` ^0.24 |
| Frontend   | React             | ^19                           |
| Build tool | Vite              | ^7                            |
| CSS        | TailwindCSS       | **v4**                        |
| DnD        | @dnd-kit/core     | ^6.3                          |
| Icons      | lucide-react      | ^0.575                        |

---

> Built with ❤️ for Hackathon 2026 — Smart Life Team
