'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// 這個頁面用來重定向訪問到 /[locale]/home 的請求
// 雖然 middleware 已經處理了大部分情況，但為了穩定性保留這個頁面作為後備
export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  // 使用可選鏈運算符確保即使 params 為 undefined 也不會出錯
  const locale = String(params?.locale || 'zh-TW');

  useEffect(() => {
    // 在客戶端進行重定向
    router.replace(`/${locale}/home`);
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">重定向中，請稍候...</p>
      </div>
    </div>
  );
}