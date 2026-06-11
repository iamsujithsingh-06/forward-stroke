import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { recommendationService } from '../services/recommendationService';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loading from '../components/Loading';

function SectionHeader({ icon, title, color = 'text-primary-500' }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
      <h2 className="text-lg md:text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
}

function ProductGrid({ products, loading, emptyMsg = 'No products found.' }) {
  if (loading) return <Loading text="Loading..." />;
  if (products.length === 0) return <p className="text-sm text-surface-500 dark:text-surface-400 py-8 text-center">{emptyMsg}</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

function TeamRanking({ teams }) {
  if (teams.length === 0) return null;
  const maxCount = Math.max(...teams.map((t) => t.count));
  return (
    <div className="space-y-3">
      {teams.map((team, i) => (
        <div key={team.name} className="flex items-center gap-3">
          <span className="w-6 text-sm font-bold text-surface-400 text-center">{i + 1}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-surface-900 dark:text-white">{team.name}</span>
              <span className="text-xs text-surface-500">{team.count} items</span>
            </div>
            <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                style={{ width: `${(team.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [fansAlsoLiked, setFansAlsoLiked] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    fans: true,
    topRated: true,
    newArrivals: true,
    featured: true,
    teams: true,
  });

  useEffect(() => {
    recommendationService.getTrending()
      .then(({ data }) => setTrending(data.products || []))
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, trending: false })));

    recommendationService.getFansAlsoLiked()
      .then(({ data }) => setFansAlsoLiked(data.products || []))
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, fans: false })));

    productService.getAll({ sort: 'rating', order: 'desc', limit: 10 })
      .then(({ data }) => setTopRated(data.products || []))
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, topRated: false })));

    productService.getAll({ sort: 'createdAt', order: 'desc', limit: 10 })
      .then(({ data }) => setNewArrivals(data.products || []))
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, newArrivals: false })));

    productService.getFeatured()
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, featured: false })));

    productService.getAll({ limit: 100 })
      .then(({ data }) => {
        const teamCount = {};
        (data.products || []).forEach((p) => {
          if (p.team) {
            teamCount[p.team] = (teamCount[p.team] || 0) + 1;
          }
        });
        setTopTeams(
          Object.entries(teamCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );
      })
      .catch(() => {})
      .finally(() => setLoading((prev) => ({ ...prev, teams: false })));
  }, []);

  return (
    <>
      <SEO title="Trending" description="Discover what's trending in the cricket world — top products, fan favourites, top rated, and new arrivals." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-14">
        <div className="mb-2">
          <h1 className="section-heading">Trending Now</h1>
          <p className="section-subheading">What&apos;s hot in the cricket world right now</p>
        </div>

        <section>
          <SectionHeader icon="fire" title="Trending Products" color="text-accent-500" />
          <ProductGrid products={trending} loading={loading.trending} />
        </section>

        <section>
          <SectionHeader icon="heart" title="Fan Favourites" color="text-red-500" />
          <ProductGrid products={fansAlsoLiked} loading={loading.fans} />
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <SectionHeader icon="star" title="Top Rated Products" color="text-yellow-500" />
            <ProductGrid products={topRated} loading={loading.topRated} />
          </section>
          <section>
            <SectionHeader icon="new" title="New Arrivals" color="text-green-500" />
            <ProductGrid products={newArrivals} loading={loading.newArrivals} />
          </section>
        </div>

        <section>
          <SectionHeader icon="flag" title="Featured Products" color="text-purple-500" />
          <ProductGrid products={featured} loading={loading.featured} />
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="card p-6">
            <SectionHeader icon="chart" title="Most Popular Teams" color="text-primary-500" />
            {loading.teams ? <Loading text="Loading teams..." /> : <TeamRanking teams={topTeams} />}
          </section>
        </div>
      </div>
    </>
  );
}
