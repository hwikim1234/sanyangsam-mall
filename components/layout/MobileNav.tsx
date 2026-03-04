'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingCart, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/products/sanyangsam-5-6nyeon-10ppuri', label: '상품', icon: Package },
  { href: '/cart', label: '장바구니', icon: ShoppingCart },
  { href: '/mypage', label: '마이', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { getTotalCount } = useCartStore()
  const count = getTotalCount()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="grid grid-cols-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          const isCart = href === '/cart'
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center py-3 gap-1 transition-colors',
                isActive ? 'text-brand-green' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {isCart && count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9' : count}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
