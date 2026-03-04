export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import ConfirmPaymentButton from './ConfirmPaymentButton'

export default async function AdminPaymentsPage() {
  const orders = await prisma.order.findMany({
    where: { status: 'PENDING_PAYMENT', paymentMethod: 'BANK_TRANSFER' },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-black mb-2">무통장 입금 확인</h1>
      <p className="text-gray-500 mb-8">입금 확인 후 처리해주세요. 오래된 순으로 표시됩니다.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-4xl mb-4">✅</p>
          <p className="font-medium">확인 대기 중인 입금이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const deadline = order.depositDeadline ? new Date(order.depositDeadline) : null
            const now = new Date()
            const hoursLeft = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / 1000 / 60 / 60) : null
            const isUrgent = hoursLeft !== null && hoursLeft <= 3

            return (
              <div key={order.id} className={`bg-white rounded-xl border-2 p-6 ${isUrgent ? 'border-red-300' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">{order.orderNumber}</p>
                    <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  {hoursLeft !== null && (
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {hoursLeft > 0 ? `${hoursLeft}시간 남음` : '기한 초과'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-400">주문자</p>
                    <p className="font-medium">{order.shippingName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">연락처</p>
                    <p className="font-medium">{order.shippingPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">입금자명</p>
                    <p className="font-medium">{order.depositorName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">입금 금액</p>
                    <p className="font-black text-brand-green text-lg">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  {order.items.map((item) => (
                    <span key={item.id} className="text-gray-600">
                      {item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}
                    </span>
                  ))}
                </div>

                <ConfirmPaymentButton orderId={order.id} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
