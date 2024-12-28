/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vethealth.com.ua',
      },
      {
        protocol: 'https',
        hostname: '*.vethealth.com.ua',
      },
      
    ],
  },
};

module.exports = nextConfig;
