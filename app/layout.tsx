import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

export const metadata: Metadata = {
  title: {
    default: '지리산 산양삼 | 자연 그대로의 건강',
    template: '%s | 지리산 산양삼',
  },
  description: '지리산 해발 800m 청정 환경에서 5~6년 자연 재배한 100% 무농약 국내산 산양삼. 한국임업진흥원 합격증 인증 농가 직송.',
  keywords: ['산양삼', '지리산', '산양삼 직송', '무농약 산양삼', '산양삼 선물'],
  openGraph: {
    title: '지리산 산양삼',
    description: '지리산 해발 800m 청정 자연에서 자란 산양삼',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="beforeInteractive"
        />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-mobile-nav">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
