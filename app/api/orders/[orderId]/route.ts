import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 권한 확인: 본인 주문 또는 관리자만
    if (session) {
      const userId = (session.user as any).id
      const role = (session.user as any).role
      if (role !== 'ADMIN' && order.userId !== userId) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
