import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.100', '192.168.1.105'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
        port:"",
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
