# Issue #23 — Get Contact: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #21 (Create Contact), Issue #29 (Search/List Contact) |

## Context

Aplikasi perlu menampilkan detail satu kontak berdasarkan ID. API endpoint yang digunakan:

- **`GET /api/contacts/:id`** — Mengambil data detail kontak berdasarkan ID.

Endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Fitur ini biasanya dipicu dari list kontak (Issue #29) — user klik salah satu kontak untuk melihat detailnya.

## Goals

- Implementasi `GET /api/contacts/:id` untuk mengambil detail kontak.
- Tambah hook `useGetContact(id)` menggunakan `useQuery`.
- Tampilkan data kontak dalam UI minimal (MVP) — panel/modal dari `DashboardPage`.
- Handle loading state dan error (404 not found, 401 unauthorized).

## API Reference

### GET /api/contacts/:id

**Response 200:**
```json
{
  "success": true,
  "message": "Contact Retrieved successfully",
  "data": {
    "id": "UUID-Format",
    "first_name": "Xiao",
    "last_name": "Yan",
    "email": "yesoseso@example.com",
    "phone": "088775758"
  }
}
```

**Response Error:** `401` (unauthorized), `404` (not found)

## Scope of Work

**In scope**

- `src/features/contact/contact.service.ts` — tambah fungsi `getContact(id: string)`.
- `src/features/contact/contact.hook.ts` — tambah hook `useGetContact(id: string)`.
- `src/features/contact/components/ContactDetail.tsx` — komponen MVP untuk menampilkan data kontak.
- Integrasi ke `DashboardPage` (via list kontak dari Issue #29) — MVP: panel/modal yang muncul saat klik kontak di list.

**Out of scope**

- Styling polish (Issue #24).
- Update/delete dari halaman detail (Issue #25, #27).

## Suggested Technical Checklist

### `contact.service.ts`
- [ ] Tambah `getContact(id: string)`: `GET /api/contacts/${id}` → return `ApiResponse<Contact>`.

### `contact.hook.ts`
- [ ] Tambah `useGetContact(id: string)`: `useQuery` dengan `queryKey: ['contacts', id]`.
- [ ] `enabled: !!id` agar query tidak jalan saat `id` kosong/undefined.

### `ContactDetail.tsx`
- [ ] Tampilkan field: First Name, Last Name, Email, Phone dalam format read-only.
- [ ] Loading state: tampilkan teks "Loading..." atau placeholder saat `isLoading`.
- [ ] Error state: tampilkan pesan error jika `isError` (misal "Contact not found").

### Routing / Integrasi
- [ ] Pilih satu pendekatan MVP:
  - **Opsi A:** Route baru `dashboard/contacts/:id` → `ContactDetailPage`.
  - **Opsi B:** Panel/modal dari `DashboardPage` yang muncul saat klik kontak di list — simpan `selectedContactId` di `contact.store.ts`.
- [ ] Jika Opsi A: tambah route di `src/routes/index.tsx`.

## Acceptance Criteria

- Data kontak berhasil di-fetch dari API dan ditampilkan di UI.
- Loading state muncul saat data sedang di-fetch.
- Jika kontak tidak ditemukan (404): pesan error yang sesuai ditampilkan.
- Jika token expired (401): redirect ke `/auth/login` (interceptor).
- Query key `['contacts', id]` konsisten untuk keperluan invalidasi dari update/delete.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Lihat detail kontak | Klik kontak dari list di DashboardPage | Data kontak tampil (first name, last name, email, phone) |
| 2 | Loading state | Buka detail saat network lambat | Loading indicator muncul |
| 3 | Kontak tidak ada | Akses ID yang tidak valid | Pesan "Contact not found" atau error yang sesuai |
| 4 | Token expired | Token invalid → akses detail | Redirect ke `/auth/login` |
| 5 | Data lengkap | Kontak dengan semua field terisi | Semua field tampil dengan benar |
| 6 | Data parsial | Kontak tanpa email/phone | Field kosong tidak menyebabkan error UI |

## Notes

- `queryKey: ['contacts', id]` memungkinkan invalidasi spesifik per kontak setelah update.
- Jika memilih Opsi A (route baru), gunakan `useParams()` dari react-router untuk ambil `id`.
- Jika memilih Opsi B (modal/panel), extend `contact.store.ts` dengan `selectedContactId` agar konsisten dengan pola state management yang sudah ada.
- Pendekatan MVP: pilih yang paling cepat diimplementasi; polish di Issue #24.
