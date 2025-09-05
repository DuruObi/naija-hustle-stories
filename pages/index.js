import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Frontend: fetches NFTs from /api/nfts, infinite scroll,
 * shows animated $NHS placeholders on error or while empty.
 */

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [after, setAfter] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const observer = useRef();

  const fetchNFTs = useCallback(
    async (cursor = null) => {
      if (loading) return;
      setLoading(true);
      try {
        const url = cursor ? `/api/nfts?after=${cursor}&limit=12` : `/api/nfts?limit=12`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Bad response from proxy");
        const data = await res.json();
        const newTokens = data.tokens || [];
        setNfts((prev) => [...prev, ...newTokens]);
        setAfter(data.next || null);
        setHasMore(newTokens.length > 0);
        setError(false);
      } catch (e) {
        console.error("Failed to fetch NFTs", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const lastNFTRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && after) {
          fetchNFTs(after);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, after, fetchNFTs]
  );

  // placeholders
  const placeholders = Array.from({ length: 6 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: `Hustle Story #${i + 1}`,
  }));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#0b1220", color: "#fff" }}>
      <header style={{ textAlign: "center", padding: "48px 16px" }}>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ fontSize: "36px", margin: 0 }}>
          Naija Hustle Stories
        </motion.h1>
        <p style={{ marginTop: 12, color: "#b8c2c8" }}>A live gallery of NFTs from @nhs (via Zora on Base)</p>
        <a href="#nft-gallery" style={{ marginTop: 16, display: "inline-block", background: "#10b981", color: "#041014", padding: "10px 18px", borderRadius: 999, fontWeight: 700, textDecoration: "none" }}>
          🚀 Explore
        </a>
      </header>

      <main id="nft-gallery" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <h2 style={{ fontSize: 22, marginBottom: 18, textAlign: "center" }}>Explore the Collection</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          { (error || (nfts.length === 0 && !loading)) ? (
            placeholders.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} style={{ background: "#071021", borderRadius: 14, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(2,6,23,0.6)" }}>
                <div style={{ fontSize: 48, color: "#10b981", fontWeight: 800 }}>$NHS</div>
                <div style={{ marginTop: 12, color: "#cbd5db", fontWeight: 600 }}>{p.title}</div>
                <a href="https://zora.co/@nhs" target="_blank" rel="noreferrer" style={{ marginTop: 20, background: "#10b981", color: "#041014", padding: "8px 14px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>View on Zora</a>
              </motion.div>
            ))
          ) : (
            nfts.map((nft, idx) => {
              // defensive extraction (Zora shape may vary)
              const token = nft?.token || nft;
              const tokenId = token?.tokenId ?? token?.id ?? idx;
              const image = token?.image?.url || token?.metadata?.image || "";
              const title = token?.metadata?.name || token?.name || `Naija Hustle #${tokenId}`;

              const isLast = idx === nfts.length - 1;
              return (
                <motion.article key={`${tokenId}-${idx}`} ref={isLast ? lastNFTRef : null} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.02 }} style={{ background: "#071021", borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 18px rgba(2,6,23,0.6)", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 200, background: "#0b1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {image ? <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#7b8794" }}>No preview</div>}
                  </div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ marginTop: "auto" }}>
                      <a href={`https://zora.co/collect/${token?.contract?.address ?? token?.contract ?? ""}/${tokenId}`} target="_blank" rel="noreferrer" style={{ background: "#10b981", color: "#041014", padding: "8px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>View on Zora</a>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        {loading && <p style={{ textAlign: "center", marginTop: 18, color: "#9aa6b0" }}>Loading more…</p>}
      </main>

      <footer style={{ textAlign: "center", padding: 24, color: "#93a1a8" }}>
        © {new Date().getFullYear()} Naija Hustle Stories — Built on Zora + Base
      </footer>
    </div>
  );
}
