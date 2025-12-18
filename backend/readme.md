# Collaborative Task Manager – Backend

This repository contains the **backend API** for the Collaborative Task Manager application.  
It is built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL (NeonDB)** and supports **secure authentication, task management, and real-time collaboration**.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **Authentication:** JWT (HttpOnly Cookies)
- **Real-time:** Socket.io
- **Validation:** Zod
- **Testing:** Jest (unit tests)
- **Deployment-ready**

---

## 📁 Project Structure

```
src/
├─ controllers/      # HTTP request handlers
├─ services/         # Business logic
├─ routes/           # API routes
├─ middlewares/      # Auth & validation middleware
├─ dto/              # Zod schemas (DTOs)
├─ config/           # Prisma, DB, Socket setup
├─ app.ts            # Express app setup
└─ server.ts         # Server & Socket.io bootstrap
```

---

## 🔐 Authentication

- Uses **JWT stored in HttpOnly cookies**
- Authentication middleware attaches:
  ```ts
  req.user = { id: string }
  ```
- All task-related routes are protected

---

## 🧠 Core Features

### ✅ Task Management (CRUD)

Each task includes:
- `title`
- `description`
- `dueDate`
- `priority` (LOW | MEDIUM | HIGH | URGENT)
- `status` (TO_DO | IN_PROGRESS | REVIEW | COMPLETED)
- `creator`
- `assignee` (optional)

### ✅ Authorization Rules

- Only authenticated users can access tasks
- Only creator or assignee can view/update a task
- Only creator can delete a task

### ✅ Real-Time Collaboration

Implemented using Socket.io:
- `task:created`
- `task:updated`
- `task:deleted`
- `task:assigned` (user-specific notification)

Each user joins a socket room using their user ID.

---

## 📡 API Endpoints

### Task APIs

| Method | Endpoint               | Description    |
| ------ | ---------------------- | -------------- |
| POST   | `/api/tasks`           | Create a task  |
| GET    | `/api/tasks/:id`       | Get task by ID |
| PATCH  | `/api/tasks/:id`       | Update task    |
| DELETE | `/api/tasks/:id`       | Delete task    |
| GET    | `/api/tasks/dashboard` | Dashboard data |

---

## 🧪 Input Validation

All inputs are validated using **Zod DTOs**:
- `createTaskSchema`
- `updateTaskSchema`
- `taskParamIdSchema`

Validation happens before controller execution via middleware.

---

## 🧪 Unit Testing

- Unit tests are written for critical service-layer logic
- Focus on:
  - Authorization rules
  - Error handling
  - Edge cases
- Database calls are mocked for isolation

---

## 🗄 Database & Prisma

- PostgreSQL hosted on **NeonDB**
- Prisma manages:
  - Schema
  - Migrations
  - Type-safe queries

To run migrations:
```bash
npx prisma migrate dev
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Running the Project Locally

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Generate Prisma client
```bash
npx prisma generate
```

### 3️⃣ Run migrations
```bash
npx prisma migrate dev
```

### 4️⃣ Start the server
```bash
npm run dev
```

Server runs on:
```
http://localhost:5000
```

---

## 🧩 Socket.io Setup

Socket.io is initialized on the same HTTP server as Express:

```ts
const server = http.createServer(app);
initSocket(server);
server.listen(PORT);
```

This ensures real-time events work correctly.

---

## 🏗 Architecture Decisions

- Service layer handles all business logic
- Controllers remain thin
- DTO-based validation ensures data integrity
- JWT-based auth scales easily
- Socket.io enables real-time collaboration
- Prisma ORM ensures type safety and maintainability

---

## 🧠 Trade-offs & Assumptions

- Password hashes are never exposed in API responses
- Creator ID is always derived from authentication, never client input
- Unit tests focus on business logic rather than full integration tests

---

## 📌 Status

✅ Backend complete  
✅ API tested  
✅ Database synced  
✅ Real-time enabled  
✅ Submission-ready

---

## ✨ Author

**Rahul Kumar**  
Full Stack Developer