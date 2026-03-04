export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyPaymentConfirmed } from '@/lib/notifications'

const KAKAO_APPROVE_URL = 'https://kapi.kakao.com/v1/payment/approve'

export async function POST(req: Request) {
  try {
    const { orderNumber, pgToken } = await req.json()
    if (!orderNumber || !pgToken) {
      return NextResponse.json({ error: 'orderNumber와 pgToken이 필요합니다.' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })

    const adminKey = process.env.KAKAO_ADMIN_KEY
    const cid = process.env.KAKAO_CID || 'TC0ONETIME'
    if (!adminKey) {
      return NextResponse.json({ error: 'KAKAO_ADMIN_KEY가 설정되지 않았습니다.' }, { status: 500 })
    }

    if (!order.paymentKey) {
      return NextResponse.json({ error: '카카오 결제 세션(TID)을 찾을 수 없습니다.' }, { status: 400 })
    }

    const params = new URLSearchParams({
      cid,
      tid: order.paymentKey,
      partner_order_id: order.orderNumber,
      partner_user_id: order.userId || order.guestPhone || 'guest',
      pg_token: pgToken,
    })

    const kakaoRes = await fetch(KAKAO_APPROVE_URL, {
      method: 'POST',
      headers: {
        Authorization: `KakaoAK ${adminKey}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params,
    })

    const kakaoData = await kakaoRes.json()
    if (!kakaoRes.ok) {
      return NextResponse.json({ error: kakaoData.msg || '카카오 결제 승인 실패' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAYMENT_CONFIRMED',
        paidAt: new Date(),
      },
    })

    void notifyPaymentConfirmed(updated.id)
    return NextResponse.json({ success: true, orderId: updated.id, orderNumber: updated.orderNumber })
  } catch (error) {
    console.error('Kakao approve error:', error)
    return NextResponse.json({ error: '카카오 결제 승인 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
