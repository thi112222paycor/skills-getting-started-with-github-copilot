# Task Manager Full-Stack Demo

This repository now includes a mock full-stack task manager application with:

- **Frontend:** React + TypeScript + Vite
- **Backend:** ASP.NET Core Web API (.NET 10)
- **Database:** EF Core InMemory provider

## Project structure

- `/frontend` - React application with mock authentication, protected routes, dashboard, and task CRUD UI
- `/backend` - ASP.NET Core Web API with controllers, services, repositories, DTOs, AutoMapper, validation, logging, and Swagger

## Features

- Mock login and registration
- Protected frontend routes
- Task CRUD operations
- Seeded in-memory data at startup
- Swagger UI for API documentation
- Clean separation between controllers, services, and repositories
- DTO validation with Data Annotations
- Centralized exception handling and logging

## Demo credentials

Use the seeded account to sign in immediately:

- **Email:** `student@mergington.edu`
- **Password:** `Pass123!`

## Run the backend

```bash
cd backend
dotnet restore
dotnet run
```

Backend URLs:

- API base: `http://localhost:5152/api`
- Swagger UI: `http://localhost:5152/swagger`

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

## Production build checks

```bash
cd backend
dotnet build

cd ../frontend
npm run lint
npm run build
```

## API overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks

Send the signed-in user email in the `X-User-Email` header.

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Switching from mock DB to SQL Server later

The backend is structured so the persistence layer can be replaced without changing controller or service behavior.

When moving to SQL Server:

1. Replace `UseInMemoryDatabase(...)` in `/backend/Program.cs`
2. Add a real SQL Server connection string in configuration
3. Keep the existing repository/service/controller structure intact
4. Add EF Core migrations for the SQL Server provider

## Notes

- The in-memory database is reseeded each time the backend restarts.
- Registration data is intentionally mock/demo-only and stored only while the API process is running.
