# Issue #5 — Implement Feature Auth Login (UI + Business Logic)

| Meta | Detail |
|------|--------|
| **Status** | CLOSED |
| **Labels** | `enhancement`, `auth` |
| **Dibuat** | 2026-03-24 |
| **Ditutup** | 2026-03-25 |

## 1. Context

Fondasi autentikasi dan pola UI untuk halaman auth sudah ada di codebase (misalnya `AuthLayout`, `AuthCard`, komponen form Shadcn untuk field dan input, serta pola toggle show/hide password dengan `react-use`). Fitur Login dapat dibangun dengan cepat dengan **menggunakan ulang** komponen dan pola tersebut, tanpa mendesain ulang layout dari nol.

Issue ini berfungsi sebagai **perencanaan kerja** (planning) agar alur UI, validasi, penyimpanan sesi (Zustand + `localStorage`), dan integrasi API login tersusun rapi sebelum atau saat implementasi.

## 2. Goals

- Menyediakan halaman dan form login yang konsisten secara visual dan teknis dengan alur register.
- Memvalidasi username dan password di klien sebelum request dikirim.
- Mengintegrasikan login dengan API melalui TanStack Query (`useLogin`), lalu pada sukses: memberi umpan balik ke pengguna, menyimpan token JWT dan data user lewat **store global Zustand** (tersinkron dengan `localStorage`), dan mengarahkan pengguna ke halaman utama aplikasi.

## 3. Scope of Work

**Termasuk**

- Membuat atau melengkapi `LoginPage.tsx` yang merender form login di dalam `AuthLayout` / `AuthCard`.
- Membuat `LoginForm.tsx` yang:
  - memakai komponen Shadcn (`<Field>`, `<FieldLabel>`, `<FieldError>`, `<Input>` atau varian yang sama dengan register),
  - mengintegrasikan `react-hook-form` + resolver Zod,
  - mengimplementasikan toggle show/hide password dengan `useToggle` dari `react-use`.
- Menambahkan `LoginSchema` pada `auth.schema.ts` (Zod): **username** dan **password** wajib diisi; mengekspor type `LoginPayload`.
- **Global state (Zustand)**: store autentikasi (`auth.store.ts`) yang menyimpan `token` dan `user`, menyediakan `setAuth` dan `logout`, tersinkron dengan `localStorage`.
- Menambahkan fungsi login di layer service dan hook `useLogin` (`useMutation`).

**Tidak wajib dalam issue ini**

- Refresh token, SSO, atau 2FA.

## 4. Suggested Technical Checklist

- [x] Menambahkan `LoginPayload` + `LoginPayloadSchema` di `auth.schema.ts`.
- [x] Membuat/merapikan store Zustand di `auth.store.ts` dengan state `token`, `user`, action `setAuth`, `logout`, plus sinkronisasi ke `localStorage`.
- [x] Memastikan interceptor Axios membaca token dari store yang sama.
- [x] Menambahkan `login` di `auth.service.ts`.
- [ ] Mengimplementasikan `useLogin` dengan `useMutation`; pada **onSuccess**:
  - [x] Tidak perlu toast sukses saat login.
  - [x] Parse respons dan ambil JWT + data user dari `data`.
  - [x] Panggil `setAuth` dari Zustand.
  - [x] Redirect ke `/`.
- [x] Membuat `LoginForm.tsx`: `useForm` + `zodResolver(LoginSchema)`.
- [x] Memastikan `LoginPage.tsx` merender `LoginForm` di dalam `AuthCard`.
- [x] Memverifikasi `<Toaster />` ada di root.
- [x] Menangani error API.

## 5. Acceptance Criteria

- Halaman login dapat dibuka; form username dan password berfungsi; validasi Zod muncul jika field wajib kosong.
- Submit dengan kredensial valid: token dan user tersimpan lewat Zustand; redirect ke `/`.
- `logout` mengosongkan token dan user di store dan `localStorage`.
- Toggle show/hide password tidak memicu submit form secara tidak sengaja.

## 6. Blackbox Test Plan

| ID | Skenario | Langkah | Ekspektasi |
|----|----------|---------|------------|
| BT-01 | Akses halaman login | Buka rute login | UI login tampil; tidak ada error kritis di konsol. |
| BT-02 | Validasi kosong | Submit tanpa mengisi | Pesan error field; tidak ada alur sukses palsu. |
| BT-03 | Login sukses | Isi kredensial valid; submit | Store berisi token + user; redirect ke halaman utama. |
| BT-04 | Login gagal | Kredensial ditolak API | Umpan balik error; store tidak berisi sesi sukses baru. |
| BT-05 | Persist sesi | Setelah login sukses, refresh halaman | Token/user masih tersedia dari persist. |
| BT-06 | Logout | Panggil logout dari UI | Token dan user hilang dari store dan storage. |
| BT-07 | Toggle password | Klik show/hide beberapa kali | Input berubah tipe; form tidak submit karena tombol toggle. |

## 7. Notes

- Jika proyek sudah memiliki store auth, **perluas atau konsolidasikan** ke satu store saja.
- Samakan key `localStorage` dengan yang dibaca saat aplikasi cold start.
- Pilih satu rute pasca-login (`/`) dan konsisten.
