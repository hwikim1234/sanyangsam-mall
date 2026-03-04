export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">삼</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">로그인</h1>
          <p className="text-gray-500 text-sm mt-1">지리산 산양삼</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">이메일</label>
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">비밀번호</label>
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2 text-sm">
          <Link href="/orders/track" className="text-gray-500 hover:text-gray-700 block">비회원 주문 조회</Link>
          <p className="text-gray-400">
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-brand-green font-medium hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
