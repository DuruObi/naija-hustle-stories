// Serverless proxy for Zora (deploy on Vercel)
// Accepts ?after=cursor and ?limit=12
export default async function handler(req, res) {
  const { after, limit = 12 } = req.query;
  try {
    const url = new URL("https://api.zora.co/discovery/v1/accounts/nhs/tokens");
    url.searchParams.set("limit", String(limit));
    if (after) url.searchParams.set("after", after);

    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Zora returned ${response.status}` });
    }

    const data = await response.json();
    // return Zora response directly — frontend handles tokens & next cursor
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
