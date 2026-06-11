import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Forward Stroke';

export default function SEO({ title, description, ogImage, ogType = 'website' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || 'Premium cricket merchandise for every fan. Shop international jerseys, IPL team gear, accessories and more.';
  const image = ogImage || 'https://placehold.co/1200x630/38bdf8/ffffff?text=Forward+Stroke';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={ogType} />
    </Helmet>
  );
}
