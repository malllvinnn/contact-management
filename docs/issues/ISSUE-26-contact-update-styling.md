# Issue #26 — Update Contact: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #25 (Update Contact API + MVP), Issue #22 (Create Contact Styling — reuse pola) |

## Context

Fitur Update Contact sudah fungsional (Issue #25). Issue ini fokus pada **polish visual** form edit kontak agar konsisten dengan design system dan memberikan UX yang baik — termasuk transisi antara mode view dan edit, serta konfirmasi sebelum menutup form yang sudah diubah.

## Goals

- Polish tampilan form edit kontak agar selaras dengan design system.
- Implementasi modal/drawer edit yang konsisten dengan modal create (Issue #22).
- Tambah indikator visual bahwa form dalam mode "edit" (bukan create).
- Responsif di semua breakpoint.
- Opsional: konfirmasi "Yakin ingin menutup? Perubahan akan hilang." jika form sudah diubah.

## Scope of Work

**In scope**

- `src/features/contact/components/ContactForm.tsx` — polish tampilan mode edit (header berbeda, warna button berbeda jika perlu).
- Modal/drawer edit: konsisten dengan modal create dari Issue #22.
- Tombol "Edit" di `ContactDetail` / list item: styling yang jelas.
- Loading state saat pre-fill data (`isLoading` dari `useGetContact`).
- Responsive: uji di 375px, 768px, 1280px.

**Out of scope**

- Perubahan logika update atau API integration.
- Delete kontak styling (Issue #28).

## Suggested Technical Checklist

### `ContactForm.tsx` (mode edit)
- [ ] Header modal/drawer berbeda: "Edit Contact" vs "Add Contact".
- [ ] Button submit berbeda: "Update" vs "Add" (label dari prop).
- [ ] Loading skeleton saat data pre-fill sedang di-fetch.
- [ ] Disabled semua field saat `isPending`.

### Modal / Drawer Edit
- [ ] Konsisten dengan modal create (ukuran, padding, close button).
- [ ] Trigger: tombol "Edit" di `ContactDetail` atau item list.
- [ ] Close otomatis setelah update sukses.

### Tombol "Edit"
- [ ] Gunakan `Button` dari shadcn dengan icon `Pencil` dari lucide-react.
- [ ] Posisi: di `ContactDetail` footer atau di action menu item list.

### Opsional: Unsaved Changes Guard
- [ ] Jika form sudah diubah (`isDirty` dari react-hook-form) dan user klik close → tampilkan konfirmasi.

## Acceptance Criteria

- Form edit tampil dalam modal/drawer dengan header "Edit Contact".
- Tampilan konsisten dengan form create dan design system.
- Loading skeleton muncul saat data pre-fill sedang di-fetch.
- Modal tertutup otomatis setelah update sukses.
- Responsif di semua breakpoint.
- Dark mode: tampilan konsisten.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka modal edit | Klik "Edit" | Modal terbuka dengan header "Edit Contact" dan data ter-pre-fill |
| 2 | Loading pre-fill | Buka edit saat network lambat | Skeleton muncul di field |
| 3 | Submit sukses | Update data valid | Modal tertutup; toast sukses |
| 4 | Tutup modal | Klik close | Modal tertutup (konfirmasi jika ada perubahan) |
| 5 | Mobile 375px | Buka modal edit di viewport 375px | Tidak overflow; field dapat diedit |
| 6 | Dark mode | Toggle dark mode, buka modal edit | Tampilan konsisten |

## Notes

- Gunakan `isDirty` dari `react-hook-form` untuk deteksi perubahan belum disimpan.
- Konsisten dengan pola modal create dari Issue #22 — pertimbangkan extract komponen `ContactModal` yang menerima prop `mode`.
- Label button dan header bisa diteruskan sebagai prop ke `ContactForm` agar reusable.
