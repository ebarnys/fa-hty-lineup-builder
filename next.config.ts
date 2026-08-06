import type { NextConfig } from "next";

// Název repozitáře na GitHubu – používá se jako podadresář pro GitHub Pages.
const repo = "fa-hty-lineup-builder";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Statický export do složky `out/` (aplikace je čistě klientská).
  output: "export",
  images: { unoptimized: true },
  // Na GitHub Pages běží web v podadresáři /<repo>/, lokálně bez prefixu.
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
