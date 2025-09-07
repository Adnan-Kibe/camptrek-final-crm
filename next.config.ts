import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PORT: '3000',
  },
  images: {
    domains: [
      'i.sstatic.net',
      'res.cloudinary.com',
      'images.unsplash.com',
      'images.pexels.com',
      'images.pexels.com',
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
