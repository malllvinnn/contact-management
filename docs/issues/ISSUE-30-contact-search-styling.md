# Issue #30 — Search Contact: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #29 (Search Contact API + MVP) |

## Context

Fitur Search/List Contact sudah fungsional (Issue #29) — list kontak tampil di `DashboardPage` dengan pencarian dan paginasi dasar. Issue ini fokus pada **polish visual** halaman dashboard agar menjadi halaman utama yang menarik, responsif, dan memberikan UX yang baik.

## Goals

- Polish tampilan list kontak menggunakan `Card` atau tabel yang rapi.
- Implementasi loading skeleton untuk list (bukan teks "Loading...").
- Empty state yang informatif dan menarik.
- Input search yang responsif dengan icon search.
- Paginasi yang proper menggunakan komponen pagination dari shadcn.
- Responsif di semua breakpoint (grid/list yang adaptif).

## Scope of Work

**In scope**

- `src/pages/DashboardPage.tsx` — polish layout, search bar, list, paginasi.
- `src/features/contact/components/ContactCard.tsx` — komponen card per kontak (avatar, nama, email, phone, action buttons).
- Loading skeleton: skeleton card untuk setiap item list.
- Empty state: ilustrasi/icon + pesan + tombol "Add Contact" (via `ContactModal`).
- Search bar: `Input` dari shadcn + icon `Search` dari lucide-react.
- Paginasi: komponen `Pagination` dari shadcn atau custom pagination bar.
- Responsive: grid 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop).

**Out of scope**

- Perubahan logika search atau API integration.
- Implementasi fitur create/update/delete (sudah di issue masing-masing).

## Suggested Technical Checklist

### `ContactCard.tsx`
- [ ] Avatar dengan inisial kontak (`AvatarFallback` dari shadcn).
- [ ] Nama kontak sebagai judul card.
- [ ] Email dan phone sebagai subtitle dengan icon (`Mail`, `Phone` dari lucide-react).
- [ ] Action buttons: "Edit" (icon `Pencil`) dan "Delete" (`DeleteContactButton`).
- [ ] Hover state: subtle shadow atau border highlight.

### `DashboardPage.tsx` — Layout
- [ ] `TitleBar` sudah ada dengan tombol "Create Contact" di kiri — pertahankan.
- [ ] Search bar di bawah `TitleBar`: full-width dengan icon `Search`.
- [ ] Grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` dengan `gap-4`.
- [ ] Padding konsisten: `px-6 md:px-8 lg:px-12 2xl:px-24 py-6`.

### Loading Skeleton
- [ ] Render `n` skeleton card (sesuai `size` paginasi) saat `isLoading`.
- [ ] Skeleton card: avatar skeleton + 2 baris teks skeleton.

### Empty State
- [ ] Icon `UserX` atau `Users` dari lucide-react.
- [ ] Pesan: "Belum ada kontak" atau "Tidak ada kontak yang cocok dengan pencarian".
- [ ] Tombol "Add Contact" di empty state memanggil `openCreateModal()` dari `useContactStore`.

### Search Bar
- [ ] `Input` dari shadcn dengan icon `Search` di kiri (menggunakan `relative` + `absolute` positioning).
- [ ] Placeholder: "Cari nama kontak...".
- [ ] Clear button (icon `X`) muncul saat ada input.

### Paginasi
- [ ] Gunakan `Pagination` dari shadcn atau custom pagination bar.
- [ ] Tampilkan: "Halaman X dari Y" + tombol Prev/Next + nomor halaman.
- [ ] Disable tombol Prev di halaman 1; disable Next di halaman terakhir.

### Responsive
- [ ] Uji di 375px: 1 kolom, search bar full-width.
- [ ] Uji di 768px: 2 kolom.
- [ ] Uji di 1280px: 3 kolom.

## Acceptance Criteria

- List kontak tampil dalam grid card yang rapi dan responsif di `DashboardPage`.
- Loading skeleton muncul saat data sedang di-fetch.
- Empty state tampil dengan pesan yang sesuai (kosong vs tidak ada hasil search).
- Search bar memiliki icon dan clear button.
- Paginasi berfungsi dengan komponen yang proper.
- Responsif: grid adaptif di semua breakpoint.
- Dark mode: tampilan konsisten.
- Tidak ada regresi pada logika search dan paginasi.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Loading state | Buka halaman saat network lambat | Skeleton card muncul |
| 2 | List tampil | Data berhasil di-fetch | Grid card kontak tampil |
| 3 | Search | Ketik nama di search bar | List ter-filter; clear button muncul |
| 4 | Clear search | Klik clear button | Input kosong; semua kontak tampil |
| 5 | Empty state (kosong) | Tidak ada kontak sama sekali | Ilustrasi + pesan + tombol "Add Contact" |
| 6 | Empty state (search) | Search nama yang tidak ada | Pesan "Tidak ada kontak yang cocok" |
| 7 | Paginasi | Klik nomor halaman / Next | Halaman berubah; data ter-refresh |
| 8 | Mobile 375px | Buka halaman di viewport 375px | 1 kolom; tidak overflow |
| 9 | Desktop 1280px | Buka halaman di viewport 1280px | 3 kolom; layout rapi |
| 10 | Dark mode | Toggle dark mode | Tampilan konsisten |

## Notes

- `ContactCard` sebaiknya komponen terpisah agar dapat digunakan di konteks lain.
- Tombol "Add Contact" di empty state menggunakan `openCreateModal()` dari `useContactStore` — konsisten dengan tombol di `TitleBar`.
- Animasi masuk card: `animate-in fade-in` dari Tailwind atau Framer Motion — opsional.
- Konsisten dengan pola `TitleBar` dan padding di `ProfilePage` dan `DashboardPage`.
