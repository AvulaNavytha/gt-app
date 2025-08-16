import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserState {
  name: string;
  phone: string;
  seatNumber: string;
  screen: string;
  isLoggedIn: boolean;
  cart: CartItem[];
  setUser: (name: string, phone: string, seatNumber: string, screen: string) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      seatNumber: '',
      screen: '',
      isLoggedIn: false,
      cart: [],
      setUser: (name, phone, seatNumber, screen) => set({ 
        name, 
        phone, 
        seatNumber,
        screen,
        isLoggedIn: true 
      }),
      logout: () => set({ 
        name: '', 
        phone: '', 
        seatNumber: '',
        screen: '',
        isLoggedIn: false,
        cart: [] 
      }),
      addToCart: (item) => set((state) => ({
        cart: [...state.cart, item]
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'movie-food-store'
    }
  )
);