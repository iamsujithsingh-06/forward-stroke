import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Error from './Error';

export default function RelatedProducts({ productId }) {
  const [related, setRelated] = useState({ similarTeam: [], similarCountry: [], similarCategory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError('');
    import('../services/recommendationService').then(({ recommendationService }) => {
      recommendationService
        .getRelated(productId)
        .then(({ data }) => setRelated(data.related))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [productId]);

  if (loading) return null;
  if (error) return <Error message={error} />;

  const hasAny = related.similarTeam?.length > 0 || related.similarCountry?.length > 0 || related.similarCategory?.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-16 space-y-10">
      {related.similarTeam?.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">
            Similar Team Jerseys
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.similarTeam.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {related.similarCountry?.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">
            Similar Country Jerseys
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.similarCountry.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {related.similarCategory?.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">
            Similar Category Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.similarCategory.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
