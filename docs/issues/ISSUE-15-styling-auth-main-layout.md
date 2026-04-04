# Styling halaman auth, halaman utama, dan layout terkait

## Context

Aplikasi Contact Management sudah memiliki fondasi teknis yang siap: routing (`/auth/login`, `/auth/register`, `/`), guard (`GuestGuard`, `AuthGuard`), `AuthLayout` untuk rute auth, `MainLayout` untuk area setelah login, serta integrasi tema (next-themes, FOUC guard di `index.html`). Halaman dan form masih berada pada tahap fungsional/minimal UI.

Issue ini mengarahkan pekerjaan ke **polish UI/UX** untuk alur masuk dan shell aplikasi utama, tanpa mengubah kontrak API atau logika bisnis auth kecuali diperlukan untuk konsistensi UI.

**Fokus wajib:** UI harus **responsif** — layout, tipografi, dan kontrol interaktif harus terbaca dan dapat digunakan di berbagai lebar viewport (mobile kecil hingga desktop lebar), tanpa scroll horizontal yang tidak disengaja dan tanpa elemen saling menindih.

## Goals

- Memberikan tampilan yang konsisten, dapat diakses, dan selaras dengan design tokens (Tailwind v4 + shadcn) pada halaman login, register, dan shell halaman utama.
- Memperjelas hierarki visual: area auth terasa jelas sebagai "gate", area utama terasa sebagai "workspace" kontak.
- Memastikan layout (Auth + Main) mendukung pola yang sama di light/dark mode.
- **Responsif:** semua layar dalam scope memenuhi perilaku yang dijelaskan di bagian [Responsive requirements](#responsive-requirements) di bawah.

## Responsive requirements

Gunakan pendekatan **mobile-first** (base = layar sempit, lalu `sm` / `md` / `lg` untuk penyesuaian).

| Area | Perilaku yang diharapkan |
|------|---------------------------|
| **Auth (login/register)** | Kartu/form punya lebar maksimum (`max-w-*`) dan padding horizontal aman (`px-4` atau setara); tidak overflow horizontal; tombol full-width di mobile boleh, di desktop boleh inline sesuai desain. |
| **MainLayout header** | Baris header tidak memaksa overflow: gunakan `flex-wrap`, `gap`, atau stack vertikal di breakpoint kecil; theme toggle + logout tetap dapat dijangkau (area sentuh ≥ ~44px). |
| **Konten utama (`Outlet`)** | Padding konsisten (`px-4 sm:px-6 lg:px-8` atau pola setara); konten tidak menempel ke tepi viewport. |
| **Tipografi** | Skala heading tidak "pecah" di mobile; pertimbangkan `text-balance` / `text-pretty` pada judul panjang jika perlu. |
| **Keyboard & sentuh** | Target sentuh tidak saling overlap; spacing antar kontrol cukup di layar kecil. |

**Breakpoint referensi (Tailwind default):** `sm` 40rem (640px), `md` 48rem (768px), `lg` 64rem (1024px). Sesuaikan dengan token proyek jika ada override.

## Scope of work

**In scope**

- `AuthLayout`: struktur halaman auth (background, centering, branding opsional, link antar halaman auth) — **responsif di semua breakpoint di atas**.
- Halaman `LoginPage` dan `RegisterPage` beserta komponen terkait (`LoginForm`, `RegisterForm`, `AuthCard` jika dipakai).
- `MainLayout`: header/nav minimal yang **adaptif** (wrap/stack di mobile), area konten utama, penempatan theme toggle + logout yang rapi di semua lebar.
- `ContactPage` (halaman utama saat ini): styling placeholder yang selaras dengan shell (judul, spacing, empty state ringan) — responsif.
- Penyesuaian minor pada `index.css` hanya jika diperlukan untuk pola layout global (misalnya `min-h-dvh` pada `body`, `overflow-x` jika perlu mencegah scroll horizontal global).

**Out of scope (issue terpisah)**

- Implementasi CRUD kontak lengkap (list, form, modal, API integration UI).
- Perubahan besar pada skema validasi auth atau alur redirect kecuali bug blocker terbukti saat Testing.
- Animasi kompleks atau redesign brand penuh.

## Suggested technical checklist

- [x] Review struktur route: `/auth/login`, `/auth/register`, `/` — pastikan tidak ada regresi navigasi setelah styling.
- [x] **Responsif — auth:** `AuthLayout` + form: `w-full max-w-*`, padding horizontal, tidak ada overflow-x; uji di 320px, 375px, 768px, 1280px (DevTools atau perangkat nyata).
- [x] **Responsif — main:** `MainLayout`: header `flex` + `flex-wrap` atau grid; theme toggle + logout tidak keluar viewport; uji orientasi portrait/landscape di mobile jika memungkinkan.
- [x] `LoginForm` / `RegisterForm`: alignment field, spacing, pesan error/loading konsisten dengan komponen form existing (`InputField`, `ButtonField`, dll.).
- [x] Link "Sudah punya akun?" / "Belum punya akun?" (atau setara) jelas dan dapat dijangkau dari keyboard.
- [x] `ContactPage`: heading + copy singkat + empty state visual ringan (tanpa logika kontak berat); responsif seperti konten utama lain.
- [x] Verifikasi tidak ada FOUC baru setelah perubahan layout (tetap selaras dengan script tema di `index.html`).
- [x] Tidak menambahkan sumber kebenaran tema kedua (tetap `next-themes` + store mirror opsional bila sudah ada).

## Acceptance criteria

- Login dan register terlihat konsisten secara tipografi, spacing, dan warna dengan token proyek.
- **Responsif:** tidak ada scroll horizontal yang tidak disengaja pada viewport **320px–1440px** untuk halaman dalam scope; layout auth dan main layout tetap usable.
- **Breakpoint:** perilaku di mobile (`<640px`), tablet (`md`), dan desktop (`lg+`) konsisten dengan goals di [Responsive requirements](#responsive-requirements).
- Pengguna dapat beralih antara login dan register tanpa kebingungan navigasi.
- Setelah login, halaman utama memakai shell `MainLayout` yang rapi: header jelas, konten berpadding konsisten, theme toggle dan logout dapat diakses di semua ukuran layar yang diuji.
- Light dan dark mode: tidak ada kontras yang membuat teks tidak terbaca; tidak ada regresi pada perilaku tema.
- Tidak ada error konsol baru yang relevan dengan perubahan UI.

## Blackbox test plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Login — mobile | Buka `/auth/login`, viewport **375×667** | Form dan layout rapi; tidak overflow horizontal; tombol/link dapat disentuh tanpa overlap. |
| 2 | Login — sempit | Viewport **320×568** | Tetap usable; tidak ada elemen terpotong atau memaksa scroll horizontal. |
| 3 | Register — tablet | Viewport **768×1024** | Layout seimbang; kartu/form tidak terlalu lebar mengambang (max-width terasa). |
| 4 | Register — desktop | Viewport **1280×800** atau lebih | Konten terpusat/terbatas lebar sesuai desain; tidak meregang penuh tidak nyaman. |
| 5 | Main — mobile | Setelah login, viewport **375** | Header tidak overflow; toggle tema + logout dapat diakses; konten utama berpadding. |
| 6 | Main — desktop | Viewport **1440** | Shell konsisten; tidak ada elemen header "terpotong" atau menumpuk salah. |
| 7 | Navigasi auth | Dari login ke register dan sebaliknya | Navigasi SPA; tidak full reload tidak perlu kecuali memang diharapkan. |
| 8 | Dark mode | Toggle tema di beberapa ukuran layar | Tidak flash salah; kontras tetap baik. |
| 9 | Login sukses | Login valid | Redirect ke `/`; shell utama sesuai poin #5–#6. |
| 10 | Logout / Guard | Logout; akses `/` tanpa login | Sesuai aturan app; tidak blank screen. |

## Notes

- Sebelum atau bersamaan dengan styling, disarankan **smoke test** alur auth (login/register redirect) agar tidak memoles UI di atas bug alur.
- Urutan pekerjaan yang disarankan: **AuthLayout + Login/Register (uji responsif dulu)** → **MainLayout + ContactPage (uji responsif)**; fitur kontak penuh dapat di-issue terpisah.
- **Safari iOS / Chrome Android (opsional):** jika ada perangkat nyata, verifikasi safe area (notch) — tambahkan `env(safe-area-inset-*)` pada padding jika header menempel ke tepi.
- Jika nanti CRUD kontak ditambahkan, shell `MainLayout` yang sudah distyle ini menjadi fondasi tanpa refactor besar.
