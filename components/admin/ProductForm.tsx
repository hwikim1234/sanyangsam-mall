'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type InitialProduct = {
  id?: string
  name?: string
  slug?: string
  description?: string
  price?: number
  salePrice?: number | null
  stock?: number
  isActive?: boolean
  isFeatured?: boolean
  images?: Array<{ url: string; altText?: string | null }>
  options?: Array<{ name: string; priceAdj: number; stock: number }>
}

export default function ProductForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: InitialProduct }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    salePrice: initial?.salePrice ?? 0,
    stock: initial?.stock ?? 100,
    isActive: initial?.isActive ?? true,
    isFeatured: initial?.isFeatured ?? false,
    imagesText: (initial?.images ?? []).map((img) => img.url).join('\n'),
    optionsText: (initial?.options ?? [])
      .map((opt) => `${opt.name}|${opt.priceAdj}|${opt.stock}`)
      .join('\n'),
  })

  const previewOptions = useMemo(() => {
    return form.optionsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, priceAdj, stock] = line.split('|').map((s) => s.trim())
        return { name, priceAdj: Number(priceAdj || 0), stock: Number(stock || 0) }
      })
      .filter((o) => o.name)
  }, [form.optionsText])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const images = form.imagesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((url, idx) => ({ url, sortOrder: idx }))

    const options = previewOptions

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      salePrice: Number(form.salePrice) > 0 ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      images,
      options,
    }

    try {
      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${initial?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.')

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      alert(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold">기본 정보</h2>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">상품명 *</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Slug *</label>
          <input className="input-field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          <p className="text-xs text-gray-400 mt-1">예: sanyangsam-5-6nyeon-10ppuri</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">설명</label>
          <textarea className="input-field min-h-[160px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold">가격/재고</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">정가 *</label>
            <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">판매가</label>
            <input type="number" className="input-field" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} min={0} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">재고 *</label>
            <input type="number" className="input-field" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} min={0} required />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> 판매 활성화</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> 추천 상품</label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold">이미지/옵션</h2>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">이미지 URL 목록 (줄바꿈)</label>
          <textarea
            className="input-field min-h-[130px]"
            value={form.imagesText}
            onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
            placeholder={'/images/products/product-hero.jpg\n/images/products/product-roots-1.jpg'}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">옵션 목록 (한 줄당 `이름|가격추가|재고`)</label>
          <textarea
            className="input-field min-h-[130px]"
            value={form.optionsText}
            onChange={(e) => setForm({ ...form, optionsText: e.target.value })}
            placeholder={'10뿌리|0|50\n15뿌리|24800|30\n20뿌리|49800|20'}
          />
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            {previewOptions.map((o, idx) => (
              <p key={`${o.name}-${idx}`}>- {o.name}: +{o.priceAdj.toLocaleString()}원 / 재고 {o.stock}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="px-4 py-2 border rounded-lg" onClick={() => router.push('/admin/products')}>취소</button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-lg font-semibold disabled:opacity-50">
          {loading ? '저장중...' : mode === 'create' ? '상품 등록' : '상품 수정'}
        </button>
      </div>
    </form>
  )
}
