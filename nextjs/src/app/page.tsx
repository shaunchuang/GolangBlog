import { redirect } from 'next/navigation';
import { locales } from '../locales';

export default function RootPage() {
  // 預設重定向到 zh-TW 或使用瀏覽器語言偵測
  // 此頁面只作為重定向用途，不會實際渲染內容
  const defaultLocale = 'zh-TW';
  
  // 重定向到預設語言
  redirect(`/${defaultLocale}`);
}
