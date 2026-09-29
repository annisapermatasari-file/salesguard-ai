# SalesGuard AI V3 — Cloudflare Native

Sales CRM / Sales Control Tower untuk Cloudflare. V3 mempertahankan UI mobile-first dari V2, tetapi menambahkan **Cloud Sync** menggunakan **Cloudflare Worker + D1**.

## Yang baru di V3
- Data tidak lagi hanya tersimpan di browser.
- Workspace disimpan di Cloudflare D1.
- Bisa dipakai dari beberapa perangkat dengan workspace yang sama.
- Jika API/D1 tidak tersedia, aplikasi otomatis kembali ke local mode.
- Dashboard, Customer 360, Pipeline, Follow-Up, Approval, Reports, WhatsApp handoff, Import/Export tetap tersedia.

## Deploy paling mudah

### 1. Buat D1
Di Cloudflare Dashboard:
- Workers & Pages → D1 SQL Database → Create database
- Nama: `salesguard-db`
- Copy **Database ID**.

### 2. Edit `wrangler.toml`
Ganti:

`REPLACE_WITH_D1_DATABASE_ID`

menjadi Database ID milikmu.

### 3. Buat tabel
Jalankan:

```bash
npx wrangler d1 execute salesguard-db --remote --file=./db/schema.sql
```

### 4. Deploy
Dari folder proyek:

```bash
npx wrangler deploy
```

Cloudflare akan meng-host frontend dan Worker pada satu alamat.

## Workspace

Gunakan query parameter:

`?workspace=demo`

Contoh:

`https://alamatmu.workers.dev/?workspace=demo`

Semua perangkat yang menggunakan workspace `demo` akan membaca data yang sama dari D1.

> **Penting:** V3 ini adalah fondasi multi-device, bukan sistem autentikasi enterprise. Untuk penggunaan perusahaan/produksi, pasang Cloudflare Access atau autentikasi aplikasi sebelum membuka workspace ke publik.

## Local mode
Jika dibuka sebagai file atau API belum aktif, aplikasi tetap bekerja memakai localStorage. Ini membuat demo tetap bisa digunakan tanpa backend.
