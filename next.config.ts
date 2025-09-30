import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost:9090'],
    // Use a custom loader for specific domains if needed
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
