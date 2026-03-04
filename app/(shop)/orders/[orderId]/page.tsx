import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/orders/track')
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  })

  if (!order) notFound()
  if (role !== 'ADMIN' && order.userId !== userId) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      <div>
        <h1 className="text-2xl font-black">주문 상세</h1>
        <p className="text-sm text-gray-500 mt-1">{order.orderNumber}</p>
      </div>

      <div className="card p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">주문 상태</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>
        <p className="text-sm text-gray-500">주문일시: {formatDate(order.createdAt)}</p>
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-3">주문 상품</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-gray-100 pb-2">
              <span>{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}</span>
              <b>{formatPrice(item.subtotal)}</b>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex justify-between font-bold">
          <span>총 결제 금액</span>
          <span className="text-brand-green">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="card p-5 text-sm space-y-1">
        <h2 className="font-bold mb-2">배송 정보</h2>
        <p>수령인: {order.shippingName}</p>
        <p>연락처: {order.shippingPhone}</p>
        <p>주소: {order.shippingAddress1} {order.shippingAddress2 || ''}</p>
        {order.trackingNumber && <p>운송장: {order.courierCode} / {order.trackingNumber}</p>}
      </div>
    </div>
  )
}
