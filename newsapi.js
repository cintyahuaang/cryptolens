exports.handler = async function(event) {
  const API_KEY = process.env.NEWSAPI_KEY;
  if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ error: "Missing NEWSAPI_KEY" }) };

  const query = event.queryStringParameters.q || "crypto OR bitcoin OR ethereum";
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=6&sortBy=publishedAt&apiKey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const simplified = (data.articles || []).map(a => ({
      title: a.title, source: a.source.name, url: a.url, publishedAt: a.publishedAt
    }));
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }, body: JSON.stringify(simplified) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch news" }) };
  }
};