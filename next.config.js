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
});
