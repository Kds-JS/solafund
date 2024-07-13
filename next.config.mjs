/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ipfs.io',
          },
          {
            protocol: 'https',
            hostname: 'i.ibb.co',
          },
        ]
      }
};

export default nextConfig;
