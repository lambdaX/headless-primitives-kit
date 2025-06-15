import type {NextConfig} from 'next';

const repoName = 'headless-primitives-kit'; // Your repository name

const nextConfig: NextConfig = {
  output: 'export', // Enable static export
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Necessary for static export if using next/image with default loader
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure trailingSlash is false (default) or not set to true, as it can affect pathing for static files.
  trailingSlash: false, 
};

export default nextConfig;
