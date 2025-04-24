/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
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
