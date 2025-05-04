# Frontend_Kasir_App_NextJS

## Deskripsi

**Frontend_Kasir_App_NextJS** adalah aplikasi frontend untuk sistem kasir restoran, dibangun menggunakan **Next.js 15 App Router**, **React**, dan **Tailwind CSS**. Aplikasi ini terhubung ke backend REST API dan mendukung berbagai peran pengguna (admin, kasir, dan pelayan) untuk mengelola pesanan, meja, menu, transaksi, dan pengguna lainnya.

---

## Teknologi yang Digunakan

- [Next.js 15 (App Router)](https://nextjs.org/docs/app)
- React.js
- Tailwind CSS
- Axios
- Context API
- JWT Authentication
- REST API Integration

---

## Instalasi

1. Clone repository ini:

   ```bash
   git clone https://github.com/username/Frontend_Kasir_App_NextJS.git
  

2. Masuk ke direktori proyek:

   ```bash
   cd Frontend_Kasir_App_NextJS

3. Install semua dependensi:

   ```bash
    npm install

4. Buat file `.env` di root folder dan isi dengan konfigurasi berikut :
   ```bash
   BASE_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_JWT_SECRET=9578
   JWT_REFRESH_SECRET=123

pastikan backend sudah berjalan di `http://localhost:5000`.

---

## Menjalankan Aplikasi
Untuk memulai server development:

  ```bash
   npm run dev
  ```

Aplikasi akan berjalan di `http://localhost:3000`.


## Struktur Folder

---
<pre>
/frontend-kasir-app
│
├── .env
├── package.json
├── next.config.mjs
├── tailwind.config.mjs
│
├── /public/
│   ├── cashire.png
│   ├── cashire1.png
│   ├── userIcons.svg
│   └── /assets/icons/
│       ├── CartIcon.jsx
│       ├── CashireIcons.jsx
│       ├── CircleBackground.jsx
│       ├── CloseIcons.jsx
│       ├── ErrorIcons.jsx
│       ├── HamburgerMenu.jsx
│       ├── IconsList.jsx
│       ├── IncomsIcons.jsx
│       ├── MoonIcon.jsx
│       ├── OrderIcons.jsx
│       ├── SuccessIcon.jsx
│       ├── SunIcon.jsx
│       ├── TabelIcons.jsx
│       └── UserIcons.jsx
│
├── /src/
│   ├── /app/
│   │   ├── _app.js
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── /context/
│   │   │   └── CartContext.jsx
│   │   ├── /hooks/
│   │   │   └── useFetchWithAuth.jsx
│   │   ├── /auth/
│   │   │   ├── login/page.jsx
│   │   │   ├── logout/page.jsx
│   │   │   └── register/page.jsx
│   │   ├── /orderCreate/page.jsx
│   │   ├── /editOrder/[id]/page.jsx
│   │   ├── /payment/[id]/page.jsx
│   │   ├── /admin/
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx
│   │   │   ├── menu/page.jsx
│   │   │   ├── orders/page.jsx
│   │   │   ├── table/page.jsx
│   │   │   ├── users/page.jsx
│   │   │   ├── transaction/page.jsx
│   │   │   └── dashboard/
│   │   │       ├── page.jsx
│   │   │       └── components/StatCard.jsx
│   │   │
│   │   ├── /admin/components/
│   │   │   ├── SideBar.jsx
│   │   │   └── ToggleDarkMode.jsx
│   │   ├── /(groups)/
│   │   │   ├── layout.jsx
│   │   │   ├── menulist/page.jsx
│   │   │   ├── menulist/components/CartSidebar.jsx
│   │   │   └── orderlist/page.jsx
│
├── /src/components/
│   ├── navbar/Navbar.jsx
│   ├── footer/Footer.jsx
│   └── alert/Alert.jsx
</pre>
---

## Fitur Utama
Berikut beberapa endpoint penting (penjelasan lengkap bisa ditambahkan di dokumentasi Postman atau Swagger):
- **Autentikasi JWT** dengan penyimpanan token di `localStorage`
- **Manajemen Pesanan** (buat, edit, lihat)
- **Halaman Dashboard Admin** (menu, user, meja, transaksi, laporan)
- **Dark/Light Mode Toggle**
- **Cart Sidebar** untuk pelayan/kasir
- **Role-based Layout** untuk admin, kasir, pelayan
- **Custom Hooks & Context** untuk pengelolaan state

---

## Catatan
- Pastikan backend sudah berjalan di `http://localhost:5000`.
- Semua API request terhubung ke base URL dari variabel `BASE_URL` di `.env`.
- Disarankan menggunakan versi Node.js terbaru untuk kompatibilitas optimal.

---

## Credential Login
- **Admin**:
  - Username : `admin`
  - Password : `Admin#1234`

- **Kasir**:
  - Username : `kasir`
  - Password : `Kasir#1234`

- **Pelayan**:
  - Username : `pelayan`
  - Password : `Pelayan#1234`
