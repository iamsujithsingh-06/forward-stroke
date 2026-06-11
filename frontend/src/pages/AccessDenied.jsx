import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-3">Access Denied</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">You don't have permission to access this area. Admin privileges are required.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-ghost">Browse Products</Link>
        </div>
      </div>
    </section>
  );
}
