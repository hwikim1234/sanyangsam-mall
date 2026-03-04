export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  searchParams: { status?: string; page?: string }
}

const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'PENDING_PAYMENT', label: '입금대기' },
  { value: 'PAYMENT_CONFIRMED', label: '결제완료' },
  { value: 'PREPARING', label: '준비중' },
  { value: 'SHIPPED', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
  { value: 'CANCELLED', label: '취소' },
]

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const where: any = {}
  if (searchParams.status) where.status = searchParams.status

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { take: 1 } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
    PAYMENT_CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">주문 목록</h1>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`/admin/orders${opt.value ? `?status=${opt.value}` : ''}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (searchParams.status || '') === opt.value
                ? 'bg-brand-green text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['주문번호', '주문자', '상품', '금액', '결제', '상태', '날짜', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.shippingName}</p>
                    <p className="text-gray-400 text-xs">{order.shippingPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-32 truncate">
                    {order.items[0]?.productName}
                  </td>
                  <td className="px-4 py-3 font-bold">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {order.paymentMethod === 'BANK_TRANSFER' ? '무통장' : order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand-green hover:underline text-xs font-medium">
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t text-sm text-gray-500 flex justify-between">
          <span>총 {total}건</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/orders?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="text-brand-green hover:underline">
                이전
              </Link>
            )}
            {page * limit < total && (
              <Link href={`/admin/orders?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="text-brand-green hover:underline">
                다음
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
