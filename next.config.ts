import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/spec",
        destination: "/spec/1.0",
        statusCode: 302,
      },
    ];
  },
};

export default nextConfig;
