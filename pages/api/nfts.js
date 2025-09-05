// pages/api/nfts.js
export default async function handler(req, res) {
  try {
    const owner = "0x7a91ef916e6a717a47b46160bc79ab2c4c4be97e"; // your wallet
    const chain = "base-mainnet"; // since your project is about Base

    const apiUrl = `https://base-mainnet.g.alchemy.com/nft/v2/demo/getNFTs?owner=${owner}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch NFTs");
    }

    const data = await response.json();

    // Normalize so your frontend can read tokens
    const tokens = (data.ownedNfts || []).map((nft) => ({
      id: nft.id.tokenId,
      name: nft.title || "Untitled",
      image: nft.media?.[0]?.gateway || null,
      contract: nft.contract?.address,
    }));

    res.status(200).json({ tokens, next: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch NFTs" });
  }
}
