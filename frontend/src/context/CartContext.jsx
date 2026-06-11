import { createContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartService.get();
      setItems(data.cart?.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      const { data } = await cartService.add(productId, quantity);
      setItems(data.cart?.items || []);
    } catch (err) {
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const { data } = await cartService.remove(itemId);
      setItems(data.cart?.items || []);
    } catch (err) {
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const { data } = await cartService.updateQuantity(itemId, quantity);
      setItems(data.cart?.items || []);
    } catch (err) {
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clear();
      setItems([]);
    } catch {
      setItems([]);
    }
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addItem, removeItem, updateQuantity, clearCart, fetchCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
