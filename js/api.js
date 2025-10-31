
const API = {
  markets: (vs="usd", perPage=20) => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`,
  // Simple news source using CryptoPanic RSS via rss2json (no key; rate-limited). Replace with your own if needed.
  news: `https://api.rss2json.com/v1/api.json?rss_url=https://cryptopanic.com/feed/`
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
    const res = await fetch(API.markets());
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
  coinSelect.innerHTML = `<option value="">Pilih koin…</option>` + list.map(c=>`<option value="${c.id}" data-price="${c.current_price}">${c.name} (${c.symbol.toUpperCase()})</option>`).join("");
}

async function fetchNews(){
  const wrap = document.getElementById("newsList");
  try{
    const res = await fetch(API.news);
    if(!res.ok) throw new Error("Gagal mengambil berita");
    const json = await res.json();
    wrap.innerHTML = "";
    (json.items||[]).slice(0,10).forEach(item => {
      const el = document.createElement("div");
      el.className = "news-item";
      const d = new Date(item.pubDate);
      el.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a><div class="src">${item.author||'CryptoPanic'} • ${d.toLocaleString()}</div>`;
      wrap.appendChild(el);
    });
  }catch(e){
    wrap.innerHTML = `<div class="loader">Tidak bisa memuat berita saat ini. Silakan coba lagi nanti.</div>`;
    console.error(e);
  }
}

refreshBtn?.addEventListener("click", () => {
  fetchMarkets();
  fetchNews();
});

// initial load
fetchMarkets();
fetchNews();
