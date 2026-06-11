import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Shop: ['Products', 'Collections'],
  Explore: ['International', 'IPL', 'Trending'],
  Connect: ['Trending'],
  Support: [],
};

export default function Footer() {
  const hasLinks = (links) => links.length > 0;

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300 border-t border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) =>
            hasLinks(links) ? (
              <div key={heading}>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {heading}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm hover:text-primary-400 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div key={heading} />
            )
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-400">
            &copy; {new Date().getFullYear()} Forward Stroke. For Every Cricket Fan.
          </p>
          <p className="text-xs text-surface-500">
            Built with passion for the game.
          </p>
        </div>
      </div>
    </footer>
  );
}
