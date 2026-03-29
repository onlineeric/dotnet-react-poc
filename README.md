# dotnet-react-poc

This is my personal learning project.

I set this repository to public so my AI tools can access it more easily.

There is nothing particularly worth looking at here.

## A recap of what I learned

- Scaffolding a React + TypeScript project with Vite (`pnpm create vite . --template react-ts`)
- Setting up Tailwind CSS v4 with the Vite plugin (`@tailwindcss/vite`)
- Using TanStack Query for server state management:
  - `useQuery` for fetching and caching data
  - `useMutation` for POST requests
  - `staleTime` to control how long cached data stays fresh
  - `invalidateQueries` to mark cache as stale after a mutation
  - Reading from the query cache directly with `queryClient.getQueryData()` to pass data between pages without re-fetching
  - `enabled: false` vs `enabled: true` and how it affects auto-fetching behavior
- How a full page refresh (F5) destroys all in-memory state including the TanStack Query cache
