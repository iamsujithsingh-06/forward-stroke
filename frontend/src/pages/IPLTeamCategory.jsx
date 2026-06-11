import { Link, useParams, Navigate } from 'react-router-dom';
import { IPL_TEAMS, PRODUCT_CATEGORIES, IPL_CATEGORY_PRODUCTS } from '../data/iplTeams';
import ProductCard from '../components/ProductCard';
import TeamLogo from '../components/TeamLogo';

const TEAM_IMAGES = {
  CSK: 'https://placehold.co/400x500/FFCB00/000000?text=CSK',
  RCB: 'https://placehold.co/400x500/EC1C24/ffffff?text=RCB',
  MI: 'https://placehold.co/400x500/004C8C/ffffff?text=MI',
  KKR: 'https://placehold.co/400x500/3A225D/ffffff?text=KKR',
  SRH: 'https://placehold.co/400x500/FF6D00/000000?text=SRH',
  RR: 'https://placehold.co/400x500/D92B9D/ffffff?text=RR',
  PBKS: 'https://placehold.co/400x500/A50E2F/ffffff?text=PBKS',
  DC: 'https://placehold.co/400x500/17479E/ffffff?text=DC',
  LSG: 'https://placehold.co/400x500/A8D5E2/000000?text=LSG',
  GT: 'https://placehold.co/400x500/1B2D4D/ffffff?text=GT',
};

function teamImage(shortName) {
  return TEAM_IMAGES[shortName] || 'https://placehold.co/400x500/1e293b/475569?text=Team';
}

export default function IPLTeamCategory() {
  const { team: teamSlug, category: categorySlug } = useParams();
  const team = IPL_TEAMS.find((t) => t.id === teamSlug);
  const category = PRODUCT_CATEGORIES.find((c) => c.id === categorySlug);

  if (!team || !category) {
    return <Navigate to="/ipl" replace />;
  }

  const products = IPL_CATEGORY_PRODUCTS[categorySlug] || [];
  const img = teamImage(team.shortName);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        to={`/ipl/${team.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {team.name}
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <TeamLogo teamId={team.id} size={52} />
        <div>
          <h1 className="section-heading">{team.name} {category.label}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-10">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
          {products.length} Products
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((item, i) => (
          <ProductCard
            key={i}
            product={{
              _id: `ipl-${team.id}-${categorySlug}-${i}`,
              name: `${team.shortName} ${item.name}`,
              price: item.price,
              images: [img],
              image: img,
              team: team.name,
              category: 'ipl-jersey',
            }}
          />
        ))}
      </div>
    </section>
  );
}
