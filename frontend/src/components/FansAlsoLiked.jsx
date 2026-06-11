import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Loading from './Loading';

export default function FansAlsoLiked() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services/recommendationService').then(({ recommendationService }) => {
      recommendationService
        .getFansAlsoLiked()
        .then(({ data }) => setProducts(data.products || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <Loading text="Loading fan favorites..." />;
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
          Most Loved Jerseys
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
