declare module 'next-i18next' {
  import { TFunction } from 'i18next';
  export function useTranslation(ns?: string | string[]): { t: TFunction };
}

declare module 'next-i18next/serverSideTranslations' {
  export function serverSideTranslations(locale: string, namespaces: string[]): Promise<{ [key: string]: any }>;
}

declare module 'next-i18next/server' {
  export function getTranslations(locale: string, namespaces: string[]): Promise<{ [key: string]: any }>;
}
