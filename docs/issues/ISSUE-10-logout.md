# Logout — clear session dan redirect ke login

## 1. Context
- User sudah bisa login; token dan user disimpan di `useAuthStore` (Zustand + persist).
- Belum ada cara resmi untuk mengakhiri sesi dari dalam aplikasi — user harus menghapus storage manual atau menunggu token tidak dipakai.
- Backend menyediakan endpoint `DELETE /api/users/current` dengan header `Authorization: Bearer <token>` untuk revoke token di sisi server.
- `MainLayout` masih placeholder; area header cocok untuk tombol logout sementara sebelum issue polish UI.

## 2. Goals
1. User dapat **logout** dari area aplikasi utama (setelah login).
2. Token di-revoke ke server via `DELETE /api/users/current`.
3. Setelah logout: token dan user **terhapus** dari store (dan persist), user **dialihkan** ke `/auth/login`.
4. Implementasi **minimal dan fungsional** — tombol sederhana di `MainLayout` tanpa styling berat (polish UI di issue terpisah).

## 3. Scope of work
| In scope | Out of scope |
|----------|----------------|
| `authService.logout()` — hit `DELETE /api/users/current` | Desain final, navbar, avatar, dropdown |
| `useLogout` hook dengan `useMutation` | Konfirmasi modal "Yakin logout?" (ditambah di issue UI) |
| `onSuccess`: `clearAuth()` + `navigate("/auth/login", { replace: true })` | Dark/light mode dan tema |
| `onError`: toast error | — |
| Tombol logout di `MainLayout` | — |

## 4. Suggested technical checklist
- [x] Tambah `logout` di `src/features/auth/auth.service.ts` — `DELETE /api/users/current` (token dikirim otomatis via axios interceptor).
- [x] Tambah `useLogout` hook di `src/features/auth/auth.hook.ts` menggunakan `useMutation`.
- [x] `onSuccess`: panggil `clearAuth()` dari store + `toast.success("Berhasil logout")` + `navigate("/auth/login", { replace: true })`.
- [x] `onError`: panggil `errorHookResponse(error)` untuk tampilkan toast error.
- [x] Di `MainLayout`, tambah tombol (`Button` dari `@/components/ui/button`) yang memanggil `mutate` dari `useLogout`.
- [x] Pastikan setelah logout, akses `/` tanpa login kembali terblokir oleh `AuthGuard` (regresi cepat).

## 5. Acceptance criteria
- [x] Dari halaman utama (area `MainLayout`), klik logout → request `DELETE /api/users/current` terkirim → user diarahkan ke `/auth/login`.
- [x] Setelah logout, `localStorage` tidak lagi menyimpan token/user (state kosong setelah rehydrate).
- [x] User yang sudah logout tidak bisa mengakses route terlindungi tanpa login ulang.
- [x] Jika request logout gagal (misal token sudah expired), toast error tampil — tidak crash.
- [x] Tidak ada error runtime di console saat logout.

## 6. Blackbox test plan
| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Logout normal | Login → buka `/` → klik Logout | Request ke API berhasil, redirect ke `/auth/login`. |
| 2 | Token hilang dari storage | Setelah logout, buka DevTools → Application → Local Storage | Entri `auth-storage` kosong / tidak berisi token. |
| 3 | Akses protected setelah logout | Ketik URL `/` di address bar | Redirect ke login (AuthGuard). |
| 4 | Login ulang | Login lagi dengan kredensial valid | Masuk ke `/` normal. |
| 5 | Back browser | Setelah logout, tekan tombol Back | Tidak kembali ke halaman protected (replace + guard aman). |

## 7. Notes
- File yang disentuh: `src/features/auth/auth.service.ts`, `src/features/auth/auth.hook.ts`, `src/layouts/MainLayout.tsx`.
- Token dikirim otomatis via axios request interceptor yang sudah ada — tidak perlu set header manual di service.
- Konfirmasi modal "Yakin logout?" — dikerjakan di issue polish UI, bukan di sini.
- **Label:** `enhancement`, `auth`.
