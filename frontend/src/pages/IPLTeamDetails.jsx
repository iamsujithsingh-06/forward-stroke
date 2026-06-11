import { Link, useParams, Navigate } from 'react-router-dom';
import { IPL_TEAMS, PRODUCT_CATEGORIES } from '../data/iplTeams';
import CategoryCard from '../components/CategoryCard';
import TeamLogo from '../components/TeamLogo';

export default function IPLTeamDetails() {
  const { team: slug } = useParams();
  const team = IPL_TEAMS.find((t) => t.id === slug);

  if (!team) {
    return <Navigate to="/ipl" replace />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        to="/ipl"
        className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to IPL Teams
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <TeamLogo teamId={team.id} size={64} />
        <div>
          <h1 className="section-heading">{team.name}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-10">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: team.color }}
        />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
          {PRODUCT_CATEGORIES.length} Categories
        </span>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide mb-6 flex items-center gap-2">
          <span>Products</span>
          <span className="text-lg">👕</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRODUCT_CATEGORIES.map((item) => (
            <Link key={item.id} to={`/ipl/${team.id}/${item.id}`} className="block">
              <CategoryCard item={item} accentColor={team.color} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
