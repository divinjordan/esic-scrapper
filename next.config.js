module.exports = {
  images: {
    domains: ["localhost"],
  },
  async rewrites() {
    console.log("Rewrites called");
    return [
      {
        source: "/items/:path*",
        destination: `https://admin.esic-online.chillo.fr/items/:path*`,
      },
    ];
  },
};
