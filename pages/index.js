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
        if (entries[0].isIntersecting && hasMore) {
          fetchNFTs(after);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, after, fetchNFTs]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold"
        >
          Naija Hustle Stories
        </motion.h1>
        <p className="mt-4 text-xl">NFTs celebrating true Nigerian resilience on Base</p>
      </section>

      {/* NFT Gallery */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">All NFTs</h2>

        {error && (
          <p className="text-red-400">
            Could not load NFTs. Please try again later.
          </p>
        )}

        {nfts.length === 0 && !loading && !error && (
          <p className="text-gray-400">No NFTs found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nfts.map((nft, i) => {
            const imgSrc =
              nft.token.image?.url ||
              nft.token.image?.small?.url ||
              nft.token.image?.large?.url ||
              nft.token.metadata?.image ||
              "/placeholder.png";

            if (i === nfts.length - 1) {
              return (
                <div
                  key={`${nft.token.contract.address}-${nft.token.tokenId}`}
                  ref={lastNFTRef}
                  className="rounded-2xl shadow-lg overflow-hidden bg-gray-900 hover:scale-105 transition flex flex-col"
                >
                  <img
                    src={imgSrc}
                    alt={nft.token.name || "NFT"}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <h3 className="text-lg font-bold mb-2">{nft.token.name}</h3>
                    <a
                      href={`https://zora.co/collect/base:${nft.token.contract.address}/${nft.token.tokenId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-block text-center bg-emerald-400 text-black px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                    >
                      View on Zora
                    </a>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`${nft.token.contract.address}-${nft.token.tokenId}`}
                  className="rounded-2xl shadow-lg overflow-hidden bg-gray-900 hover:scale-105 transition flex flex-col"
                >
                  <img
                    src={imgSrc}
                    alt={nft.token.name || "NFT"}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <h3 className="text-lg font-bold mb-2">{nft.token.name}</h3>
                    <a
                      href={`https://zora.co/collect/base:${nft.token.contract.address}/${nft.token.tokenId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-block text-center bg-emerald-400 text-black px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                    >
                      View on Zora
                    </a>
                  </div>
                </div>
              );
            }
          })}

          {/* Animated placeholders while loading */}
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="rounded-2xl shadow-lg overflow-hidden bg-gray-800 flex items-center justify-center h-64"
              >
                <span className="text-2xl font-bold text-emerald-400">
                  $NHS
                </span>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400">
        <p>© {new Date().getFullYear()} Naija Hustle Stories — Built on Base with Zora</p>
      </footer>
    </div>
  );
}
