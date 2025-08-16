import create from 'zustand';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  loading: false,
  error: null,

  adminLogin: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ isAdmin: true, loading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', loading: false });
    }
  },

  adminLogout: async () => {
    try {
      await signOut(auth);
      set({ isAdmin: false });
    } catch (error) {
      set({ error: 'Failed to logout' });
    }
  }
}));