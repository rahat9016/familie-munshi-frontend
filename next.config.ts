import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only serves listed qualities; 90 is used by the auth banners.
    qualities: [75, 90],
    dangerouslyAllowSVG: true,
    // Default "attachment" makes /_next/image look like a file download
    // (filename="x.webp"), which office/school web filters block as a
    // forbidden file type. Next still sends its sandbox CSP
    // (script-src 'none'; sandbox), so inline SVGs cannot run scripts.
    contentDispositionType: "inline",
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/uploads/**",
      },
      {
        // Production API — uploaded media (logos, product/profile images).
        protocol: "https",
        hostname: "api.familiemunshi.de",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: ["localhost"],
};

export default nextConfig;
