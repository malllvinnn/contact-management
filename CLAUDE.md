# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint check
npm run preview    # Preview production build
```

No test runner is configured. There is no single-test command.

## Environment

Create a `.env` file at the root if needed:

```
VITE_API_BASE_URL=http://localhost:3000/api  # defaults to this if unset
```

## Architecture

### Feature-based structure

All domain logic lives under `src/features/<feature>/` following a strict layered pattern:

| File | Role |
|------|------|
| `<feature>.types.ts` | TypeScript interfaces |
| `<feature>.schema.ts` | Zod schema + inferred payload types |
| `<feature>.service.ts` | Raw API calls using `api` from `@/lib/api` |
| `<feature>.hook.ts` | TanStack Query `useMutation` / `useQuery` hooks with toast feedback |
| `components/` | Feature-scoped React components |

Current features: `auth`, `user`, `contact`.

### Data flow

1. **HTTP** — `src/lib/api.ts` creates an Axios instance. A request interceptor attaches `Authorization: Bearer <token>` from Zustand auth store. A response interceptor auto-calls `clearAuth()` and redirects to `/auth/login` on 401.
2. **Server state** — TanStack Query (v5). Query client is at `src/lib/queryClient.ts`. Use `queryClient.invalidateQueries` after mutations. Contact list queries use key `['contacts']`.
3. **Client state** — Zustand. `useAuthStore` (persisted to `localStorage` as `auth-storage`) holds `token`, `user`, and `hasHydrated`. Guards read `hasHydrated` before rendering to avoid flash.
4. **Forms** — `react-hook-form` + `zodResolver`. Reuse shared form components: `InputField`, `InputPasswordField`, `ButtonField` from `src/components/form/`.

### Routing & guards

`src/routes/index.tsx` uses two guard wrappers:
- `GuestGuard` — wraps `/auth/*` routes; redirects authenticated users away.
- `AuthGuard` — wraps all app routes; redirects unauthenticated users to `/auth/login` with `state.from` for post-login redirect.

### UI conventions

- `cn()` from `src/lib/utils.ts` for conditional class merging (`clsx` + `tailwind-merge`).
- `errorHookResponse(error)` from `src/lib/utils.ts` — standardized Axios error → `sonner` toast. Use in every `onError` hook.
- Shadcn-style component primitives live in `src/components/ui/`.
- Dark/light mode via `next-themes`; `ThemeProvider` wraps the app in `main.tsx`.
- Path alias `@/` maps to `src/`.

### Issue tracking

Feature specs are documented in `docs/issues/ISSUE-<N>-<slug>.md`. Each issue describes API contract, scope, acceptance criteria, and a blackbox test plan. Read the relevant issue before implementing a feature.
