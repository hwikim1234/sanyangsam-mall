export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import ShipButton from './ShipButton'

export default async function AdminShippingPage() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING'] } },
    include: { items: true },
    orderBy: { paidAt: 'asc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-black mb-2">배송 처리</h1>
      <p className="text-gray-500 mb-8">결제 확인된 주문 {orders.length}건을 발송 처리해주세요.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p className="font-medium">배송 처리할 주문이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{order.orderNumber}</p>
                  <p className="text-gray-500 text-sm">결제완료: {order.paidAt ? formatDate(order.paidAt) : '-'}</p>
                </div>
                <span className="text-sm font-bold text-brand-green">{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">수령인</p>
                  <p className="font-medium">{order.shippingName} / {order.shippingPhone}</p>
                </div>
                <div>
                  <p className="text-gray-400">배송지</p>
                  <p className="font-medium">{order.shippingAddress1} {order.shippingAddress2}</p>
                </div>
                {order.shippingMemo && (
                  <div className="col-span-2">
                    <p className="text-gray-400">배송 메모</p>
                    <p className="font-medium text-orange-600">{order.shippingMemo}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
                {order.items.map((item) => (
                  <span key={item.id}>{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity} </span>
                ))}
              </div>

              <ShipButton orderId={order.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
