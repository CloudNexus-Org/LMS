import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toCourseSummary } from '@/data/courses';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (course) => {
        const summary = toCourseSummary(course);
        set((state) => {
          if (state.items.some((item) => item.id === summary.id)) return state;
          return { items: [...state.items, summary] };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      isInCart: (id) => get().items.some((item) => item.id === id),

      total: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    { name: 'cloud-nexus-cart' }
  )
);

export default useCartStore;
