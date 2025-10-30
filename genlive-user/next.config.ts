import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Tắt check ESLint khi build production
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
