import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: '',
    team: '',
    country: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productService
      .getFilters()
      .then(({ data }) => setFilters(data.filters))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.team) params.team = activeFilters.team;
      if (activeFilters.country) params.country = activeFilters.country;
      params.sort = activeFilters.sort;
      params.order = activeFilters.order;
      params.page = activeFilters.page;
      params.limit = activeFilters.limit;

      const { data } = await productService.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = pagination?.pages || 1;
  const currentPage = pagination?.page || 1;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="section-heading">All Products</h1>
        <p className="section-subheading">Browse our complete cricket merchandise collection</p>
      </div>

      <ProductFilters
        filters={filters}
        activeFilters={activeFilters}
        onChange={setActiveFilters}
      />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {pagination ? `${pagination.total} product${pagination.total !== 1 ? 's' : ''} found` : ''}
        </p>
        {(activeFilters.search || activeFilters.category || activeFilters.team || activeFilters.country) && (
          <button
            onClick={() =>
              setActiveFilters({
                search: '',
                category: '',
                team: '',
                country: '',
                sort: 'createdAt',
                order: 'desc',
                page: 1,
                limit: 12,
              })
            }
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && <Error message={error} onRetry={fetchProducts} />}

      {loading ? (
        <Loading text="Loading products..." />
      ) : !error && products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-surface-500 dark:text-surface-400">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setActiveFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={currentPage <= 1}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveFilters((prev) => ({ ...prev, page: p }))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setActiveFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={currentPage >= totalPages}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
