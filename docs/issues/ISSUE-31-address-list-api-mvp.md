# Issue #31 — List Address: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #23 (Get Contact — untuk `contactId` dari route params) |

## Context

Address adalah resource yang nested di bawah contact: `/api/contacts/:idContact/addresses`. Issue ini adalah **entry point** feature address — menyiapkan seluruh struktur feature directory `src/features/address/` sekaligus mengimplementasikan endpoint **List Address** sebagai fondasi tampilan.

Feature address dibuat terpisah dari `src/features/contact/` karena contact sudah memiliki banyak file. Semua operasi address selanjutnya (Create, Get, Update, Remove) akan membangun di atas fondasi yang dibuat di issue ini.

List alamat ditampilkan sebagai **section terpisah di bawah card kontak** pada halaman Contact Detail (`/dashboard/contacts/:id`).

## Goals

- Setup feature directory `src/features/address/` dengan file foundational.
- Implementasi `GET /api/contacts/:idContact/addresses` untuk mengambil semua alamat sebuah kontak.
- Tambah hook `useListAddresses(contactId)` menggunakan `useQuery`.
- Tampilkan list alamat secara minimal (MVP) di `ContactDetail`.

## API Reference

### GET /api/contacts/:idContact/addresses

**Response 200:**
```json
{
  "success": true,
  "message": "Addresses Retrieved successfully",
  "data": [
    {
      "id": "UUID-Format",
      "street": "Jalan apa",
      "city": "Kota apa",
      "province": "Provinsi apa",
      "country": "Negara apa",
      "postal_code": "51352"
    }
  ]
}
```

**Response Error:** `401` (unauthorized), `404` (contact not found)

## Scope of Work

**In scope**

- `src/features/address/address.types.ts` — type `Address`.
- `src/features/address/address.service.ts` — fungsi `listAddresses(contactId)`.
- `src/features/address/address.hook.ts` — hook `useListAddresses(contactId)`.
- `src/features/address/components/AddressSection.tsx` — section MVP: render list alamat di `ContactDetail`.
- Integrasi: tambah `<AddressSection contactId={contact.id} />` di `ContactDetail.tsx` di bawah `page-card` kontak.

**Out of scope**

- Schema Zod (belum dibutuhkan — tidak ada form di issue ini).
- Store Zustand (belum dibutuhkan — tidak ada modal).
- Create, Update, Remove address (issue terpisah).
- Styling polish (Issue #32).

## Suggested Technical Checklist

### `address.types.ts`
- [ ] Definisi `Address`:
  ```ts
  export type Address = {
    id: string;
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
  };
  ```

### `address.service.ts`
- [ ] Buat objek `addressService`.
- [ ] Tambah `listAddresses(contactId: string)`: `GET /contacts/${contactId}/addresses` → return `ApiResponse<Address[]>`.
- [ ] Import `api` dari `@/lib/api` dan `ApiResponse` dari `@/types/api`.

### `address.hook.ts`
- [ ] Tambah `useListAddresses(contactId: string)`: `useQuery`:
  - `queryKey`: `['contacts', contactId, 'addresses']`.
  - `queryFn`: `() => addressService.listAddresses(contactId)`.
  - `enabled`: `!!contactId`.

### `AddressSection.tsx` (MVP)
- [ ] Props: `contactId: string`.
- [ ] Gunakan `useListAddresses(contactId)` untuk fetch data.
- [ ] Loading state: teks "Memuat alamat..." sementara (skeleton di Issue #32).
- [ ] Empty state: teks "Belum ada alamat." sementara.
- [ ] List: render `<ul>/<li>` sederhana — tampilkan `country`, `city`, `postal_code` per item.
- [ ] Section header: judul "Alamat".

### Integrasi `ContactDetail.tsx`
- [ ] Import `AddressSection` dari `@/features/address/components/AddressSection`.
- [ ] Render `<AddressSection contactId={contact.id} />` di bawah `<div className="page-card">` (setelah card kontak, sebelum closing tag `ContactContainer`).

## Acceptance Criteria

- `AddressSection` muncul di bawah card kontak di halaman Contact Detail.
- Saat kontak memiliki alamat, list alamat berhasil ditampilkan.
- Saat kontak tidak memiliki alamat, pesan "Belum ada alamat." muncul.
- Loading state muncul saat request berlangsung.
- Error (401/404): toast error muncul via `errorHookResponse`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | List alamat ada | Buka Contact Detail kontak yang punya alamat | Daftar alamat muncul di bawah card kontak |
| 2 | Empty state | Buka Contact Detail kontak tanpa alamat | Teks "Belum ada alamat." muncul |
| 3 | Loading | Buka halaman (jaringan lambat) | Loading state muncul sebelum data tampil |
| 4 | Contact tidak ditemukan | `contactId` tidak valid | Toast error "Not Found" |
| 5 | Token expired | Token tidak valid → buka halaman | Redirect ke `/auth/login` |

## Notes

- Query key `['contacts', contactId, 'addresses']` memungkinkan invalidasi spesifik per kontak tanpa mempengaruhi query contact lain.
- Cek prefix path API: `contactService` menggunakan `/contacts/:id` (tanpa `/users/`) karena base URL Axios sudah mengarah ke `/api/users`. Ikuti pola yang sama untuk `addressService`.
- File `address.schema.ts` dan `address.store.ts` belum dibuat di issue ini — akan ditambahkan di issue Create (ISSUE-33) saat dibutuhkan.
