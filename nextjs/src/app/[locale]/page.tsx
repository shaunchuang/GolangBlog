'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const t = useTranslations('Common');

  return (
    <div className="flex flex-col min-h-screen bg-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
            <div className="text-xl font-semibold text-teal-800">新聞網站</div>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['首頁', '特別報導', '國際', '生活', '觀點'].map((label, i) => (
              <Link key={i} href={i===0?'/' : `/${label.toLowerCase()}`} className="text-teal-700 hover:text-teal-900 font-medium relative group">
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-teal-700 hover:text-teal-900 p-1 rounded-full hover:bg-teal-50 transition duration-200">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
            <button className="text-teal-700 hover:text-teal-900 p-1 rounded-full hover:bg-teal-50 transition duration-200">
              <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
            </button>
            <button className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300 text-sm font-medium">
              訂閱
            </button>
          </div>
        </div>
        <div className="md:hidden container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
            <div className="text-xl font-semibold text-teal-800">新聞網站</div>
          </div>
          <button className="text-teal-700 hover:text-teal-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-teal-100 relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center relative z-10">
          <div
            className="w-full h-64 md:h-96 bg-cover rounded-none mb-6 animate-fade-in"
            style={{ backgroundImage: "url('/images/news/featured-1.jpg')" }}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-teal-900 mb-4 animate-slide-up">
            頭條新聞標題
          </h1>
          <p className="text-lg md:text-xl text-teal-700 leading-relaxed max-w-3xl mx-auto mb-6 animate-slide-up delay-100">
            這是頭條新聞的簡短摘要，介紹當天最重要的故事。
          </p>
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-800 text-sm font-semibold rounded-full mb-6 animate-slide-up delay-200">
            熱門
          </span>
          <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition duration-300 animate-bounce-in">
            {t('readMore')}
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-10 animate-gradient-shift" />
      </section>

      {/* 其餘版面略…請照原本邏輯撰寫 */}
    </div>
  );
}
