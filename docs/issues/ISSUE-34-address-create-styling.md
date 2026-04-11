# Issue #34 — Create Address: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #33 (Create Address API + MVP), Issue #32 (List Address Styling — `AddressEmptyState`) |

## Context

Form create alamat sudah fungsional (Issue #33) dengan tampilan inline MVP. Issue ini mengganti form inline dengan **shadcn `Dialog`** agar konsisten dengan design system dan memberikan UX yang lebih baik (fokus jelas, tidak mengganggu layout list).

## Goals

- Buat `AddressFormDialog.tsx` — shadcn `Dialog` yang membungkus `AddressForm` untuk mode create.
- Polish `AddressEmptyState` — tambah tombol CTA "Tambah Alamat" yang proper (jika belum di Issue #32).
- Responsif dan dark mode konsisten.

## Scope of Work

**In scope**

- `src/features/address/components/AddressFormDialog.tsx` — shadcn `Dialog` untuk create (dikontrol via `isOpenCreateModal` dari `useAddressStore`).
- Polish `AddressSection.tsx` — ganti form inline dengan `<AddressFormDialog />`.
- Styling tombol "Tambah Alamat": ikon `Plus` dari `lucide-react`, `variant="outline"` atau `default`, ukuran `sm`.

**Out of scope**

- Mode edit di dialog (Issue #37 — Update Styling).
- Perubahan logika create atau hooks.

## Suggested Technical Checklist

### `AddressFormDialog.tsx`
- [ ] Pastikan `Dialog` dari shadcn tersedia (`npx shadcn@latest add dialog`).
- [ ] Dikontrol via `isOpenCreateModal` + `openCreateModal` + `closeCreateModal` dari `useAddressStore`.
- [ ] `DialogTrigger`: tombol "Tambah Alamat" (ikon `Plus` + label).
- [ ] `DialogContent`:
  - `DialogHeader` dengan `DialogTitle`: "Tambah Alamat".
  - Render `<AddressForm contactId={contactId} />` di body dialog.
- [ ] Dialog tertutup otomatis setelah `onSuccess` (sudah dihandle `closeCreateModal` di hook).
- [ ] Props: `contactId: string`.

### Update `AddressSection.tsx`
- [ ] Hapus render form inline (`{isOpenCreateModal && <AddressForm />}`).
- [ ] Render `<AddressFormDialog contactId={contactId} />` di header section (trigger sekaligus container).
- [ ] Tombol "Tambah Alamat" di `AddressEmptyState`: panggil `openCreateModal()` dari `useAddressStore` (tidak lagi inline button).

### Responsive
- [ ] Dialog tidak overflow di 375px.
- [ ] Form di dalam dialog scrollable jika konten melebihi viewport.

## Acceptance Criteria

- Klik "Tambah Alamat" membuka shadcn `Dialog` dengan form di dalamnya.
- Submit sukses menutup dialog + toast + alamat baru muncul di list.
- Validasi Zod tetap berfungsi di dalam dialog.
- Dialog bisa ditutup dengan klik di luar atau tombol close (bawaan shadcn `Dialog`).
- Responsif di 375px — tidak overflow.
- Dark mode konsisten.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka dialog | Klik "Tambah Alamat" | Dialog terbuka dengan form kosong |
| 2 | Submit valid | Isi country + postal_code → submit | Dialog tertutup; toast sukses; alamat muncul |
| 3 | Validasi | Submit tanpa country | Error validasi muncul di dalam dialog |
| 4 | Tutup dialog | Klik di luar dialog | Dialog tertutup; tidak ada request |
| 5 | Loading | Klik submit | Tombol submit disabled + loading |
| 6 | Mobile 375px | Buka dialog di viewport kecil | Tidak ada overflow; form dapat diisi |
| 7 | Dark mode | Toggle dark mode → buka dialog | Tampilan konsisten |

## Notes

- `Dialog` dari shadcn dapat ditutup dengan klik di luar — intentional untuk form non-destruktif (beda dengan `AlertDialog` yang tidak bisa).
- Jika `Dialog` belum terinstall: `npx shadcn@latest add dialog`.
- Pastikan `AddressForm` tidak memanggil `closeCreateModal` secara langsung — cukup via `onSuccess` di hook agar logika tetap di satu tempat.
