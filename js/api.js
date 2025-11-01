
// CryptoApp v5 — Prices via CoinCap (CORS ok), News (ID) via Coinvestasi RSS + corsproxy + thumbnails

const API = {
  markets: "https://api.coincap.io/v2/assets?limit=20",
  API.news = "https://crypto-proxy.cintyahuaang07.workers.dev/?url=" + 
  encodeURIComponent("https://cryptopanic.com/api/v1/posts/?auth_token=PUBLIC_TOKEN&filter=hot");

};

const table = document.getElementById("coinsTable");
const tbody = table.querySelector("tbody");
const loader = document.getElementById("tableLoader");
const refreshBtn = document.getElementById("refreshBtn");
const coinSelect = document.getElementById("coinSelect");

function fmtUSD(x){
  const n = Number(x || 0);
  return n.toLocaleString(undefined, { style:"currency", currency:"USD", maximumFractionDigits:2 });
}
function pct(x){
  const n = Number(x || 0);
  return (n>=0?"+":"") + n.toFixed(2) + "%";
}
function iconFor(sym){
  const s = String(sym||"").toLowerCase();
  return `https://cryptoicons.org/api/icon/${s}/32`;
}

async function fetchMarkets(){
  loader.classList.remove("hidden");
  table.classList.add("hidden");
  try{
    const res = await fetch(API.markets, { cache: "no-store" });
    if(!res.ok) throw new Error("Gagal mengambil data pasar");
    const json = await res.json();
    const data = json.data || [];
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
    const price = Number(c.priceUsd||0);
    const chg = Number(c.changePercent24Hr||0);
    const mc = Number(c.marketCapUsd||0);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td><img src="${iconFor(c.symbol)}" onerror="this.style.display='none'" alt="" style="height:18px;vertical-align:middle;margin-right:8px">${c.name} <span style="color:#9aa4b2">(${c.symbol})</span></td>
      <td>${fmtUSD(price)}</td>
      <td style="color:${chg>=0?'#19c37d':'#ef4444'}">${pct(chg)}</td>
      <td>${fmtUSD(mc)}</td>
    `;
    tbody.appendChild(tr);
  });
  loader.classList.add("hidden");
  table.classList.remove("hidden");
}

function renderSelect(list){
  coinSelect.innerHTML = `<option value="">Pilih koin…</option>` + 
    list.map(c=>`<option value="${c.id}" data-price="${c.priceUsd}">${c.name} (${c.symbol})</option>`).join("");
}

async function fetchNews(){
  const wrap = document.getElementById("newsList");
  try{
    const res = await fetch(API.news, { cache: "no-store" });
    if(!res.ok) throw new Error("Gagal mengambil berita");
    const data = await res.json();
    const items = data.items || [];
    wrap.innerHTML = "";

    items.slice(0,8).forEach(item => {
      const d = new Date(item.pubDate);
      const img = item.thumbnail || "https://via.placeholder.com/1200x600?text=Crypto+News";
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <img class="news-cover" src="${img}" alt="cover">
        <div class="news-body">
          <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
          <div class="news-meta">${d.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>
      `;
      wrap.appendChild(card);
    });

    if(items.length===0){
      wrap.innerHTML = `<div class="loader">Belum ada berita. Coba klik Refresh.</div>`;
    }
  }catch(e){
    console.error(e);
    document.getElementById("newsList").innerHTML = `<div class="loader">Tidak bisa memuat berita saat ini. Silakan coba lagi nanti.</div>`;
  }
}

refreshBtn?.addEventListener("click", () => {
  fetchMarkets();
  fetchNews();
});

// Auto refresh prices every 60 seconds
setInterval(fetchMarkets, 60000);

// Initial load
fetchMarkets();
fetchNews();
