export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const status = body.status as 'RECEIVED' | 'IN_PROGRESS' | 'ANSWERED'
    const answer = body.answer ? String(body.answer) : null

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: {
        status,
        answer,
        answeredAt: status === 'ANSWERED' ? new Date() : null,
        answeredBy: status === 'ANSWERED' ? (session.user as any).id : null,
      },
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('inquiry update error:', error)
    return NextResponse.json({ error: '문의 업데이트 실패' }, { status: 500 })
  }
}
