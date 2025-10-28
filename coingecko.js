exports.handler = async function(event) {
  const qs = event.queryStringParameters || {};
  const vs_currency = qs.vs_currency || 'usd';
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs_currency)}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch data" }) };
  }
};