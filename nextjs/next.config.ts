import createIntlPlugin from 'next-intl/plugin';

// 指定 next-intl 配置文件的路徑
const withNextIntl = createIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'news.sj-sphere.com',
        pathname: '/images/**',
      } as any,
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      } as any,
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      } as any,
    ],
  },
  // 將 turbo 從 experimental 移至頂層配置
  turbopack: {},
};

export default withNextIntl(nextConfig);
