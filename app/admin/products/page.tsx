export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-sm text-gray-500 mt-1">등록된 상품 {products.length}개</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#2d6a4f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1b4332]"
        >
          + 상품 등록
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-gray-400">등록된 상품이 없습니다.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-block bg-[#2d6a4f] text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            첫 상품 등록하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">상품명</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">정가</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">판매가</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">재고</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">상태</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">/products/{product.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4">
                    {product.salePrice ? (
                      <span className="font-semibold text-[#1b4332]">
                        {product.salePrice.toLocaleString()}원
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        product.stock <= 5 ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      {product.stock}개
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isActive ? '판매중' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-[#2d6a4f] hover:underline font-medium"
                      >
                        수정
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="text-xs text-gray-500 hover:underline"
                      >
                        보기
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
