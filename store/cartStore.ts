import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  productName: string
  optionId?: string
  optionName?: string
  unitPrice: number
  quantity: number
  imageUrl?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, optionId?: string) => void
  updateQuantity: (productId: string, optionId: string | undefined, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId && i.optionId === newItem.optionId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId && i.optionId === newItem.optionId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId, optionId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.optionId === optionId)
          ),
        }))
      },

      updateQuantity: (productId, optionId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, optionId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.optionId === optionId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'sanyangsam-cart',
    }
  )
)
