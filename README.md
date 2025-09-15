# Neon Prisma Todo

A full-stack Todo application built with Next.js (frontend), Node.js/Express (backend), Prisma ORM, and PostgreSQL. The project is fully containerized using Docker and Docker Compose.

---

## Features

- User authentication (JWT-based).
- Create, update, delete, and list todos
- Responsive UI with Next.js
- PostgreSQL database with Prisma ORM
- Production-ready Docker setup

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Nest.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Containerization:** Docker, Docker Compose

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose installed

---

### Clone the Repository

```sh
git clone https://github.com/SubinC13/neon-prisma-todo.git
cd neon-prisma-todo
```

---

### Environment Variables

Create `.env` files in both `server` and `frontend` directories. Example for backend:

```
DATABASE_URL=postgres://postgres:postgres@db:5432/sticky_wall_db
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_EXPIRES_SEC=604800
ACCESS_TOKEN_EXPIRES_IN=15m
NODE_ENV=production
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Frontend example:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### Running with Docker

Build and start all services:

```sh
docker-compose up --build
```

Run Prisma migrations (in a new terminal):

```sh
docker-compose exec backend npx prisma migrate deploy
```

---

### Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

---

## Project Structure

```
neon-prisma-todo/
│
├── frontend/      # Next.js frontend
├── server/        # Nest.js/Express backend
├── docker-compose.yml
└── README.md
```

---

## Scripts

### Backend

- `npm run dev` – Start backend in development mode
- `npm run build` – Build backend
- `npm run start:prod` – Start backend in production

### Frontend

- `npm run dev` – Start frontend in development mode
- `npm run build` – Build frontend
- `npm run start` – Start frontend in production

---

## License

[MIT](LICENSE)

---

## Author - https://github.com/SubinC13