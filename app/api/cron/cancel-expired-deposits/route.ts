import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notify } from '@/lib/notifications'

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : req.headers.get('x-cron-secret')

  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const targets = await prisma.order.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      paymentMethod: 'BANK_TRANSFER',
      depositDeadline: { lt: now },
    },
    select: { id: true, orderNumber: true, shippingPhone: true, guestEmail: true },
  })

  if (targets.length === 0) {
    return NextResponse.json({ ok: true, cancelled: 0 })
  }

  const ids = targets.map((t) => t.id)
  await prisma.order.updateMany({
    where: { id: { in: ids } },
    data: {
      status: 'CANCELLED',
      cancelledAt: now,
      cancelReason: '입금 기한(24시간) 초과 자동 취소',
    },
  })

  await Promise.allSettled(
    targets.map((t) =>
      notify({
        title: `[산양삼] 주문 자동 취소 ${t.orderNumber}`,
        message: `입금 기한이 지나 주문이 자동 취소되었습니다. 주문번호: ${t.orderNumber}`,
        toEmail: t.guestEmail,
        toPhone: t.shippingPhone,
      })
    )
  )

  return NextResponse.json({ ok: true, cancelled: ids.length })
}
