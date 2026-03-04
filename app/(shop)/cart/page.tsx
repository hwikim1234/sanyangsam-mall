'use client'

import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Trash2, ShoppingBag } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 50000
const SHIPPING_FEE = 3000

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-600 mb-2">장바구니가 비었습니다</h2>
        <p className="text-gray-400 mb-8">좋은 상품을 담아보세요!</p>
        <Link href="/products/sanyangsam-5-6nyeon-10ppuri" className="btn-primary">
          상품 보러가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6">장바구니</h1>

      {/* 상품 목록 */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.optionId}`} className="card p-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{item.productName}</p>
              {item.optionName && (
                <p className="text-sm text-gray-500">{item.optionName}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.productId, item.optionId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.optionId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-brand-green">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.optionId)}
              className="text-gray-400 hover:text-red-500 transition-colors self-start"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 가격 요약 */}
      <div className="card p-6 mb-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">상품 금액</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">배송비</span>
            <span className={shippingFee === 0 ? 'text-brand-green font-medium' : ''}>
              {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
            </span>
          </div>
          {shippingFee > 0 && (
            <p className="text-xs text-gray-400">
              {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} 더 담으면 무료배송!
            </p>
          )}
          <div className="border-t pt-3 flex justify-between font-black text-lg">
            <span>총 결제 금액</span>
            <span className="text-brand-green">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary w-full block text-center text-lg">
        주문하기 ({formatPrice(total)})
      </Link>
    </div>
  )
}
