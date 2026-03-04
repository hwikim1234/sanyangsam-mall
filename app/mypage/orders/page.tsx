import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">주문 목록</h1>
      {orders.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">주문 내역이 없습니다.</div>
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
              <p className="font-medium text-gray-800">{order.items[0]?.productName || '상품 정보 없음'}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                <span className="font-bold text-brand-green">{formatPrice(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
