import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloud Run / Docker deployment.
  // Produces a self-contained .next/standalone build that doesn't need node_modules.
  output: "standalone",
};

export default nextConfig;
