# Morphereum — Admin Interface 🛡️

_A fast, React + Vite control panel for the $Morphereum ecosystem._

> Manage **Raids**, **Links**, and **Arts** with JWT-guarded routes, optimistic UX, markdown preview, and responsive layouts.

---

## ✨ What this app does

- **Secure admin area** with JWT validation, route guards, and automatic redirect to login when a token expires.
- **Raids manager**: create, edit, delete raids; date is normalized to **UTC 00:00** and content supports **Markdown + GFM** preview.
- **Links manager**: CRUD for official/community links with **dynamic brand icons**.
- **Arts review**: infinite-scrolling gallery for pending/approved submissions with fullscreen review, **approve/remove** actions, and one-click **download**.
- **Polished UX**: toasts, skeleton loaders, responsive columns, sticky navigation, and “scroll to top” on route change.

---

## 🧱 Tech Stack

**Core**

- **React 18** + **TypeScript** + **Vite** app bootstrap.
- **React Router** for public/login and protected admin routes.
- **@tanstack/react-query** for fetching, cache and pagination (infinite queries).
- **Zod** for typing/validation of API shapes and env parsing.

**UI & A11y**

- **Tailwind CSS** + utility helpers (`clsx`, `tailwind-merge`).
- **shadcn/ui-style primitives** built on **Radix** (button, card, sheet, select, toast, tooltip, textarea, badge, input, skeleton).
- **lucide-react** icons + **@icons-pack/react-simple-icons** with **on-demand dynamic import**.
- **react-markdown** + **remark-gfm** for Markdown preview.

**Date/Intl**

- **date-fns** + **date-fns-tz** for UTC-safe parsing/formatting; **react-intersection-observer** for infinite lists.

**Quality of life**

- **WebFont Loader** for Inter.
- Lightweight **toast** system (custom hook) with a viewport provider.

---

## 🔐 Auth & Route Protection

- **AuthProvider** keeps `token` and its **exp** in `localStorage`, exposes `saveToken`, `removeToken`, and `checkTokenValidity`.
- **customFetch** automatically attaches `Authorization: Bearer <token>` and on `401` clears storage and hard-redirects to `/`.
- **ProtectedRoute** checks token validity on navigation and redirects to `/login` if invalid/expired.

---

## 🗺️ App Structure

```
src/
  components/
    ui/                # shadcn-style primitives (button, card, sheet, toast, etc.)
    Layout.tsx         # Top navigation + footer shell
    Navigator.tsx      # Admin nav (Raids, Links, Arts)
    ProtectedRoute.tsx # Guard for private pages
    ...                # Skeletons, helpers, icons
  config/              # Zod-validated env (VITE_API_URL)
  features/
    login/             # Login screen + useLogin()
    raids/             # List + Create/Edit/Delete + Markdown preview
    links/             # List + Create/Edit/Delete + dynamic brand icons
    arts/              # Paginated grid + fullscreen + approve/remove
  hooks/               # use-toast (provider & reducer)
  providers/           # AuthProvider + customFetch
  router/              # Routes, guards, layout
  lib/                 # utils (cn)
  assets/              # token images, etc.
  main.tsx             # React Query provider + Toaster + App
  App.tsx              # <Router />
  index.css            # Tailwind theme tokens + effects
```

---

## 📄 Pages & Workflows

### Login (`/`)

- Minimal email/password form.
- Shows **pending**, **success**, and **error** states (icons + progress bar).
- On success, **saves JWT**, computes expiration from `exp`, and navigates to `/raids`.

### Raids (`/raids`)

- Grid of cards with **status badge**: _today_ (highlight), _past_ (destructive), and future.
- **CreateRaidSheet** with live **Markdown preview**, and date input parsed from `dd/MM/yyyy` → `UTC` ISO.
- **Edit/Delete** via sheet + context menu; invalid input triggers toasts.

### Links (`/links`)

