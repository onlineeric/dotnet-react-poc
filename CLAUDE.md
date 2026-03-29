# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POC / learning project: a .NET 10 C# web server that hosts a React SPA and provides RESTful API endpoints.

## Tech Stack

**Backend:** .NET 10, ASP.NET Core Minimal APIs, JSON file-based data store (`data/products.json`)
**Frontend:** React 19, Vite 8, TypeScript (strict), pnpm, React Router 7, TanStack Query 5, Tailwind CSS 4, Zustand (only if needed)

## Build and Run Commands

### Backend (.NET)
```bash
cd server
dotnet build              # compile
dotnet run                # start server on http://localhost:5157
```

### Frontend (React)
```bash
cd client
pnpm install              # install dependencies
pnpm dev                  # start Vite dev server on http://localhost:5173
pnpm build                # production build to client/dist/
pnpm lint                 # run ESLint
```

Both servers must run simultaneously during development.

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

## Architecture

### Backend
- `server/Program.cs` — single-file server: CORS, static file serving, API endpoints, SPA fallback routing, and data models
- `server/data/products.json` — JSON file used as the data store, read/written by API endpoints
- The server creates `client/dist/` on startup if missing (prevents `DirectoryNotFoundException` before frontend is built)
- SPA fallback: `MapFallbackToFile("index.html")` routes all non-API, non-static requests to the React app

### Frontend
- `client/src/main.tsx` — entry point, sets up providers: `BrowserRouter` → `QueryClientProvider` → `App`
- `client/src/App.tsx` — routing: `/` → ProductList, `/edit/:id` → EditProduct
- `client/src/api/products.ts` — API client functions (`fetchProducts`, `updateProduct`) and `Product` type definition
- `client/src/pages/ProductList.tsx` — product table with `useQuery` (staleTime: 5 min), navigate to edit page per row
- `client/src/pages/EditProduct.tsx` — edit form, reads product from TanStack Query cache (`getQueryData`), saves via `useMutation`, invalidates cache on success

### Data Flow Pattern
- **Read:** `useQuery` fetches and caches the product list with a 5-minute staleTime
- **Edit:** edit page reads from TanStack Query cache (no re-fetch), form uses local `useState`
- **Save:** `useMutation` POSTs to server → `invalidateQueries` marks cache stale → navigate back to list → stale cache triggers auto-refetch
