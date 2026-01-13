import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // 1. Tambahkan ini untuk mengabaikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Tambahkan ini untuk mengabaikan error ESLint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  }
};

export default nextConfig;