export default function ProductFilters({ filters, activeFilters, onChange }) {
  const { search, category, team, country, sort, order } = activeFilters;

  const handleChange = (key, value) => {
    onChange({ ...activeFilters, [key]: value, page: 1 });
  };

  return (
    <div className="card p-4 space-y-4">
      <div>
        <label htmlFor="search" className="block text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            {filters?.categories?.map((c) => (
              <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
            Team
          </label>
          <select
            value={team || ''}
            onChange={(e) => handleChange('team', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            {filters?.teams?.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
            Country
          </label>
          <select
            value={country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            {filters?.countries?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
            Sort By
          </label>
          <select
            value={`${sort || 'createdAt'}-${order || 'desc'}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              onChange({ ...activeFilters, sort: s, order: o, page: 1 });
            }}
            className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
