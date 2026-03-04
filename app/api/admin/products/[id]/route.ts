import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }
  return null
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const denied = await ensureAdmin()
  if (denied) return denied

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      options: true,
    },
  })
  if (!product) return NextResponse.json({ error: '상품 없음' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const denied = await ensureAdmin()
  if (denied) return denied

  try {
    const body = await req.json()
    const { name, slug, description, price, salePrice, stock, isActive, isFeatured, images, options } = body

    const exists = await prisma.product.findUnique({ where: { id: params.id } })
    if (!exists) return NextResponse.json({ error: '상품 없음' }, { status: 404 })

    const sameSlug = await prisma.product.findFirst({ where: { slug, NOT: { id: params.id } } })
    if (sameSlug) return NextResponse.json({ error: '이미 사용 중인 slug입니다.' }, { status: 400 })

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description ?? '',
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        stock: Number(stock ?? 0),
        isActive: Boolean(isActive),
        isFeatured: Boolean(isFeatured),
        images: {
          deleteMany: {},
          create: (images ?? []).map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
        options: {
          deleteMany: {},
          create: (options ?? []).map((opt: any) => ({
            name: opt.name,
            priceAdj: Number(opt.priceAdj ?? 0),
            stock: Number(opt.stock ?? 0),
          })),
        },
      },
      include: { images: true, options: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: '상품 수정 실패' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const denied = await ensureAdmin()
  if (denied) return denied

  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: '상품 삭제 실패' }, { status: 500 })
  }
}
