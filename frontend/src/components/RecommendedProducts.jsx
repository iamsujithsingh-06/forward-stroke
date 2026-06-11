import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProductCard from './ProductCard';
import Loading from './Loading';

export default function RecommendedProducts() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    import('../services/recommendationService').then(({ recommendationService }) => {
      recommendationService
        .getPersonalized()
        .then(({ data }) => setProducts(data.products || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  if (loading) return <Loading text="Personalizing recommendations..." />;
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
          Recommended For You
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
