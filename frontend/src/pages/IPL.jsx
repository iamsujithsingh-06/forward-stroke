import { IPL_TEAMS } from '../data/iplTeams';
import TeamCard from '../components/TeamCard';

import SEO from '../components/SEO';

export default function IPL() {
  return (
    <>
      <SEO title="IPL Teams" description="Shop official IPL team jerseys and merchandise. Chennai Super Kings, Mumbai Indians, and more." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="section-heading">Indian Premier League</h1>
        <p className="section-subheading">Explore merchandise from every IPL franchise</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {IPL_TEAMS.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
    </>
  );
}
