# Issue #24 — Get Contact: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #23 (Get Contact API + MVP) |

## Context

Fitur Get Contact sudah fungsional (Issue #23) — data kontak berhasil di-fetch dan ditampilkan. Issue ini fokus pada **polish visual** tampilan detail kontak agar konsisten dengan design system proyek dan memberikan UX yang baik.

## Goals

- Polish tampilan `ContactDetail` agar selaras dengan design system (shadcn + Tailwind tokens).
- Implementasi loading skeleton yang proper (bukan teks "Loading...").
- Tampilan error state yang informatif dan konsisten.
- Responsif di semua breakpoint.
- Jika menggunakan modal/drawer: pastikan tampilan rapi dan dapat diakses.

## Scope of Work

**In scope**

- `src/features/contact/components/ContactDetail.tsx` — polish layout, typography, spacing.
- Loading skeleton menggunakan `animate-pulse` atau shadcn `Skeleton`.
- Error state visual yang jelas (icon + pesan).
- Responsive: uji di 375px, 768px, 1280px.
- Jika modal/drawer: polish header, body, padding, dan close button.

**Out of scope**

- Perubahan logika fetch atau API integration.
- Tombol edit/delete dari halaman detail (Issue #25, #27 styling).

## Suggested Technical Checklist

### `ContactDetail.tsx`
- [ ] Gunakan `Card` dari shadcn sebagai wrapper.
- [ ] Setiap field ditampilkan dengan label (`FieldLabel`) dan nilai yang jelas.
- [ ] Avatar/inisial kontak di header detail (opsional, menggunakan `Avatar` dari shadcn).
- [ ] Loading skeleton: 4 baris skeleton untuk setiap field.
- [ ] Error state: icon `AlertCircle` dari lucide-react + pesan error.

### Modal / Drawer (jika dipakai)
- [ ] Header modal berisi nama kontak + close button.
- [ ] Body modal berisi `ContactDetail`.
- [ ] Footer modal berisi tombol aksi (Edit, Delete) — placeholder dulu, diisi di issue selanjutnya.
- [ ] Responsif: `Sheet` untuk mobile, `Dialog` untuk desktop (atau `Dialog` responsif).

### Halaman Detail (jika menggunakan route)
- [ ] `TitleBar` dengan judul nama kontak + tombol back.
- [ ] Layout konsisten dengan `ProfilePage`.
- [ ] Padding `px-6 md:px-8 lg:px-12 2xl:px-24`.

## Acceptance Criteria

- Detail kontak tampil dengan layout yang rapi dan konsisten dengan design system.
- Loading skeleton muncul saat data sedang di-fetch.
- Error state tampil dengan pesan yang informatif.
- Responsif: tidak ada overflow horizontal di semua breakpoint.
- Dark mode: tampilan konsisten.
- Tidak ada regresi pada logika fetch.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Loading state | Buka detail saat network lambat | Skeleton muncul, bukan teks kosong |
| 2 | Data tampil | Data berhasil di-fetch | Layout rapi, semua field terbaca |
| 3 | Error state | Kontak tidak ditemukan | Icon + pesan error yang informatif |
| 4 | Mobile 375px | Buka detail di viewport 375px | Tidak overflow; teks terbaca |
| 5 | Dark mode | Toggle dark mode | Tampilan konsisten |
| 6 | Avatar/inisial | Kontak dengan nama | Avatar/inisial tampil di header |

## Notes

- Skeleton loading menggunakan pola `animate-pulse` dengan `div` atau `Skeleton` dari shadcn.
- Inisial avatar: ambil huruf pertama `first_name` dan `last_name` untuk `AvatarFallback`.
- Konsisten dengan pola `UserForm` di `ProfilePage` untuk layout field read-only.
