import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'International', path: '/international' },
  { label: 'IPL', path: '/ipl' },
  { label: 'Products', path: '/products' },
  { label: 'Collections', path: '/collections' },
  { label: 'Trending', path: '/trending' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { productIds: wishlistIds } = useWishlist();
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
        : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
    }`;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                Forward Stroke
              </span>
            </Link>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="px-3 py-1.5 rounded-lg text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                Admin Panel
              </NavLink>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            {user?.role !== 'admin' && (
              <div className="flex items-center gap-1">
                <NavLink to="/wishlist" className="relative p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold bg-red-500 text-white min-w-[18px] min-h-[18px]">
                      {wishlistIds.length}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/cart" className="relative p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold bg-primary-600 text-white min-w-[18px] min-h-[18px]">
                      {itemCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
            <div className="ml-3 pl-3 border-l border-surface-300 dark:border-surface-600 flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user?.role !== 'admin' && (
                    <NavLink to="/orders" className={linkClass}>
                      My Orders
                    </NavLink>
                  )}
                  <NavLink to="/profile" className={linkClass}>
                    {user?.name || 'Profile'}
                  </NavLink>
                  <button onClick={handleLogout} className="btn-ghost text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-primary text-sm">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <hr className="my-2 border-surface-200 dark:border-surface-700" />
            {user?.role !== 'admin' && (
              <>
                <NavLink to="/wishlist" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Wishlist {wishlistIds.length > 0 && `(${wishlistIds.length})`}
                </NavLink>
                <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Cart {itemCount > 0 && `(${itemCount})`}
                </NavLink>
              </>
            )}
            <hr className="my-2 border-surface-200 dark:border-surface-700" />
            {isAuthenticated ? (
                <>
                  {user?.role !== 'admin' && (
                  <NavLink to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
                    My Orders
                  </NavLink>
                )}
                <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
                  {user?.name || 'Profile'}
                </NavLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-center btn-primary" onClick={() => setMenuOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
