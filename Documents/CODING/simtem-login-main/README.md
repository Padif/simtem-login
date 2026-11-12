# Cipher — sistem login Next.js

Starter autentikasi (register, login credentials, OAuth, lupa password) yang sudah disesuaikan dengan **Next.js 16**, **React 19**, **Auth.js v5**, **Prisma ORM 7**, **Zod 4**, dan **Tailwind CSS 4**.

## Yang salah di kode lama (penyebab error)

Kesalahan utamanya bukan “satu baris rusak”, melainkan **pola Next.js 13/14 masih dipakai di stack Next.js 16**.

### 1. `export const dynamic = "force-dynamic"`

Di Next.js 16, proyek ini mengaktifkan **Cache Components** (`cacheComponents: true` di `next.config.ts`). Dengan flag itu, route segment config lama **tidak didukung lagi**:

- `dynamic`
- `revalidate`
- `fetchCache`
- `dynamicParams`

Itulah kenapa `export const dynamic = "force-dynamic"` langsung error.

**Penggantinya:** biarkan Next.js prerender bagian statis, lalu bungkus data per-request (seperti `auth()` / cookies) di dalam `<Suspense>`. Jangan memaksa seluruh halaman jadi dynamic.

### 2. `middleware.ts` vs `proxy.ts`

Mulai Next.js 16, file `middleware.ts` diganti menjadi `src/proxy.ts`, dan export-nya bernama `proxy` (bukan `middleware`).

Auth.js v5 yang benar:

```ts
export const { auth: proxy } = NextAuth(authConfig);
```

Jangan mengimpor Prisma / bcrypt di `proxy.ts`. Instance NextAuth di proxy harus **ringan** (hanya JWT + `authorized` callback). Instance lengkap (adapter + credentials) tetap di `src/lib/auth.ts`.

### 3. Prisma 7 bukan Prisma 5/6

Kesalahan umum saat naik versi:

- Masih memakai generator `prisma-client-js` dan `new PrismaClient()` tanpa adapter.
- Masih menaruh `url` di `schema.prisma` (`datasource db { url = env("DATABASE_URL") }`). Di Prisma 7 URL pindah ke `prisma.config.ts`.
- File config salah nama / belum ada, dan paket `dotenv` + `pg` tidak diinstal.
- Client dihasilkan ke `src/generated/prisma` lalu di-gitignore, tetapi `prisma generate` tidak dijalankan — TypeScript gagal import `@/generated/prisma/client`.

### 4. Auth.js v5 (bukan NextAuth v4)

Pola lama `NextAuth({...})` di `pages/api/auth/[...nextauth].ts`, `getServerSession`, dan `NEXTAUTH_SECRET` sudah tidak dipakai.

Yang wajib sekarang:

- Route handler App Router: `src/app/api/auth/[...nextauth]/route.ts` mengekspor `{ GET, POST }` dari `handlers`.
- Env: `AUTH_SECRET` dan `AUTH_URL` (bukan hanya `NEXTAUTH_*`).
- Credentials provider **harus** `session.strategy = "jwt"` (database session tidak kompatibel dengan Credentials).

### 5. Cache Components + `auth()` di Server Component

`auth()` membaca cookie. Itu **runtime data**. Jika dipanggil langsung di `page.tsx` tanpa batas `<Suspense>` / `loading.tsx`, build Cache Components akan gagal.

Landing page memisahkan cek sesi ke komponen kecil di dalam `<Suspense>`, supaya UI pemasaran tetap bisa di-prerender.

### 6. Dependensi yang terlewat

| Paket | Kenapa wajib |
| --- | --- |
| `pg` | Driver PostgreSQL untuk `@prisma/adapter-pg` |
| `dotenv` | Prisma CLI 7 tidak lagi memuat `.env` sendiri |
| `@types/pg` | Tipe TypeScript untuk `pg` |

Tanpa `pg`, Prisma Client tidak bisa konek meskipun schema sudah benar.

### 7. `.gitignore` memakan `.env.example`

Pola `.env*` juga mengabaikan `.env.example`, jadi file contoh env tidak ikut ke repo. Sekarang `.env.example` di-whitelist.

### 8. Zod 4

`z.string().email()` diganti `z.email()`. Jika schema validasi masih pola Zod 3, TypeScript akan error setelah upgrade.

---

## Yang perlu kamu lakukan

### 1. Salin environment

```bash
cp .env.example .env
```

Isi minimal:

1. `DATABASE_URL` — PostgreSQL yang benar-benar berjalan.
2. `AUTH_SECRET` — generate dengan:

```bash
openssl rand -base64 32
```

3. `AUTH_URL` — `http://localhost:3000` untuk development.

OAuth (Google / GitHub / Facebook) dan Resend **opsional**. Tanpa itu, login email tetap jalan. Tanpa `RESEND_API_KEY`, kode reset password hanya muncul di log development (jangan dipakai di production).

### 2. Install & generate Prisma Client

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

`prisma generate` wajib setiap kali schema berubah, dan juga dijalankan lewat `postinstall` / `npm run build`.

### 3. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Jangan mengembalikan pola lama

- Jangan menambah lagi `export const dynamic = "force-dynamic"` selama `cacheComponents: true`.
- Jangan membuat `middleware.ts` baru di samping `src/proxy.ts`.
- Jangan instansiasi `PrismaClient` tanpa `PrismaPg`.
- Jangan mengandalkan proxy saja untuk otorisasi — halaman terproteksi tetap memanggil `requireSession()` / `auth()` di server.

---

## Stack saat ini

- Next.js 16 (App Router, Cache Components, React Compiler, Turbopack)
- React 19
- Auth.js 5 (`next-auth` beta) + Prisma Adapter
- Prisma ORM 7 + PostgreSQL (`@prisma/adapter-pg`)
- Zod 4, Tailwind CSS 4, Pino, Resend, bcryptjs

## Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` lalu production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Migration development |
| `npm run db:push` | Push schema tanpa file migration |
