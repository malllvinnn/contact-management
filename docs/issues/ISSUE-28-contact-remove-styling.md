# Issue #28 — Remove Contact: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #27 (Remove Contact API + MVP) |

## Context

Fitur Remove Contact sudah fungsional (Issue #27) — kontak dapat dihapus dengan konfirmasi `window.confirm`. Issue ini fokus pada **polish visual** aksi delete, terutama mengganti `window.confirm` dengan `AlertDialog` dari shadcn untuk UX yang lebih baik dan konsisten dengan design system.

## Goals

- Ganti `window.confirm` dengan `AlertDialog` dari shadcn.
- Polish tombol "Delete" agar jelas sebagai aksi destruktif (warna merah/danger).
- Loading state yang jelas saat delete berlangsung.
- Responsif dan konsisten di light/dark mode.

## Scope of Work

**In scope**

- Implementasi `AlertDialog` dari shadcn sebagai konfirmasi delete.
- `src/features/contact/components/DeleteContactButton.tsx` — komponen tombol delete + dialog konfirmasi.
- Styling tombol "Delete": warna danger (merah), icon `Trash2` dari lucide-react.
- Loading state: tombol disabled + spinner saat `isPending`.
- Responsive: uji di 375px, 768px, 1280px.

**Out of scope**

- Perubahan logika delete atau API integration.
- Undo delete / soft delete.

## Suggested Technical Checklist

### `DeleteContactButton.tsx`
- [ ] Install / pastikan `AlertDialog` dari shadcn tersedia (`npx shadcn@latest add alert-dialog`).
- [ ] Komponen menerima prop `contactId: string` dan `contactName: string`.
- [ ] Trigger: `Button` dengan icon `Trash2` + label "Delete", warna `variant="destructive"`.
- [ ] `AlertDialog` berisi:
  - Title: "Hapus Kontak?"
  - Description: "Tindakan ini tidak dapat dibatalkan. Kontak **{contactName}** akan dihapus permanen."
  - Cancel button: "Batal"
  - Confirm button: "Hapus" (warna destructive, disabled + spinner saat `isPending`).
- [ ] `onConfirm`: panggil `mutate(contactId)` dari `useRemoveContact`.

### Integrasi
- [ ] Ganti tombol delete + `window.confirm` di `ContactDetail` / item list dengan `DeleteContactButton`.

### Responsive
- [ ] `AlertDialog` responsif di mobile (tidak overflow, tombol dapat diklik).

## Acceptance Criteria

- Konfirmasi delete menggunakan `AlertDialog` shadcn, bukan `window.confirm`.
- Tombol "Delete" berwarna destructive (merah) dengan icon `Trash2`.
- Dialog konfirmasi menampilkan nama kontak yang akan dihapus.
- Loading state: tombol "Hapus" di dialog disabled + spinner saat request berlangsung.
- Responsif: dialog tidak overflow di mobile.
- Dark mode: tampilan konsisten.
- Tidak ada regresi pada logika delete.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka dialog konfirmasi | Klik "Delete" | AlertDialog muncul dengan nama kontak |
| 2 | Batalkan | Klik "Batal" | Dialog tertutup; tidak ada request |
| 3 | Konfirmasi delete | Klik "Hapus" | Request delete terkirim; toast sukses |
| 4 | Loading state | Klik "Hapus" | Tombol "Hapus" disabled + spinner |
| 5 | Mobile 375px | Buka dialog di viewport 375px | Dialog tidak overflow; tombol dapat diklik |
| 6 | Dark mode | Toggle dark mode, buka dialog | Tampilan konsisten |

## Notes

- `AlertDialog` dari shadcn tidak menutup saat klik di luar secara default — ini intentional untuk aksi destruktif.
- Nama kontak di description dialog: `${contact.first_name} ${contact.last_name}`.
- Pertimbangkan extract `DeleteContactButton` sebagai komponen terpisah agar reusable di list item dan detail.
