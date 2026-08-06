import type { NextConfig } from "next";

// Aplikace běží jako běžná Next.js appka na Vercelu (kvůli API pro sdílené
// úložiště). Data se ukládají do Redis přes /api/data; localStorage slouží
// jako záložní režim (offline / bez nakonfigurovaného úložiště).
const nextConfig: NextConfig = {};

export default nextConfig;
