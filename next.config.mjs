/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
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
