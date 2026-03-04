export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [todayOrders, pendingPayment, totalRevenue, totalOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
      prisma.order.aggregate({
        where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalAmount: true },
      }),
      prisma.order.count(),
    ])

    return NextResponse.json({
      todayOrders,
      pendingPayment,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
    })
  } catch (error) {
    return NextResponse.json({ error: '통계 조회 실패' }, { status: 500 })
  }
}
