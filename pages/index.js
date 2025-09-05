import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
        if (!res.ok) throw new Error("Bad response from /api/nfts");
        const data = await res.json();
        const newTokens = data.tokens || [];
        setNfts((prev) => [...prev, ...newTokens]);
        setAfter(data.next || null);
        setHasMore(newTokens.length > 0);
        setError(false);
      } catch (e) {
        console.error("Error fetching NFTs:", e);
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
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-2">Naija Hustle Stories</h1>
      <p className="text-center text-gray-600 mb-8">
        NFTs celebrating true Nigerian resilience on Base
      </p>

      {error ? (
        <div className="text-center text-red-500">
          Could not load NFTs. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {nfts.map((nft, index) => {
            const isLast = index === nfts.length - 1;
            return (
              <motion.div
                ref={isLast ? lastNFTRef : null}
                key={nft.id}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg shadow-md bg-white overflow-hidden"
              >
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{nft.name}</h3>
                  <p className="text-sm text-gray-600">{nft.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="text-center mt-6 text-gray-500">Loading more...</div>
      )}

      <footer className="text-center text-sm text-gray-500 mt-12">
        © 2025 Naija Hustle Stories — Built on Base with Zora
      </footer>
    </main>
  );
}
