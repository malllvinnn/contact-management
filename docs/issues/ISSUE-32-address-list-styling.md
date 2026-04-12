# Issue #32 — List Address: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #31 (List Address API + MVP) |

## Context

List alamat sudah fungsional (Issue #31) dengan tampilan MVP minimal (`<ul>/<li>`). Issue ini fokus pada **polish visual** tampilan list: card-based layout per alamat, skeleton loading, empty state dengan ikon, dan header section yang proper.

Komponen-komponen yang dibuat di issue ini (`AddressCard`, `AddressCardSkeleton`, `AddressEmptyState`) akan menjadi fondasi visual yang digunakan oleh operasi Create, Update, dan Remove di issue-issue selanjutnya.

## Goals

- Buat `AddressCard` — card visual untuk satu item alamat.
- Buat `AddressCardSkeleton` — skeleton loading per card.
- Buat `AddressEmptyState` — empty state dengan ikon dan teks deskriptif.
- Polish `AddressSection`: header proper, layout grid/list responsif, integrasi semua komponen di atas.
- Responsif di 375px, 768px, 1280px. Dark mode konsisten.

## Scope of Work

**In scope**

- `src/features/address/components/AddressCard.tsx` — card visual satu alamat dengan semua field dan placeholder aksi.
- `src/features/address/components/AddressCardSkeleton.tsx` — skeleton loading (reuse pola `ContactCardSkeleton.tsx`).
- `src/features/address/components/AddressEmptyState.tsx` — empty state dengan ikon `MapPinOff` dari `lucide-react`.
- Polish `AddressSection.tsx` — ganti MVP markup dengan komponen-komponen di atas.

**Out of scope**

- Tombol aksi fungsional (Edit, Hapus) — ditambahkan di issue Create/Update/Remove.
- Perubahan logika fetch atau hooks.

## Suggested Technical Checklist

### `AddressCard.tsx`
- [ ] Props: `address: Address`.
- [ ] Ikon `MapPin` dari `lucide-react` di header card.
- [ ] Tampilkan semua field: `street` (jika ada), `city` (jika ada), `province` (jika ada), `country`, `postal_code`.
- [ ] Field opsional yang kosong: tampilkan "—" atau skip baris.
- [ ] Placeholder area di kanan untuk action buttons (akan diisi oleh Issue #34, #37, #39).
- [ ] Styling: border, rounded, padding — konsisten dengan `page-card` pattern yang ada di app.
- [ ] Gunakan `cn()` dari `@/lib/utils` untuk class merging.

### `AddressCardSkeleton.tsx`
- [ ] Pastikan `Skeleton` dari shadcn tersedia (`npx shadcn@latest add skeleton`).
- [ ] Skeleton placeholder untuk header (ikon + judul) dan 3–4 baris field.
- [ ] Reuse pola `ContactCardSkeleton.tsx` sebagai referensi.

### `AddressEmptyState.tsx`
- [ ] Ikon `MapPinOff` dari `lucide-react`, ukuran besar (`size-10` atau `size-12`), warna `text-muted-foreground`.
- [ ] Teks utama: "Belum ada alamat".
- [ ] Teks sekunder: "Tambahkan alamat untuk kontak ini." (`text-muted-foreground`, ukuran `text-sm`).
- [ ] Layout: centered, vertikal, gap proporsional.
- [ ] Placeholder area untuk tombol CTA "Tambah Alamat" (akan diisi di Issue #34).

### Polish `AddressSection.tsx`
- [ ] Header section: judul "Alamat" dengan ikon `MapPin`, placeholder tombol "Tambah Alamat" di kanan (fungsional di Issue #34).
- [ ] Loading: render 2× `AddressCardSkeleton`.
- [ ] Empty: render `AddressEmptyState`.
- [ ] List: render `AddressCard` per item.
- [ ] Layout list: `flex flex-col gap-3` atau grid 1 kolom (2 kolom di `md:` jika UX lebih baik).
- [ ] Gunakan `cn()` dan class Tailwind yang konsisten dengan style app.

### Responsive
- [ ] 375px: card tidak overflow, teks terbaca, layout satu kolom.
- [ ] 768px: layout mulai melebar, padding nyaman.
- [ ] 1280px: opsional 2-kolom list jika lebih dari 1 alamat.

## Acceptance Criteria

- `AddressCard` menampilkan semua field alamat dengan fallback "—" untuk field opsional yang kosong.
- Skeleton loading muncul saat data sedang di-fetch.
- Empty state dengan ikon dan teks deskriptif muncul saat list kosong.
- Section header dengan judul "Alamat" + ikon terlihat jelas.
- Responsive di 375px, 768px, 1280px.
- Dark mode: tampilan konsisten.
- Tidak ada regresi pada logika fetch.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Loading | Buka Contact Detail (jaringan lambat) | 2 skeleton card muncul di section alamat |
| 2 | List dengan data | Kontak punya 2+ alamat | Setiap alamat tampil sebagai card dengan info lengkap |
| 3 | Field opsional kosong | Alamat tanpa `street` dan `city` | Field tersebut menampilkan "—" atau tidak ditampilkan |
| 4 | Empty state | Kontak tanpa alamat | Ikon + teks "Belum ada alamat" muncul |
| 5 | Mobile 375px | Buka di viewport 375px | Tidak ada overflow; card terbaca |
| 6 | Dark mode | Toggle dark mode | Card, skeleton, empty state konsisten |

## Notes

- `AddressCard` sengaja tidak memiliki tombol aksi fungsional di issue ini — slot aksi disiapkan (placeholder `div`) agar issue selanjutnya tinggal mengisi tanpa restrukturisasi.
- Pola `AddressCardSkeleton` identik dengan `ContactCardSkeleton` — cukup adaptasi dimensi sesuai layout `AddressCard`.
- `Skeleton` dari shadcn mungkin sudah terinstall (digunakan di `ContactDetailFieldSkeleton`) — cek sebelum install ulang.
