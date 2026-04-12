## Deskripsi
Melakukan setup awal untuk core library, arsitektur routing, dan struktur folder agar aplikasi siap dikembangkan.

## Tasks (To-Do)
- [x] **Layouts:** Buat `src/layouts/AuthLayout.tsx` dan `src/layouts/MainLayout.tsx`, pastikan keduanya memiliki `<Outlet />`.
- [x] **Pages:** Buat `src/pages/RegisterPage.tsx` dan `src/pages/ContactsPage.tsx` (isi dengan `<h1>NamaHalaman</h1>` untuk testing).
- [x] **Routing:** Setup `react-router` dengan `createBrowserRouter` di file `src/routes/index.tsx` (hubungkan Layout dan Pages).
- [x] **Data Fetching:** Setup `QueryClientProvider` + Devtools di `src/main.tsx`.
- [x] **HTTP Client:** Buat file `src/lib/axiosClient.ts` untuk base instance Axios (persiapan interceptor).
- [x] **State Management:** Buat skeleton awal `src/store/useAuthStore.ts` menggunakan Zustand + persist middleware.
- [x] **Features Skeleton:** Buat folder `src/features/auth` dan `src/features/contacts` sebagai kerangka awal domain logic.

## Kriteria Selesai (Acceptance Criteria)
- [x] Aplikasi berjalan tanpa error merah di console.
- [x] Ikon TanStack Query Devtools muncul di browser.
- [x] URL `/register` dan `/contacts` (index route) berhasil dirender dengan benar di dalam Layout.
