import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 상품 목록 조회 (관리자)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

// 상품 생성
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, slug, description, price, salePrice, stock, images, options, isActive, isFeatured } = body

    if (!name || !slug || price === undefined) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 })
    }

    // slug 중복 체크
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: '이미 사용 중인 slug입니다.' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? '',
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        stock: Number(stock ?? 999),
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        images: {
          create: (images ?? []).map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
        options: {
          create: (options ?? []).map((opt: any) => ({
            name: opt.name,
            priceAdj: Number(opt.priceAdj ?? 0),
            stock: Number(opt.stock ?? 0),
          })),
        },
      },
      include: {
        images: true,
        options: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('Product create error:', err)
    return NextResponse.json({ error: '상품 생성 실패' }, { status: 500 })
  }
}
