# Issue #15 — Styling halaman auth, halaman utama, dan layout terkait

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `enhancement`, `ui`, `responsive design` |
| **Dibuat** | 2026-03-27 |
| **Ditutup** | — |

## Context

Aplikasi Contact Management sudah memiliki fondasi teknis yang siap: routing (`/auth/login`, `/auth/register`, `/`), guard (`GuestGuard`, `AuthGuard`), `AuthLayout` untuk rute auth, `MainLayout` untuk area setelah login, serta integrasi tema (next-themes, FOUC guard di `index.html`). Halaman dan form masih berada pada tahap fungsional/minimal UI.

Issue ini mengarahkan pekerjaan ke **polish UI/UX** untuk alur masuk dan shell aplikasi utama, tanpa mengubah kontrak API atau logika bisnis auth kecuali diperlukan untuk konsistensi UI.

**Fokus wajib:** UI harus **responsif** — layout, tipografi, dan kontrol interaktif harus terbaca dan dapat digunakan di berbagai lebar viewport (mobile kecil hingga desktop lebar), tanpa scroll horizontal yang tidak disengaja dan tanpa elemen saling menindih.

## Goals

- Memberikan tampilan yang konsisten, dapat diakses, dan selaras dengan design tokens (Tailwind v4 + shadcn) pada halaman login, register, dan shell halaman utama.
- Memperjelas hierarki visual: area auth terasa jelas sebagai "gate", area utama terasa sebagai "workspace" kontak.
- Memastikan layout (Auth + Main) mendukung pola yang sama di light/dark mode.
- **Responsif:** semua layar dalam scope memenuhi perilaku yang dijelaskan di bagian Responsive requirements di bawah.

## Responsive Requirements

Gunakan pendekatan **mobile-first** (base = layar sempit, lalu `sm` / `md` / `lg` untuk penyesuaian).

| Area | Perilaku yang diharapkan |
|------|--------------------------|
| **Auth (login/register)** | Kartu/form punya lebar maksimum (`max-w-*`) dan padding horizontal aman (`px-4` atau setara); tidak overflow horizontal; tombol full-width di mobile boleh, di desktop boleh inline. |
| **MainLayout header** | Baris header tidak memaksa overflow: gunakan `flex-wrap`, `gap`, atau stack vertikal di breakpoint kecil; theme toggle + logout tetap dapat dijangkau (area sentuh ≥ ~44px). |
| **Konten utama (`Outlet`)** | Padding konsisten (`px-4 sm:px-6 lg:px-8` atau pola setara); konten tidak menempel ke tepi viewport. |
| **Tipografi** | Skala heading tidak "pecah" di mobile; pertimbangkan `text-balance` / `text-pretty` pada judul panjang. |
| **Keyboard & sentuh** | Target sentuh tidak saling overlap; spacing antar kontrol cukup di layar kecil. |

**Breakpoint referensi (Tailwind default):** `sm` 40rem (640px), `md` 48rem (768px), `lg` 64rem (1024px).

## Scope of Work

**In scope**

- `AuthLayout`: struktur halaman auth (background, centering, branding opsional, link antar halaman auth) — **responsif di semua breakpoint**.
- Halaman `LoginPage` dan `RegisterPage` beserta komponen terkait (`LoginForm`, `RegisterForm`, `AuthCard`).
- `MainLayout`: header/nav minimal yang **adaptif** (wrap/stack di mobile), penempatan theme toggle + logout yang rapi di semua lebar.
- `ContactPage`: styling placeholder yang selaras dengan shell — responsif.
- Penyesuaian minor pada `index.css` jika diperlukan (`min-h-dvh`, `overflow-x`).

**Out of scope (issue terpisah)**

- Implementasi CRUD kontak lengkap.
- Perubahan besar pada skema validasi auth atau alur redirect.
- Animasi kompleks atau redesign brand penuh.

## Suggested Technical Checklist

- [ ] Review struktur route: `/auth/login`, `/auth/register`, `/` — pastikan tidak ada regresi navigasi setelah styling.
- [ ] **Responsif — auth:** `AuthLayout` + form: `w-full max-w-*`, padding horizontal, tidak ada overflow-x; uji di 320px, 375px, 768px, 1280px.
- [ ] **Responsif — main:** `MainLayout`: header `flex` + `flex-wrap` atau grid; theme toggle + logout tidak keluar viewport.
- [ ] `LoginForm` / `RegisterForm`: alignment field, spacing, pesan error/loading konsisten.
- [ ] Link "Sudah punya akun?" / "Belum punya akun?" jelas dan dapat dijangkau dari keyboard.
- [ ] `ContactPage`: heading + copy singkat + empty state visual ringan; responsif.
- [ ] Verifikasi tidak ada FOUC baru setelah perubahan layout.
- [ ] Tidak menambahkan sumber kebenaran tema kedua.

## Acceptance Criteria

- Login dan register terlihat konsisten secara tipografi, spacing, dan warna dengan token proyek.
- **Responsif:** tidak ada scroll horizontal yang tidak disengaja pada viewport **320px–1440px**.
- **Breakpoint:** perilaku di mobile (`<640px`), tablet (`md`), dan desktop (`lg+`) konsisten.
- Pengguna dapat beralih antara login dan register tanpa kebingungan navigasi.
- Setelah login, halaman utama memakai shell `MainLayout` yang rapi di semua ukuran layar.
- Light dan dark mode: tidak ada kontras yang membuat teks tidak terbaca.
- Tidak ada error konsol baru yang relevan dengan perubahan UI.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Login — mobile | Buka `/auth/login`, viewport **375×667** | Form rapi; tidak overflow horizontal; tombol/link dapat disentuh tanpa overlap. |
| 2 | Login — sempit | Viewport **320×568** | Tetap usable; tidak ada elemen terpotong. |
| 3 | Register — tablet | Viewport **768×1024** | Layout seimbang; max-width terasa. |
| 4 | Register — desktop | Viewport **1280×800** | Konten terpusat; tidak meregang penuh. |
| 5 | Main — mobile | Setelah login, viewport **375** | Header tidak overflow; toggle tema + logout dapat diakses. |
| 6 | Main — desktop | Viewport **1440** | Shell konsisten; tidak ada elemen header menumpuk salah. |
| 7 | Navigasi auth | Dari login ke register dan sebaliknya | Navigasi SPA; tidak full reload. |
| 8 | Dark mode | Toggle tema di beberapa ukuran layar | Tidak flash salah; kontras tetap baik. |
| 9 | Login sukses | Login valid | Redirect ke `/`; shell utama sesuai poin #5–#6. |
| 10 | Logout / Guard | Logout; akses `/` tanpa login | Sesuai aturan app; tidak blank screen. |

## Notes

- Sebelum atau bersamaan dengan styling, disarankan **smoke test** alur auth (login/register redirect).
- Urutan pekerjaan yang disarankan: **AuthLayout + Login/Register (uji responsif dulu)** → **MainLayout + ContactPage**.
- **Safari iOS / Chrome Android (opsional):** verifikasi safe area (notch) — tambahkan `env(safe-area-inset-*)` pada padding jika header menempel ke tepi.
- Jika nanti CRUD kontak ditambahkan, shell `MainLayout` yang sudah distyle ini menjadi fondasi tanpa refactor besar.
