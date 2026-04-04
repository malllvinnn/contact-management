# Issue #3 - Implement Feature Auth Login (UI + Business Logic)

## 1. Context

Fondasi autentikasi dan pola UI untuk halaman auth sudah ada di codebase (misalnya `AuthLayout`, `AuthCard`, komponen form Shadcn untuk field dan input, serta pola toggle show/hide password dengan `react-use`). Fitur Login dapat dibangun dengan cepat dengan **menggunakan ulang** komponen dan pola tersebut, tanpa mendesain ulang layout dari nol.

Issue ini berfungsi sebagai **perencanaan kerja** (planning) agar alur UI, validasi, penyimpanan sesi (Zustand + `localStorage`), dan integrasi API login tersusun rapi sebelum atau saat implementasi.

## 2. Goals

- Menyediakan halaman dan form login yang konsisten secara visual dan teknis dengan alur register.
- Memvalidasi username dan password di klien sebelum request dikirim.
- Mengintegrasikan login dengan API melalui TanStack Query (`useLogin`), lalu pada sukses: memberi umpan balik ke pengguna, menyimpan token JWT dan data user lewat **store global Zustand** (tersinkron dengan `localStorage`), dan mengarahkan pengguna ke halaman utama aplikasi.

## 3. Scope of Work

**Termasuk**

- Membuat atau melengkapi `LoginPage.tsx` yang merender form login di dalam `AuthLayout` / `AuthCard` (polanya mengikuti halaman register).
- Membuat `LoginForm.tsx` yang:
  - memakai komponen Shadcn (`<Field>`, `<FieldLabel>`, `<FieldError>`, `<Input>` atau varian yang sama dengan register, misalnya `InputGroup` bila dipakai untuk password),
  - mengintegrasikan `react-hook-form` + resolver Zod,
  - mengimplementasikan toggle show/hide password dengan `useToggle` dari `react-use`.
- Menambahkan `LoginSchema` pada `auth.schema.ts` (Zod): **username** dan **password** wajib diisi; mengekspor type `LoginPayload` (misalnya `z.infer<typeof LoginSchema>`).
- **Global state (Zustand)**: menyediakan store autentikasi (contoh nama file: `auth.store.ts`) yang:
  - menyimpan `token` (string | null) dan data `user` yang sedang login (setidaknya `username` dan `name`, sesuai kebutuhan tipe yang dipakai di proyek),
  - menyediakan `setAuth` untuk menulis token + user sekaligus,
  - menyediakan `logout` (atau nama setara) untuk mengosongkan sesi,
  - **tersinkron dengan `localStorage`** — misalnya memakai middleware `persist` dari Zustand, atau menyimpan/membaca manual di dalam action store (pilih satu pola dan konsisten).
- Menambahkan fungsi login di layer service (`auth.service.ts` atau setara) dan hook `useLogin` (`useMutation`) yang pada respons sukses menjalankan rangkaian langkah di checklist.

**Tidak wajib dalam issue ini (kecuali diputuskan sendiri)**

- Refresh token, SSO, atau 2FA.
- Menempelkan contoh payload/response API mentah di dokumentasi repositori.

## 4. Suggested Technical Checklist

- [x] Menambahkan `LoginPayload` + type `LoginPayloadSchema` di `auth.schema.ts`.
- [x] Membuat atau merapikan store Zustand di `auth.store.ts` (atau memperluas store auth yang sudah ada—hindari duplikasi) dengan state `token`, `user`, action `setAuth`, dan `logout`, plus sinkronisasi ke `localStorage` (`persist` atau manual).
- [x] Memastikan modul lain yang membutuhkan token (misalnya interceptor Axios) membaca dari store yang sama (`getState().token`) agar tidak ada dua sumber kebenaran.
- [x] Menambahkan `login` di `auth.service.ts` yang mengirim `LoginPayload` ke endpoint login backend.
- [ ] Mengimplementasikan `useLogin` dengan `useMutation`; pada **onSuccess**:
  - [x] Tidak perlu menampilkan toast sukses karna Login.
  - [x] Mem-parse respons sukses dan mengambil **JWT** serta **data user** (`username`, `name`) dari object `data` di dalam body respons (struktur mengikuti kontrak backend: indikator sukses, pesan, dan `data` berisi token + user).
  - [x] Memanggil `setAuth` (atau setara) dari Zustand agar token dan user tersimpan di memory **dan** tercermin di `localStorage` sesuai pola persist yang dipilih.
  - [x] Redirect ke halaman utama (`/` atau `/dashboard`—tetapkan satu rute).
- [x] Membuat `LoginForm.tsx`: `useForm` + `zodResolver(LoginSchema)`, submit memanggil `mutate` dari `useLogin`.
- [x] Memastikan `LoginPage.tsx` merender `LoginForm` di dalam `AuthCard` dengan copy yang sesuai (termasuk tautan ke register jika dipakai).
- [x] Memverifikasi `<Toaster />` ada di root agar toast login terlihat.
- [x] Menangani error API (toast atau pola yang sama dengan `useRegister`).

## 5. Acceptance Criteria

- Halaman login dapat dibuka; form username dan password berfungsi; validasi Zod muncul jika field wajib kosong atau tidak memenuhi aturan.
- Submit dengan kredensial valid: request login terkirim; pada sukses muncul toast sukses; token dan user dari `data` tersimpan lewat Zustand dan dapat diobservasi setelah reload halaman (jika persist dikonfigurasi dengan benar).
- Setelah sukses, pengguna diarahkan ke `/` atau `/dashboard` sesuai keputusan tunggal di implementasi.
- `logout` mengosongkan token dan user di store dan state persist di `localStorage` konsisten (tidak menyisakan token lama yang masih dipakai interceptor).
- Toggle show/hide password tidak memicu submit form secara tidak sengaja (tombol bertipe `button` bila di dalam `<form>`).

## 6. Blackbox Test Plan

| ID    | Skenario            | Langkah                                           | Hasil yang diharapkan                                                                              |
| ----- | ------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| BT-01 | Akses halaman login | Buka rute login.                                  | UI login tampil; tidak ada error kritis di konsol.                                                 |
| BT-02 | Validasi kosong     | Submit tanpa mengisi.                             | Pesan error field; tidak ada alur sukses palsu.                                                    |
| BT-03 | Login sukses        | Isi kredensial valid; submit.                     | Toast sukses; store berisi token + user; `localStorage` sesuai persist; redirect ke halaman utama. |
| BT-04 | Login gagal         | Kredensial ditolak API.                           | Umpan balik error; store tidak berisi sesi sukses baru.                                            |
| BT-05 | Persist sesi        | Setelah login sukses, refresh halaman.            | Token/user masih tersedia dari persist (jika itu requirement produk).                              |
| BT-06 | Logout              | Panggil logout dari UI atau aksi yang disediakan. | Token dan user hilang dari store dan storage.                                                      |
| BT-07 | Toggle password     | Klik show/hide beberapa kali.                     | Input berubah tipe; form tidak submit karena tombol toggle.                                        |

## 7. Notes

- Jika proyek sudah memiliki store auth (misalnya `useAuthStore.ts`), **perluas atau konsolidasikan** ke satu store saja daripada menambah file baru yang bentrok; nama `auth.store.ts` di atas bersifat ilustratif.
- Samakan key `localStorage` dengan yang dibaca saat aplikasi cold start agar persist tidak "hilang" setelah refresh.
- Pilih satu rute pasca-login dan dokumentasikan di commit/PR pribadi agar tidak ragu antara `/` dan `/dashboard`.
