import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function AdminProductNewPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">상품 등록</h1>
      <ProductForm mode="create" />
    </div>
  )
}
