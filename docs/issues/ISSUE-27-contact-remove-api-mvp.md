# Issue #27 — Remove Contact: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-03-31 |
| **Ditutup** | — |
| **Depends on** | Issue #23 (Get Contact), Issue #29 (Search/List Contact) |

## Context

Aplikasi perlu menyediakan fitur untuk menghapus kontak. API endpoint yang digunakan:

- **`DELETE /api/contacts/:id`** — Menghapus kontak berdasarkan ID.

Endpoint ini memerlukan header `Authorization: Bearer <token>` yang sudah dihandle oleh Axios interceptor di `lib/api.ts`.

Aksi delete bersifat destruktif — perlu ada konfirmasi minimal sebelum request dikirim.

## Goals

- Implementasi `DELETE /api/contacts/:id` untuk menghapus kontak.
- Tambah hook `useRemoveContact()` menggunakan `useMutation`.
- Tambah tombol "Delete" dengan konfirmasi minimal (MVP: `window.confirm` atau inline confirm button).
- Setelah delete sukses, invalidate query list kontak.

## API Reference

### DELETE /api/contacts/:id

**Response 200:**
```json
{
  "success": true,
  "message": "Contact Removed successfully",
  "data": "OK"
}
```

**Response Error:** `401` (unauthorized), `404` (not found)

## Scope of Work

**In scope**

- `src/features/contact/contact.service.ts` — tambah fungsi `removeContact(id: string)`.
- `src/features/contact/contact.hook.ts` — tambah hook `useRemoveContact()`.
- Tambah tombol "Delete" di `ContactDetail` atau item list kontak.
- Konfirmasi MVP: `window.confirm("Yakin ingin menghapus kontak ini?")` atau inline "Yakin?" button.
- Setelah sukses: toast + invalidate query + tutup detail (jika dalam modal).

**Out of scope**

- Styling konfirmasi dialog (Issue #28).
- Undo delete / soft delete.

## Suggested Technical Checklist

### `contact.service.ts`
- [ ] Tambah `removeContact(id: string)`: `DELETE /api/contacts/${id}` → return `ApiResponse<string>`.

### `contact.hook.ts`
- [ ] Tambah `useRemoveContact()`: `useMutation`:
  - `mutationFn`: `(id: string) => contactService.removeContact(id)`.
  - `onSuccess`: `toast.success(response.message)` + `invalidateQueries(['contacts'])`.
  - `onError`: `errorHookResponse(error)`.

### UI — Tombol Delete
- [ ] Tambah tombol "Delete" di `ContactDetail` atau action di item list.
- [ ] MVP konfirmasi: `window.confirm(...)` sebelum memanggil `mutate(id)`.
- [ ] Disable tombol saat `isPending`.
- [ ] Setelah sukses: tutup modal/panel detail jika terbuka.

## Acceptance Criteria

- Tombol "Delete" tersedia di detail kontak atau item list.
- Konfirmasi muncul sebelum request delete dikirim.
- Request `DELETE /api/contacts/:id` terkirim dengan ID yang benar.
- Response sukses: toast muncul + kontak hilang dari list (setelah invalidate).
- Response error (401/404): toast error muncul.
- Button disabled saat `isPending`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Delete dengan konfirmasi | Klik "Delete" → konfirmasi "OK" | Kontak terhapus; toast sukses; list ter-refresh |
| 2 | Batalkan delete | Klik "Delete" → konfirmasi "Cancel" | Tidak ada request; kontak tetap ada |
| 3 | Loading state | Klik "Delete" → konfirmasi | Button disabled saat request berlangsung |
| 4 | Kontak tidak ada | Delete ID yang sudah tidak ada | Toast error "Not Found" |
| 5 | Token expired | Token invalid → delete | Redirect ke `/auth/login` |
| 6 | Setelah delete | Delete sukses dari modal detail | Modal tertutup; list ter-refresh |

## Notes

- `window.confirm` adalah MVP yang cepat — konfirmasi dialog yang proper (shadcn `AlertDialog`) dikerjakan di Issue #28.
- `invalidateQueries(['contacts'])` memastikan list kontak ter-refresh setelah delete.
- Jika delete dipanggil dari dalam modal detail, tutup modal setelah `onSuccess` menggunakan callback prop atau state management.
- Pertimbangkan `optimistic update` di issue styling jika performa list penting.
