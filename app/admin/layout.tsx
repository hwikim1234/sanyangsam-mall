export const dynamic = 'force-dynamic'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, CreditCard, Truck, Package, Settings, MessagesSquare } from 'lucide-react'

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: '주문 목록', icon: ShoppingBag },
  { href: '/admin/payments', label: '입금 확인', icon: CreditCard },
  { href: '/admin/shipping', label: '배송 처리', icon: Truck },
  { href: '/admin/products', label: '상품 관리', icon: Package },
  { href: '/admin/inquiries', label: '문의 관리', icon: MessagesSquare },
  { href: '/admin/settings', label: '운영 설정', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-700">
          <Link href="/admin" className="font-bold text-lg">관리자 센터</Link>
          <p className="text-gray-400 text-xs mt-1">지리산 산양삼</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="text-xs text-gray-400 hover:text-white">← 사이트로 이동</Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
