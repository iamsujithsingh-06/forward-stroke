import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Loading from '../components/Loading';

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();

  if (loading) return <Loading fullPage text="Loading cart..." />;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading">Shopping Cart</h1>
          <p className="section-subheading">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="btn-ghost text-sm text-red-500 hover:text-red-600">
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Add some products to get started.</p>
          <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const imgSrc = product.images?.[0] || 'https://placehold.co/100x100/1e293b/475569?text=P';
              const itemTotal = product.price * item.quantity;

              return (
                <div key={item._id} className="card p-4 flex gap-4">
                  <Link to={`/products/${product.slug}`} className="w-20 h-20 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-900 shrink-0">
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 capitalize">
                      {product.category?.replace(/-/g, ' ')}
                    </p>
                    <p className="text-sm font-bold text-surface-900 dark:text-white mt-1">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-surface-300 dark:border-surface-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium text-surface-900 dark:text-white border-x border-surface-300 dark:border-surface-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-surface-900 dark:text-white">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1.5 text-surface-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Shipping</span>
                  <span className="font-medium text-surface-900 dark:text-white">Calculated at checkout</span>
                </div>
              </div>

              <hr className="border-surface-200 dark:border-surface-700" />

              <div className="flex justify-between text-base">
                <span className="font-semibold text-surface-900 dark:text-white">Estimated Total</span>
                <span className="font-bold text-lg text-surface-900 dark:text-white">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <button
  className="btn-primary w-full py-3 text-base"
  onClick={() => {
    alert(
      "🎉 Your order has been successfully placed with Forward Stroke!\n\nThank you for your support ❤️\nKeep purchasing from our site and enjoy your cricket journey with us! 🏏"
    );
    clearCart();
  }}
>
  Place Order
</button>

              <Link to="/products" className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
