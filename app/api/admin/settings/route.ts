import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_KEYS = ['BANK_NAME', 'BANK_ACCOUNT', 'BANK_HOLDER', 'SHIPPING_FEE', 'FREE_SHIPPING_THRESHOLD', 'DEPOSIT_DEADLINE_HOURS']

async function ensureAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }
  return null
}

export async function GET() {
  const denied = await ensureAdmin()
  if (denied) return denied
  const settings = await prisma.setting.findMany({ where: { key: { in: ALLOWED_KEYS } } })
  return NextResponse.json(settings)
}

export async function PUT(req: Request) {
  const denied = await ensureAdmin()
  if (denied) return denied

  try {
    const body = await req.json()
    const tasks = ALLOWED_KEYS.map((key) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(body[key] ?? '') },
        create: { key, value: String(body[key] ?? '') },
      })
    )
    await Promise.all(tasks)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '설정 저장 실패' }, { status: 500 })
  }
}
