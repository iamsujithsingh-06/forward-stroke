import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO title="Home" description="Premium cricket merchandise for every fan. Shop international jerseys, IPL team gear, and more." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
            Welcome to <span className="text-primary-600 dark:text-primary-400">Forward Stroke</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
            Premium cricket merchandise for every fan. From international test jerseys to IPL team gear.
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold uppercase tracking-wider bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/20 transition-all"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link
            to="/international"
            className="card-hover overflow-hidden group rounded-2xl"
          >
            <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">ICC</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
                Explore International Jerseys
              </h3>
              <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                Browse official jerseys from top cricket nations
              </p>
            </div>
          </Link>

          <Link
            to="/ipl"
            className="card-hover overflow-hidden group rounded-2xl"
          >
            <div className="h-48 bg-gradient-to-br from-accent-600 to-accent-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">IPL</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
                Explore IPL Team Jerseys
              </h3>
              <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                Gear up with your favourite franchise colours
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
