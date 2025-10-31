import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  color?: string;  // Seçilen renk
  size?: string;  // Seçilen beden (XS, S, M, L, XL, XXL)
  shoeSize?: string;  // Seçilen ayakkabı numarası
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number; color?: string; size?: string; shoeSize?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number; color?: string; size?: string; shoeSize?: string } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Aynı ürün, aynı renk, aynı beden/numara kombinasyonunu bul
      const existingItem = state.items.find(item => 
        item.id === action.payload.id &&
        item.color === action.payload.color &&
        item.size === action.payload.size &&
        item.shoeSize === action.payload.shoeSize
      );
      
      let newItems;
      if (existingItem) {
        // Aynı kombinasyon varsa miktarı artır
        newItems = state.items.map(item =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size &&
          item.shoeSize === action.payload.shoeSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Farklı kombinasyon ise yeni satır ekle
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      // Aynı ürün, renk, beden/numara kombinasyonunu kaldır
      const newItems = state.items.filter(item => 
        !(item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size &&
          item.shoeSize === action.payload.shoeSize)
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      // Aynı ürün, renk, beden/numara kombinasyonunun miktarını güncelle
      const newItems = state.items.map(item =>
        item.id === action.payload.id &&
        item.color === action.payload.color &&
        item.size === action.payload.size &&
        item.shoeSize === action.payload.shoeSize
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, color?: string, size?: string, shoeSize?: string) => void;
  updateQuantity: (id: number, quantity: number, color?: string, size?: string, shoeSize?: string) => void;
  clearCart: () => void;
} | undefined>(undefined);

const CART_STORAGE_KEY = 'egemoutdoor_cart';

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }
  return { items: [], total: 0, itemCount: 0 };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number, color?: string, size?: string, shoeSize?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, color, size, shoeSize } });
  };

  const updateQuantity = (id: number, quantity: number, color?: string, size?: string, shoeSize?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, color, size, shoeSize } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};