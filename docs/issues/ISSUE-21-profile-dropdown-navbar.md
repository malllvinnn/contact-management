# Issue #21 — Profile Dropdown di Navbar (Ganti Logout Button)

| Meta | Detail |
|------|--------|
| **Status** | OPEN |
| **Labels** | `feature`, `ui`, `navbar` |
| **Dibuat** | 2026-03-30 |
| **Ditutup** | — |
| **Depends on** | Issue #17 (routing), Issue #19 (ProfilePage tersedia) |

## Context

Saat ini `MainLayout.tsx` memiliki Logout button yang langsung tampil di navbar. Seiring ditambahkannya halaman profile, diperlukan **dropdown menu** pada navbar untuk mengelompokkan aksi terkait user (profil, logout) agar lebih rapi dan scalable.

Dropdown ini akan menampilkan:
1. **Header dropdown** — nama user yang sedang login (dari `useAuthStore`).
2. **Menu item "Profile"** — navigate ke `/dashboard/profile`.
3. **Menu item "Logout"** — memicu logout (pindah dari button langsung ke dalam dropdown).

## Goals

- Hapus Logout button yang berdiri sendiri dari navbar `MainLayout`.
- Tambah komponen `ProfileDropdown` (atau gunakan shadcn `DropdownMenu`) di posisi yang sama.
- Tampilkan nama user aktif di bagian atas dropdown.
- Sediakan link ke `/dashboard/profile` dan aksi logout di dalam dropdown.

## Scope of Work

**File yang diubah/dibuat:**

```
src/layouts/MainLayout.tsx         # Integrasi ProfileDropdown, hapus Logout button lama
src/components/ProfileDropdown.tsx # Komponen baru (opsional, bisa inline di MainLayout)
```

**Out of scope**

- Avatar / foto profil user di dropdown.
- Notifikasi atau badge di icon.

## Suggested Technical Checklist

### Komponen `ProfileDropdown`
- [ ] Install / pastikan `DropdownMenu` dari shadcn tersedia (`@/components/ui/dropdown-menu`).
- [ ] Trigger: icon user (`UserCircle` atau `CircleUser` dari lucide-react) + nama user (opsional tampil di samping icon, bisa hidden di mobile).
- [ ] Dropdown content:
  - **Header** (non-clickable): tampilkan `user.name` dari `useAuthStore` — gunakan class yang membedakan secara visual (font-weight, muted color, border-bottom).
  - **Item "Profile"**: `<Link to="/dashboard/profile">` atau navigate programmatically → icon `User` + label "Profile".
  - **Separator** (`<DropdownMenuSeparator />`).
  - **Item "Logout"**: icon `LogOut` + label "Logout" — onClick trigger `mutate()` dari `useLogout()`, disabled saat `isPending`.
- [ ] Loading state saat logout: item "Logout" disabled + spinner icon.

### `MainLayout.tsx`
- [ ] Hapus `<Button>` Logout yang lama.
- [ ] Tambah `<ProfileDropdown />` di nav (posisi kanan, setelah `ThemeToggle`).

### Responsivitas
- [ ] Dropdown trigger cukup terlihat di mobile (icon saja sudah cukup, nama bisa hidden di `sm:` ke bawah).
- [ ] Dropdown panel tidak overflow di layar sempit.

## Acceptance Criteria

- Logout button lama tidak lagi tampil di navbar.
- Ada icon/trigger di navbar kanan yang membuka dropdown saat diklik.
- Bagian atas dropdown menampilkan nama user yang sedang login.
- Klik "Profile" navigasi ke `/dashboard/profile`.
- Klik "Logout" menjalankan logout + redirect ke `/auth/login`.
- Saat logout sedang berjalan, item "Logout" disabled dan ada indikator loading.
- Tampil rapi di mobile (375px) dan desktop (1280px+).

## Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Buka dropdown | Klik icon user di navbar | Dropdown terbuka dengan nama user di atas |
| 2 | Nama user benar | Lihat header dropdown | Nama sesuai data login yang ada di store |
| 3 | Link profil | Klik "Profile" di dropdown | Navigasi ke `/dashboard/profile` |
| 4 | Logout | Klik "Logout" di dropdown | Redirect ke `/auth/login`, store cleared |
| 5 | Loading logout | Klik logout, amati sebelum redirect | Item disabled, spinner tampil |
| 6 | Tutup dropdown | Klik di luar dropdown | Dropdown tertutup |
| 7 | Mobile | Buka di viewport 375px | Trigger terlihat; dropdown tidak overflow |
| 8 | Dark mode | Toggle dark mode, buka dropdown | Dropdown konsisten dengan tema aktif |

## Notes

- Gunakan `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel` dari shadcn.
- Untuk nama user: ambil dari `useAuthStore((state) => state.user?.name)`.
- Jika `user.name` belum tersinkron setelah update profil (Issue #19), pastikan Issue #19 sudah menyelesaikan sync ke store terlebih dahulu agar ini langsung berfungsi.
