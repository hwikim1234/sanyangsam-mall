'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COURIERS = [
  { code: 'CJ', name: 'CJ대한통운' },
  { code: 'LOGEN', name: '로젠택배' },
  { code: 'HANJIN', name: '한진택배' },
  { code: 'LOTTE', name: '롯데택배' },
  { code: 'POST', name: '우체국택배' },
]

export default function ShipButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [courier, setCourier] = useState('CJ')
  const [tracking, setTracking] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!tracking.trim()) { alert('운송장 번호를 입력해주세요.'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courierCode: courier, trackingNumber: tracking }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
        🚚 배송 처리
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400">
        {COURIERS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
      <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="운송장 번호 입력" className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="flex-1 border-2 border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50">취소</button>
        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
          {loading ? '처리중...' : '배송 완료'}
        </button>
      </div>
    </div>
  )
}
