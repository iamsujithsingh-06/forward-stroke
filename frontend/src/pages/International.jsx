import { COUNTRIES } from '../data/countries';
import CountryCard from '../components/CountryCard';

import SEO from '../components/SEO';

export default function International() {
  return (
    <>
      <SEO title="International Teams" description="Browse and shop official international cricket jerseys from India, Australia, England, and more." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="section-heading">International Cricket</h1>
        <p className="section-subheading">Explore team stores from around the cricketing world</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {COUNTRIES.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>
      </section>
    </>
    );
  }
