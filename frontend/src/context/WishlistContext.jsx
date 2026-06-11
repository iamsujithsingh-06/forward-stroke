import { createContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setProductIds([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await wishlistService.get();
      const ids = (data.products || []).map((p) => p._id || p);
      setProducts(data.products || []);
      setProductIds(ids);
    } catch {
      setProducts([]);
      setProductIds([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = useCallback(async (productId) => {
    try {
      const { data } = await wishlistService.add(productId);
      const ids = (data.products || []).map((p) => p._id || p);
      setProducts(data.products || []);
      setProductIds(ids);
    } catch (err) {
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (productId) => {
    try {
      const { data } = await wishlistService.remove(productId);
      const ids = (data.products || []).map((p) => p._id || p);
      setProducts(data.products || []);
      setProductIds(ids);
    } catch (err) {
      throw err;
    }
  }, []);

  const isInWishlist = useCallback(
    (productId) => productIds.includes(productId),
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{ products, productIds, loading, addItem, removeItem, isInWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
