# Issue #33 — Create Address: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #31 (List Address — feature setup, `AddressSection`) |

## Context

Setelah list alamat bisa ditampilkan (Issue #31), user perlu bisa **menambah alamat baru** untuk kontak. Issue ini mengimplementasikan endpoint `POST /api/contacts/:idContact/addresses` beserta form input alamat (MVP).

Operasi create membutuhkan:
- `address.schema.ts` (Zod schema pertama kali dibuat di issue ini).
- `address.store.ts` (Zustand store untuk modal state — juga pertama kali dibuat di issue ini).
- Form MVP: bisa inline di `AddressSection` atau menggunakan `<details>` collapse sementara.

## Goals

- Implementasi `POST /api/contacts/:idContact/addresses`.
- Tambah hook `useCreateAddress(contactId)` menggunakan `useMutation`.
- Buat `address.schema.ts` dengan `CreateAddressSchema`.
- Buat `address.store.ts` dengan state modal create.
- Buat `AddressForm` (MVP) dan integrasikan tombol "Tambah Alamat" di `AddressSection`.
- Setelah create sukses, invalidate query list alamat.

## API Reference

### POST /api/contacts/:idContact/addresses

**Request Body:**
```json
{
  "street": "Jalan apa",
  "city": "Kota apa",
  "province": "Provinsi apa",
  "country": "Negara apa",
  "postal_code": "51352"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Address Created successfully",
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

**Response Error:** `400` (validation), `401` (unauthorized), `404` (contact not found)

## Scope of Work

**In scope**

- `src/features/address/address.schema.ts` — buat `CreateAddressSchema` dan `CreateAddressPayload`.
- `src/features/address/address.service.ts` — tambah `createAddress(contactId, payload)`.
- `src/features/address/address.hook.ts` — tambah `useCreateAddress(contactId)`.
- `src/features/address/address.store.ts` — buat `useAddressStore` dengan state create modal.
- `src/features/address/components/AddressForm.tsx` — form create (MVP: render inline/collapse).
- Update `AddressSection.tsx` — tambah tombol "Tambah Alamat" dan render `AddressForm` (MVP).
- Update `AddressEmptyState.tsx` — tombol CTA "Tambah Alamat" fungsional (panggil `openCreateModal`).

**Out of scope**

- Mode edit form (Issue #36 — Update).
- Styling Dialog (Issue #34).
- Update, Remove (issue terpisah).

## Suggested Technical Checklist

### `address.schema.ts`
- [ ] `CreateAddressSchema`:
  - `street`: `z.string().max(255).optional().or(z.literal(""))`.
  - `city`: `z.string().max(100).optional().or(z.literal(""))`.
  - `province`: `z.string().max(100).optional().or(z.literal(""))`.
  - `country`: `z.string().min(1, { error: "Country wajib diisi" }).max(100)`.
  - `postal_code`: `z.string().min(1, { error: "Postal code wajib diisi" }).max(10)`.
- [ ] Export `CreateAddressPayload = z.infer<typeof CreateAddressSchema>`.

### `address.service.ts`
- [ ] Tambah `createAddress(contactId: string, payload: CreateAddressPayload)`:
  - `POST /contacts/${contactId}/addresses` → return `ApiResponse<Address>`.

### `address.hook.ts`
- [ ] Tambah `useCreateAddress(contactId: string)`: `useMutation`:
  - `mutationFn`: `(payload: CreateAddressPayload) => addressService.createAddress(contactId, payload)`.
  - `onSuccess`: `closeCreateModal()` + `toast.success(response.message)` + `invalidateQueries(['contacts', contactId, 'addresses'])`.
  - `onError`: `errorHookResponse(error)`.

### `address.store.ts`
- [ ] Buat `useAddressStore` dengan Zustand (tanpa persist — pola sama dengan `useContactStore`):
  ```ts
  isOpenCreateModal: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  ```
- [ ] Import dan gunakan `AddressState` dari `address.types.ts` (extend type di issue ini).

### Update `address.types.ts`
- [ ] Tambah `AddressState` dengan field create modal:
  ```ts
  export type AddressState = {
    isOpenCreateModal: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
  };
  ```

### `AddressForm.tsx` (MVP)
- [ ] Props: `contactId: string`.
- [ ] Field: `street` (opsional), `city` (opsional), `province` (opsional), `country` (wajib), `postal_code` (wajib).
- [ ] Gunakan `InputField` dari `@/components/form/InputField` (reuse komponen existing).
- [ ] Gunakan `ButtonField` dari `@/components/form/ButtonField` untuk tombol submit.
- [ ] `react-hook-form` + `zodResolver(CreateAddressSchema)` — pola identik dengan `ContactForm`.
- [ ] Submit: panggil `useCreateAddress(contactId)`.
- [ ] Tombol submit disabled saat `isPending`.

### Update `AddressSection.tsx`
- [ ] Tambah tombol "Tambah Alamat" di header section — panggil `openCreateModal()` dari `useAddressStore`.
- [ ] MVP: render `AddressForm` secara kondisional saat `isOpenCreateModal === true` (inline, sebelum list).
- [ ] Tombol "Tambah Alamat" di `AddressEmptyState` juga panggil `openCreateModal()`.

## Acceptance Criteria

- Tombol "Tambah Alamat" tersedia di header section dan empty state.
- Form create muncul saat tombol diklik.
- Validasi `country` dan `postal_code` wajib muncul jika kosong.
- Request `POST /contacts/:id/addresses` terkirim dengan payload yang benar.
- Response sukses: form tertutup + toast + alamat baru muncul di list (setelah invalidate).
- Response error (400/401/404): toast error muncul.
- Tombol submit disabled saat `isPending`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka form create | Klik "Tambah Alamat" | Form create muncul di section |
| 2 | Submit valid | Isi country + postal_code → submit | Toast sukses; alamat baru muncul di list |
| 3 | Country kosong | Submit tanpa country | Validasi Zod: "Country wajib diisi" |
| 4 | Postal code kosong | Submit tanpa postal_code | Validasi Zod: "Postal code wajib diisi" |
| 5 | Field opsional kosong | Submit hanya country + postal_code | Request sukses tanpa error validasi |
| 6 | Loading state | Klik submit | Tombol disabled saat request berlangsung |
| 7 | Error 400 | API return validasi error | Toast error muncul |
| 8 | CTA dari empty state | Klik "Tambah Alamat" di empty state | Form create muncul |
| 9 | Token expired | Token tidak valid → submit | Redirect ke `/auth/login` |

## Notes

- `address.store.ts` tidak di-persist ke `localStorage` — state modal tidak perlu bertahan antar session.
- `invalidateQueries(['contacts', contactId, 'addresses'])` me-refetch list setelah create — tidak perlu optimistic update untuk MVP.
- Field opsional yang dikirim sebagai string kosong `""` — pastikan schema meng-handle ini (`.optional().or(z.literal(""))` seperti pola di `contact.schema.ts`).
