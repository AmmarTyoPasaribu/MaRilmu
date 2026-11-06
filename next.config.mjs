/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // "Bacaan Populer" digabung ke halaman Al-Quran (surah pilihan)
      { source: '/bacaan', destination: '/quran', permanent: true },
    ];
  },
};

export default nextConfig;
