# Issue #39 — Remove Address: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #38 (Remove Address API + MVP) |

## Context

Fitur Remove Address sudah fungsional (Issue #38) dengan konfirmasi `window.confirm`. Issue ini mengganti `window.confirm` dengan **shadcn `AlertDialog`** — konsisten dengan pola `DeleteContactButton` dari Issue #28.

## Goals

- Buat `DeleteAddressButton.tsx` — tombol hapus + `AlertDialog` konfirmasi.
- Ganti `window.confirm` di `AddressCard` dengan `DeleteAddressButton`.
- Tombol "Hapus" berwarna destructive dengan ikon `Trash2`.
- Loading state yang jelas saat delete berlangsung.
- Responsif dan dark mode konsisten.

## Scope of Work

**In scope**

- `src/features/address/components/DeleteAddressButton.tsx` — tombol + `AlertDialog` (pola identik dengan `DeleteContactButton.tsx`).
- Update `AddressCard.tsx` — ganti tombol "Hapus" + `window.confirm` dengan `<DeleteAddressButton />`.

**Out of scope**

- Perubahan logika remove atau hooks.

## Suggested Technical Checklist

### `DeleteAddressButton.tsx`
- [ ] Pastikan `AlertDialog` dari shadcn tersedia (`npx shadcn@latest add alert-dialog`).
- [ ] Props: `contactId: string`, `addressId: string`, `addressLabel: string`.
- [ ] Trigger: `Button` dengan ikon `Trash2` + label "Hapus", `variant="destructive"`, `size="sm"` atau `size="icon"`.
- [ ] `AlertDialog` berisi:
  - `AlertDialogTitle`: "Hapus Alamat?"
  - `AlertDialogDescription`: `Alamat **{addressLabel}** akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
  - `AlertDialogCancel`: "Batal"
  - `AlertDialogAction`: "Hapus" (variant destructive, disabled + spinner saat `isPending`).
- [ ] `onConfirm` (`AlertDialogAction` onClick): panggil `mutate(addressId)` dari `useRemoveAddress(contactId)`.
- [ ] Pola implementasi: lihat `DeleteContactButton.tsx` sebagai referensi langsung.

### `AddressCard.tsx`
- [ ] Ganti tombol "Hapus" + `window.confirm` dengan `<DeleteAddressButton>`.
- [ ] `addressLabel`: bentuk dari `[address.street, address.city, address.country].filter(Boolean).join(', ')`.
- [ ] Hapus import `useRemoveAddress` dari `AddressCard` — logika pindah ke `DeleteAddressButton`.

### Responsive
- [ ] `AlertDialog` tidak overflow di 375px.
- [ ] Tombol "Hapus" dan "Batal" dapat diklik dengan nyaman di mobile.

## Acceptance Criteria

- Klik "Hapus" di card membuka `AlertDialog` shadcn (bukan `window.confirm`).
- Dialog menampilkan label alamat yang akan dihapus.
- Tombol "Hapus" berwarna destructive dengan ikon `Trash2`.
- Konfirmasi: alamat terhapus + toast sukses.
- Batal: dialog tertutup; tidak ada request.
- Loading: tombol "Hapus" di dialog disabled + spinner saat request berlangsung.
- Responsif di 375px — tidak overflow.
- Dark mode konsisten.
- Tidak ada regresi pada logika remove.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka dialog hapus | Klik "Hapus" di card | `AlertDialog` muncul dengan label alamat |
| 2 | Konfirmasi hapus | Klik "Hapus" di dialog | Alamat terhapus; toast sukses; list ter-refresh |
| 3 | Batalkan | Klik "Batal" | Dialog tertutup; tidak ada request |
| 4 | Loading | Klik "Hapus" di dialog | Tombol "Hapus" disabled + spinner |
| 5 | Mobile 375px | Buka dialog di viewport 375px | Tidak ada overflow; tombol dapat diklik |
| 6 | Dark mode | Toggle dark mode → buka dialog | Tampilan konsisten |

## Notes

- `AlertDialog` tidak bisa ditutup dengan klik di luar — intentional untuk aksi destruktif (berbeda dengan `Dialog` untuk form).
- `addressLabel` yang digunakan di description dialog cukup ringkas — tidak perlu tampilkan semua field.
- Implementasi `DeleteAddressButton` hampir identik dengan `DeleteContactButton` — cukup adaptasi props dan label.
