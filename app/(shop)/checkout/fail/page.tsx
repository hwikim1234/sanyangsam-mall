export const dynamic = 'force-dynamic'
import Link from 'next/link'

export default function CheckoutFailPage({ searchParams }: { searchParams: { code?: string; message?: string } }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-black text-red-600 mb-2">결제에 실패했습니다</h1>
      <p className="text-gray-500 mb-6">다시 시도하거나 다른 결제수단을 선택해주세요.</p>

      <div className="card p-5 text-left mb-6 text-sm space-y-1">
        <p>오류코드: <b>{searchParams.code || '-'}</b></p>
        <p>메시지: <b>{searchParams.message || '결제 처리 중 오류'}</b></p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/checkout" className="btn-primary">결제 다시 시도</Link>
        <Link href="/cart" className="btn-outline">장바구니로 이동</Link>
      </div>
    </div>
  )
}
