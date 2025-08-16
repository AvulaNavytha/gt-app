import create from 'zustand';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  enabled: boolean;
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchMenuItems: () => Promise<void>;
  startRealTimeUpdates: () => () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  loading: true, // Start with loading true
  error: null,
  initialized: false,

  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      set({ items, loading: false, initialized: true });
    } catch (error) {
      set({ error: 'Failed to fetch menu items', loading: false });
    }
  },

  startRealTimeUpdates: () => {
    set({ loading: true }); // Set loading true when starting real-time updates
    
    const unsubscribe = onSnapshot(
      collection(db, 'menuItems'),
      (snapshot) => {
        const items: MenuItem[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        set({ items, loading: false, initialized: true });
      },
      (error) => {
        set({ error: 'Failed to sync menu items', loading: false });
      }
    );
    return unsubscribe;
  },
}));