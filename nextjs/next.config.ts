import createIntlPlugin from 'next-intl/plugin';

const withNextIntl = createIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'news.sj-sphere.com', pathname: '/images/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' }
    ]
  },
  reactStrictMode: true
});

export default nextConfig;
