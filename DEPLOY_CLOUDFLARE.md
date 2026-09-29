# Deploy SalesGuard AI V3

## Opsi A — Cloudflare Dashboard + GitHub
1. Upload folder ini ke GitHub.
2. Cloudflare → Workers & Pages → Create application → Workers.
3. Connect repository.
4. Build command: kosongkan / tidak ada build step.
5. Deploy.
6. Buat D1 `salesguard-db`.
7. Isi `database_id` pada `wrangler.toml`.
8. Jalankan migration/schema menggunakan Wrangler.

## Opsi B — Terminal
Prasyarat: Node.js + Wrangler.

```bash
npx wrangler login
npx wrangler d1 create salesguard-db
```

Salin database ID ke `wrangler.toml`, lalu:

```bash
npx wrangler d1 execute salesguard-db --remote --file=./db/schema.sql
npx wrangler deploy
```

## Cek API
Setelah deploy:

```text
/api/health
```

harus mengembalikan JSON dengan `ok: true`.

## Keamanan
Jangan menganggap `?workspace=demo` sebagai autentikasi. Untuk data pelanggan nyata, gunakan Cloudflare Access atau tambahkan login/session yang memverifikasi identitas pengguna di Worker.
