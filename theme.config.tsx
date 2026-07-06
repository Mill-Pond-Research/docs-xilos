import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#0066FF"/>
        <path d="M9 9L16 16L9 23M23 9L16 16L23 23" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#111827" }}>
        Xilos
      </span>
      <span style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 500, marginLeft: "2px" }}>
        Docs
      </span>
    </span>
  ),
  navbar: {
    extraContent: (
      <a
        href="https://www.xilos.ai"
        style={{
          marginLeft: "1rem",
          padding: "0.375rem 1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#0066FF",
          color: "#fff",
          fontSize: "0.8125rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "background-color 0.15s ease",
        }}
      >
        Get Started
      </a>
    ),
  },
  sidebar: {
    toggleButton: true,
  },
  search: {
    placeholder: "Search documentation...",
  },
  footer: {
    text: (
      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#6B7280" }}>
        © {new Date().getFullYear()} Mill Pond Research, Inc.
        <span style={{ margin: "0 4px" }}>·</span>
        <a href="https://www.millpondresearch.com" style={{ color: "#0066FF", textDecoration: "none" }}>millpondresearch.com</a>
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Xilos documentation — intelligent agentic AI infrastructure platform by Mill Pond Research. Observe, secure, and orchestrate AI across your enterprise." />
      <meta property="og:title" content="Xilos Documentation" />
      <meta property="og:description" content="Observe, secure, and orchestrate agentic AI across your enterprise." />
      <meta property="og:url" content="https://docs.xilos.ai" />
      <meta property="og:image" content="https://docs.xilos.ai/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </>
  ),
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark",
  },
  primaryHue: 212,
  primarySaturation: 100,
  banner: {
    key: "xilos-docs-launch",
    text: (
      <a href="https://www.xilos.ai" style={{ color: "inherit", textDecoration: "underline" }}>
        Xilos is live — connect your agents today →
      </a>
    ),
  },
};

export default config;
