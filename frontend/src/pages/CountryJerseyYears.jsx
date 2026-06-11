import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { COUNTRIES, JERSEY_CATEGORIES, JERSEY_YEARS, CATEGORY_TYPE_MAP, INTERNATIONAL_ACCESSORY_PRODUCTS, ACCESSORY_TYPES } from '../data/countries';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import CountryFlag from '../components/CountryFlag';
import Loading from '../components/Loading';

const PLACEHOLDER_IMG = 'https://placehold.co/400x500/1e293b/475569?text=Product';

export default function CountryJerseyYears() {
  const { country: countrySlug, category: categorySlug } = useParams();
  const country = COUNTRIES.find((c) => c.id === countrySlug);
  const category = JERSEY_CATEGORIES.find((c) => c.id === categorySlug);

  if (!country || !category) {
    return <Navigate to="/international" replace />;
  }

  const isAccessories = categorySlug === 'accessories';

  const [productsByYear, setProductsByYear] = useState({});
  const [loading, setLoading] = useState(!isAccessories);

  const years = JERSEY_YEARS[categorySlug] || [];
  const jerseyType = CATEGORY_TYPE_MAP[categorySlug] || '';

  useEffect(() => {
    if (isAccessories) return;
    setLoading(true);
    productService
      .getAll({ country: country.name, category: 'international-jersey', limit: 50 })
      .then(({ data }) => {
        const grouped = {};
        for (const year of years) {
          grouped[year] = (data.products || []).filter((p) => {
            const nameIncludesYear = p.name.includes(` ${year}`);
            const hasYearTag = p.tags?.includes(year);
            return nameIncludesYear || hasYearTag;
          });
        }
        setProductsByYear(grouped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [country.name, categorySlug, years, isAccessories]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        to={`/international/${country.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {country.name}
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <CountryFlag code={country.code} flagUrl={country.flagUrl} size={52} />
        <div>
          <h1 className="section-heading">{country.name} {category.label}</h1>
          {!isAccessories && <p className="section-subheading">{jerseyType}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-10">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: country.color }} />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
          {isAccessories ? `${ACCESSORY_TYPES.length} Types` : `${years.length} Editions`}
        </span>
      </div>

      {loading ? (
        <Loading text="Loading products..." />
      ) : isAccessories ? (
        <div className="space-y-12">
          {ACCESSORY_TYPES.map((type) => {
            const items = INTERNATIONAL_ACCESSORY_PRODUCTS.filter((p) => p.type === type.id);
            return (
              <div key={type.id}>
                <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span>{type.label}</span>
                </h2>
                {items.length === 0 ? (
                  <p className="text-sm text-surface-500 dark:text-surface-400 py-4">
                    No products available.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {items.map((item, i) => (
                      <ProductCard
                        key={i}
                        product={{
                          _id: `accessory-${country.id}-${type.id}-${i}`,
                          name: `${country.name} ${item.name}`,
                          price: item.price,
                          images: [item.image],
                          image: item.image,
                          country: country.name,
                          category: 'cricket-accessories',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-12">
          {years.map((year) => {
            const products = productsByYear[year] || [];
            return (
              <div key={year}>
                <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                    {year}
                  </span>
                  <span>{year} Edition</span>
                </h2>
                {products.length === 0 ? (
                  <p className="text-sm text-surface-500 dark:text-surface-400 py-4">
                    No products available for this edition.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
