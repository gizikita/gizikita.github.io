/** @type {import('next').NextConfig} */
const repoName = 'gizikita';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  // ponytail: static export for GitHub Pages — path must match repo name
};

module.exports = nextConfig;
