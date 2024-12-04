import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
      {
        protocol: 'https',
        hostname: 'creazilla-store.fra1.digitaloceanspaces.com',
        pathname: '/icons/3207857/bookshelf-icon-md.png',
      },
    ],
  },
  webpack: (config) => {
    config.output.publicPath = '/_next/';
    return config;
  },
};

export default nextConfig;
