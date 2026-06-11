import { Link } from 'react-router-dom';
import CountryFlag from './CountryFlag';

export default function CountryCard({ country }) {
  return (
    <div className="card-hover overflow-hidden group">
      <div
        className="h-2"
        style={{ backgroundColor: country.color }}
      />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <CountryFlag code={country.code} flagUrl={country.flagUrl} size={40} />
          <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
            {country.name}
          </h3>
        </div>
        <Link
          to={`/international/${country.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/btn"
        >
          View Products
          <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
