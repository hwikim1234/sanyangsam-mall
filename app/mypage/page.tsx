export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import Link from 'next/link'

export default async function MypagePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center text-white text-xl font-bold">
          {session.user?.name?.charAt(0) || '?'}
        </div>
        <div>
          <p className="font-bold text-xl">{session.user?.name}</p>
          <p className="text-gray-500">{session.user?.email}</p>
        </div>
      </div>

      <h2 className="font-bold text-lg mb-4">주문 내역</h2>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <p className="mb-4">주문 내역이 없습니다</p>
          <Link href="/products/sanyangsam-5-6nyeon-10ppuri" className="btn-primary">상품 보러가기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="card p-5 block hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <p className="font-mono text-sm text-gray-500">{order.orderNumber}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>
              <p className="font-bold text-gray-800">{order.items[0]?.productName}</p>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">{formatDate(order.createdAt)}</span>
                <span className="font-bold text-brand-green">{formatPrice(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
