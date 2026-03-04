'use client'

import { useState } from 'react'

export default function InquiryPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '문의 등록 실패')

      setDone(true)
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.message || '문의 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-2">고객 문의</h1>
      <p className="text-gray-500 mb-6">문의사항을 남겨주시면 확인 후 답변드립니다.</p>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">이름</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">연락처</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">이메일</label>
          <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">제목</label>
          <input className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">문의 내용</label>
          <textarea className="input-field min-h-[140px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {done && <p className="text-sm text-green-600">문의가 접수되었습니다. 빠르게 답변드리겠습니다.</p>}

        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? '등록중...' : '문의 등록'}
        </button>
      </form>
    </div>
  )
}
