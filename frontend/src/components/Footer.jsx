export default function Footer() {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400 border-t border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 19h20l-2-10H4L2 19zm9-8h2v2h-2v-2zm0 4h2v2h-2v-2zM5.5 7l1.5-4h10l1.5 4H5.5z" />
            </svg>
            <span className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Forward Stroke
            </span>
          </div>

          <p className="text-xs text-surface-500">
            &copy; 2026 Forward Stroke. All rights reserved.
          </p>

          <hr className="w-12 border-surface-700" />

          <div className="space-y-2 text-sm">
            <p className="text-surface-500">
              Designed &amp; Developed by{' '}
              <span className="text-surface-300 font-medium">Sujith Singh</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
              <a
                href="https://sujithsingh-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors hover:underline"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/iamsujithsingh-06"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors hover:underline"
              >
                GitHub
              </a>
              <a
                href="mailto:sujithsinghsm@gmail.com"
                className="text-primary-400 hover:text-primary-300 transition-colors hover:underline"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
