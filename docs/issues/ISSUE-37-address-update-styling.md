# Issue #37 — Update Address: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #36 (Update Address API + MVP), Issue #34 (Create Address Styling — `AddressFormDialog` reuse) |

## Context

Form edit alamat sudah fungsional (Issue #36) dengan tampilan inline MVP. Issue ini mengganti form inline dengan **shadcn `Dialog`** — reuse `AddressFormDialog` dari Issue #34 yang diperluas agar mendukung mode `'edit'`. Dengan begitu satu komponen dialog menangani kedua mode (create dan edit) tergantung state store.

## Goals

- Extend `AddressFormDialog` agar mendukung mode `'edit'` (dikontrol via `isOpenEditModal`).
- Ganti form edit inline di `AddressSection` dengan `AddressFormDialog` mode edit.
- Styling tombol "Edit" di `AddressCard` yang proper.
- Responsif dan dark mode konsisten.

## Scope of Work

**In scope**

- Extend `AddressFormDialog.tsx` — tambah handling mode `'edit'` via `isOpenEditModal` dan `selectedAddress` dari store.
- Update `AddressSection.tsx` — hapus form edit inline, cukup satu `<AddressFormDialog />` yang menangani kedua mode.
- Styling tombol "Edit" di `AddressCard`: ikon `Pencil`, `variant="ghost"`, `size="icon"` atau `size="sm"`.

**Out of scope**

- Perubahan logika update atau hooks.
- Remove address (Issue #38).

## Suggested Technical Checklist

### `AddressFormDialog.tsx`
- [ ] Extend untuk handle dua mode secara bersamaan:
  - Jika `isOpenCreateModal`: render dialog dengan title "Tambah Alamat" + `AddressForm mode="create"`.
  - Jika `isOpenEditModal` dan `selectedAddress` tersedia: render dialog dengan title "Edit Alamat" + `AddressForm mode="edit" defaultValues={selectedAddress}`.
- [ ] `open` prop dialog: `isOpenCreateModal || isOpenEditModal`.
- [ ] `onOpenChange`: tutup dialog yang sedang aktif (`closeCreateModal` atau `closeEditModal`).
- [ ] `DialogTitle` dinamis sesuai mode.

### `AddressSection.tsx`
- [ ] Hapus render form edit inline (`{isOpenEditModal && <AddressForm mode="edit" ... />}`).
- [ ] Pastikan `<AddressFormDialog />` sudah di-render sekali (sudah ada dari Issue #34) dan menangani kedua mode.

### `AddressCard.tsx`
- [ ] Styling tombol "Edit": ikon `Pencil`, `variant="ghost"`, `size="icon"` — konsisten dengan style action button di app.
- [ ] Tooltip opsional: "Edit Alamat" (gunakan shadcn `Tooltip` jika sudah tersedia di app).

### Responsive
- [ ] Dialog edit tidak overflow di 375px.
- [ ] Form scrollable jika konten melebihi viewport.

## Acceptance Criteria

- Klik "Edit" di card membuka shadcn `Dialog` dengan form ter-pre-fill.
- Title dialog berubah menjadi "Edit Alamat".
- Submit sukses menutup dialog + toast + list ter-update.
- Validasi Zod tetap berfungsi di dalam dialog.
- Satu `AddressFormDialog` menangani create dan edit — tidak ada duplikasi dialog.
- Responsif di 375px.
- Dark mode konsisten.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka dialog edit | Klik "Edit" di card | Dialog "Edit Alamat" terbuka dengan data pre-fill |
| 2 | Submit edit | Ubah field → submit | Dialog tertutup; card ter-update; toast sukses |
| 3 | Tutup dialog | Klik di luar | Dialog tertutup; tidak ada request |
| 4 | Mode tidak bentrok | Buka create lalu edit | Dialog menampilkan mode yang benar |
| 5 | Mobile 375px | Buka dialog edit di viewport kecil | Tidak ada overflow |
| 6 | Dark mode | Toggle dark mode → buka dialog edit | Tampilan konsisten |

## Notes

- Menggabungkan create dan edit dalam satu `AddressFormDialog` lebih clean daripada dua dialog terpisah — `open` prop cukup `isOpenCreateModal || isOpenEditModal`, dan `onOpenChange` close yang aktif.
- Pastikan saat dialog ditutup secara manual (klik luar), `selectedAddress` di-reset via `closeEditModal` agar tidak ada data stale.
