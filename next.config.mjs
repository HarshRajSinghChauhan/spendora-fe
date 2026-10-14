import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      "https://spendora-be.onrender.com";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/api\/?$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
