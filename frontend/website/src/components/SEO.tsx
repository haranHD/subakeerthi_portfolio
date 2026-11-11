import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'profile' | 'article';
  ogImage?: string;
  schema?: object | object[];
}

const DEFAULT_TITLE =
  'Subakeerthii MP | Certified POSH & POCSO Trainer, Child Counsellor & Legal Awareness Scholar';

const DEFAULT_DESCRIPTION =
  'Subakeerthii MP is a Certified POSH & POCSO Trainer, Child Counsellor, and Legal Scholar in Erode, Tamil Nadu. Conducting structured awareness programs in POSH Act 2013 compliance, POCSO Act 2012 school safety, and child psychology counselling in English & Tamil.';

const DEFAULT_KEYWORDS =
  'trainer, awareness program, counselling, psychology, child psychology, posh, pocso, posh trainer, pocso trainer, posh awareness program, pocso awareness program, child counsellor, child counselling, legal scholar, lawyer legal trainer, school child safety, workplace harassment prevention, internal committee training, IC capacity building, Subakeerthii MP, Erode, Coimbatore, Salem, Tamil Nadu, bilingual legal training';

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/subakeerthii-portrait.png',
  schema,
}) => {
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://subakeerthii.in';

  const fullCanonicalUrl = `${currentOrigin}${canonicalPath}`;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${currentOrigin}${ogImage}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Subakeerthii MP" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Search Engine Robots Crawling Directives */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Geo-targeting Meta for Local & Regional SEO (Erode / Tamil Nadu / India) */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Erode, Tamil Nadu, India" />
      <meta name="geo.position" content="11.3410;77.7172" />
      <meta name="ICBM" content="11.3410, 77.7172" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Subakeerthii MP Portfolio" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="ta_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
