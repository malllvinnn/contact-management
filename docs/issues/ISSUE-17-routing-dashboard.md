# Issue #17 — Update routing struktur: `/dashboard` dan `/dashboard/profile`

| Meta | Detail |
|------|--------|
| **Status** | CLOSED |
| **Labels** | `refactor`, `routing` |
| **Dibuat** | 2026-03-30 |
| **Ditutup** | 2026-03-30 |

## Context

Saat ini halaman utama setelah login menggunakan route `/` (root). Seiring aplikasi berkembang (dashboard, profile, dsb.), diperlukan struktur routing yang lebih eksplisit dan scalable.

Perubahan yang diperlukan:
- **`/`** → redirect ke `/dashboard`
- **`/dashboard`** → halaman utama (ContactPage / halaman kontak)
- **`/dashboard/profile`** → halaman profile user

Hal ini membuat hierarki route lebih jelas dan mempersiapkan fondasi untuk penambahan halaman baru di bawah prefix `/dashboard`.

## Goals

- Pindahkan route `/` menjadi `/dashboard` di `routes/index.tsx`.
- Tambahkan redirect dari `/` ke `/dashboard` (opsional tapi UX-friendly).
- Siapkan slot route `/dashboard/profile` (boleh placeholder dulu, akan diisi di Issue #19).
- Pastikan guard `AuthGuard` dan `GuestGuard` tetap berjalan dengan benar setelah perubahan.

## Scope of Work

**In scope**

- `src/routes/index.tsx`: update path `"/"` menjadi `"dashboard"`, tambah anak route `"profile"` (placeholder).
- Redirect `/` → `/dashboard` menggunakan `<Navigate>` dari react-router.
- Update `navigate` di `auth.hook.ts` (`useLogin`) agar `from` default mengarah ke `/dashboard`.

**Out of scope**

- Implementasi UI halaman profile (Issue #19).
- Perubahan guard logic.

## Suggested Technical Checklist

- [ ] Update `routes/index.tsx`:
  - Ganti `path: "/"` menjadi `path: "dashboard"` di dalam `MainLayout` children.
  - Tambah route `{ path: "profile", Component: ProfilePage }` sebagai anak `/dashboard` (bisa placeholder dulu).
  - Tambah fallback route `{ path: "/", element: <Navigate to="/dashboard" replace /> }`.
- [ ] Update default `from` di `useLogin` di `auth.hook.ts` menjadi `/dashboard`.
- [ ] Verifikasi guard redirect masih ke path yang benar setelah login/logout.
- [ ] Smoke test semua route (login → `/dashboard`, logout → `/auth/login`, akses langsung `/` → redirect ke `/dashboard`).

## Acceptance Criteria

- Setelah login, user diarahkan ke `/dashboard`.
- Akses langsung ke `/` secara otomatis redirect ke `/dashboard`.
- Route `/dashboard/profile` tersedia (meskipun kontennya placeholder).
- Tidak ada regresi pada alur login, logout, dan guard.
- Tidak ada broken link / blank screen.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Login sukses | Login dengan kredensial valid | Redirect ke `/dashboard`, bukan `/` |
| 2 | Akses root | Buka `/` saat sudah login | Redirect otomatis ke `/dashboard` |
| 3 | Akses root tanpa login | Buka `/` tanpa login | Redirect ke `/auth/login` |
| 4 | Akses profil | Buka `/dashboard/profile` saat sudah login | Halaman profile tampil (atau placeholder) |
| 5 | Logout | Klik logout | Redirect ke `/auth/login` |

## Notes

- Issue ini adalah **prasyarat** untuk Issue #19 (Profile Page) dan Issue #20 (Profile Dropdown Navbar).
- Pastikan `useLogin` hook juga diupdate agar `from` default menjadi `/dashboard` sehingga flow redirect setelah login konsisten.
