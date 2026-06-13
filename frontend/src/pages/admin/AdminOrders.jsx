import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    adminService.getOrders(params)
      .then(({ data }) => { setOrders(data.orders); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch { /* silent */ }
  };

  if (loading && orders.length === 0) return <Loading text="Loading orders..." />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">Orders</h1>

      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Email</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Items</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Date</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Total</th>
                <th className="text-center px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-surface-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusKey = (order.orderStatus || 'pending').toLowerCase();
                  const badgeClass = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
                  const user = order.user || {};

                  return (
                    <tr key={order._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="px-4 py-3 font-mono text-xs text-surface-600 dark:text-surface-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{user.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{user.email || 'N/A'}</td>
                      <td className="px-4 py-3 text-surface-900 dark:text-surface-100">
                        {order.items?.length > 0 ? (
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-xs leading-tight">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-surface-400 ml-1">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-surface-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right text-surface-900 dark:text-white font-medium">
                        ₹{order.total?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={statusKey}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${badgeClass}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination?.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-ghost text-sm disabled:opacity-30">Previous</button>
          <span className="text-sm text-surface-500">Page {page} of {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="btn-ghost text-sm disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
