'use client'

import { useState } from 'react'
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'

export default function OrderTrackPage() {
  const [form, setForm] = useState({ orderNumber: '', phone: '' })
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setOrder(null)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrder(data)
    } catch (err: any) {
      setError(err.message || '조회 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-2">주문 조회</h1>
      <p className="text-gray-500 mb-8">주문번호와 연락처로 조회할 수 있습니다</p>

      <form onSubmit={handleSearch} className="card p-6 space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">주문번호</label>
          <input className="input-field" placeholder="SYS-20250215-0001" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">연락처</label>
          <input className="input-field" placeholder="010-0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? '조회 중...' : '조회하기'}</button>
      </form>

      {order && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-lg">{order.orderNumber}</p>
              <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.productName} {item.optionName && `(${item.optionName})`} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>총 결제 금액</span>
            <span className="text-brand-green">{formatPrice(order.totalAmount)}</span>
          </div>

          {order.status === 'PENDING_PAYMENT' && (
            <div className="mt-4 bg-yellow-50 rounded-xl p-4 text-sm">
              <p className="font-bold text-yellow-800 mb-2">입금 계좌 안내</p>
              <p>은행: {order.bankName}</p>
              <p>계좌: {order.bankAccount}</p>
              <p className="font-bold text-brand-green mt-1">입금액: {formatPrice(order.totalAmount)}</p>
            </div>
          )}

          {order.trackingNumber && (
            <div className="mt-4 bg-indigo-50 rounded-xl p-4 text-sm">
              <p className="font-bold text-indigo-800 mb-1">배송 정보</p>
              <p>택배사: {order.courierCode}</p>
              <p>운송장: {order.trackingNumber}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
