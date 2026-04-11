# Issue #38 — Remove Address: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #31 (List Address — feature setup), Issue #32 (List Styling — `AddressCard`) |

## Context

User perlu bisa **menghapus alamat** dari sebuah kontak. Issue ini mengimplementasikan endpoint `DELETE /api/contacts/:idContact/addresses/:idAddress` dengan konfirmasi minimal MVP (`window.confirm`) sebelum request dikirim.

Aksi delete bersifat destruktif — konfirmasi proper dengan `AlertDialog` shadcn dikerjakan di Issue #39.

## Goals

- Implementasi `DELETE /api/contacts/:idContact/addresses/:idAddress`.
- Tambah hook `useRemoveAddress(contactId)` menggunakan `useMutation`.
- Tambah tombol "Hapus" di `AddressCard` dengan konfirmasi `window.confirm` (MVP).
- Setelah remove sukses, invalidate query list alamat.

## API Reference

### DELETE /api/contacts/:idContact/addresses/:idAddress

**Response 200:**
```json
{
  "success": true,
  "message": "Address Removed successfully",
  "data": "OK"
}
```

**Response Error:** `401` (unauthorized), `404` (contact or address not found)

## Scope of Work

**In scope**

- `src/features/address/address.service.ts` — tambah `removeAddress(contactId, addressId)`.
- `src/features/address/address.hook.ts` — tambah `useRemoveAddress(contactId)`.
- `src/features/address/components/AddressCard.tsx` — tambah tombol "Hapus" + `window.confirm` MVP.

**Out of scope**

- Styling konfirmasi dialog (Issue #39 — AlertDialog).
- Undo delete / soft delete.

## Suggested Technical Checklist

### `address.service.ts`
- [ ] Tambah `removeAddress(contactId: string, addressId: string)`:
  - `DELETE /contacts/${contactId}/addresses/${addressId}` → return `ApiResponse<string>`.

### `address.hook.ts`
- [ ] Tambah `useRemoveAddress(contactId: string)`: `useMutation`:
  - `mutationFn`: `(addressId: string) => addressService.removeAddress(contactId, addressId)`.
  - `onSuccess`: `toast.success(response.message)` + `invalidateQueries(['contacts', contactId, 'addresses'])`.
  - `onError`: `errorHookResponse(error)`.

### `AddressCard.tsx`
- [ ] Tambah tombol "Hapus" — ikon `Trash2` dari `lucide-react`, `variant="ghost"` (warna destructive di Issue #39), `size="icon"` atau `size="sm"`.
- [ ] Klik "Hapus": `window.confirm("Yakin ingin menghapus alamat ini?")` sebelum memanggil `mutate(address.id)`.
- [ ] Tombol disabled saat `isPending` dari `useRemoveAddress`.
- [ ] Props tambahan: `contactId: string` (untuk meneruskan ke `useRemoveAddress`).

## Acceptance Criteria

- Tombol "Hapus" tersedia di setiap `AddressCard`.
- `window.confirm` muncul sebelum request delete dikirim.
- Konfirmasi "OK": request terkirim → toast sukses → alamat hilang dari list.
- Batalkan: tidak ada request; alamat tetap ada.
- Response error (401/404): toast error muncul.
- Tombol disabled saat `isPending`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Hapus dengan konfirmasi | Klik "Hapus" → OK | Alamat terhapus; toast sukses; list ter-refresh |
| 2 | Batalkan hapus | Klik "Hapus" → Cancel | Tidak ada request; alamat tetap ada |
| 3 | Loading state | Klik "Hapus" → OK | Tombol disabled saat request berlangsung |
| 4 | Address tidak ditemukan | Hapus ID yang sudah tidak ada | Toast error "Not Found" |
| 5 | Contact tidak ditemukan | `contactId` tidak valid | Toast error "Not Found" |
| 6 | Token expired | Token tidak valid → hapus | Redirect ke `/auth/login` |

## Notes

- `window.confirm` adalah MVP yang cepat — `AlertDialog` yang proper dikerjakan di Issue #39.
- `invalidateQueries(['contacts', contactId, 'addresses'])` memastikan list ter-refresh tanpa perlu optimistic update untuk MVP.
- `useRemoveAddress` menerima `contactId` di level hook (bukan di `mutate`) — konsisten dengan pola `useRemoveContact` yang menerima `id` di `mutate`.
