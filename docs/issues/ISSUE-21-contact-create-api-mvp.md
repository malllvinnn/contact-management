# Issue #21 — Create Contact: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #17 (routing `/dashboard`) |

## Context

Aplikasi perlu menyediakan fitur untuk membuat kontak baru. API endpoint yang digunakan:

- **`POST /api/contacts`** — Membuat kontak baru milik user yang sedang login.

Endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Mengikuti pola arsitektur yang sudah ada (`features/user/`, `features/auth/`), fitur ini dibangun di folder `features/contact/`.

## Goals

- Buat feature folder `src/features/contact/` dengan types, schema, service, hook, dan store.
- Implementasi `POST /api/contacts` untuk membuat kontak baru.
- Buat UI form dalam modal (MVP) untuk input data kontak.
- Tampilkan feedback toast sukses/error setelah submit.
- Setelah create sukses, invalidate query list kontak agar data terbaru muncul.

## API Reference

### POST /api/contacts

**Request Body:**
```json
{
  "first_name": "Xiao",
  "last_name": "Yan",
  "email": "yesoseso@example.com",
  "phone": "088775758"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Contact Created successfully",
  "data": {
    "first_name": "Xiao",
    "last_name": "Yan",
    "email": "yesoseso@example.com",
    "phone": "088775758"
  }
}
```

**Response Error:** `400` (validation), `401` (unauthorized), `500` (server error)

## Scope of Work

**In scope**

- `src/features/contact/contact.types.ts` — definisi type `Contact`.
- `src/features/contact/contact.schema.ts` — Zod schema `CreateContactSchema` dan type `CreateContactPayload`.
- `src/features/contact/contact.service.ts` — fungsi `createContact(payload)`.
- `src/features/contact/contact.hook.ts` — hook `useCreateContact()`.
- `src/features/contact/contact.store.ts` — Zustand store untuk modal state (`isOpenCreateModal`, `openCreateModal`, `closeCreateModal`).
- `src/features/contact/components/ContactForm.tsx` — form MVP dalam modal (field + button submit).
- `src/features/contact/components/ContactModal.tsx` — `Dialog` modal yang dikontrol via `useContactStore`.
- `src/components/TitleBar.tsx` — tambah `ContactModal` sebagai trigger "Create Contact" di title bar `DashboardPage`.

**Out of scope**

- Styling polish (Issue #22).
- List/search kontak (Issue #29).
- Update/delete kontak.

## Perubahan Rencana

> Rencana awal menggunakan `ContactsPage.tsx` dengan form inline. Setelah dipertimbangkan, halaman dashboard yang sudah ada (`DashboardPage.tsx`) digunakan sebagai entry point, dengan trigger modal "Create Contact" diletakkan di `TitleBar` — konsisten dengan layout seluruh halaman aplikasi.

**Perubahan utama:**
- `ContactsPage.tsx` **tidak jadi dibuat** — digantikan oleh `DashboardPage.tsx` yang sudah ada.
- Trigger create contact dipindah ke `TitleBar` via komponen `ContactModal`.
- Modal menggunakan `Dialog` (bukan `AlertDialog`) agar bisa ditutup dengan klik di luar area.
- State open/close modal dikelola via Zustand (`contact.store.ts`) sehingga form dapat menutup modal secara programmatic setelah submit sukses.

## Suggested Technical Checklist

### `contact.types.ts`
- [ ] Definisikan type `Contact { id: string; first_name: string; last_name?: string; email?: string; phone?: string }`.

### `contact.schema.ts`
- [ ] Buat `CreateContactSchema` dengan Zod:
  - `first_name`: string, min 1, wajib.
  - `last_name`: string, opsional.
  - `email`: string, format email, opsional.
  - `phone`: string, opsional.
- [ ] Export `CreateContactPayload` dari schema.

### `contact.service.ts`
- [ ] `createContact(payload: CreateContactPayload)`: `POST /api/contacts` → return `ApiResponse<Contact>`.

### `contact.store.ts`
- [ ] `useContactStore()`: Zustand store dengan state:
  - `isOpenCreateModal: boolean`
  - `openCreateModal()`, `closeCreateModal()`

### `contact.hook.ts`
- [ ] `useCreateContact()`: `useMutation`:
  - `onSuccess`: `closeCreateModal()` + `toast.success(response.message)` + `invalidateQueries(['contacts'])`.
  - `onError`: `errorHookResponse(error)`.

### `ContactForm.tsx`
- [ ] Form dengan field: First Name, Last Name, Email, Phone.
- [ ] Gunakan `react-hook-form` + `zodResolver(CreateContactSchema)`.
- [ ] Gunakan komponen `InputField` yang sudah ada.
- [ ] Submit memanggil `mutate` dari `useCreateContact`.
- [ ] Reset form (`reset()`) setelah submit sukses via per-call `onSuccess`.
- [ ] Disable button saat `isPending`.

### `ContactModal.tsx`
- [ ] Gunakan komponen `Dialog` (bukan `AlertDialog`) agar support dismiss on outside click.
- [ ] Controlled via `useContactStore` — `open={isOpenCreateModal}` dan `onOpenChange`.
- [ ] Trigger berupa `AppButton` "Create Contact" yang memanggil `openCreateModal()`.

### `TitleBar.tsx`
- [ ] Render `ContactModal` di posisi kiri title bar (menggantikan placeholder sebelumnya).

## Acceptance Criteria

- User dapat membuka modal create contact dari title bar di `DashboardPage`.
- Modal dapat ditutup dengan klik di luar area form atau tombol Cancel.
- User dapat mengisi form dan submit data kontak baru.
- Request `POST /api/contacts` terkirim dengan payload yang benar.
- Response sukses: modal tertutup + form di-reset + toast muncul dengan pesan dari API.
- Response error (400/401/500): toast error muncul via `errorHookResponse`.
- Button submit disabled dan menampilkan loading indicator saat `isPending`.
- Setelah sukses, query `['contacts']` di-invalidate (siap untuk list di issue berikutnya).

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka modal | Klik tombol "Create Contact" di title bar | Modal terbuka |
| 2 | Tutup modal (outside click) | Klik di luar area modal | Modal tertutup |
| 3 | Tutup modal (Cancel) | Klik tombol Cancel | Modal tertutup |
| 4 | Create valid | Isi semua field valid, submit | Modal tertutup + form reset + toast sukses |
| 5 | First name kosong | Submit tanpa first_name | Validasi Zod muncul di bawah field |
| 6 | Email format salah | Isi email tidak valid, submit | Validasi Zod muncul di bawah field email |
| 7 | Loading state | Klik submit | Button disabled + loading indicator muncul |
| 8 | Error 401 | Token expired → submit | Redirect ke `/auth/login` (interceptor) |
| 9 | Error 400 | Kirim data tidak valid ke API | Toast error muncul |

## Notes

- Pola `contact.service.ts` mengikuti `user.service.ts` — gunakan instance `api` dari `@/lib/api`.
- `errorHookResponse` sudah tersedia di `@/lib/utils` — gunakan untuk semua `onError`.
- `queryKey: ['contacts']` dipakai konsisten di semua hook kontak agar invalidasi saling terhubung.
- `contact.store.ts` diletakkan di `src/features/contact/` (bukan `src/stores/`) — sesuai pola feature-based architecture.
