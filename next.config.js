/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ponytail: root deploy — no basePath needed for org/user GitHub Pages
};

module.exports = nextConfig;
