'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Zap } from 'lucide-react'

interface Props {
  product: {
    id: string
    name: string
    price: number
    salePrice: number | null
    images: { url: string }[]
    options: { id: string; name: string; priceAdj: number; stock: number }[]
  }
}

export default function AddToCartSection({ product }: Props) {
  const router = useRouter()
  const { addItem } = useCartStore()
  const [selectedOption, setSelectedOption] = useState(product.options[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const basePrice = product.salePrice ?? product.price
  const optionAdj = selectedOption?.priceAdj ?? 0
  const unitPrice = basePrice + optionAdj
  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      optionId: selectedOption?.id,
      optionName: selectedOption?.name,
      unitPrice,
      quantity,
      imageUrl: product.images[0]?.url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      optionId: selectedOption?.id,
      optionName: selectedOption?.name,
      unitPrice,
      quantity,
      imageUrl: product.images[0]?.url,
    })
    router.push('/checkout')
  }

  return (
    <div>
      {/* 옵션 선택 */}
      {product.options.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">수량 선택</label>
          <div className="space-y-2">
            {product.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option)}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-colors ${
                  selectedOption?.id === option.id
                    ? 'border-brand-green bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{option.name}</span>
                {option.priceAdj > 0 && (
                  <span className="text-brand-green font-bold">+{formatPrice(option.priceAdj)}</span>
                )}
                {option.priceAdj === 0 && (
                  <span className="text-gray-500 text-sm">{formatPrice(basePrice)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 수량 조절 */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700">개수</label>
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-brand-green font-black text-xl ml-auto">{formatPrice(totalPrice)}</span>
      </div>

      {/* 구매 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-colors ${
            added
              ? 'border-brand-green bg-brand-green text-white'
              : 'border-brand-green text-brand-green hover:bg-green-50'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {added ? '담겼습니다!' : '장바구니'}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-green text-white font-bold hover:bg-green-800 transition-colors"
        >
          <Zap className="w-5 h-5" />
          바로 구매
        </button>
      </div>
    </div>
  )
}
