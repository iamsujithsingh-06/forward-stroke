import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function Wishlist() {
  const { products, loading, removeItem } = useWishlist();

  if (loading) return <Loading fullPage text="Loading wishlist..." />;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="section-heading">My Wishlist</h1>
        <p className="section-subheading">{products.length} saved item{products.length !== 1 ? 's' : ''}</p>
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Save products you love to your wishlist and find them here.</p>
          <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => removeItem(product._id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-surface-800/80 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from wishlist"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
