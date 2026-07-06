import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>
      Xilos<span style={{ color: "#0066FF", marginLeft: "4px" }}>Docs</span>
    </span>
  ),
  project: {
    link: "",
  },
  chat: {
    link: "https://www.xilos.ai",
  },
  navbar: {
    extraContent: (
      <a
        href="https://www.xilos.ai"
        style={{
          marginLeft: "1rem",
          padding: "0.375rem 0.875rem",
          borderRadius: "0.5rem",
          backgroundColor: "#0066FF",
          color: "#fff",
          fontSize: "0.8125rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Try Xilos
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
      <span style={{ fontSize: "0.75rem" }}>
        © {new Date().getFullYear()} Mill Pond Research, Inc. · All rights reserved.
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Xilos documentation — intelligent agentic AI infrastructure platform by Mill Pond Research." />
      <meta name="og:title" content="Xilos Documentation" />
      <meta name="og:description" content="Observe, secure, and orchestrate agentic AI across your enterprise." />
      <meta name="og:url" content="https://docs.xilos.ai" />
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
