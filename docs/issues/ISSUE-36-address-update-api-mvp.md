# Issue #36 — Update Address: API Integration + UI MVP

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `api-integration` |
| **Dibuat** | 2026-04-11 |
| **Ditutup** | — |
| **Depends on** | Issue #35 (Get Address — untuk pre-fill), Issue #33 (Create Address — schema & `AddressForm` reuse) |

## Context

User perlu bisa **mengedit alamat yang sudah ada**. Issue ini mengimplementasikan endpoint `PUT /api/contacts/:idContact/addresses/:idAddress` beserta form edit MVP yang memanfaatkan kembali `AddressForm` dari Issue #33 dengan mode `'edit'` dan pre-fill data dari `useGetAddress` (Issue #35).

Pola ini identik dengan `useUpdateContact` + `ContactForm` mode edit di Issue #25.

## Goals

- Implementasi `PUT /api/contacts/:idContact/addresses/:idAddress`.
- Tambah hook `useUpdateAddress(contactId, addressId)` menggunakan `useMutation`.
- Tambah `UpdateAddressSchema` ke `address.schema.ts`.
- Extend `address.store.ts` dengan state modal edit.
- Extend `AddressForm` agar mendukung mode `'edit'` dengan pre-fill.
- Tambah tombol "Edit" di `AddressCard` yang membuka form edit MVP.

## API Reference

### PUT /api/contacts/:idContact/addresses/:idAddress

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

**Response 200:**
```json
{
  "success": true,
  "message": "Address Updated successfully",
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

**Response Error:** `400` (validation), `401` (unauthorized), `404` (contact or address not found)

## Scope of Work

**In scope**

- `src/features/address/address.schema.ts` — tambah `UpdateAddressSchema` dan `UpdateAddressPayload`.
- `src/features/address/address.service.ts` — tambah `updateAddress(contactId, addressId, payload)`.
- `src/features/address/address.hook.ts` — tambah `useUpdateAddress(contactId, addressId)`.
- `src/features/address/address.store.ts` — extend dengan state edit modal (`isOpenEditModal`, `selectedAddress`, `openEditModal`, `closeEditModal`).
- `src/features/address/address.types.ts` — extend `AddressState` dengan field edit modal.
- `src/features/address/components/AddressForm.tsx` — extend dengan prop `mode: 'create' | 'edit'` dan `defaultValues?: Address`.
- `src/features/address/components/AddressCard.tsx` — tambah tombol "Edit" (panggil `openEditModal(address)`).
- `src/features/address/components/AddressSection.tsx` — render form edit MVP secara kondisional.

**Out of scope**

- Dialog edit (Issue #37 — Styling).
- Remove address (Issue #38).

## Suggested Technical Checklist

### `address.schema.ts`
- [ ] Tambah `UpdateAddressSchema` — sama dengan `CreateAddressSchema` (semua field opsional, namun `country` dan `postal_code` tetap wajib untuk konsistensi data):
  ```ts
  export const UpdateAddressSchema = CreateAddressSchema;
  ```
  Atau buat variant semua optional jika API memang mendukung partial update — sesuaikan dengan behavior API.
- [ ] Export `UpdateAddressPayload = z.infer<typeof UpdateAddressSchema>`.

### `address.service.ts`
- [ ] Tambah `updateAddress(contactId: string, addressId: string, payload: UpdateAddressPayload)`:
  - `PUT /contacts/${contactId}/addresses/${addressId}` → return `ApiResponse<Address>`.

### `address.hook.ts`
- [ ] Tambah `useUpdateAddress(contactId: string, addressId: string)`: `useMutation`:
  - `mutationFn`: `(payload: UpdateAddressPayload) => addressService.updateAddress(contactId, addressId, payload)`.
  - `onSuccess`: `closeEditModal()` + `toast.success(response.message)` + `invalidateQueries(['contacts', contactId, 'addresses'])`.
  - `onError`: `errorHookResponse(error)`.

### `address.store.ts`
- [ ] Extend `useAddressStore` dengan:
  ```ts
  isOpenEditModal: boolean
  selectedAddress: Address | null
  openEditModal: (address: Address) => void  // set isOpenEditModal: true + selectedAddress
  closeEditModal: () => void                 // set isOpenEditModal: false + selectedAddress: null
  ```

### `address.types.ts`
- [ ] Extend `AddressState` dengan field edit modal di atas.

### `AddressForm.tsx`
- [ ] Tambah prop `mode: 'create' | 'edit'` (default `'create'`) dan `defaultValues?: Address`.
- [ ] Jika `mode === 'edit'`: gunakan `reset(defaultValues)` di `useEffect` saat `defaultValues` berubah — pola identik dengan `ContactForm`.
- [ ] Submit: panggil `useCreateAddress` jika `mode === 'create'`, panggil `useUpdateAddress` jika `mode === 'edit'`.
- [ ] Saat mode `'edit'`, hook `useUpdateAddress` butuh `contactId` dan `addressId` — pastikan keduanya tersedia via props.
- [ ] Tambah prop `addressId?: string` untuk kebutuhan mode edit.

### `AddressCard.tsx`
- [ ] Tambah tombol "Edit" — ikon `Pencil` dari `lucide-react`, `variant="ghost"`, `size="sm"`.
- [ ] Klik "Edit": panggil `openEditModal(address)` dari `useAddressStore`.

### `AddressSection.tsx`
- [ ] MVP: render form edit secara kondisional `{isOpenEditModal && <AddressForm mode="edit" ... />}` (inline, di atas list atau di bawah card terpilih).
- [ ] Saat `isOpenEditModal` true, `selectedAddress` dari store digunakan sebagai `defaultValues`.

## Acceptance Criteria

- Tombol "Edit" tersedia di setiap `AddressCard`.
- Klik "Edit" membuka form edit dengan data alamat ter-pre-fill.
- Ubah field → submit → toast sukses + data alamat terupdate di list.
- Validasi `country` dan `postal_code` tetap wajib.
- Response error (400/401/404): toast error muncul.
- Tombol submit disabled saat `isPending`.

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka form edit | Klik "Edit" di card alamat | Form edit terbuka dengan data ter-pre-fill |
| 2 | Update valid | Ubah `city` → submit | Toast sukses; card alamat ter-update |
| 3 | Update country kosong | Hapus country → submit | Validasi Zod muncul |
| 4 | Pre-fill benar | Buka form edit | Semua field terisi sesuai data alamat |
| 5 | Loading | Klik submit edit | Tombol disabled saat request berlangsung |
| 6 | Error 400 | API return error | Toast error muncul |
| 7 | Error 404 | Address/contact tidak ditemukan | Toast error "Not Found" |
| 8 | Token expired | Token tidak valid → submit | Redirect ke `/auth/login` |

## Notes

- Pre-fill menggunakan `reset(defaultValues)` di `useEffect` — identik dengan pola `ContactForm` + `UserForm` yang sudah ada.
- `selectedAddress` di store sudah berisi data lengkap dari list response — tidak perlu hit `useGetAddress` untuk pre-fill (data sudah available dari cache list). `useGetAddress` (Issue #35) tetap tersedia jika dibutuhkan di skenario lain.
- `invalidateQueries(['contacts', contactId, 'addresses'])` me-refetch list setelah update.
