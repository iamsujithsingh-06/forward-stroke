import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

const EMPTY_PRODUCT = { name: '', slug: '', description: '', price: '', category: 'international-jersey', team: '', country: '', images: '', stock: '', rating: '4.5', featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const fetchProducts = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    adminService.getProducts(params)
      .then(({ data }) => { setProducts(data.products); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };

  const openCreate = () => { setEditing('new'); setForm(EMPTY_PRODUCT); };
  const openEdit = (p) => { setEditing(p._id); setForm({ ...p, images: p.images?.[0] || '', price: String(p.price), stock: String(p.stock), rating: String(p.rating) }); };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating), images: form.images ? [form.images] : [] };
    try {
      if (editing === 'new') await adminService.createProduct(data);
      else await adminService.updateProduct(editing, data);
      setEditing(null);
      fetchProducts();
    } catch { /* silent */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    await adminService.deleteProduct(id);
    fetchProducts();
  };

  const handleToggle = async (id) => {
    await adminService.toggleFeatured(id);
    fetchProducts();
  };

  if (loading && products.length === 0) return <Loading text="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">Products</h1>
        <button onClick={openCreate} className="btn-primary text-sm">Add Product</button>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <button type="submit" className="btn-ghost text-sm">Search</button>
      </form>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg bg-white dark:bg-surface-800 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white">{editing === 'new' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setEditing(null)} className="text-surface-400 hover:text-surface-600">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} min="0" className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="international-jersey">International Jersey</option>
                    <option value="ipl-jersey">IPL Jersey</option>
                    <option value="ipl-training-kit">IPL Training Kit</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Rating</label>
                  <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} min="0" max="5" step="0.1" className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Team</label>
                  <input type="text" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="e.g. Chennai Super Kings" className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Country</label>
                  <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. India" className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Image URL</label>
                  <input type="url" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} id="featured" className="rounded" />
                  <label htmlFor="featured" className="text-sm text-surface-700 dark:text-surface-300">Featured Product</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">{editing === 'new' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Name</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Category</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Team/Country</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Price</th>
                <th className="text-center px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{p.name}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400 capitalize">{p.category?.replace(/-/g, ' ')}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{p.team || p.country || '-'}</td>
                  <td className="px-4 py-3 text-right text-surface-900 dark:text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggle(p._id)} className={`px-2 py-0.5 rounded text-xs font-medium ${p.featured ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400' : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'}`}>
                      {p.featured ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-primary-600 hover:text-primary-700 text-xs font-medium mr-3">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Delete</button>
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
