/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
