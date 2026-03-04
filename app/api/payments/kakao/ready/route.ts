import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const KAKAO_READY_URL = 'https://kapi.kakao.com/v1/payment/ready'

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'orderId가 필요합니다.' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })

    const adminKey = process.env.KAKAO_ADMIN_KEY
    const cid = process.env.KAKAO_CID || 'TC0ONETIME'
    if (!adminKey) {
      return NextResponse.json({ error: 'KAKAO_ADMIN_KEY가 설정되지 않았습니다.' }, { status: 500 })
    }

    const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const successUrl = `${siteUrl}/checkout/success?method=kakao&orderId=${encodeURIComponent(order.orderNumber)}`
    const cancelUrl = `${siteUrl}/checkout/fail?method=kakao&reason=cancel`
    const failUrl = `${siteUrl}/checkout/fail?method=kakao&reason=fail`

    const itemName = order.items[0]?.productName || '산양삼 주문'

    const params = new URLSearchParams({
      cid,
      partner_order_id: order.orderNumber,
      partner_user_id: order.userId || order.guestPhone || 'guest',
      item_name: itemName,
      quantity: String(order.items.reduce((sum, it) => sum + it.quantity, 0) || 1),
      total_amount: String(order.totalAmount),
      tax_free_amount: '0',
      approval_url: successUrl,
      cancel_url: cancelUrl,
      fail_url: failUrl,
    })

    const kakaoRes = await fetch(KAKAO_READY_URL, {
      method: 'POST',
      headers: {
        Authorization: `KakaoAK ${adminKey}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params,
    })

    const kakaoData = await kakaoRes.json()
    if (!kakaoRes.ok) {
      return NextResponse.json({ error: kakaoData.msg || '카카오페이 결제 준비 실패' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentKey: kakaoData.tid,
      },
    })

    return NextResponse.json(kakaoData)
  } catch (error) {
    console.error('Kakao ready error:', error)
    return NextResponse.json({ error: '카카오페이 준비 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
