# Sticky Wall Todo App - Setup Instructions

This is a full-stack todo application with a beautiful sticky wall interface, built with Next.js (frontend) and NestJS (backend).

## Features

- 🔐 User authentication (login/signup)
- 📝 Create, read, update, delete todos
- 🎨 Beautiful sticky notes with different colors
- 📊 Dashboard with statistics
- 🏷️ Categories and tags support
- 📱 Responsive design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sticky_wall_db"
   ACCESS_TOKEN_SECRET="your-super-secret-jwt-key-here"
   REFRESH_TOKEN_EXPIRES_SEC="604800"
   ACCESS_TOKEN_EXPIRES_IN="15m"
   NODE_ENV="development"
   PORT="3000"
   FRONTEND_URL="http://localhost:3001"
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the backend server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3001`

## Database Schema

The application uses the following main models:

- **User**: Stores user authentication data
- **Todo**: Stores sticky notes with title, description, color, category, and completion status
- **RefreshToken**: Manages JWT refresh tokens for secure authentication

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Todos
- `GET /todos` - Get all user todos
- `GET /todos/stats` - Get todo statistics
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3001`
3. Create an account or sign in
4. Start creating your sticky notes!

## Features Overview

### Dashboard
- Left sidebar with navigation, search, and statistics
- Main area displaying sticky notes in a grid layout
- Add new notes by clicking the "+" card

### Sticky Notes
- Click to edit any note
- Choose from 7 different colors
- Add categories and descriptions
- Mark as complete with the check button
- Delete notes with the trash button

### Authentication
- Secure JWT-based authentication
- Automatic token refresh
- Protected routes
- Cookie-based session management

## Troubleshooting

1. **Database connection issues**: Ensure PostgreSQL is running and the DATABASE_URL is correct
2. **CORS errors**: Make sure FRONTEND_URL in backend .env matches your frontend URL
3. **Authentication issues**: Check that ACCESS_TOKEN_SECRET is set and consistent
4. **Build errors**: Ensure all dependencies are installed and Node.js version is compatible

## Development

- Backend uses NestJS with Prisma ORM
- Frontend uses Next.js 15 with TypeScript and Tailwind CSS
- Authentication handled with JWT tokens and HTTP-only cookies
- Real-time updates with React state management
