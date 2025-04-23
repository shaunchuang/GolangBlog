'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-grow p-0 lg:pl-64">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
        <footer className="bg-gray-800 text-white py-3">
          <div className="container mx-auto text-center">
            <p>© 2025 Golang Blog. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}