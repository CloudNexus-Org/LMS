import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toCourseSummary } from '@/lib/courseSummary';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (course) => {
        const summary = toCourseSummary(course);
        const exists = get().items.some((item) => item.id === summary.id);
        set((state) => ({
          items: exists
            ? state.items.filter((item) => item.id !== summary.id)
            : [...state.items, summary],
        }));
        return !exists;
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      isInWishlist: (id) => get().items.some((item) => item.id === id),
    }),
    { name: 'realm-wishlist' }
  )
);

export default useWishlistStore;
