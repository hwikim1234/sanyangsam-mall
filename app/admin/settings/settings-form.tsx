'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    BANK_NAME: initial.BANK_NAME || '',
    BANK_ACCOUNT: initial.BANK_ACCOUNT || '',
    BANK_HOLDER: initial.BANK_HOLDER || '',
    SHIPPING_FEE: initial.SHIPPING_FEE || '3000',
    FREE_SHIPPING_THRESHOLD: initial.FREE_SHIPPING_THRESHOLD || '50000',
    DEPOSIT_DEADLINE_HOURS: initial.DEPOSIT_DEADLINE_HOURS || '24',
  })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장 실패')
      router.refresh()
      alert('설정이 저장되었습니다.')
    } catch (err: any) {
      alert(err.message || '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-2xl">
      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="text-sm font-medium text-gray-700 mb-1 block">{key}</label>
          <input
            className="input-field"
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-lg font-semibold disabled:opacity-50">
        {loading ? '저장중...' : '설정 저장'}
      </button>
    </form>
  )
}
