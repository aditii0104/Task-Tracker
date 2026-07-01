# TaskLedger — MERN Task Tracker

A full-stack task management app built with MongoDB, Express, React (Vite), and Node.js.

## Features

- Create, view, update, and delete tasks (full CRUD)
- Client-side and server-side form validation
- REST API with filtering, sorting, and search query params
- Dynamic UI updates with no page refresh (optimistic updates for status toggling)
- Responsive, mobile-friendly design
- Toast notifications for success/error feedback
- Reusable React components (`TaskForm`, `TaskList`, `TaskItem`, `FilterBar`, `Toast`)
- Environment-variable based configuration for both frontend and backend

## Project structure

```
task-tracker/
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── models/Task.js          Mongoose schema + validation
│   ├── controllers/taskController.js
│   ├── routes/taskRoutes.js
│   ├── middleware/errorHandler.js
│   ├── server.js               Express app entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/taskApi.js      Axios client
    │   ├── components/         TaskForm, TaskList, TaskItem, FilterBar, Toast
    │   ├── App.jsx
    │   └── index.css
    └── .env.example
```

## REST API reference

Base URL: `/api/tasks`

| Method | Endpoint          | Description                                   |
|--------|--------------------|------------------------------------------------|
| GET    | `/api/tasks`       | List tasks. Query params: `status`, `priority`, `sortBy`, `order`, `search` |
| GET    | `/api/tasks/:id`   | Get a single task                              |
| POST   | `/api/tasks`       | Create a task                                  |
| PUT    | `/api/tasks/:id`   | Update a task                                  |
| DELETE | `/api/tasks/:id`   | Delete a task                                  |

Task fields: `title` (required, 3–100 chars), `description` (optional, ≤500 chars), `status` (`pending` | `in-progress` | `completed`), `priority` (`low` | `medium` | `high`), `dueDate` (optional ISO date).

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI (see below)
npm install
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # starts on http://localhost:5173
```

### 3. MongoDB

Use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster:
1. Create a free M0 cluster.
2. Add a database user (username/password).
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) for deployment.
4. Copy the connection string into `backend/.env` as `MONGO_URI`.

## Deploying to a public URL

Since this environment can't deploy directly, here's the fastest path (all free tiers):

### Backend → Render

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **New Web Service**, connect the repo, set root directory to `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `CLIENT_URL` (your frontend's deployed URL, set after step below).
5. Deploy. Note the public URL, e.g. `https://task-tracker-api.onrender.com`.

### Frontend → Vercel

1. On [Vercel](https://vercel.com), import the same repo, set root directory to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add environment variable: `VITE_API_URL=https://task-tracker-api.onrender.com/api`.
4. Deploy. Note the public URL, e.g. `https://task-tracker.vercel.app`.
5. Go back to Render and set `CLIENT_URL=https://task-tracker.vercel.app` on the backend, then redeploy the backend so CORS allows it.

### Alternative combos
- Backend also works well on **Railway** or **Fly.io**.
- Frontend also works well on **Netlify** (same build settings as Vercel).

## Bonus features implemented

- Filtering by status and priority
- Sorting by creation date, due date, priority, or title
- Live search by title (debounced)
- Toast notifications for create/update/delete/errors
- Optimistic UI update when toggling task completion
- Fully reusable, composable component structure
- `.env`-based config on both ends, with `.env.example` templates
