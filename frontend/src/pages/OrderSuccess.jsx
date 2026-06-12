import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-lg mx-auto">
        <div className="card p-8 md:p-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="section-heading">Order Placed Successfully!</h1>
            <p className="section-subheading">
              Thank you for supporting Forward Stroke. Your order has been successfully placed and is being processed.
            </p>
          </div>

          <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
            We appreciate your support. Keep purchasing from Forward Stroke and enjoy your cricket journey with us.
          </p>

          <hr className="border-surface-200 dark:border-surface-700" />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="btn-primary px-8 py-3 text-center">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn-ghost px-8 py-3 text-center border border-surface-300 dark:border-surface-600 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
