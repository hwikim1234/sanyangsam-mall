export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice, getOrderStatusLabel } from '@/lib/utils'
import ConfirmPaymentButton from '../../payments/ConfirmPaymentButton'
import ShipButton from '../../shipping/ShipButton'

export default async function AdminOrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
  })
  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">주문 상세</h1>
        <p className="text-sm text-gray-500 mt-1">{order.orderNumber} · {formatDate(order.createdAt)}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3">주문 정보</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>상태: <b>{getOrderStatusLabel(order.status)}</b></p>
            <p>결제수단: <b>{order.paymentMethod}</b></p>
            <p>총 결제금액: <b>{formatPrice(order.totalAmount)}</b></p>
            <p>입금자명: <b>{order.depositorName || '-'}</b></p>
            <p>입금기한: <b>{order.depositDeadline ? formatDate(order.depositDeadline) : '-'}</b></p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3">고객/배송 정보</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>주문자: <b>{order.shippingName}</b></p>
            <p>연락처: <b>{order.shippingPhone}</b></p>
            <p>이메일: <b>{order.user?.email || order.guestEmail || '-'}</b></p>
            <p>주소: <b>{order.shippingAddress1} {order.shippingAddress2 || ''}</b></p>
            <p>배송메모: <b>{order.shippingMemo || '-'}</b></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4">주문 상품</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-gray-100 py-2">
              <span>{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}</span>
              <b>{formatPrice(item.subtotal)}</b>
            </div>
          ))}
        </div>
      </div>

      {order.status === 'PENDING_PAYMENT' && order.paymentMethod === 'BANK_TRANSFER' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">입금 확인 처리</h2>
          <ConfirmPaymentButton orderId={order.id} />
        </div>
      )}

      {(order.status === 'PAYMENT_CONFIRMED' || order.status === 'PREPARING') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">배송 처리</h2>
          <ShipButton orderId={order.id} />
        </div>
      )}
    </div>
  )
}