- Two sections: **Community** and **Token** (official) links.
- **CreateLinkSheet** and per-item edit sheet; **context menu → remove**.
- Icons resolved with a **DynamicIcon** component that lazily imports from `@icons-pack/react-simple-icons` (fallback: `SiX`).

### Arts (`/arts`)

- Masonry-like, responsive columns (1/2/3) computed on resize with debounce.
- **Infinite scroll**: loads next page when the last image becomes visible.
- **Fullscreen review**: open → see metadata + description + actions (**download**, **approve**, **remove**).
- Green/red borders indicate approved/pending in the list.

---

## 🧩 Important Components

- **Layout / Navigator / Footer** — app shell and section links.
- **ProtectedRoute** — guards private routes; integrates with `AuthProvider`.
- **CreateRaidSheet / RaidCard** — raid CRUD with Markdown preview and UTC-safe dates.
- **CreateLinkSheet / Link** — link CRUD with context menu and dynamic icons.
- **Image / FullscreenCarrousel** — art review surface with approve/remove/download.
- **Toaster / use-toast** — global toast queue with viewport.
- **UI primitives** — button, card, select, sheet, toast, tooltip, textarea, input, skeleton, badge.

---

## 🔌 API Contracts (expected by the Admin UI)

> All requests go to `VITE_API_URL` and require a **valid Bearer token**.  
> Errors surface as toasts and/or inline hints.

- **Auth**
  - `POST /auth` → `{ token }` (JWT with `exp`).
- **Raids**
  - `GET /raids` → `Raid[]`
  - `POST /raids` → create (expects `{ platform, date(ISO), url, shareMessage, content }`)
  - `PUT /raids/:id` → update
  - `DELETE /raids/:id` → remove  
    _(Date inputs are typed as `dd/MM/yyyy` in the UI then normalized to `UTC`.)_
- **Links**
  - `GET /links` → `Link[]` (types: `community-links | official-links`)
  - `POST /links` → create
  - `PUT /links/:id` → update
  - `DELETE /links/:id` → remove
- **Arts**
  - `GET /arts?page=N` → `{ arts, page, next }` (20 per page)
  - `PUT /arts/:id` → `{ approved: true }`
  - `DELETE /arts/:id` → remove

---

## 🧪 UX Details

- **Skeletons** for list items while fetching or paginating.
- **Toasts** for success/error on all mutations (create/update/delete).
- **Tooltips** for overflowing text, **context menus** for quick actions.
- **Scroll restoration** on route change.

---

## 🔧 Environment

Create a `.env` (or `.env.local`) in the project root:

```env
VITE_API_URL=https://your-api.example.com/api
```

`VITE_API_URL` is **validated with Zod** at startup.

---

## ▶️ Getting Started

```bash
# 1) install deps
pnpm install        # or: npm i / yarn

# 2) set env
cp .env.example .env   # put your VITE_API_URL

# 3) run dev
pnpm dev               # Vite @ http://localhost:5173

# 4) build & preview
pnpm build
pnpm preview
```

Requires **Node 18+**. Fonts are loaded via WebFont Loader (Inter).

---

## 🏗️ Notable Implementation Notes

- **Infinite Arts pagination** uses `useInfiniteQuery` and `react-intersection-observer` to trigger `fetchNextPage()` when the last card comes into view.
- **Dynamic brand icons** are loaded on demand to keep bundles small; if an icon name is invalid, it falls back to **SiX**.
- **Date handling** for Raids:
  - inputs are **`dd/MM/yyyy`**, parsed with `date-fns/parse`
  - normalized to ISO with **UTC 00:00** to avoid TZ drift
  - display badges derive _today/past_ using `date-fns-tz` (UTC key).
- **Auth flow**:
  - `useLogin` posts to `/auth`
  - on success, `saveToken()` writes token + `exp` to `localStorage`
  - `customFetch` attaches the header & handles `401` globally.

---

### Made with 🔒 for the $Morphereum core team
