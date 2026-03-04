export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'

declare global {
  interface Window {
    daum: any
    TossPayments: any
  }
}

const FREE_SHIPPING_THRESHOLD = 50000
const SHIPPING_FEE = 3000

const loadTossScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('브라우저 환경이 아닙니다.'))
    if (window.TossPayments) return resolve()

    const existing = document.querySelector('script[data-toss-sdk="true"]') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('토스 SDK 로드 실패')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1'
    script.async = true
    script.dataset.tossSdk = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('토스 SDK 로드 실패'))
    document.head.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'KAKAOPAY' | 'TOSS'>('BANK_TRANSFER')

  const [form, setForm] = useState({
    name: session?.user?.name || '',
    phone: '',
    email: session?.user?.email || '',
    zipCode: '',
    address1: '',
    address2: '',
    memo: '',
    depositorName: '',
  })

  const subtotal = getTotalPrice()
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  const openPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setForm((f) => ({
          ...f,
          zipCode: data.zonecode,
          address1: data.roadAddress || data.jibunAddress,
        }))
      },
    }).open()
  }

  const createOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          optionId: i.optionId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          productName: i.productName,
          optionName: i.optionName,
        })),
        shipping: {
          name: form.name,
          phone: form.phone,
          zipCode: form.zipCode,
          address1: form.address1,
          address2: form.address2,
          memo: form.memo,
        },
        paymentMethod,
        guestInfo: !session ? { email: form.email, name: form.name, phone: form.phone } : null,
        subtotal,
        shippingFee,
        totalAmount: total,
        depositorName: form.depositorName,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '주문 생성 실패')
    return data as { orderId: string; orderNumber: string }
  }

  const requestTossPayment = async (orderId: string, orderNumber: string) => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
    if (!clientKey) {
      throw new Error('토스 클라이언트 키가 설정되지 않았습니다.')
    }

    await loadTossScript()

    const tossPayments = window.TossPayments(clientKey)
    const customerName = form.name || '고객'

    await tossPayments.requestPayment('카드', {
      amount: total,
      orderId: orderNumber,
      orderName: items[0]?.productName || '산양삼 주문',
      customerName,
      customerEmail: form.email || undefined,
      successUrl: `${window.location.origin}/checkout/success?method=toss&orderDbId=${orderId}`,
      failUrl: `${window.location.origin}/checkout/fail?method=toss`,
    })
  }

  const requestKakaoPayment = async (orderId: string) => {
    const res = await fetch('/api/payments/kakao/ready', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '카카오페이 결제 준비 실패')

    window.location.href = data.next_redirect_pc_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)

    try {
      const { orderId, orderNumber } = await createOrder()

      if (paymentMethod === 'BANK_TRANSFER') {
        clearCart()
        router.push(`/checkout/success?orderId=${orderId}&method=bank`)
        return
      }

      if (paymentMethod === 'TOSS') {
        await requestTossPayment(orderId, orderNumber)
        return
      }

      if (paymentMethod === 'KAKAOPAY') {
        await requestKakaoPayment(orderId)
        return
      }
    } catch (err: any) {
      alert(err.message || '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6">주문 / 결제</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">주문자 정보</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">이름 *</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="홍길동" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">연락처 *</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="010-0000-0000" required />
            </div>
            {!session && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">이메일</label>
                <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" />
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">배송지</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input className="input-field flex-1" value={form.zipCode} placeholder="우편번호" readOnly required />
              <button type="button" onClick={openPostcode} className="px-4 py-3 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 whitespace-nowrap transition-colors">주소 검색</button>
            </div>
            <input className="input-field" value={form.address1} placeholder="기본 주소" readOnly required />
            <input className="input-field" value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} placeholder="상세 주소 (동/호수)" />
            <select className="input-field" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })}>
              <option value="">배송 메모 선택</option>
              <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
              <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
              <option value="직접 받겠습니다">직접 받겠습니다</option>
              <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
            </select>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">결제 수단</h2>
          <div className="space-y-3">
            {[
              { value: 'BANK_TRANSFER', label: '무통장 입금', emoji: '🏦', desc: '계좌 이체 후 확인 시 발송' },
              { value: 'KAKAOPAY', label: '카카오페이', emoji: '💛', desc: '카카오페이 결제창으로 이동' },
              { value: 'TOSS', label: '토스페이', emoji: '💙', desc: '토스 결제창으로 이동' },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value as any)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === method.value ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{method.emoji}</span>
                <div className="text-left">
                  <p className="font-bold">{method.label}</p>
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {paymentMethod === 'BANK_TRANSFER' && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">입금자명 *</label>
              <input className="input-field" value={form.depositorName} onChange={(e) => setForm({ ...form, depositorName: e.target.value })} placeholder="실제 입금하실 분의 이름" required />
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">주문 상품</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.optionId}`} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">상품 금액</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">배송비</span><span>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</span></div>
            <div className="flex justify-between font-black text-lg border-t pt-3"><span>총 결제 금액</span><span className="text-brand-green">{formatPrice(total)}</span></div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-5 disabled:opacity-50">
          {loading ? '처리중...' : `${formatPrice(total)} 결제하기`}
        </button>
      </form>
    </div>
  )
}
