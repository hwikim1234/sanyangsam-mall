export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', passwordConfirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/login?registered=1')
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-black text-center text-gray-800 mb-8">회원가입</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          {[
            { key: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
            { key: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
            { key: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
            { key: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상' },
            { key: 'passwordConfirm', label: '비밀번호 확인', type: 'password', placeholder: '' },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
              <input className="input-field" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? '가입 중...' : '회원가입'}</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">
          이미 계정이 있으신가요? <Link href="/login" className="text-brand-green font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
