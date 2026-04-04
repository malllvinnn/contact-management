# Implementasi light mode & dark mode

## 1. Context

- Project memakai **Tailwind CSS v4**, **shadcn** (variabel warna di `src/index.css`), dan sudah ada blok **`.dark`** beserta token `oklch` untuk tema gelap.
- Di `index.css` sudah ada `@custom-variant dark (&:is(.dark *));` — kelas `.dark` pada ancestor (biasanya `<html>`) mengaktifkan variabel dark mode.
- Dependency **`next-themes`** sudah ada di `package.json` tetapi belum dipakai di `main.tsx` / layout.
- Pola umum shadcn + Vite: **`ThemeProvider` dari `next-themes`** membungkus app, menyimpan preferensi di `localStorage`, mendukung **system**, **light**, dan **dark**, serta mengurangi flash tema salah saat load.
- **Zustand** tidak wajib untuk tema jika memakai `next-themes` (sudah punya persistensi). Zustand hanya berguna jika ingin satu store global yang menggabungkan tema dengan state UI lain — opsional, bukan default.
- **`useToggle` dari `react-use` tidak direkomendasikan** untuk tema: itu untuk boolean (on/off) saja, sedangkan `next-themes` mengelola **light / dark / system**, persistensi, dan sync ke DOM. **Best practice:** pakai **`useTheme()` dari `next-themes`** (`theme`, `setTheme`, `resolvedTheme`) pada handler toggle — satu sumber kebenaran, tanpa state tema duplikat di React.

## 2. Goals

1. Pengguna dapat beralih antara **light**, **dark**, dan (opsional) **system** secara konsisten di seluruh app.
2. Preferensi tema **tersimpan** antar reload (mis. `localStorage`) dan tidak ada **flash** tema yang salah saat pertama kali render (hydration).
3. Komponen yang memakai token shadcn (`bg-background`, `text-foreground`, dll.) otomatis mengikuti tema tanpa mengganti setiap halaman secara manual.
4. **Sonner** (`Toaster`) mengikuti tema aktif (light/dark) bila didukung oleh konfigurasi yang ada.

## 3. Scope of work

| In scope | Out of scope |
|----------|----------------|
| Integrasi `ThemeProvider` (`next-themes`) di root app (`main.tsx` atau wrapper dedikasi) | Polish layout penuh (navbar, spacing) — issue UI terpisah |
| Menambah kelas `.dark` pada elemen root sesuai dokumentasi `next-themes` + Tailwind variant yang ada | Refactor semua warna hard-coded di komponen lama (bisa bertahap) |
| **Toggle tema minimal di `src/layouts/MainLayout.tsx`** (sejajar placeholder/header — cukup tombol atau icon; yang penting fitur jalan dulu) | Toggle di `AuthLayout` / halaman login (bisa issue polish UI nanti); halaman profile / Get–Update user |
| Sinkronisasi tema dengan `localStorage` + opsi `defaultTheme` / `enableSystem` | Migrasi ke cookie `httpOnly` untuk tema |

## 4. Suggested technical checklist

- [x] Buat komponen `ThemeProvider` tipis yang membungkus children dengan `ThemeProvider` dari `next-themes` (props: `attribute="class"`, `defaultTheme`, `enableSystem`, `storageKey` konsisten).
- [x] Bungkus root app (`main.tsx`) dengan provider tersebut (urutan: di dalam `QueryClientProvider` atau di luarnya — pastikan router dan toaster tetap dalam scope tema).
- [x] Pastikan elemen root memakai `class` strategy agar selaras dengan `.dark` di CSS (bukan hanya `data-theme` kecuali disesuaikan dengan Tailwind).
- [x] Di **`MainLayout.tsx`**, tambah toggle minimal (tombol / icon) yang memanggil **`setTheme`** dari **`useTheme()`** (`next-themes`) — jangan pakai `useToggle` untuk state tema; jika hanya butuh **light ↔ dark** bergantian, boleh `setTheme(resolvedTheme === "dark" ? "light" : "dark")` atau enum eksplisit.
- [x] Set `theme` pada `<Toaster />` (Sonner) agar mengikuti tema (prop `theme` / integrasi dengan `useTheme` sesuai API komponen di project).
- [x] (Opsional) Jika tetap ingin Zustand: sinkronkan `theme` dari `next-themes` ke store hanya jika ada kebutuhan lintas fitur; hindari duplikasi sumber kebenaran.

## 5. Acceptance criteria

- [x] Toggle light ↔ dark ada di **`MainLayout`** dan mengubah tampilan area utama; halaman auth mengikuti tema yang sama (persistensi `next-themes`).
- [x] Setelah refresh, tema yang dipilih tetap sama (persistensi berfungsi).
- [x] Mode **system** (jika diaktifkan) mengikuti preferensi OS/browser.
- [x] Tidak ada error hydration terkait tema di console (development).
- [x] Toast (Sonner) tidak "nyangkut" di tema terang saat app dalam mode gelap (atau sebaliknya).

## 6. Blackbox test plan

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Toggle manual | Buka app → klik toggle dark → klik toggle light | UI berubah; background/teks konsisten dengan tema. |
| 2 | Persistensi | Pilih dark → refresh (F5) | Tetap dark setelah reload. |
| 3 | System (jika ada) | Set ke system → ubah tema OS (light/dark) | App mengikuti (atau sesuai perilaku `next-themes`). |
| 4 | Tema di area auth | Set tema di MainLayout (mis. dark) → navigasi ke `/auth/login` | Halaman auth mengikuti tema tersimpan (token warna shadcn); toggle belum wajib di AuthLayout pada issue ini. |
| 5 | Toast | Trigger toast di light dan dark | Toast readable di kedua mode. |

## 7. Notes

- **Rekomendasi utama:** `next-themes` + kelas `.dark` — selaras dengan shadcn dan file CSS yang sudah ada; tidak perlu Zustand khusus tema kecuali ada alasan arsitektur.
- **Tailwind:** variant `dark:` sudah terhubung ke `.dark *` lewat `@custom-variant` — jangan ubah kecuali ada konflik dengan `next-themes`.
- **File yang kemungkinan disentuh:** `src/main.tsx`, komponen baru mis. `src/components/theme/ThemeProvider.tsx`, `src/layouts/MainLayout.tsx` (**toggle dulu di sini**). Komponen `ThemeToggle` terpisah opsional jika ingin merapikan import.
- **Label GitHub yang cocok:** `enhancement`, `ui`, `theming`.
