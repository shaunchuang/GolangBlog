import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import ClientSearchPage from './ClientSearchPage';

interface SearchPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Metadata' });
  const query = searchParams.q || '';
  
  return {
    title: query 
      ? t('searchResultsTitle', { query })
      : t('searchTitle'),
    description: query
      ? t('searchResultsDescription', { query })
      : t('searchDescription'),
    openGraph: {
      title: query 
        ? t('searchResultsTitle', { query })
        : t('searchTitle'),
      description: query
        ? t('searchResultsDescription', { query })
        : t('searchDescription'),
    },
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const locale = params.locale;
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  
  // 驗證頁碼
  if (isNaN(page) || page < 1) {
    redirect(`/${locale}/search${query ? `?q=${query}` : ''}`);
  }
  
  return (
    <ClientSearchPage 
      query={query}
      page={page}
      locale={locale}
    />
  );
}