import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './locales';

export default createMiddleware({
  // 支援的語言列表
  locales,
  // 默認語言
  defaultLocale,
  // 本地化的 cookie 名稱
  localePrefix: 'as-needed', // 只有當訪問非默認語言時添加前綴
});

export const config = {
  // 需要匹配的路徑：所有除了 API 路由、靜態資源和內部路由
  // 增加排除 manifest.json 和其他靜態檔案
  matcher: [
    '/((?!api|_next|_vercel|manifest\\.json|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)']
};