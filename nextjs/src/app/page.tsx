import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faTag, faEye } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect } from 'react';

const ArticleCard = ({ id, title, excerpt, date, author, tags, views }: {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  views: number;
}) => {
  return (
    <div className="card mb-4 shadow-sm h-100">
      <div className="card-body">
        <h3 className="card-title">
          <Link href={`/articles/${id}`} className="text-decoration-none text-dark">
            {title}
          </Link>
        </h3>
        <p className="card-text text-truncate" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
          {excerpt}
        </p>
        <div className="d-flex flex-wrap justify-content-between text-muted small">
          <div className="mb-2 mb-md-0">
            <span className="me-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {date}
            </span>
            <span className="me-3">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              {author}
            </span>
          </div>
          <div>
            <span className="me-3">
              <FontAwesomeIcon icon={faEye} className="me-1" />
              {views} 次瀏覽
            </span>
            <span>
              <FontAwesomeIcon icon={faTag} className="me-1" />
              {tags.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedArticleSlide = ({ article }: { article: any }) => {
  return (
    <div className="card bg-dark text-white border-0 rounded-3 overflow-hidden h-100">
      <div className="bg-image" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/800x400?${article.tags[0].toLowerCase()})`,
        height: '300px',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      </div>
      <div className="card-img-overlay d-flex flex-column justify-content-end">
        <h2 className="card-title mb-2 fs-3 fs-md-2">
          <Link href={`/articles/${article.id}`} className="text-white text-decoration-none">
            {article.title}
          </Link>
        </h2>
        <p className="card-text mb-3 d-none d-md-block">{article.excerpt}</p>
        <p className="card-text mb-3 d-block d-md-none">
          {article.excerpt.length > 60 ? article.excerpt.substring(0, 60) + '...' : article.excerpt}
        </p>
        <div className="d-flex flex-wrap justify-content-between text-light small">
          <div className="mb-1 mb-md-0">
            <span className="me-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {article.date}
            </span>
            <span className="me-3 d-none d-sm-inline-block">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              {article.author}
            </span>
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faTag} className="me-1" />
              {article.tags.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
