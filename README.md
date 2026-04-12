<p align="center">
  <a href="https://malv-store.my.id" target="_blank">
    <img src="public/images/chibi.png" width="100" alt="Malvin Logo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/author-Muhammad%20Malfin-blueviolet" />
  <img src="https://img.shields.io/badge/language-TypeScript-007acc" />
  <img src="https://img.shields.io/badge/framework-React_19-61DAFB" />
  <img src="https://img.shields.io/badge/build_tool-Vite-646CFF" />
  <img src="https://img.shields.io/badge/styling-TailwindCSS_v4-06B6D4" />
  <img src="https://img.shields.io/badge/state-TanStack_Query_v5-FF4154" />
  <img src="https://img.shields.io/badge/state-Zustand-433E38" />
  <img src="https://img.shields.io/badge/validation-Zod-3E67B1" />
  <img src="https://img.shields.io/badge/deploy-Vercel-000000" />
</p>

# Contact Management — Frontend

The frontend for the Contact Management RESTful API. Built with React 19 and TypeScript, featuring a feature-based architecture, full CRUD for contacts and addresses, and a clean responsive UI with dark/light mode support.

**Live Demo:** [contact-management.malfin.xyz](https://contact-management.malfin.xyz) &nbsp;|&nbsp; **API:** [api-contact-management.malfin.xyz](https://api-contact-management.malfin.xyz)

## Features

- **JWT Authentication** — Register & login with JWT. Token persisted to `localStorage` via Zustand. Auto-logout and redirect on 401 via Axios response interceptor.
- **Contact Management** — Full CRUD: create, view, edit, and delete contacts with client-side search/filter and pagination.
- **Address Management** — Each contact can have multiple addresses. Full CRUD per address using dialog-based forms.
- **Profile** — Update username and password from the profile page.
- **Dark / Light Mode** — System-aware theme toggle powered by `next-themes`.
- **Skeleton Loading** — Dedicated skeleton components for every async state — no layout shift.
- **Toast Notifications** — Consistent success/error feedback via `sonner` on every mutation.
- **Route Guards** — `AuthGuard` (protected routes) and `GuestGuard` (auth pages) prevent unauthorized access and preserve post-login redirect.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 |
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Routing | React Router v7 |
| UI Primitives | Shadcn / Base UI |
| Notifications | Sonner |
| Theme | next-themes |

## Architecture

This project uses a **feature-based folder structure** with a strict layered pattern inside each feature:

```
src/
├── features/
│   ├── auth/
│   │   ├── auth.types.ts        # TypeScript interfaces
│   │   ├── auth.schema.ts       # Zod schema + inferred payload types
│   │   ├── auth.service.ts      # Raw Axios API calls
│   │   ├── auth.store.ts        # Zustand client state (persisted)
│   │   ├── auth.hook.ts         # TanStack Query mutations with toast feedback
│   │   ├── guards/              # AuthGuard, GuestGuard
│   │   └── components/          # Feature-scoped UI components
│   ├── contact/                 # Contact CRUD feature
│   ├── address/                 # Address CRUD feature (nested under contact)
│   └── user/                    # Profile management feature
│
├── components/
│   ├── ui/                      # Shadcn-style primitive components
│   └── form/                    # Shared form fields (InputField, ButtonField, etc.)
│
├── lib/
│   ├── api.ts                   # Axios instance + auth interceptors
│   ├── queryClient.ts           # TanStack Query client config
│   └── utils.ts                 # cn(), errorHookResponse()
│
├── pages/                       # Route-level page components
├── layouts/                     # AuthLayout, MainLayout
├── routes/                      # createBrowserRouter config
└── stores/                      # Global app stores
```

### Data Flow

```
User Action
    │
    ▼
React Component  ──►  useXxxHook (TanStack Query)
                            │
                            ▼
                       xxxService  ──►  api (Axios + JWT)  ──►  REST API
                            │
                            ▼
                   queryClient.invalidateQueries  ──►  UI re-renders
```

## Environment Setup

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=https://api-contact-management.malfin.xyz/api
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the REST API | `http://localhost:3000/api` |

## Running the Application

```bash
npm install
npm run dev       # Dev server with HMR → http://localhost:5173
```

Other commands:

```bash
npm run build     # Type-check + production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Deployment

The frontend is deployed on **Vercel** and connects to the REST API hosted on a VPS.

To deploy your own instance:

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set `VITE_API_BASE_URL` in the Vercel dashboard → **Settings → Environment Variables**
4. Deploy — Vercel will build and serve the app automatically

> `vercel.json` is included to configure SPA fallback routing so React Router works correctly on direct URL access and page refresh.

## Related

- [Contact Management API](https://github.com/malllvinnn/contact-management-restful-api) — the Express.js backend this app consumes
