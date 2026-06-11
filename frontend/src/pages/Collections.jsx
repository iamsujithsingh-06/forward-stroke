import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loading from '../components/Loading';

const COLLECTIONS = [
  {
    id: 'world-cup',
    title: 'World Cup Collection',
    subtitle: 'Championship gear from every ICC World Cup era',
    description: 'Relive the greatest moments with official ICC Cricket World Cup merchandise. From vintage replicas to modern match jerseys, celebrate cricket\'s biggest tournament in style.',
    banner: 'https://placehold.co/1200x400/0ea5e9/ffffff?text=World+Cup+Collection',
    color: '#0ea5e9',
    filter: { category: 'international-jersey', tags: 'world-cup' },
  },
  {
    id: 'ipl',
    title: 'IPL Collection',
    subtitle: 'All 10 franchises — jerseys, kits & more',
    description: 'Represent your favourite IPL franchise with our complete collection of match jerseys, training gear, and team merchandise. From CSK yellow to RCB red, find everything in one place.',
    banner: 'https://placehold.co/1200x400/f97316/ffffff?text=IPL+Collection',
    color: '#f97316',
    filter: { category: 'ipl-jersey' },
  },
  {
    id: 'premium',
    title: 'Premium Collection',
    subtitle: 'Professional-grade equipment for serious cricketers',
    description: 'Our highest-quality, professional-grade items for cricketers who demand the best. Premium English Willow bats, elite protective gear, and tournament-ready kits.',
    banner: 'https://placehold.co/1200x400/10b981/ffffff?text=Premium+Collection',
    color: '#10b981',
    filter: { category: 'cricket-bat' },
  },
  {
    id: 'fan-favorites',
    title: 'Fan Favorites Collection',
    subtitle: 'Best-rated and most popular items',
    description: 'The most loved products by our community. These fan-favourite items have the highest ratings and best reviews from cricket enthusiasts worldwide.',
    banner: 'https://placehold.co/1200x400/ec4899/ffffff?text=Fan+Favorites',
    color: '#ec4899',
    filter: { sort: 'rating', order: 'desc', limit: 8 },
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals Collection',
    subtitle: 'The latest additions to our catalogue',
    description: 'Fresh off the shelf — browse our newest cricket merchandise. From latest jersey designs to cutting-edge equipment, be the first to own the newest arrivals.',
    banner: 'https://placehold.co/1200x400/6366f1/ffffff?text=New+Arrivals',
    color: '#6366f1',
    filter: { sort: 'createdAt', order: 'desc', limit: 8 },
  },
  {
    id: 'best-sellers',
    title: 'Best Sellers Collection',
    subtitle: 'Top-selling cricket gear loved by thousands',
    description: 'Our most popular products based on sales volume and customer demand. These proven performers are trusted by cricketers across all levels of the game.',
    banner: 'https://placehold.co/1200x400/f59e0b/ffffff?text=Best+Sellers',
    color: '#f59e0b',
    filter: { sort: 'price', order: 'desc', limit: 8 },
  },
  {
    id: 'accessories',
    title: 'Accessories & Gear',
    subtitle: 'Complete your cricket kit with essential add-ons',
    description: 'From arm sleeves to kit bags, find every cricket accessory you need. High-quality add-ons to enhance your game and complete your playing kit.',
    banner: 'https://placehold.co/1200x400/94a3b8/ffffff?text=Accessories',
    color: '#94a3b8',
    filter: { category: 'cricket-accessories' },
  },
  {
    id: 'kits',
    title: 'Cricket Kits',
    subtitle: 'Complete cricket kits for every level',
    description: 'Ready-to-play cricket kits for beginners, club players, and professionals. Each kit includes everything you need to step onto the field with confidence.',
    banner: 'https://placehold.co/1200x400/ef4444/ffffff?text=Cricket+Kits',
    color: '#ef4444',
    filter: { category: 'cricket-kit' },
  },
];

function CollectionSection({ collection }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 8, sort: 'createdAt', order: 'desc', ...collection.filter };
    productService.getAll(params)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [collection.filter]);

  return (
    <section className="scroll-mt-24" id={collection.id}>
      <div
        className="relative rounded-2xl overflow-hidden mb-6 h-40 sm:h-48 md:h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${collection.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wide">
            {collection.title}
          </h2>
          <p className="text-sm md:text-base text-white/80 mt-1 max-w-lg">{collection.subtitle}</p>
          <p className="text-xs md:text-sm text-white/60 mt-1 max-w-xl line-clamp-1">{collection.description}</p>
        </div>
      </div>
      {loading ? (
        <Loading text="Loading products..." />
      ) : products.length === 0 ? (
        <p className="text-sm text-surface-500 dark:text-surface-400 py-8 text-center">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
      <div className="mt-4 text-right">
        <Link
          to={`/products?${collection.filter.category ? `category=${collection.filter.category}` : ''}`}
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: collection.color }}
        >
          View All in {collection.title}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function Collections() {
  return (
    <>
      <SEO title="Collections" description="Curated cricket merchandise collections — World Cup, IPL, Premium, Fan Favorites, New Arrivals, Best Sellers, and more." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="section-heading">Collections</h1>
          <p className="section-subheading">Curated collections for every cricket fan</p>
        </div>

        <nav className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-surface-200 dark:border-surface-700 overflow-x-auto">
          {COLLECTIONS.map((col) => (
            <a
              key={col.id}
              href={`#${col.id}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap hover:text-white"
              style={{ color: col.color, backgroundColor: `${col.color}15` }}
            >
              {col.title}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {COLLECTIONS.map((col) => (
            <CollectionSection key={col.id} collection={col} />
          ))}
        </div>
      </section>
    </>
  );
}
