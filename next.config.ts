import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence cross-origin dev warnings (Next 16). Extend with a LAN IP for device testing.
  allowedDevOrigins: ['localhost', '127.0.0.1'],
};

export default nextConfig;
