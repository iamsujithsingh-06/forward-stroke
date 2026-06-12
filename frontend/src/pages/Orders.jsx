import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function truncateId(id) {
  return id.slice(-8).toUpperCase();
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await orderService.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading fullPage text="Loading orders..." />;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="section-heading">My Orders</h1>
        <p className="section-subheading">
          {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} placed` : 'Track your cricket gear purchases'}
        </p>
      </div>

      {error && (
        <div className="card p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">Retry</button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Start your cricket shopping journey today!</p>
          <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = (order.orderStatus || 'pending').toLowerCase();
            const badgeClass = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
            const itemCount = order.items?.length || 0;

            return (
              <div key={order._id} className="card p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-surface-500 dark:text-surface-400 font-mono">
                      #{truncateId(order._id)}
                    </p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`inline-flex self-start sm:self-center items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${badgeClass}`}>
                    {statusKey}
                  </span>
                </div>

                <hr className="my-4 border-surface-200 dark:border-surface-700" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {itemCount} product{itemCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white">
                    ₹{order.total?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pt-4 text-center">
            <Link to="/products" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 border border-surface-300 dark:border-surface-600 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
