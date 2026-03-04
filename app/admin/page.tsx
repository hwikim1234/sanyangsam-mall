export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [todayOrders, pendingPayment, totalRevenue, recentOrders] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
    prisma.order.aggregate({
      where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: { take: 1 } },
    }),
  ])

  const stats = [
    { label: '오늘 주문', value: `${todayOrders}건`, color: 'bg-blue-50 text-blue-700' },
    { label: '입금 대기', value: `${pendingPayment}건`, color: pendingPayment > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700', urgent: pendingPayment > 0 },
    { label: '누적 매출', value: formatPrice(totalRevenue._sum.totalAmount || 0), color: 'bg-green-50 text-green-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black mb-8">대시보드</h1>

      {/* 긴급 알림 */}
      {pendingPayment > 0 && (
        <Link href="/admin/payments" className="block mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 hover:bg-red-100 transition-colors">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="font-bold text-red-700">무통장 입금 확인 대기 {pendingPayment}건</p>
              <p className="text-sm text-red-500">클릭하여 입금 확인하기</p>
            </div>
          </div>
        </Link>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 ${stat.color}`}>
            <p className="text-sm font-medium opacity-70">{stat.label}</p>
            <p className="text-2xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 최근 주문 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg">최근 주문</h2>
          <Link href="/admin/orders" className="text-sm text-brand-green hover:underline">전체 보기</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['주문번호', '주문자', '금액', '결제수단', '상태', '날짜'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand-green hover:underline font-medium">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.shippingName}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    {order.paymentMethod === 'BANK_TRANSFER' ? '무통장' : order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING_PAYMENT: { label: '입금대기', cls: 'bg-yellow-100 text-yellow-700' },
    PAYMENT_CONFIRMED: { label: '결제완료', cls: 'bg-blue-100 text-blue-700' },
    PREPARING: { label: '준비중', cls: 'bg-purple-100 text-purple-700' },
    SHIPPED: { label: '배송중', cls: 'bg-indigo-100 text-indigo-700' },
    DELIVERED: { label: '배송완료', cls: 'bg-green-100 text-green-700' },
    CANCELLED: { label: '취소', cls: 'bg-red-100 text-red-700' },
  }
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' }
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
}
