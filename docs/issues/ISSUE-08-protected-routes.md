# Issue #8 — Protected routes berdasarkan token autentikasi

| Meta | Detail |
|------|--------|
| **Status** | CLOSED |
| **Labels** | `enhancement`, `auth`, `routing` |
| **Dibuat** | 2026-03-25 |
| **Ditutup** | 2026-03-25 |

## 1. Context

- Token dan user disimpan di `useAuthStore` (Zustand + `persist`, storage key `auth-storage`).
- Axios sudah mengirim header `Authorization: Bearer <token>` bila token ada; interceptor response 401 sudah disetel agar tidak memicu redirect global saat percobaan login gagal.
- Router saat ini (`src/routes/index.tsx`) belum membatasi akses: siapa pun bisa membuka `/` dan halaman auth tanpa aturan berdasarkan keberadaan token di client.

## 2. Goals

1. Halaman aplikasi utama hanya dapat diakses jika user memiliki token di store (setelah login).
2. Halaman auth tidak perlu ditampilkan ke user yang sudah login — arahkan ke home.
3. Perilaku tetap benar setelah refresh browser (rehydration dari persist), tanpa redirect yang salah atau "flash" konten sensitif.
4. (Opsional) Setelah login sukses, redirect ke URL yang sebelumnya diminta jika user datang dari protected route.

## 3. Scope of Work

| In scope | Out of scope |
|----------|--------------|
| Komponen route guard (`AuthGuard`, `GuestGuard`) dan integrasi ke `createBrowserRouter` | Polish UI / tema dark–light |
| Penyesuaian struktur route agar guard membungkus layout yang tepat | Validasi JWT ke server atau refresh token |
| Menangani hydration persist agar redirect guard tidak salah di render pertama | Role-based access (admin/user) |
| Opsional: `navigate` setelah login ke `location.state.from` | Tombol logout penuh |

## 4. Suggested Technical Checklist

- [x] Tambah **AuthGuard**: jika tidak ada `token` → `<Navigate to="/auth/login" replace />`.
- [x] Tambah **GuestGuard**: jika ada `token` → `<Navigate to="/" replace />`; jika tidak → `<Outlet />`.
- [x] Bungkus route utama dengan AuthGuard; bungkus route auth dengan GuestGuard.
- [x] Samakan path dengan navigasi yang sudah ada.
- [x] Tangani **rehydration**: tunggu persist selesai sebelum memutuskan redirect.
- [x] (Opsional) Di `useLogin` → `onSuccess`, redirect ke `location.state.from` jika ada.
- [x] Uji manual skenario di blackbox test plan.

## 5. Acceptance Criteria

- [x] Mengakses route terlindungi tanpa token → dialihkan ke `/auth/login`.
- [x] Login sukses → masuk ke `/`.
- [x] User yang sudah login membuka `/auth/login` atau `/auth/register` → dialihkan ke `/`.
- [x] Refresh pada halaman terlindungi saat sudah login → tetap di area aplikasi.
- [x] Login dengan kredensial salah → tetap muncul toast error; tidak ada redirect tidak diinginkan.

## 6. Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Akses app tanpa login | Buka tab baru, navigasi langsung ke `/` | Redirect ke `/auth/login`. |
| 2 | Login valid | Isi username/password benar, submit | Masuk ke `/`, tidak stuck di login. |
| 3 | Login invalid | Password salah, submit | Toast error; tetap di halaman login; tidak redirect ke register. |
| 4 | Deep link ke auth saat sudah login | Login sukses, lalu buka manual `/auth/register` | Redirect ke `/`. |
| 5 | Refresh saat sudah login | Di `/`, refresh (F5) | Tetap di `/`, tidak ke login. |
| 6 | Bookmark URL protected | Logout, paste `/` di address bar | Redirect ke login. |
| 7 | (Jika `from` diimplementasi) | Tanpa login, akses `/` → login | Kembali ke halaman yang diminta. |

## 7. Notes

- Letak file guard: `src/features/auth/guards/` sesuai struktur fitur auth.
- File yang disentuh: `src/routes/index.tsx`, `src/features/auth/auth.store.ts` (hydration), `src/features/auth/auth.hook.ts`.
