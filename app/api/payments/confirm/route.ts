export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyPaymentConfirmed } from '@/lib/notifications'

// 토스페이먼츠 결제 서버 검증 + 상태 업데이트
export async function POST(req: Request) {
  try {
    const { paymentKey, orderId, amount } = await req.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // DB에서 주문 조회
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 금액 일치 검증 (보안 핵심)
    if (order.totalAmount !== amount) {
      return NextResponse.json(
        { error: '결제 금액이 일치하지 않습니다.' },
        { status: 400 }
      )
    }

    // 이미 결제 완료된 경우
    if (order.status !== 'PENDING_PAYMENT') {
      return NextResponse.json(
        { error: '이미 처리된 주문입니다.' },
        { status: 400 }
      )
    }

    // 토스페이먼츠 서버 API 호출 (실제 결제 확정)
    const tossSecretKey = process.env.TOSS_SECRET_KEY
    if (!tossSecretKey) {
      throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.')
    }

    const tossResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${tossSecretKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    )

    const tossData = await tossResponse.json()

    if (!tossResponse.ok) {
      console.error('Toss API Error:', tossData)
      return NextResponse.json(
        { error: tossData.message || '결제 확인에 실패했습니다.' },
        { status: 400 }
      )
    }

    // 결제 성공 → 주문 상태 업데이트
    const updated = await prisma.order.update({
      where: { orderNumber: orderId },
      data: {
        status: 'PAYMENT_CONFIRMED',
        paymentKey: tossData.paymentKey,
        paidAt: new Date(tossData.approvedAt),
      },
    })

    void notifyPaymentConfirmed(updated.id)

    return NextResponse.json({
      success: true,
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      payment: tossData,
    })
  } catch (err) {
    console.error('Payment confirm error:', err)
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
