import '../globals.css';
import '../../../src/lib/fontawesome'; // 導入 Font Awesome 配置
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '../../../src/locales';
import { Metadata, Viewport } from 'next';

// 支持的語言列表
const supportedLocales = ['en', 'th', 'vi', 'id', 'ko', 'ja', 'zh-TW', 'zh-CN'];

const inter = Inter({ subsets: ['latin'] });

// 新增單獨的 viewport 配置，從 metadata 中分離
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// 增強版 metadata 配置
export const metadata: Metadata = {
  title: {
    default: 'SJ Sphere News',
    template: '%s | SJ Sphere News',
  },
  description: '全球領先多語言新聞平台，提供最新國際新聞、財經、科技、體育等各類新聞資訊',
  keywords: ['news', 'global news', 'international news', 'politics', 'business', 'technology', 'sports', 'health'],
  authors: [{ name: 'SJ Sphere' }],
  publisher: 'SJ Sphere News',
  // 移除 viewport 設定，已單獨配置
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://news.sj-sphere.com',
    languages: {
      'en': 'https://news.sj-sphere.com/en',
      'th': 'https://news.sj-sphere.com/th',
      'vi': 'https://news.sj-sphere.com/vi',
      'id': 'https://news.sj-sphere.com/id',
      'ko': 'https://news.sj-sphere.com/ko',
      'ja': 'https://news.sj-sphere.com/ja',
      'zh-TW': 'https://news.sj-sphere.com/zh-tw',
      'zh-CN': 'https://news.sj-sphere.com/zh-cn',
      'zh-MY': 'https://news.sj-sphere.com/zh-my',
      'zh-SG': 'https://news.sj-sphere.com/zh-sg',
      'zh-MO': 'https://news.sj-sphere.com/zh-mo',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://news.sj-sphere.com',
    siteName: 'SJ Sphere News',
    title: 'SJ Sphere News',
    description: '全球領先多語言新聞平台',
    images: [
      {
        url: 'https://news.sj-sphere.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SJ Sphere News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SJ Sphere News',
    description: '全球領先多語言新聞平台',
    images: ['https://news.sj-sphere.com/images/twitter-image.jpg'],
    site: '@sjsphere',
    creator: '@sjsphere',
  },
};

export function generateStaticParams() {
  return supportedLocales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 確保 locale 是字符串類型
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  
  // 驗證是否為支持的語言
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // 獲取翻譯訊息
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}/messages.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`min-h-screen bg-gray-50 ${inter.className}`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}