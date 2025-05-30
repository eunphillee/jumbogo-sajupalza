import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '점보고 - 사주팔자',
  description: '정확한 사주팔자 분석과 ChatGPT 기반 상세 해석',
  keywords: ['사주팔자', '명리학', '운세', '점보고'],
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        url: '/favicon.png',
        sizes: '64x64',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/favicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: '점보고 - 사주팔자',
    description: '정확한 사주팔자 분석과 ChatGPT 기반 상세 해석',
    url: 'https://www.jumbogo.co.kr',
    siteName: '점보고',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '점보고 - 사주팔자',
    description: '정확한 사주팔자 분석과 ChatGPT 기반 상세 해석',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Image
                      src="/jubogo_log.png"
                      alt="점보고 로고"
                      width={240}
                      height={72}
                      className="h-16 w-auto"
                      priority
                    />
                  </Link>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                    사주보기
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                    운세
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                    궁합
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <Image
                    src="/favicon.png"
                    alt="점보고"
                    width={48}
                    height={48}
                    className="mr-3 rounded-lg"
                  />
                  <span className="text-xl font-semibold">점보고</span>
                </div>
                <p>&copy; 2024 점보고. 모든 권리 보유.</p>
                <p className="text-sm text-gray-400 mt-2">
                  www.jumbogo.co.kr
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 