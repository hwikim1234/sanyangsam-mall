'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { getTotalCount } = useCartStore()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const count = getTotalCount()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">삼</span>
            </div>
            <span className="font-bold text-brand-green text-lg hidden sm:block">지리산 산양삼</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-brand-green font-medium transition-colors">홈</Link>
            <Link href="/products/sanyangsam-5-6nyeon-10ppuri" className="text-gray-700 hover:text-brand-green font-medium transition-colors">상품</Link>
            <Link href="/orders/track" className="text-gray-700 hover:text-brand-green font-medium transition-colors">주문조회</Link>
          </nav>

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            {session ? (
              <Link href="/mypage" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-gray-700" />
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
