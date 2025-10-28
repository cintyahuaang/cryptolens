# 🚀 CryptoLens — Dashboard Kripto Real-Time

CryptoLens menampilkan harga, grafik, dan berita kripto secara langsung menggunakan CoinGecko API dan NewsAPI.

## 📁 Struktur Proyek
```
cryptolens/
├── index.html
├── terms.html
├── netlify/functions/
│   ├── coingecko.js
│   └── newsapi.js
├── netlify.toml
└── assets/
```

## ⚙️ Deploy di Netlify
1. Hubungkan ke GitHub
2. Publish directory: `/`
3. Functions directory: `netlify/functions`
4. Tambahkan Environment Variables:
   - `NEWSAPI_KEY` = (API key dari newsapi.org)
   - `NODE_VERSION` = `18`

Lalu **Deploy site**.

## 🧠 Disclaimer
Hanya untuk edukasi. Tidak memberi saran investasi.
