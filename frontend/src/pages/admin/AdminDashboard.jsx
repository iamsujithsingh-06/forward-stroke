import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'bg-green-500' },
    { label: 'Total Wishlists', value: stats?.totalWishlists || 0, color: 'bg-red-500' },
    { label: 'Active Carts', value: stats?.totalCarts || 0, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{card.value}</span>
            </div>
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
