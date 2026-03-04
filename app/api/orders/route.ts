import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/server-utils'
import { notifyOrderCreated } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const {
      items,
      shipping,
      paymentMethod,
      guestInfo,
      subtotal,
      shippingFee,
      totalAmount,
      depositorName,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: '주문 상품이 없습니다.' }, { status: 400 })
    }

    if (!shipping.name || !shipping.phone || !shipping.address1) {
      return NextResponse.json({ error: '배송지 정보를 입력해주세요.' }, { status: 400 })
    }

    const orderNumber = await generateOrderNumber()

    // 무통장 입금 기한 (24시간)
    const depositDeadline = new Date()
    depositDeadline.setHours(depositDeadline.getHours() + 24)

    // 은행 정보 조회
    const bankSettings = await prisma.setting.findMany({
      where: { key: { in: ['BANK_NAME', 'BANK_ACCOUNT', 'BANK_HOLDER'] } },
    })
    const bankMap = Object.fromEntries(bankSettings.map((s) => [s.key, s.value]))

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? (session.user as any).id : null,
        guestEmail: guestInfo?.email,
        guestName: guestInfo?.name,
        guestPhone: guestInfo?.phone,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingZipCode: shipping.zipCode,
        shippingAddress1: shipping.address1,
        shippingAddress2: shipping.address2,
        shippingMemo: shipping.memo,
        status: 'PENDING_PAYMENT',
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod,
        bankName: paymentMethod === 'BANK_TRANSFER' ? bankMap['BANK_NAME'] : null,
        bankAccount: paymentMethod === 'BANK_TRANSFER' ? bankMap['BANK_ACCOUNT'] : null,
        depositorName: depositorName || null,
        depositDeadline: paymentMethod === 'BANK_TRANSFER' ? depositDeadline : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            optionId: item.optionId || null,
            productName: item.productName,
            optionName: item.optionName || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
    })

    void notifyOrderCreated(order.id)
    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber })
  } catch (error: any) {
    console.error('주문 생성 오류:', error)
    return NextResponse.json({ error: '주문 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
