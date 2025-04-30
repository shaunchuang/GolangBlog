import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './locales';

export default getRequestConfig(async ({ locale }) => {
  // 確保 locale 一定有值，如果未提供則使用預設語言
  const safeLocale = locale || defaultLocale;
  
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}/messages.json`)).default
  };
});