/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Turbopack's persistent build cache (.next/cache/turbopack) records the
    // values of environment variables it sees, including server-only secrets
    // like EMAIL_PASS and GEMINI_API_KEY. Netlify's secrets scanner flags those
    // values and fails the deploy, so skip writing the cache entirely.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
