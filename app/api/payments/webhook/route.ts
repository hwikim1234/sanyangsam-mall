import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { notifyPaymentConfirmed } from '@/lib/notifications'

// 토스페이먼츠 가상계좌 입금 webhook
export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()

    // webhook 서명 검증
    const webhookSecret = process.env.TOSS_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = headersList.get('TossPayments-Signature')
      if (!signature) {
        return NextResponse.json({ error: '서명이 없습니다.' }, { status: 401 })
      }
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('base64')
      if (signature !== expectedSig) {
        return NextResponse.json({ error: '서명이 유효하지 않습니다.' }, { status: 401 })
      }
    }

    const data = JSON.parse(body)
    const { eventType, data: eventData } = data

    // 가상계좌 입금 완료 이벤트
    if (eventType === 'DEPOSIT_CALLBACK' && eventData.status === 'DONE') {
      const { orderId, totalAmount } = eventData

      const order = await prisma.order.findUnique({
        where: { orderNumber: orderId },
      })

      if (!order) {
        return NextResponse.json({ error: '주문 없음' }, { status: 404 })
      }

      // 금액 검증
      if (order.totalAmount !== totalAmount) {
        console.error(`금액 불일치: 주문 ${order.totalAmount} vs 입금 ${totalAmount}`)
        return NextResponse.json({ error: '금액 불일치' }, { status: 400 })
      }

      const updated = await prisma.order.update({
        where: { orderNumber: orderId },
        data: {
          status: 'PAYMENT_CONFIRMED',
          depositConfirmedAt: new Date(),
          paymentKey: eventData.paymentKey,
        },
      })
      void notifyPaymentConfirmed(updated.id)

      console.log(`[Webhook] 가상계좌 입금 완료: ${orderId}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: '웹훅 처리 오류' },
      { status: 500 }
    )
  }
}
