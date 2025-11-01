
// CryptoApp API helpers (CORS-safe for GitHub Pages)

const API = {
  markets: "https://api.allorigins.win/raw?url=" + 
    encodeURIComponent("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h"),
  // ✅ NEWS INDONESIA + THUMBNAIL

API.news = "https://corsproxy.io/?" + 
  encodeURIComponent("https://api.rss2json.com/v1/api.json?rss_url=https://crypto.news/id/feed/");

async function fetchNews(){
  const wrap = document.getElementById("newsList");
  try{
    const res = await fetch(API.news, { cache: "no-store" });
    const json = await res.json();

    if(!json.items){
      wrap.innerHTML = `<div class="loader">Belum ada berita untuk ditampilkan.</div>`;
      return;
    }

    wrap.innerHTML = "";
    json.items.slice(0,8).forEach(item => {
      const d = new Date(item.pubDate);
      const img = item.thumbnail || "https://via.placeholder.com/100x70?text=News";

      const el = document.createElement("div");
      el.className = "news-item";
      el.style.display = "flex";
      el.style.gap = "12px";
      el.style.alignItems = "flex-start";

      el.innerHTML = `
        <img src="${img}" alt="thumb" style="width:100px;height:70px;border-radius:8px;object-fit:cover;">
        <div>
          <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
          <div class="src">${d.toLocaleDateString("id-ID", {day: "2-digit", month: "short", year: "numeric"})}</div>
        </div>
      `;
      wrap.appendChild(el);
    });
  }catch(e){
    console.error(e);
    wrap.innerHTML = `<div class="loader">Tidak bisa memuat berita saat ini. Silakan coba lagi nanti.</div>`;
  }
};

const table = document.getElementById("coinsTable");
const tbody = table.querySelector("tbody");
const loader = document.getElementById("tableLoader");
const refreshBtn = document.getElementById("refreshBtn");
const coinSelect = document.getElementById("coinSelect");

async function fetchMarkets(){
  loader.classList.remove("hidden");
  table.classList.add("hidden");
  try{
    const res = await fetch(API.markets, { cache: "no-store" });
    if(!res.ok) throw new Error("Gagal mengambil data pasar");
    const data = await res.json();
    renderTable(data);
    renderSelect(data);
  }catch(e){
    loader.textContent = "Gagal memuat data. Coba klik Refresh.";
    console.error(e);
  }
}

function renderTable(list){
  tbody.innerHTML = "";
  list.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td><img src="${c.image}" alt="" style="height:18px;vertical-align:middle;margin-right:8px">${c.name} <span style="color:#9aa4b2">(${c.symbol.toUpperCase()})</span></td>
      <td>$${c.current_price.toLocaleString()}</td>
      <td style="color:${c.price_change_percentage_24h>=0?'#19c37d':'#ef4444'}">${(c.price_change_percentage_24h?.toFixed(2) || 0)}%</td>
      <td>$${c.market_cap.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
  loader.classList.add("hidden");
  table.classList.remove("hidden");
}

function renderSelect(list){
  coinSelect.innerHTML = `<option value="">Pilih koin…</option>` + 
    list.map(c=>`<option value="${c.id}" data-price="${c.current_price}">${c.name} (${c.symbol.toUpperCase()})</option>`).join("");
}

async function fetchNews(){
  const wrap = document.getElementById("newsList");
  try{
    const res = await fetch(API.news, { cache: "no-store" });
    if(!res.ok) throw new Error("Gagal mengambil berita");
    const data = await res.json();
    wrap.innerHTML = "";
    (data || []).slice(0,10).forEach(item => {
      const el = document.createElement("div");
      el.className = "news-item";
      const d = new Date(item.publishedAt);
      el.innerHTML = `
        <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>
        <div class="src">${item.source?.name || 'Crypto News'} • ${d.toLocaleString()}</div>
      `;
      wrap.appendChild(el);
    });
    if(!data || data.length===0){
      wrap.innerHTML = `<div class="loader">Belum ada berita. Coba klik Refresh.</div>`;
    }
  }catch(e){
    wrap.innerHTML = `<div class="loader">Tidak bisa memuat berita saat ini. Silakan coba lagi nanti.</div>`;
    console.error(e);
  }
}

refreshBtn?.addEventListener("click", () => {
  fetchMarkets();
  fetchNews();
});

fetchMarkets();
fetchNews();
