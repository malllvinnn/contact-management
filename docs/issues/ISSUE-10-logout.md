# Issue #10 — Logout — clear session dan redirect ke login

| Meta | Detail |
|------|--------|
| **Status** | CLOSED |
| **Labels** | `enhancement`, `auth` |
| **Dibuat** | 2026-03-26 |
| **Ditutup** | 2026-03-26 |

## 1. Context

- User sudah bisa login; token dan user disimpan di `useAuthStore` (Zustand + persist).
- Belum ada cara resmi untuk mengakhiri sesi dari dalam aplikasi.
- Backend menyediakan endpoint `DELETE /api/users/current` dengan header `Authorization: Bearer <token>` untuk revoke token di sisi server.
- `MainLayout` masih placeholder; area header cocok untuk tombol logout sementara sebelum issue polish UI.

## 2. Goals

1. User dapat **logout** dari area aplikasi utama (setelah login).
2. Token di-revoke ke server via `DELETE /api/users/current`.
3. Setelah logout: token dan user **terhapus** dari store (dan persist), user **dialihkan** ke `/auth/login`.
4. Implementasi **minimal dan fungsional** — tombol sederhana di `MainLayout` tanpa styling berat.

## 3. Scope of Work

| In scope | Out of scope |
|----------|--------------|
| `authService.logout()` — hit `DELETE /api/users/current` | Desain final, navbar, avatar, dropdown |
| `useLogout` hook dengan `useMutation` | Konfirmasi modal "Yakin logout?" |
| `onSuccess`: `clearAuth()` + `navigate("/auth/login", { replace: true })` | Dark/light mode dan tema |
| `onError`: toast error | — |
| Tombol logout di `MainLayout` | — |

## 4. Suggested Technical Checklist

- [x] Tambah `logout` di `src/features/auth/auth.service.ts` — `DELETE /api/users/current`.
- [x] Tambah `useLogout` hook di `src/features/auth/auth.hook.ts` menggunakan `useMutation`.
- [x] `onSuccess`: panggil `clearAuth()` dari store + `toast.success("Berhasil logout")` + `navigate("/auth/login", { replace: true })`.
- [x] `onError`: tampilkan toast error.
- [x] Di `MainLayout`, tambah tombol yang memanggil `mutate` dari `useLogout`.
- [x] Pastikan setelah logout, akses `/` tanpa login kembali terblokir oleh `AuthGuard`.

## 5. Acceptance Criteria

- [x] Dari halaman utama, klik logout → request `DELETE /api/users/current` terkirim → user diarahkan ke `/auth/login`.
- [x] Setelah logout, `localStorage` tidak lagi menyimpan token/user.
- [x] User yang sudah logout tidak bisa mengakses route terlindungi tanpa login ulang.
- [x] Jika request logout gagal, toast error tampil — tidak crash.
- [x] Tidak ada error runtime di console saat logout.

## 6. Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Logout normal | Login → buka `/` → klik Logout | Request ke API berhasil, redirect ke `/auth/login`. |
| 2 | Token hilang dari storage | Setelah logout, buka DevTools → Application → Local Storage | Entri `auth-storage` kosong / tidak berisi token. |
| 3 | Akses protected setelah logout | Ketik URL `/` di address bar | Redirect ke login (AuthGuard). |
| 4 | Login ulang | Login lagi dengan kredensial valid | Masuk ke `/` normal. |
| 5 | Back browser | Setelah logout, tekan tombol Back | Tidak kembali ke halaman protected. |

## 7. Notes

- File yang disentuh: `src/features/auth/auth.service.ts`, `src/features/auth/auth.hook.ts`, `src/layouts/MainLayout.tsx`.
- Token dikirim otomatis via axios request interceptor — tidak perlu set header manual di service.
- Konfirmasi modal "Yakin logout?" — dikerjakan di issue polish UI.
