import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(({ data }) => setAnalytics(data.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading analytics..." />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-sm font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-3">Most Wishlisted Products</h2>
          {analytics?.mostWishlisted?.length > 0 ? (
            <div className="space-y-2">
              {analytics.mostWishlisted.map((p, i) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400">
                  <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400">No data yet.</p>
          )}
        </div>

        <div className="card p-4">
          <h2 className="text-sm font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-3">Most Added To Cart</h2>
          {analytics?.mostCarted?.length > 0 ? (
            <div className="space-y-2">
              {analytics.mostCarted.map((p, i) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400">
                  <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400">No data yet.</p>
          )}
        </div>

        <div className="card p-4">
          <h2 className="text-sm font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-3">Trending Teams</h2>
          {analytics?.trendingTeams?.length > 0 ? (
            <div className="space-y-2">
              {analytics.trendingTeams.map((t, i) => (
                <div key={t._id} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                  <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                  <span>{t._id}</span>
                  <span className="text-xs text-surface-400 ml-auto">{t.count} products</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
