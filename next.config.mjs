/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Emit /route/index.html so Amplify Hosting serves static routes directly.
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "rc-util",
    "@babel/runtime",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
