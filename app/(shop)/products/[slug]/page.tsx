export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import AddToCartSection from './AddToCartSection'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })
  if (!product) return {}
  return { title: product.name, description: product.description.slice(0, 150) }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      options: true,
    },
  })

  if (!product) notFound()

  const discountRate = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  const displayImages = product.images.length > 0
    ? product.images.map(img => img.url)
    : ['/images/products/placeholder.jpg']

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="md:grid md:grid-cols-2 md:gap-12">
        {/* 이미지 갤러리 */}
        <div className="mb-6 md:mb-0">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
            <img
              src={displayImages[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x500/dcfce7/2d6a4f?text=산양삼'
              }}
            />
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {displayImages.slice(1).map((url, i) => (
                <div key={i} className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={url} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">무농약 인증</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">농가 직송</span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-3">{product.name}</h1>

          <div className="mb-4">
            {product.salePrice ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-brand-green">{formatPrice(product.salePrice)}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">{discountRate}% 할인</span>
                </div>
                <span className="text-gray-400 line-through text-lg">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-3xl font-black text-brand-green">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* 배송 안내 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">배송비</span>
              <span className="font-medium">3,000원 (50,000원 이상 무료)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">발송</span>
              <span className="font-medium">오전 11시 이전 주문 당일 발송</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">포장</span>
              <span className="font-medium">냉장 포장</span>
            </div>
          </div>

          {/* 구매 섹션 (클라이언트 컴포넌트) */}
          <AddToCartSection product={product} />
        </div>
      </div>

      {/* 상품 상세 설명 */}
      <div className="mt-12 border-t pt-10">
        <h2 className="text-xl font-bold mb-6">상품 상세</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </div>
      </div>

      {/* 증정 이벤트 안내 */}
      <div className="mt-10 bg-green-50 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-brand-green mb-4">🎁 구매 증정 이벤트</h3>
        <div className="space-y-2">
          {[
            { qty: '10뿌리 주문', bonus: '2뿌리 추가 증정' },
            { qty: '15뿌리 주문', bonus: '3뿌리 추가 증정' },
            { qty: '20뿌리 주문', bonus: '4뿌리 추가 증정' },
          ].map((item) => (
            <div key={item.qty} className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">{item.qty}</span>
              <span className="font-bold text-brand-green">{item.bonus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
