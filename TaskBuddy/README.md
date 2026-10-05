# TaskBuddy – Task Management Application

TaskBuddy is a full-stack task manager. Users register, log in, and manage their own tasks (create, edit, delete, change status), with live statistics, search, filters and sorting. It runs entirely on your own computer: React + Vite on the front, Express + MongoDB on the back, JWT for authentication. No paid services are needed.

## Features

- Register and log in (name, email, password, confirm password) with validation and clear error messages
- Passwords hashed with bcrypt; sessions use JWT; duplicate emails are rejected
- Protected routes on the frontend and protected API routes on the backend
- Every task belongs to one user; users can only read, edit or delete their own tasks (other users' tasks return 403)
- Task CRUD: title, description, due date, priority (Low / Medium / High), status (Pending / In Progress / Completed)
- Change status straight from a task card
- Delete confirmation dialog; the UI updates immediately after each action
- Dashboard statistics: total, pending, in progress, completed, high priority (update instantly)
- Search by title, filter by status and priority, sort by due date / priority / created date, all without reloading the page
- Loading states, error states, empty states, toast messages, duplicate-submit protection
- Responsive layout for desktop, tablet and mobile (single column on phones)
- 404 page

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router 6, Axios, plain CSS |
| Backend | Node.js, Express 4, REST API |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |

`bcryptjs` is a pure-JavaScript implementation of the bcrypt algorithm. It produces standard bcrypt hashes and installs on any machine without needing a C++ build toolchain.

## Folder Structure

```text
TaskBuddy/
├── backend/
│   ├── config/db.js               MongoDB connection
│   ├── controllers/               authController.js, taskController.js
│   ├── middleware/                auth.js (JWT check), errorHandler.js
│   ├── models/                    User.js, Task.js
│   ├── routes/                    authRoutes.js, taskRoutes.js
│   ├── utils/                     validators, ApiError, asyncHandler, token helper, constants
│   ├── seed.js                    optional demo data
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/            Navbar, ProtectedRoute, TaskCard, TaskForm, TaskList, TaskStats,
│   │   │                          SearchBar, FilterBar, LoadingSpinner, ConfirmationModal, Modal, ...
│   │   ├── pages/                 Login, Register, Dashboard, NotFound
│   │   ├── context/AuthContext.jsx
│   │   ├── services/              api.js (Axios), authService.js, taskService.js
│   │   ├── hooks/                 useAuth.js, useTasks.js
│   │   ├── utils/helpers.js
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, vite.config.js, package.json
│   └── .env.example
├── README.md
├── .gitignore
└── package.json                   optional helper scripts for the whole project
```

## Prerequisites

- **Node.js** 18 or newer (https://nodejs.org) – check with `node -v`
- **npm** (comes with Node.js) – check with `npm -v`
- **MongoDB**, either:
  - MongoDB Community Server installed locally (https://www.mongodb.com/try/download/community), or
  - a free MongoDB Atlas cluster (https://www.mongodb.com/atlas)

## Installation

Open the `TaskBuddy` folder in VS Code, open the integrated terminal (Ctrl + `), then:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

(Optional shortcut from the project root: `npm run install:all` installs the root, backend and frontend dependencies in one go.)

## Environment Variables

### Backend – create `backend/.env`

Copy `backend/.env.example` to `backend/.env` and edit it:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskbuddy
JWT_SECRET=paste_a_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Generate a good `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend – `frontend/.env`

Already included, and it contains no secrets. If it is missing, copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart `npm run dev` after changing a `.env` file. Never commit `.env` files (they are in `.gitignore`).

## Connecting MongoDB

**Option A – Local MongoDB**

1. Install MongoDB Community Server and make sure the service is running.
2. Use `MONGO_URI=mongodb://127.0.0.1:27017/taskbuddy` in `backend/.env`.
3. The `taskbuddy` database and its collections are created automatically on first use.

**Option B – MongoDB Atlas (cloud, free tier)**

1. Create a free account and an M0 cluster at https://www.mongodb.com/atlas.
2. Database Access → add a database user (username + password).
3. Network Access → add your current IP address (or `0.0.0.0/0` for development only).
4. Cluster → Connect → Drivers → copy the connection string and put it in `backend/.env`, adding the database name before the `?`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskbuddy?retryWrites=true&w=majority
```

If your password contains special characters (`@`, `#`, `/`), URL-encode them.

## Running the Backend

```bash
cd backend
npm run dev
```

You should see `MongoDB connected: ...` and `TaskBuddy API running on port 5000`. If the database cannot be reached, the server prints a clear message and exits.

## Running the Frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

(Or from the project root, run both together with `npm install` once at the root and then `npm run dev`.)

## Expected URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Creating the First Account

Open http://localhost:5173, click **Create an account**, and register. No users are hard-coded.

## Demo Account

The login page defaults to the **Demo account** option, with its credentials prefilled. Choose **My account** to enter personal credentials, or return to **Demo account** to refill the demo login:

- Email: `demo@taskbuddy.com`
- Password: `Demo@123`

The demo account and its tasks are shared by visitors. Anyone using the account can view, add, edit, change status, or delete its tasks, so do not put private or sensitive information in the demo workspace.

Create the demo account and sample tasks by running the seed script against the database configured in `backend/.env`:

```bash
cd backend
npm run seed
```

The script is safe to rerun: it creates the account if missing, ensures the displayed password works, and adds sample tasks only if the demo account has none. Existing demo tasks are not reset or overwritten. It uses `MONGO_URI` from the backend environment, so to seed a deployed app, configure `MONGO_URI` to point to the production database and run `npm run seed` from the backend directory in a trusted deployment environment. Do not put database credentials in frontend environment variables.

For production, configure the backend environment variables `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, and `CLIENT_URL` as described above. Configure the frontend's `VITE_API_URL` to the deployed backend API URL (ending in `/api`) at frontend build time. Run the seed command after the production database is reachable and before sharing the public app URL. Seeding is a manual deployment step; the backend does not reset demo data on startup.

To run locally from the project root after installing dependencies:

```bash
npm run dev
```

This starts both the backend and frontend. To seed the local database separately, run `npm run seed --prefix backend` from the project root, or change to the `backend` directory and run `npm run seed`.

## API Reference

All task routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns token + user |
| POST | `/api/auth/login` | Log in, returns token + user |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | List your tasks (optional `status`, `priority`, `search`, `sortBy`, `order`) |
| GET | `/api/tasks/:id` | One task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update only the status |
| DELETE | `/api/tasks/:id` | Delete a task |

Status codes used: 200, 201, 400 (validation / bad id), 401 (not logged in / bad token), 403 (task belongs to another user), 404 (not found), 409 (duplicate email), 500 (server error, generic message only).

## Architecture Notes

- **Request flow:** React component → hook/service → shared Axios instance (`services/api.js`, adds the JWT) → Express route → auth middleware → controller → Mongoose model → MongoDB.
- **Auth:** the JWT is kept in `localStorage`. On page load the app calls `/api/auth/me` to confirm it. If the API ever answers 401 for a stored token, the app logs out automatically. `localStorage` is simple and fine for a learning project; production apps often prefer httpOnly cookies.
- **Authorization:** `taskController.findOwnedTask` is used by every single-task operation, so ownership is checked in one place.
- **Errors:** controllers throw `ApiError`; one error-handling middleware turns everything into `{ success: false, message }` JSON and hides internal details.
- **Filtering:** search/filter/sort run in the browser for instant updates. The API also supports the same options as query parameters.
- **Real-time updates:** Socket.IO was intentionally left out so the core CRUD app stays simple and stable.

## Troubleshooting

- `Database connection failed` – check `MONGO_URI`, make sure MongoDB is running (or your Atlas IP is allowed).
- `JWT_SECRET is not set` – you have not created `backend/.env`.
- Frontend shows "Cannot reach the server" – the backend is not running, or `VITE_API_URL` is wrong.
- CORS error in the browser – `CLIENT_URL` in `backend/.env` must match the URL in your address bar exactly.
