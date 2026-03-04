export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      options: true,
    },
  })

  return (
    <main className="min-h-screen bg-[#faf8f0]">
      <section className="bg-[#1b4332] text-white py-14 text-center">
        <p className="text-sm tracking-widest text-[#b5831f] font-semibold mb-2 uppercase">
          Jirisan · Altitude 800m
        </p>
        <h1 className="text-4xl font-black">지리산 산양삼</h1>
        <p className="mt-3 text-white/70 text-sm">한국임업진흥원 국내산·무농약 인증 · 농장 직거래</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">등록된 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const minOptionPrice =
                product.options.length > 0
                  ? Math.min(...product.options.map((o) => (product.salePrice ?? product.price) + o.priceAdj))
                  : product.salePrice ?? product.price
              const thumbnail = product.images[0]?.url || '/images/products/product-roots-1.jpg'

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#1b4332] text-white text-[10px] font-bold px-2 py-1 rounded-full">무농약 인증</span>
                    </div>
                    {product.salePrice && product.salePrice < product.price && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          {Math.round((1 - product.salePrice / product.price) * 100)}% 할인
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-[#2d6a4f] font-semibold mb-1 tracking-wide">지리산 산양삼 농장 직거래</p>
                    <h2 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-3">{product.name}</h2>

                    {product.options.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.options.map((opt) => (
                          <span key={opt.id} className="text-[11px] bg-[#f0f7f4] text-[#1b4332] px-2 py-0.5 rounded-full font-medium">
                            {opt.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#1b4332]">{minOptionPrice.toLocaleString()}원</span>
                      {product.options.length > 1 && <span className="text-xs text-gray-400">부터</span>}
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}원</span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">{minOptionPrice >= 50000 ? '✓ 무료배송' : '배송비 3,000원'}</p>

                    <button className="mt-4 w-full bg-[#2d6a4f] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1b4332] transition-colors">
                      구매하기
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
