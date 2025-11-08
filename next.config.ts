import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9096",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9096",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
