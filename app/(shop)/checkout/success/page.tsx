export const dynamic = 'force-dynamic'
'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

type OrderItem = {
  id: string
  productName: string
  optionName: string | null
  quantity: number
  subtotal: number
}

type Order = {
  id: string
  orderNumber: string
  totalAmount: number
  items: OrderItem[]
  bankName?: string | null
  bankAccount?: string | null
}

const formatPrice = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()

  const method = searchParams.get('method') || ''
  const orderDbId = searchParams.get('orderDbId') || ''
  const orderId = searchParams.get('orderId') || ''
  const paymentKey = searchParams.get('paymentKey') || ''
  const amount = searchParams.get('amount') || ''
  const pgToken = searchParams.get('pg_token') || ''

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const bankInfo = useMemo(() => {
    return {
      bankName: process.env.NEXT_PUBLIC_BANK_NAME || '국민은행',
      bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '123-456-789012',
      bankHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || '홍길동(산양삼)',
    }
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        let dbOrderId = orderId

        if (method === 'toss' && paymentKey && orderId && amount) {
          const res = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || '토스 결제 승인 실패')
          dbOrderId = data.orderId
        }

        if (method === 'kakao' && pgToken && orderId) {
          const res = await fetch('/api/payments/kakao/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber: orderId, pgToken }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || '카카오 결제 승인 실패')
          dbOrderId = data.orderId
        }

        if (!dbOrderId && orderDbId) {
          dbOrderId = orderDbId
        }

        if (!dbOrderId) throw new Error('주문 정보를 찾을 수 없습니다.')

        const orderRes = await fetch(`/api/orders/${dbOrderId}`)
        const orderData = await orderRes.json()
        if (!orderRes.ok) throw new Error(orderData.error || '주문 조회 실패')

        setOrder(orderData)
        clearCart()
      } catch (err: any) {
        setError(err.message || '결제 완료 처리 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [amount, clearCart, method, orderDbId, orderId, paymentKey, pgToken])

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-12 text-center">결제 결과 확인 중...</div>
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-black text-red-600 mb-2">처리에 실패했습니다</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/checkout/fail" className="btn-primary">실패 페이지로 이동</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-black text-gray-800 mb-2">주문 완료!</h1>
      <p className="text-gray-500 mb-8">
        {method === 'bank' ? '입금 확인 후 바로 발송해드립니다.' : '결제가 완료되었습니다.'}
      </p>

      {order && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">주문번호</span>
            <span className="font-bold">{order.orderNumber}</span>
          </div>
          <div className="space-y-2 text-sm mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>총 결제 금액</span>
            <span className="text-brand-green">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}

      {method === 'bank' && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6 text-left">
          <h2 className="font-bold text-lg text-yellow-800 mb-4">무통장 입금 안내</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>은행: <b>{order?.bankName || bankInfo.bankName}</b></p>
            <p>계좌번호: <b>{order?.bankAccount || bankInfo.bankAccount}</b></p>
            <p>예금주: <b>{bankInfo.bankHolder}</b></p>
          </div>
          <p className="text-sm text-yellow-700 mt-4">
            주문 후 24시간 이내에 입금해주세요. 입금자명을 주문자명과 동일하게 맞춰주세요.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {order && <Link href={`/orders/${order.id}`} className="btn-outline w-full">주문 내역 확인</Link>}
        <Link href="/" className="btn-primary w-full">쇼핑 계속하기</Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-12 text-center">결제 결과 확인 중...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
