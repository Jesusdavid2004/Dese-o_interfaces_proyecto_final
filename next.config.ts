import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Performance (swcMinify eliminado - deprecado en Next 15)
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // ✅ Images
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
  },

  // ✅ Webpack optimizations
  webpack: (config) => {
    return config;
  },

  // ✅ Production source maps deshabilitadas
  productionBrowserSourceMaps: false,

  // ✅ Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
