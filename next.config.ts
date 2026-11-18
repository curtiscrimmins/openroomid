import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // One canonical host: www redirects to the bare domain.
        source: "/:path*",
        has: [{ type: "host", value: "www.openroomid.org" }],
        destination: "https://openroomid.org/:path*",
        permanent: true,
      },
      {
        source: "/spec",
        destination: "/spec/1.0",
        statusCode: 302,
      },
    ];
  },
};

export default nextConfig;
