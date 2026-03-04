export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notify } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, subject, message } = body

    if (!name || !message) {
      return NextResponse.json({ error: '이름과 문의 내용은 필수입니다.' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: String(name),
        phone: phone ? String(phone) : null,
        email: email ? String(email) : null,
        subject: subject ? String(subject) : null,
        message: String(message),
      },
    })

    await notify({
      title: `[산양삼] 신규 문의 #${inquiry.id.slice(0, 8)}`,
      message: `신규 문의가 등록되었습니다.\n이름: ${inquiry.name}\n연락처: ${inquiry.phone || '-'}\n내용: ${inquiry.message}`,
      toEmail: process.env.ADMIN_NOTIFY_EMAIL,
      toPhone: process.env.ADMIN_NOTIFY_PHONE,
    })

    return NextResponse.json({ ok: true, inquiryId: inquiry.id })
  } catch (error) {
    console.error('inquiry create error:', error)
    return NextResponse.json({ error: '문의 등록 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
