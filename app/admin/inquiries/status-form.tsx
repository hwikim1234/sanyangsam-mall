'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InquiryStatusForm({ inquiryId, currentStatus, currentAnswer }: { inquiryId: string; currentStatus: string; currentAnswer: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [answer, setAnswer] = useState(currentAnswer)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, answer }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장 실패')
      router.refresh()
    } catch (err: any) {
      alert(err.message || '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="RECEIVED">접수</option>
          <option value="IN_PROGRESS">처리중</option>
          <option value="ANSWERED">답변완료</option>
        </select>
      </div>
      <textarea className="input-field min-h-[90px]" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답변 내용을 입력하세요." />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-[#2d6a4f] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
        {loading ? '저장중...' : '답변 저장'}
      </button>
    </form>
  )
}
