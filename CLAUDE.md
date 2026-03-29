# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POC project: a .NET 10 C# web server that hosts a React SPA and provides RESTful API endpoints. The React frontend is in progress.

## Tech Stack

**Backend:** .NET 10, ASP.NET Core Minimal APIs, JSON file-based data store (`data/products.json`)  
**Frontend (in progress):** React (latest), Vite, TypeScript, pnpm, TanStack Query, Zustand (only if needed), Tailwind CSS

## Folder Structure

```
/
├── server/          # .NET 10 backend
│   ├── Program.cs
│   └── data/        # JSON data store
├── client/          # React SPA (in progress)
├── CLAUDE.md
└── .gitignore
```

## Architecture

- `server/Program.cs` — single-file server: CORS, static file serving, API endpoints, SPA fallback routing, and data models
- `client/dist/` — build output directory for the React SPA, served by the .NET server via `PhysicalFileProvider` (path: `../client/dist` relative to server)
- `server/data/products.json` — JSON file used as the data store, read/written by API endpoints
- The server creates `client/dist/` on startup if missing (prevents `DirectoryNotFoundException` before frontend is built)
- SPA fallback: `MapFallbackToFile("index.html")` routes all non-API, non-static requests to the React app

## URLs and Ports

- .NET server: `http://localhost:5157` (or `https://localhost:7159`)
- Vite dev server: `http://localhost:5173`
- CORS policy `AllowViteDev` allows the Vite dev server origin

## API Endpoints

All endpoints are prefixed with `/api/`:
- `GET /api/status` — health check
- `GET /api/products` — all products
- `GET /api/product/{id}` — single product by UUID
- `POST /api/product` — update existing product (match by id)

## Build and Run Commands

### Backend (.NET)
```bash
cd server
dotnet build              # compile
dotnet run                # start server on http://localhost:5157
```

### Frontend (React — once scaffolded in client/)
```bash
cd client
pnpm install              # install dependencies
pnpm dev                  # start Vite dev server on http://localhost:5173
pnpm build                # production build to client/dist/
```
