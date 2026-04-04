# Issue #2 - Implement Feature Auth Register (UI + Business Logic)

## Context

Mengimplementasikan fitur autentikasi (Register) untuk aplikasi. Fokus *issue* ini adalah merancang alur *end-to-end* mulai dari pembuatan komponen UI, validasi *client-side*, penanganan *business logic*, hingga integrasi dengan *endpoint* API sesuai spesifikasi dokumen *backend*.

## Goals

- Mengganti favicon project dengan icon baru (sumber bebas, contoh: Freepik).
- Membangun UI feature register yang konsisten dengan layout auth.
- Mengimplementasikan business logic register berbasis API.
- Memastikan validasi register berjalan baik dan lolos blackbox testing.
- Menjamin implementasi sesuai API Spesifikasi MD dari Docs BE.

## Scope of Work

### 1) UI and Layout

- Gunakan `AuthLayout` (sudah tersedia) untuk halaman auth.
- Buat `RegisterPage.tsx` dan integrasikan ke routing/pages + layout.
- Siapkan komponen reusable di folder `components/`, minimal:
  - `AuthCard` (dipakai register sekarang, login nanti).
  - `RegisterForm`.
  - Komponen input/button/helper text bila dibutuhkan agar konsisten dan reusable.

### 2) Types and Schema

- Pastikan types untuk payload request/response register sudah sesuai kontrak API.
- Tambahkan schema validasi form register.
  - **Rekomendasi:** gunakan `zod` untuk validasi schema agar konsisten, aman, dan mudah di-maintain.
  - Jika `zod` belum terpasang, install pada tahap ini.

### 3) Service and Hooks

- Buat layer service untuk logic hit API register menggunakan instance axios/base URL yang sudah disiapkan.
- Buat hooks (TanStack Query) sebagai layer konsumsi service:
  - mutation register
  - state loading/success/error
  - mapping error message dari API ke UI

### 4) Integration

- Implementasikan feature register dari layer feature ke pages + layout.
- Pastikan alur submit form -> request API -> handling response berjalan end-to-end.

## Suggested Technical Checklist

- [x] Update favicon project.
- [x] Jalankan `npx shadcn@latest add field` (otomatis install react-hook-form & zod beserta UI komponennya).
- [x] Jalankan `npx shadcn@latest add sonner` (untuk notifikasi toast).
- [x] Jalankan `npx shadcn@latest add input` (jika belum ada).
- [x] Buat/rapikan `RegisterPage.tsx` dan `AuthLayout.tsx`.
- [x] Buat reusable component `AuthCard`.
- [x] Buat component `RegisterForm`.
- [x] Rapikan `types` register sesuai API spec.
- [x] Tambahkan schema validasi (disarankan `zod`).
- [x] Implement service register (axios).
- [x] Implement hooks register (TanStack Query mutation).
- [x] Integrasikan ke routing/pages + `AuthLayout`.
- [x] Implementasi `useForm` pada Komponen `RegisterForm`
- [x] Tampilkan feedback UI untuk loading, success, dan error.
- [x] Handle error response API (validation error/general error).
- [x] Verifikasi blackbox test register.

## Acceptance Criteria

- User bisa mengakses halaman register melalui route yang benar.
- Form register memiliki validasi client-side yang jelas dan informatif.
- Request register terkirim ke endpoint backend yang benar.
- Response sukses ditangani dengan menampilkan notifikasi berhasil dan otomatis redirect ke halaman `/login`.
- Error dari API tampil dengan pesan yang bisa dipahami user.
- Implementasi sesuai API Spesifikasi MD di Docs BE.
- Komponen utama auth register reusable dan siap dipakai ulang untuk login flow.

## Blackbox Test Plan

- Input valid -> register sukses.
- Input invalid (email format salah, password lemah, field kosong) -> validasi tampil.
- Email sudah terdaftar -> error API tertangani dan tampil di UI.
- Simulasi jaringan/API error -> fallback error message tampil.
- Tombol submit/UX saat loading berjalan benar (disable button, indicator).

## Notes

- Prioritas issue ini fokus register terlebih dahulu; struktur komponen diusahakan reusable agar implementasi login lebih cepat di issue berikutnya.
