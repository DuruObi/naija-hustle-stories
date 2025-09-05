// pages/api/nfts.js

export default async function handler(req, res) {
  const { after = null, limit = 12 } = req.query;

  const query = `
    query GetNFTs($limit: Int!, $after: String) {
      tokens(
        where: { ownerAddresses: ["0x7a91ef916e6a717a47b46160bc79ab2c4c4be97e"] }
        networks: [{ network: BASE, chain: MAINNET }]
        pagination: { limit: $limit, after: $after }
      ) {
        nodes {
          token {
            tokenId
            name
            metadata
            image {
              url
              small { url }
              large { url }
            }
            collectionAddress
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.zora.co/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // no API key needed
      body: JSON.stringify({
        query,
        variables: { limit: parseInt(limit), after },
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from Zora" });
    }

    const json = await response.json();

    const tokens = json.data?.tokens?.nodes?.map((n) => n.token) || [];

    return res.status(200).json({
      tokens,
      next: json.data?.tokens?.pageInfo?.endCursor || null,
    });
  } catch (err) {
    console.error("NFT fetch error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
