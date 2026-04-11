# Issue #35 — Get Address by ID: API Integration

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #31 (List Address — feature setup) |

## Context

Endpoint `GET /api/users/contacts/:idContact/addresses/:idAddress` digunakan untuk mengambil data satu alamat berdasarkan ID. Hook `useGetAddress` yang dibuat di issue ini akan digunakan oleh **Issue #36 (Update Address)** untuk pre-fill form edit — pola identik dengan `useGetContact` yang digunakan oleh `useUpdateContact`.

Issue ini **murni layer service + hook** — tidak ada UI baru karena tidak ada halaman Address Detail terpisah. Alamat ditampilkan inline di `AddressSection` menggunakan data dari list (`useListAddresses`).

## Goals

- Implementasi `GET /api/users/contacts/:idContact/addresses/:idAddress`.
- Tambah hook `useGetAddress(contactId, addressId)` menggunakan `useQuery`.

## API Reference

### GET /api/users/contacts/:idContact/addresses/:idAddress

**Response 200:**
```json
{
  "success": true,
  "message": "Address Retrieved successfully",
  "data": {
    "id": "UUID-Format",
    "street": "Jalan apa",
    "city": "Kota apa",
    "province": "Provinsi apa",
    "country": "Negara apa",
    "postal_code": "51352"
  }
}
```

**Response Error:** `401` (unauthorized), `404` (contact or address not found)

## Scope of Work

**In scope**

- `src/features/address/address.service.ts` — tambah `getAddress(contactId, addressId)`.
- `src/features/address/address.hook.ts` — tambah `useGetAddress(contactId, addressId)`.

**Out of scope**

- UI halaman Address Detail (tidak ada — tidak diperlukan).
- Pre-fill form edit (digunakan di Issue #36).

## Suggested Technical Checklist

### `address.service.ts`
- [ ] Tambah `getAddress(contactId: string, addressId: string)`:
  - `GET /contacts/${contactId}/addresses/${addressId}` → return `ApiResponse<Address>`.

### `address.hook.ts`
- [ ] Tambah `useGetAddress(contactId: string, addressId: string)`: `useQuery`:
  - `queryKey`: `['contacts', contactId, 'addresses', addressId]`.
  - `queryFn`: `() => addressService.getAddress(contactId, addressId)`.
  - `enabled`: `!!contactId && !!addressId`.

## Acceptance Criteria

- `addressService.getAddress` melakukan request `GET /contacts/:cid/addresses/:aid` dengan benar.
- `useGetAddress` hanya aktif (`enabled`) saat keduanya `contactId` dan `addressId` tersedia.
- Data berhasil di-fetch dan tersedia untuk dikonsumsi (akan diverifikasi saat digunakan di Issue #36).
- Error (401/404): `errorHookResponse` dipanggil (jika hook di-consume di komponen).

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Fetch valid | `useGetAddress` dengan ID valid | Data alamat dikembalikan |
| 2 | Address tidak ditemukan | `addressId` tidak valid | Query error; `errorHookResponse` terpanggil |
| 3 | Contact tidak ditemukan | `contactId` tidak valid | Query error; `errorHookResponse` terpanggil |
| 4 | Disabled saat ID kosong | `addressId` kosong | Query tidak dijalankan (`enabled: false`) |
| 5 | Token expired | Token tidak valid | Axios interceptor redirect ke `/auth/login` |

## Notes

- Hook ini tidak dikonsumsi di UI manapun sampai Issue #36 — verifikasi fungsional dilakukan saat integrasi dengan form edit.
- Query key `['contacts', contactId, 'addresses', addressId]` lebih spesifik dari list key `['contacts', contactId, 'addresses']` — tidak saling mempengaruhi kecuali saat invalidasi list (yang hanya menggunakan prefix list key).
- Tidak ada UI change di issue ini — tidak ada styling issue pasangan.
