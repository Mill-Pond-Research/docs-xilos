/** @type {import('next').NextConfig} */

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultLatex: false,
});

module.exports = withNextra({
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico|xilos-logo-.*\\.svg|xilos\\.css|og-image|signin\\.html|api).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
});
