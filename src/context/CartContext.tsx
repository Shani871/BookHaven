import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Book, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Book }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  syncCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.book.id === action.payload.id);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.items.map(item => 
          item.book.id === action.payload.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { book: action.payload, quantity: 1 }];
      }
      
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.book.id !== action.payload);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => 
        item.book.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
      
    case 'LOAD_CART': {
      const items = action.payload;
      return {
        items,
        total: items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });
  const { user } = useAuth();

  // Load cart from localStorage or Supabase
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  // Sync cart to database when items change (for authenticated users)
  useEffect(() => {
    if (user && state.items.length >= 0) {
      syncCartToDatabase();
    } else if (!user) {
      localStorage.setItem('bookstore-cart', JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('bookstore-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  };

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert database cart items to our cart format
      const cartItems: CartItem[] = data.map(item => ({
        book: {
          id: item.book_id,
          // We'll need to fetch book details from our books data
          // For now, we'll try to find it in our static data
          ...getBookById(item.book_id)
        } as Book,
        quantity: item.quantity
      })).filter(item => item.book.title); // Filter out items where book wasn't found

      dispatch({ type: 'LOAD_CART', payload: cartItems });
    } catch (error) {
      console.error('Failed to load cart from database:', error);
      // Fallback to localStorage
      loadCartFromLocalStorage();
    }
  };

  const syncCartToDatabase = async () => {
    if (!user) return;

    try {
      // Clear existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Insert current cart items
      if (state.items.length > 0) {
        const cartData = state.items.map(item => ({
          user_id: user.id,
          book_id: item.book.id,
          quantity: item.quantity
        }));

        await supabase
          .from('cart_items')
          .insert(cartData);
      }
    } catch (error) {
      console.error('Failed to sync cart to database:', error);
    }
  };

  const getBookById = (id: string) => {
    // Import books data dynamically to avoid circular dependency
    const { books } = require('../data/books');
    return books.find((book: Book) => book.id === id) || {};
  };

  const addToCart = (book: Book) => {
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const removeFromCart = (bookId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: bookId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const syncCart = () => {
    if (user) {
      syncCartToDatabase();
    }
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}