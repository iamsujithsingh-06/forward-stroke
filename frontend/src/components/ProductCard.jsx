import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import WishlistButton from './WishlistButton';
import CartButton from './CartButton';

const FALLBACK_IMG = 'https://placehold.co/400x500/1e293b/475569?text=Product';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? FALLBACK_IMG : (product.images?.[0] || FALLBACK_IMG);
  const inStock = true;

  return (
    <div className="card-hover overflow-hidden group flex flex-col">
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden aspect-[4/5] bg-surface-100 dark:bg-surface-900">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-accent-500 text-white">
            Featured
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-surface-900/60 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-surface-900 px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
          {product.category?.replace(/-/g, ' ')}
        </p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-surface-300 dark:text-surface-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-surface-400 ml-1">({product.rating})</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.comparePrice > product.price && (
              <span className="ml-2 text-xs text-surface-400 line-through">
                ₹{product.comparePrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className="mt-3 flex items-center gap-2">
            <CartButton productId={product._id} disabled={!inStock} />
            <WishlistButton productId={product._id} />
          </div>
        )}
      </div>
    </div>
  );
}
