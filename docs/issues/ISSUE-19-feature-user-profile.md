# Issue #19 — Feature User Profile: `user.service`, `user.hook`, schema, dan halaman Profile

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `ui`, `api-integration` |
| **Dibuat** | 2026-03-30 |
| **Ditutup** | — |
| **Depends on** | Issue #17 (routing `/dashboard/profile`) |

## Context

Aplikasi perlu menyediakan halaman profile user yang memungkinkan user melihat dan memperbarui data dirinya. API yang digunakan:

- **`GET /api/users/current`** — Fetch data user yang sedang login.
- **`PATCH /api/users/current`** — Update name dan/atau password user.

Kedua endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Mengikuti pola arsitektur yang sudah ada (`features/auth/`), fitur ini dipisahkan ke folder `features/user/`.

## Goals

- Buat feature folder `src/features/user/` dengan service, hook, schema, dan types.
- Implementasi `GET /api/users/current` untuk menampilkan data profil di form.
- Implementasi `PATCH /api/users/current` untuk submit perubahan name dan/atau password.
- Buat halaman `ProfilePage` di `/dashboard/profile` dengan form update profil.
- Setelah update sukses, sync `name` di `useAuthStore` agar navbar langsung reflect perubahan.
- Password pada form update bersifat **opsional** (tidak wajib diisi).

## API Reference

### GET /api/users/current
```
Response 200:
{
  "success": true,
  "data": { "username": "cah_ganteng", "name": "Muhammad Malfin" }
}
```

### PATCH /api/users/current
```
Request Body (semua field opsional, minimal salah satu harus ada):
{ "name": "Budi Sudarsono", "password": "rahasia123" }

Response 200:
{
  "success": true,
  "data": { "username": "cah_ganteng", "name": "Budi Sudarsono" }
}
```

## Scope of Work

**Struktur file yang dibuat/dimodifikasi:**

```
src/features/user/
├── user.types.ts       # Type UpdateUserPayload, dll
├── user.schema.ts      # Zod schema untuk form update (name opsional, password opsional)
├── user.service.ts     # getProfile(), updateProfile()
└── user.hook.ts        # useGetProfile(), useUpdateProfile()

src/pages/
└── ProfilePage.tsx     # Halaman profile dengan form update

src/features/auth/
└── auth.store.ts       # Update setAuth / tambah action updateUser untuk sync name
```

**Out of scope**

- Upload foto profil / avatar.
- Perubahan username (tidak didukung API).
- Validasi server-side selain error response handling.

## Suggested Technical Checklist

### `user.types.ts`
- [ ] Definisikan type `UpdateUserPayload { name?: string; password?: string }`.

### `user.schema.ts`
- [ ] Buat Zod schema `updateUserSchema`:
  - `name`: string, min 1 karakter, **opsional** (`.optional()` atau empty string allowed).
  - `password`: string, min 8 karakter, **opsional**.
  - Tambah `.refine()` agar minimal salah satu field harus diisi.
- [ ] Export `UpdateUserValues` type dari schema.

### `user.service.ts`
- [ ] `getProfile()`: `GET /api/users/current` → return `ApiResponse<User>`.
- [ ] `updateProfile(payload)`: `PATCH /api/users/current` → return `ApiResponse<User>`.

### `user.hook.ts`
- [ ] `useGetProfile()`: `useQuery` dengan `queryKey: ['profile']`.
- [ ] `useUpdateProfile()`: `useMutation`:
  - `onSuccess`: toast sukses + update `name` di `useAuthStore` (via `setAuth` atau action baru) + `invalidateQueries(['profile'])`.
  - `onError`: gunakan `errorHookResponse(error)`.

### `auth.store.ts`
- [ ] Tambah action `updateUser(user: Partial<User>)` untuk update `name` di store tanpa clear token.

### `ProfilePage.tsx`
- [ ] Fetch data profil via `useGetProfile()` dan pre-fill form.
- [ ] Form field: **Name** (text), **Password baru** (password — opsional), **Konfirmasi Password** (opsional, harus match).
- [ ] Field **Username** ditampilkan sebagai readonly/disabled (tidak bisa diubah).
- [ ] Submit via `useUpdateProfile()`, kirim hanya field yang terisi.
- [ ] Loading state saat fetch dan submit.
- [ ] Error handling pada form (pesan di bawah field via `react-hook-form` + `zodResolver`).
- [ ] Styling: mengikuti design system proyek (shadcn components: `Card`, `Input`, `Button`, `Label`).

## Acceptance Criteria

- Halaman `/dashboard/profile` menampilkan data user yang sedang login (username readonly, name terisi otomatis dari API).
- User dapat mengubah name dan/atau password.
- Password bersifat opsional — form valid meski field password kosong (asalkan name diisi minimal 1 karakter, atau sebaliknya).
- Setelah update sukses, name di navbar/dropdown langsung berubah tanpa re-login.
- Error dari API (400, 401) ditampilkan via toast.
- Loading spinner/disabled state aktif saat fetching dan submitting.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Tampil data profil | Buka `/dashboard/profile` | Form pre-filled dengan `name` dari API; `username` readonly |
| 2 | Update name saja | Ubah name, kosongkan password, submit | Sukses; name di navbar berubah; toast muncul |
| 3 | Update password saja | Kosongkan name, isi password baru (≥8 char), submit | Sukses; toast muncul |
| 4 | Update keduanya | Isi name baru + password baru, submit | Sukses; name di navbar berubah |
| 5 | Form kosong semua | Tidak mengubah apapun, klik submit | Validasi gagal — setidaknya 1 field harus diisi |
| 6 | Password terlalu pendek | Isi password < 8 karakter, submit | Error validasi Zod muncul di bawah field |
| 7 | Error API | Simulasi 401 (token expired) | Toast error muncul |

## Notes

- Validasi password konfirmasi (`confirmPassword`) cukup di sisi frontend via Zod `.refine()` — tidak dikirim ke API.
- Gunakan `react-hook-form` + `@hookform/resolvers/zod` sesuai pola yang sudah ada di `auth.schema.ts`.
- Untuk men-sync store setelah update, pertimbangkan `setAuth(token, updatedUser)` dengan token yang sudah ada, atau tambah action `updateUser` yang hanya update field `user` di store.
