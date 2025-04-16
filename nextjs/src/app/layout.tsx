import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Golang Blog - 技術學習與分享',
  description: '分享 Golang、React、TypeScript 等技術心得與實踐',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <AppProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <Navbar />
            <main className="flex-grow-1">
              <div className="container py-4">
                {children}
              </div>
            </main>
            <footer className="bg-dark text-white py-3">
              <div className="container text-center">
                <p className="mb-0">© 2025 Golang Blog. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
