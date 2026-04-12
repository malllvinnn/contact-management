# Issue #22 — Create Contact: Styling UI

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `ui`, `responsive design` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #21 (Create Contact API + MVP) |

## Context

Fitur Create Contact sudah fungsional (Issue #21) — form dapat submit data ke API, modal sudah diimplementasi via `Dialog` dengan Zustand store, dan toast feedback sudah berjalan. Issue ini fokus pada **polish visual dan UX** form create kontak agar konsisten dengan design system proyek (shadcn + Tailwind tokens) dan responsif di semua breakpoint.

## Goals

- Polish tampilan `ContactForm` agar selaras dengan design system proyek.
- Tambah loading skeleton / disabled state yang jelas saat `isPending`.
- Pastikan form responsif di mobile (375px) hingga desktop (1440px).
- Pastikan dark mode konsisten.

## Perubahan dari Rencana Awal

> Modal create contact sudah diimplementasi di Issue #21 menggunakan `Dialog` (bukan `AlertDialog`) dengan state dikontrol via Zustand (`contact.store.ts`). Trigger "Create Contact" sudah ada di `TitleBar` via `ContactModal`. Issue ini **tidak perlu** setup modal/drawer baru — fokus murni pada polish visual form.

## Scope of Work

**In scope**

- `src/features/contact/components/ContactForm.tsx` — polish styling field, spacing, label, error message.
- `src/features/contact/components/ContactModal.tsx` — polish header, padding, close button modal.
- Loading state visual yang jelas (spinner di button, disabled fields saat `isPending`).
- Responsive: uji di 375px, 768px, 1280px.

**Out of scope**

- Setup modal/drawer baru (sudah selesai di Issue #21).
- Perubahan logika validasi atau API integration.
- List/search kontak (Issue #29–#30).

## Suggested Technical Checklist

### `ContactForm.tsx`
- [ ] Spacing antar field konsisten (`gap-4` atau `FieldGroup`).
- [ ] Error message di bawah field menggunakan `FieldError` dari shadcn.
- [ ] Button submit full-width di mobile, auto-width di desktop.
- [ ] Disabled semua field saat `isPending`.

### `ContactModal.tsx`
- [ ] Pastikan close button eksplisit di header modal terlihat jelas.
- [ ] Padding modal konsisten di semua breakpoint.

### Responsive
- [ ] Uji form di viewport 375px — tidak overflow horizontal.
- [ ] Uji modal di viewport 768px dan 1280px.

## Acceptance Criteria

- Form create kontak tampil dalam modal `Dialog` (sudah ada dari Issue #21).
- Tampilan konsisten dengan design system (font, spacing, warna token shadcn).
- Responsif: tidak ada overflow horizontal di semua breakpoint yang diuji.
- Loading state jelas: button disabled + spinner saat submit, semua field disabled.
- Modal tertutup otomatis setelah create sukses (sudah berjalan dari Issue #21).
- Tidak ada regresi pada logika create (validasi dan API call tetap berjalan).

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka modal | Klik "Create Contact" di TitleBar | Modal terbuka dengan form |
| 2 | Tutup modal | Klik di luar / tombol close / Cancel | Modal tertutup tanpa submit |
| 3 | Submit sukses | Isi form valid, submit | Modal tertutup; toast sukses muncul |
| 4 | Submit error | Isi form tidak valid | Modal tetap terbuka; error di bawah field |
| 5 | Loading state | Klik submit | Button disabled + spinner; field disabled |
| 6 | Mobile 375px | Buka modal di viewport 375px | Form tidak overflow; field dapat diisi |
| 7 | Dark mode | Toggle dark mode, buka modal | Tampilan konsisten di dark mode |

## Notes

- Modal sudah menggunakan `Dialog` dari Issue #21 — tidak perlu ganti ke `Sheet`.
- Close modal setelah sukses sudah ditangani via `closeCreateModal()` di `contact.hook.ts`.
- Ikuti pola padding yang sudah ada di `ProfilePage` untuk konsistensi layout.
