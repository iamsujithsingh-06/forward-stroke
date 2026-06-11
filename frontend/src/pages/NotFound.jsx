import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-7xl font-display font-bold text-primary-600 dark:text-primary-400">
        404
      </h1>
      <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
        Page not found.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-block">
        Back to Home
      </Link>
    </section>
  );
}
