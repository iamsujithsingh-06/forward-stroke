import { useState } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export default function WishlistButton({ productId, className = '' }) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const inWishlist = isInWishlist(productId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (toggling) return;
    setToggling(true);
    try {
      if (inWishlist) {
        await removeItem(productId);
        showToast('Removed from wishlist');
      } else {
        await addItem(productId);
        showToast('Added to wishlist!');
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setToggling(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggling}
      className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
        inWishlist
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          : 'bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500'
      } ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
