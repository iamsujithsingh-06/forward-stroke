import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export default function CartButton({ productId, disabled = false, className = '' }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (disabled) return;
    setAdding(true);
    try {
      await addItem(productId, 1);
      showToast('Added to cart!');
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || adding}
      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        disabled
          ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
          : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
      } ${className}`}
    >
      {adding ? 'Adding...' : disabled ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
