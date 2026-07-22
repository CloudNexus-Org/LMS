import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,

      login: (userData, token, refreshToken = null) => set({
        user: userData,
        isAuthenticated: true,
        token,
        refreshToken,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'realm-auth',
    }
  )
);

export default useAuthStore;
