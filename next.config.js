/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ponytail: static export for GitHub Pages — no server needed
};

module.exports = nextConfig;
