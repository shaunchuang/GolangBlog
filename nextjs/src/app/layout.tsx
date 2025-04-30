import React from 'react';

// 不需要匯出 metadata，因為這個佈局不會實際顯示內容

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 這個佈局只用於重定向，內容會由 [locale] 佈局處理
  return <>{children}</>;
}
