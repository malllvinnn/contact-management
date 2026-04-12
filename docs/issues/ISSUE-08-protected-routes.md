# Protected routes berdasarkan token autentikasi

## 1. Context

- Token dan user disimpan di `useAuthStore` (Zustand + `persist`, storage key `auth-storage`).
- Axios sudah mengirim header `Authorization: Bearer <token>` bila token ada; interceptor response 401 sudah disetel agar tidak memicu redirect global saat percobaan login gagal (tanpa token).
- Router saat ini (`src/routes/index.tsx`) belum membatasi akses: siapa pun bisa membuka `/` dan halaman auth tanpa aturan berdasarkan keberadaan token di client.

## 2. Goals

1. Halaman aplikasi utama (mis. `/` dan child route di bawah layout yang sama) hanya dapat diakses jika user memiliki token di store (setelah login).
2. Halaman auth (`/auth/login`, `/auth/register`) tidak perlu ditampilkan ke user yang sudah login — arahkan ke home atau route default aplikasi.
3. Perilaku tetap benar setelah refresh browser (rehydration dari persist), tanpa redirect yang salah atau "flash" konten sensitif.
4. (Opsional namun disarankan) Setelah login sukses, redirect ke URL yang sebelumnya diminta jika user datang dari protected route (mis. lewat `state.from`).

## 3. Scope of work

| In scope | Out of scope |
|----------|----------------|
| Komponen route guard (`AuthGuard`, `GuestGuard` atau nama setara) dan integrasi ke `createBrowserRouter` | Polish UI / tema dark–light |
| Penyesuaian struktur route agar guard membungkus layout yang tepat | Validasi JWT ke server atau refresh token |
| Menangani hydration persist agar redirect guard tidak salah di render pertama | Role-based access (admin/user) |
| Opsional: `navigate` setelah login ke `location.state.from` | Tombol logout penuh (bisa issue terpisah jika belum ada) |

## 4. Suggested technical checklist

- [x] Tambah **AuthGuard**: jika tidak ada `token` → `<Navigate to="/auth/login" replace />` (atau setara), sertakan `state: { from: location }` bila memakai pola redirect balik.
- [x] Tambah **GuestGuard**: jika ada `token` → `<Navigate to="/" replace />`; jika tidak → `<Outlet />`.
- [x] Bungkus route utama (MainLayout + halaman terlindungi) dengan AuthGuard; bungkus route auth (AuthLayout + login/register) dengan GuestGuard.
- [x] Samakan path dengan navigasi yang sudah ada (`/auth/login`, `/auth/register`, dll.).
- [x] Tangani **rehydration**: tunggu persist selesai (mis. `useAuthStore((state) => state.hasHydrated)` atau pola setara) sebelum memutuskan redirect, atau tampilkan placeholder ringan agar tidak flash konten protected.
- [x] (Opsional) Di `useLogin` → `onSuccess`, jika `(location.state as { from?: Location })?.from` ada, `navigate(from, { replace: true })`; jika tidak, `navigate("/")`.
- [x] Uji manual skenario di blackbox test plan; pastikan tidak regresi perilaku 401 saat login salah (toast, tanpa redirect paksa ke register).

## 5. Acceptance criteria

- [x] Mengakses route terlindungi (mis. `/`) tanpa token → dialihkan ke `/auth/login`.
- [x] Login sukses → masuk ke home `/` (atau ke `from` jika fitur itu diimplementasi).
- [x] User yang sudah login membuka `/auth/login` atau `/auth/register` → dialihkan ke `/` (atau default yang disepakati).
- [x] Refresh pada halaman terlindungi saat sudah login → tetap di area aplikasi (bukan redirect ke login karena race hydration).
- [x] Login dengan kredensial salah → tetap muncul toast error; tidak ada redirect tidak diinginkan yang mengganggu flow (selaras dengan interceptor 401 saat ini).

## 6. Blackbox test plan (disarankan)

| # | Skenario | Langkah | Ekspektasi |
|---|----------|---------|------------|
| 1 | Akses app tanpa login | Buka tab baru / private window, navigasi langsung ke `/` | Redirect ke `/auth/login` (atau URL auth yang dipakai project). |
| 2 | Login valid | Dari halaman login, isi username/password benar, submit | Masuk ke `/` (atau contact/home sesuai implementasi), tidak stuck di login. |
| 3 | Login invalid | Password salah (>6 karakter agar lolos validasi form), submit | Toast error; tetap di halaman login; **tidak** redirect ke register. |
| 4 | Deep link ke auth saat sudah login | Login sukses, lalu buka manual `/auth/register` atau `/auth/login` | Redirect ke `/` (guest guard aktif). |
| 5 | Refresh saat sudah login | Di `/`, refresh (F5) | Tetap di `/`, tidak ke login. |
| 6 | Bookmark / paste URL protected | Logout atau hapus storage (simulasi tanpa token), paste `/` di address bar | Redirect ke login. |
| 7 | (Jika `from` diimplementasi) | Tanpa login, akses `/` → login → setelah sukses | Kembali ke halaman yang diminta atau `/` sesuai aturan yang dipilih. |

## 7. Notes

- Letak file guard: pilih satu konvensi (`src/features/auth/guards/` vs `src/routes/`) dan konsisten dengan struktur fitur auth.
- File yang biasanya disentuh: `src/routes/index.tsx`; bila perlu `src/features/auth/auth.store.ts` (hydration); `src/features/auth/auth.hook.ts` (redirect setelah login).
- **Label GitHub yang cocok:** `enhancement`, `auth`, `routing`.
