import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyShipped } from '@/lib/notifications'

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const { trackingNumber, courierCode } = await req.json()

    if (!trackingNumber || !courierCode) {
      return NextResponse.json({ error: '택배사와 운송장 번호를 입력해주세요.' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: 'SHIPPED',
        shippingStatus: 'SHIPPED',
        trackingNumber,
        courierCode,
        shippedAt: new Date(),
      },
    })

    void notifyShipped(updated.id)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: '처리 실패' }, { status: 500 })
  }
}
