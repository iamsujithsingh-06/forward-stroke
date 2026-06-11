import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    adminService.getUsers(params)
      .then(({ data }) => { setUsers(data.users); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.changeUserRole(userId, newRole);
      fetchUsers();
    } catch { /* silent */ }
  };

  if (loading && users.length === 0) return <Loading text="Loading users..." />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6">Users</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <button type="submit" className="btn-ghost text-sm">Search</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Name</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Email</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Role</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
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
