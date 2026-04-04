# Issue #29 — Search Contact: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #17 (routing `/dashboard`) |

## Context

Halaman utama dashboard (`DashboardPage`) menampilkan daftar kontak dengan fitur pencarian dan paginasi. API endpoint yang digunakan:

- **`GET /api/contacts`** — Mengambil daftar kontak dengan filter pencarian dan paginasi.

Endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Ini adalah fitur utama dashboard — user pertama kali melihat list kontak di halaman ini setelah login.

## Goals

- Implementasi `GET /api/contacts` dengan query params untuk pencarian dan paginasi.
- Tambah hook `useSearchContacts(params)` menggunakan `useQuery`.
- Tambah type `PagingResponse<T>` untuk response yang mengandung data paginasi.
- Tampilkan list kontak dalam UI minimal (MVP) — tabel atau daftar sederhana di `DashboardPage`.
- Implementasi input pencarian yang men-trigger re-fetch.
- Implementasi navigasi halaman (paginasi).

## API Reference

### GET /api/contacts

**Query Params:**
```
name=string (opsional)
email=string (opsional)
phone=string (opsional)
page=number (default: 1)
size=number (default: 10)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Contacts Retrieved successfully",
  "data": [
    {
      "id": "UUID-Format",
      "first_name": "Xiao",
      "last_name": "Yan",
      "email": "yesoseso@example.com",
      "phone": "088775758"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

**Response Error:** `401` (unauthorized)

## Scope of Work

**In scope**

- `src/types/api.ts` — tambah type `PagingResponse<T>` untuk response dengan paginasi.
- `src/features/contact/contact.types.ts` — tambah type `SearchContactParams`.
- `src/features/contact/contact.service.ts` — tambah fungsi `searchContacts(params)`.
- `src/features/contact/contact.hook.ts` — tambah hook `useSearchContacts(params)`.
- `src/pages/DashboardPage.tsx` — implementasi list kontak + input search + paginasi MVP.

**Out of scope**

- Styling polish (Issue #30).
- Create/update/delete dari halaman ini (sudah di issue masing-masing).

## Perubahan dari Rencana Awal

> Rencana awal membuat halaman terpisah `ContactsPage.tsx`. Sesuai keputusan di Issue #21, list kontak langsung diimplementasikan di `DashboardPage.tsx` yang sudah ada — tidak ada halaman `ContactsPage` terpisah.

## Suggested Technical Checklist

### `src/types/api.ts`
- [ ] Tambah type `PagingResponse<T>`:
  ```typescript
  export interface PagingResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    paging: {
      current_page: number;
      total_page: number;
      size: number;
    };
  }
  ```

### `contact.types.ts`
- [ ] Tambah type `SearchContactParams`:
  ```typescript
  export interface SearchContactParams {
    name?: string;
    email?: string;
    phone?: string;
    page?: number;
    size?: number;
  }
  ```

### `contact.service.ts`
- [ ] Tambah `searchContacts(params: SearchContactParams)`: `GET /api/contacts` dengan query params → return `PagingResponse<Contact>`.
- [ ] Gunakan `axios` params config untuk query string.

### `contact.hook.ts`
- [ ] Tambah `useSearchContacts(params: SearchContactParams)`: `useQuery`:
  - `queryKey: ['contacts', params]` agar re-fetch saat params berubah.
  - `queryFn`: `() => contactService.searchContacts(params)`.
  - `placeholderData: keepPreviousData` untuk transisi paginasi yang mulus.

### `DashboardPage.tsx`
- [ ] State lokal: `searchName`, `currentPage`.
- [ ] Input search (controlled) yang update `searchName` dengan debounce (300ms).
- [ ] Panggil `useSearchContacts({ name: searchName, page: currentPage })`.
- [ ] Render list kontak: tampilkan `first_name last_name`, `email`, `phone` per item.
- [ ] Paginasi MVP: tombol "Prev" dan "Next" + info "Halaman X dari Y".
- [ ] Loading state: teks "Loading..." atau placeholder saat `isLoading`.
- [ ] Empty state: teks "Tidak ada kontak" jika `data.length === 0`.

## Acceptance Criteria

- List kontak tampil saat halaman `/dashboard` dibuka.
- Input search men-trigger re-fetch dengan query `name`.
- Paginasi berfungsi: tombol Prev/Next mengubah halaman dan data ter-refresh.
- Loading state muncul saat data sedang di-fetch.
- Empty state muncul jika tidak ada kontak yang cocok.
- Token expired: redirect ke `/auth/login`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | List tampil | Buka `/dashboard` | Daftar kontak tampil |
| 2 | Search by name | Ketik nama di input search | List ter-filter sesuai nama |
| 3 | Search kosong | Hapus input search | Semua kontak tampil kembali |
| 4 | Paginasi next | Klik "Next" | Halaman berikutnya dimuat |
| 5 | Paginasi prev | Klik "Prev" di halaman 2 | Kembali ke halaman 1 |
| 6 | Empty state | Search nama yang tidak ada | Pesan "Tidak ada kontak" |
| 7 | Loading state | Buka halaman saat network lambat | Loading indicator muncul |
| 8 | Token expired | Token invalid → buka halaman | Redirect ke `/auth/login` |

## Notes

- `queryKey: ['contacts', params]` memastikan cache terpisah per kombinasi params.
- `keepPreviousData` dari TanStack Query v5 adalah `placeholderData: keepPreviousData` — cegah flicker saat ganti halaman.
- Debounce input search 300ms menggunakan `useDebounce` hook atau `setTimeout` manual.
- `size` default 10 — bisa dijadikan konstanta `CONTACTS_PAGE_SIZE = 10`.
- Paginasi MVP: tombol Prev/Next cukup; pagination bar yang proper dikerjakan di Issue #30.
