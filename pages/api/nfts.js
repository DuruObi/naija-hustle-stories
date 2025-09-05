export default async function handler(req, res) {
  try {
    // Replace "nhs" with your actual Zora username or account address
    const response = await fetch("https://api.zora.co/discovery/v1/accounts/nhs/tokens");

    if (!response.ok) {
      throw new Error(`Zora API error: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Unable to fetch NFTs from Zora" });
  }
}
