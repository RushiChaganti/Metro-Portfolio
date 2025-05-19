/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/github_Portfolio',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
