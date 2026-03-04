import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyPaymentConfirmed } from '@/lib/notifications'

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const { memo } = await req.json().catch(() => ({}))
    const adminId = (session.user as any).id

    const order = await prisma.order.findUnique({ where: { id: params.orderId } })
    if (!order) return NextResponse.json({ error: '주문 없음' }, { status: 404 })
    if (order.status !== 'PENDING_PAYMENT') {
      return NextResponse.json({ error: '이미 처리된 주문입니다.' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: 'PAYMENT_CONFIRMED',
        paidAt: new Date(),
        depositConfirmedAt: new Date(),
        depositConfirmedBy: adminId,
        memo: memo || order.memo,
      },
    })

    void notifyPaymentConfirmed(updated.id)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: '처리 실패' }, { status: 500 })
  }
}
