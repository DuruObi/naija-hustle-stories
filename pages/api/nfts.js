export default function handler(req, res) {
  // Mock NFT JSON response
  const tokens = [
    {
      id: "1",
      name: "Hustler #1",
      description: "First NFT of true Naija resilience",
      image: "https://ipfs.io/ipfs/bafkreidcy7n7fthsmzgy6m35e7zqk3m6u4x7qp3kkk7nuzqx2yukp6j5uq",
    },
    {
      id: "2",
      name: "Hustler #2",
      description: "Pushing forward against all odds",
      image: "https://ipfs.io/ipfs/bafkreigh2akiscaildcpld6lmwe2phgzr5bl2uzg5wq6ce5h7quw27l7gq",
    },
    {
      id: "3",
      name: "Hustler #3",
      description: "The streets don’t break us — they shape us.",
      image: "https://ipfs.io/ipfs/bafkreib7wcn5vdg2rjop64sguzk2rs5j2bqms5izclz6dr3i3npnqcyxdu",
    },
  ];

  res.status(200).json({
    tokens,
    next: null, // no pagination for now
  });
}
