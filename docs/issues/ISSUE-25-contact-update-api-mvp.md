# Issue #25 — Update Contact: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #23 (Get Contact), Issue #21 (Create Contact — schema reuse) |

## Context

Aplikasi perlu menyediakan fitur untuk mengubah data kontak yang sudah ada. API endpoint yang digunakan:

- **`PUT /api/contacts/:id`** — Mengupdate data kontak berdasarkan ID.

Endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Form update kontak memanfaatkan kembali `ContactForm` dari Issue #21 dengan pre-fill data dari `useGetContact`, serta menggunakan `contact.store.ts` yang sudah ada untuk mengontrol modal edit.

## Goals

- Implementasi `PUT /api/contacts/:id` untuk mengupdate data kontak.
- Tambah hook `useUpdateContact()` menggunakan `useMutation`.
- Extend `contact.store.ts` dengan state untuk modal edit (`isOpenEditModal`, `selectedContact`).
- Buat UI form update minimal (MVP) dengan pre-fill data dari API.
- Setelah update sukses, invalidate query kontak terkait.

## API Reference

### PUT /api/contacts/:id

**Request Body:**
```json
{
  "first_name": "Han",
  "last_name": "Feng",
  "email": "yesoseso@example.com",
  "phone": "088775758"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Contact Updated successfully",
  "data": {
    "first_name": "Han",
    "last_name": "Feng",
    "email": "yesoseso@example.com",
    "phone": "088775758"
  }
}
```

**Response Error:** `400` (validation), `401` (unauthorized)

## Scope of Work

**In scope**

- `src/features/contact/contact.service.ts` — tambah fungsi `updateContact(id, payload)`.
- `src/features/contact/contact.hook.ts` — tambah hook `useUpdateContact()`.
- `src/features/contact/contact.schema.ts` — tambah `UpdateContactSchema`.
- `src/features/contact/contact.store.ts` — extend dengan state edit modal:
  - `isOpenEditModal: boolean`
  - `selectedContact: Contact | null`
  - `openEditModal(contact: Contact)`, `closeEditModal()`
- `src/types/contact-state.types.ts` — extend type `ContactState` untuk edit modal.
- `src/features/contact/components/ContactForm.tsx` — extend agar bisa dipakai untuk mode edit (pre-fill + submit update).
- `src/features/contact/components/ContactModal.tsx` — tambah modal edit yang dikontrol via `useContactStore`.
- Integrasi tombol "Edit" di `ContactDetail` atau item list kontak di `DashboardPage`.

**Out of scope**

- Styling polish (Issue #26).
- Delete kontak (Issue #27).

## Suggested Technical Checklist

### `contact.schema.ts`
- [ ] Tambah `UpdateContactSchema` — sama dengan `CreateContactSchema`, semua field opsional kecuali `first_name` wajib.
- [ ] Export `UpdateContactPayload` dari schema.

### `contact.service.ts`
- [ ] Tambah `updateContact(id: string, payload: UpdateContactPayload)`: `PUT /api/contacts/${id}` → return `ApiResponse<Contact>`.

### `contact.hook.ts`
- [ ] Tambah `useUpdateContact()`: `useMutation`:
  - `mutationFn`: `(params: { id: string; payload: UpdateContactPayload }) => contactService.updateContact(params.id, params.payload)`.
  - `onSuccess`: `closeEditModal()` + `toast.success(response.message)` + `invalidateQueries(['contacts'])` + `invalidateQueries(['contacts', id])`.
  - `onError`: `errorHookResponse(error)`.

### `contact.store.ts`
- [ ] Extend store dengan:
  - `isOpenEditModal: boolean`
  - `selectedContact: Contact | null`
  - `openEditModal: (contact: Contact) => void`
  - `closeEditModal: () => void`

### `contact-state.types.ts`
- [ ] Extend `ContactState` dengan field-field edit modal di atas.

### `ContactForm.tsx`
- [ ] Tambah prop `mode: 'create' | 'edit'` dan `defaultValues?: Contact`.
- [ ] Jika `mode === 'edit'`: pre-fill form dengan `defaultValues` via `reset()` di `useEffect`.
- [ ] Submit memanggil `useCreateContact` atau `useUpdateContact` sesuai `mode`.

### `ContactModal.tsx`
- [ ] Tambah modal edit yang dikontrol via `isOpenEditModal` dari `useContactStore`.
- [ ] Render `ContactForm` dengan `mode="edit"` dan `defaultValues={selectedContact}`.

### Integrasi
- [ ] Tambah tombol "Edit" di `ContactDetail` atau item kontak di list `DashboardPage`.
- [ ] Tombol "Edit" memanggil `openEditModal(contact)` dari `useContactStore`.

## Acceptance Criteria

- Form update ter-pre-fill dengan data kontak yang ada.
- Request `PUT /api/contacts/:id` terkirim dengan payload yang benar.
- Response sukses: modal edit tertutup + toast muncul dengan pesan dari API.
- Response error (400/401): toast error muncul.
- Setelah sukses, query `['contacts']` dan `['contacts', id]` di-invalidate.
- Button submit disabled saat `isPending`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka form edit | Klik "Edit" pada kontak | Modal edit terbuka dengan data kontak ter-pre-fill |
| 2 | Update valid | Ubah nama, submit | Toast sukses; modal tertutup; data kontak terupdate |
| 3 | First name kosong | Hapus first_name, submit | Validasi Zod muncul |
| 4 | Email format salah | Isi email tidak valid | Validasi Zod muncul di field email |
| 5 | Loading state | Klik submit | Button disabled + loading indicator |
| 6 | Error 400 | Kirim data tidak valid ke API | Toast error muncul |
| 7 | Token expired | Token invalid → submit | Redirect ke `/auth/login` |

## Notes

- `contact.store.ts` sudah ada dari Issue #21 — cukup di-extend, tidak perlu file baru.
- Pre-fill menggunakan `reset(defaultValues)` di `useEffect` saat data dari `useGetContact` tersedia, sama dengan pola `UserForm` di `ProfilePage`.
- `invalidateQueries(['contacts'])` memastikan list kontak ter-refresh setelah update.
- Pola `openEditModal(contact)` menyimpan data kontak di store sekaligus membuka modal — konsisten dengan `openCreateModal()`.
