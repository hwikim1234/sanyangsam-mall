'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmPaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!confirm('입금을 확인하셨나요? 결제 완료 처리됩니다.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('처리 실패')
      router.refresh()
    } catch (err) {
      alert('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50"
    >
      {loading ? '처리중...' : '✅ 입금 확인 완료'}
    </button>
  )
}
