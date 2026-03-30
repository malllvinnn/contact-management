# Issue #12 — Implementasi light mode & dark mode

| Meta | Detail |
|------|--------|
| **Status** | CLOSED |
| **Labels** | `enhancement`, `ui`, `theming` |
| **Dibuat** | 2026-03-26 |
| **Ditutup** | 2026-03-27 |

## 1. Context

Aplikasi sudah menggunakan Tailwind v4 dengan CSS variables untuk warna (token shadcn). File `index.css` sudah memiliki blok `.dark { ... }` yang mendefinisikan ulang semua token warna untuk mode gelap, dan `@custom-variant dark (&:is(.dark *))` sudah terpasang — artinya Tailwind sudah siap merespons class `.dark` di elemen root.

Yang belum ada: mekanisme untuk **toggle** tema dari UI, **persistensi** pilihan tema, dan **sinkronisasi** dengan preferensi sistem operasi.

## 2. Goals

- Menyediakan toggle tema (light / dark / system) yang dapat diakses dari `MainLayout`.
- Tema tersimpan di `localStorage` dan dipulihkan saat reload tanpa flash (FOUC).
- Tema mengikuti preferensi sistem OS jika pilihan "system" aktif.
- Integrasi dengan komponen yang membutuhkan tema secara eksplisit (mis. `<Toaster />`).

## 3. Scope of Work

**In scope**

- `ThemeProvider` wrapper tipis di atas `next-themes`.
- Toggle tema di `MainLayout` (dropdown light/dark/system).
- Integrasi `<Toaster />` (Sonner) dengan `useTheme`.
- FOUC prevention via inline script di `index.html <head>`.
- (Opsional) Zustand store sebagai mirror read-only dari `next-themes` untuk konsumsi lintas fitur.

**Out of scope**

- Styling penuh halaman auth dan main layout (issue terpisah).
- Animasi transisi tema.

## 4. Suggested Technical Checklist

- [x] Buat `ThemeProvider` di `src/components/ui/ThemeProvider.tsx` wrapping `next-themes`.
- [x] Pasang `ThemeProvider` di `src/main.tsx` di luar `QueryClientProvider`.
- [x] Tambah toggle dropdown (Sun/Moon icon) di `MainLayout` menggunakan `useTheme()`.
- [x] Fix `DropdownMenuTrigger` — gunakan prop `render` (Base UI API, bukan `asChild` Radix).
- [x] Pastikan `<Toaster />` menggunakan `theme` dari `useTheme()`.
- [x] Tambah inline script anti-FOUC di `index.html <head>` yang baca `localStorage` dan set class sebelum render.
- [x] Verifikasi `@custom-variant dark` di `index.css` selaras dengan `attribute="class"` di ThemeProvider.
- [x] (Opsional) Buat `src/stores/theme.store.ts` sebagai mirror Zustand dari `next-themes`.

## 5. Acceptance Criteria

- Toggle tema di `MainLayout` berfungsi: light, dark, system dapat dipilih.
- Pilihan tema tersimpan di `localStorage` dan dipulihkan setelah reload.
- Tidak ada FOUC (flash ke tema salah) saat reload berulang.
- `<Toaster />` mengikuti tema aktif.
- Tailwind `dark:` variant bekerja di seluruh komponen.

## 6. Blackbox Test Plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Toggle manual | Buka app → klik toggle dark → klik toggle light | UI berubah; background/teks konsisten dengan tema. |
| 2 | Persistensi | Pilih dark → refresh (F5) | Tetap dark setelah reload. |
| 3 | System | Set ke system → ubah tema OS | App mengikuti preferensi sistem. |
| 4 | Tema di area auth | Set tema dark → navigasi ke `/auth/login` | Halaman auth mengikuti tema tersimpan. |
| 5 | Toast | Trigger toast di light dan dark | Toast readable di kedua mode. |

## 7. Notes

- `suppressHydrationWarning` pada `<html>` hanya diperlukan untuk Next.js (SSR) — tidak diperlukan di Vite.
- FOUC di Vite dicegah dengan inline blocking script di `<head>`, bukan oleh `next-themes` secara otomatis.
- `useThemeStore.getState()` memungkinkan akses tema di luar komponen React (utility/service).
- Untuk mengubah tema selalu gunakan `setTheme` dari `useTheme()`, bukan dari Zustand store.
