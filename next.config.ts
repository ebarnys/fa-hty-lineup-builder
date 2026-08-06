import type { NextConfig } from "next";

// basePath/assetPrefix nastavujeme jen pro GitHub Pages (běh v podadresáři).
// Na Vercelu/Netlify (kořen domény) i lokálně zůstává prázdný.
const repo = "fa-hty-lineup-builder";
const isGitHubPages = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  // Statický export – aplikace je čistě klientská (localStorage, žádný backend).
  output: "export",
  images: { unoptimized: true },
  basePath: isGitHubPages ? `/${repo}` : "",
  assetPrefix: isGitHubPages ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
