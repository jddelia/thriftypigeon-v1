import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // experimental: {
  //   allowedOrigins: ["http://127.0.0.1:3000"],
  // },
};

export default nextConfig;
