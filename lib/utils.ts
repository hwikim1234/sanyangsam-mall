import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING_PAYMENT: '입금 대기',
    PAYMENT_CONFIRMED: '결제 완료',
    PREPARING: '상품 준비중',
    SHIPPED: '배송중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소',
    REFUND_REQUESTED: '환불 요청',
    REFUNDED: '환불 완료',
  }
  return labels[status] || status
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAYMENT_CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUND_REQUESTED: 'bg-orange-100 text-orange-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const COURIER_LIST = [
  { code: 'CJ', name: 'CJ대한통운' },
  { code: 'LOGEN', name: '로젠택배' },
  { code: 'HANJIN', name: '한진택배' },
  { code: 'LOTTE', name: '롯데택배' },
  { code: 'POST', name: '우체국택배' },
  { code: 'EPOST', name: '등기우편' },
]
