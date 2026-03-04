import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = await req.json()

    if (!orderNumber || !phone) {
      return NextResponse.json({ error: '주문번호와 연락처를 입력해주세요.' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        shippingPhone: phone,
      },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다. 주문번호와 연락처를 확인해주세요.' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
