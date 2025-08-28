import { create } from 'zustand';
import type { User as AppUser } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    onAuthStateChange((user) => {
      set({ user, loading: false });
    });
  },
}));