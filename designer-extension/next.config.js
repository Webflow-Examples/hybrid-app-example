/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // force static build
  distDir: "dist", // set output dir, must match with webflow.json
  assetPrefix: process.env.NODE_ENV === "production" ? "." : undefined,
  images: { unoptimized: true }, // "output: export" doesn't support image optimization since there's no nextjs server to optimize image.
};

module.exports = nextConfig;