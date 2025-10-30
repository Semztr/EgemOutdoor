import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  children?: React.ReactNode;
}

const defaultSEO = {
  title: 'EgemOutdoor - Outdoor, Kamp ve Balık Av Malzemeleri',
  description: 'Outdoor giyim, kamp malzemeleri, balık av ekipmanları ve daha fazlası. Kaliteli ürünler, uygun fiyatlar, hızlı kargo.',
  keywords: [
    'outdoor',
    'kamp malzemeleri',
    'balık av malzemeleri',
    'outdoor giyim',
    'dalış ekipmanları',
    'kamp çadırı',
    'olta',
    'outdoor ekipman',
  ],
  image: '/og-image.jpg',
  url: 'https://egemoutdoor.com',
  type: 'website' as const,
};

export function SEO({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type,
  author,
  publishedTime,
  modifiedTime,
  children,
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | EgemOutdoor`
    : defaultSEO.title;

  const fullUrl = url.startsWith('http') ? url : `${defaultSEO.url}${url}`;
  const fullImage = image.startsWith('http') ? image : `${defaultSEO.url}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="EgemOutdoor" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Article specific */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="EgemOutdoor" />
      
      {children}
    </Helmet>
  );
}

// Product-specific SEO helper
export function ProductSEO({
  name,
  description,
  price,
  image,
  category,
  brand,
  inStock = true,
}: {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
}) {
  const keywords = [
    name,
    category,
    brand,
    'outdoor',
    'kamp',
    'balık avı',
  ].filter(Boolean) as string[];

  return (
    <SEO
      title={name}
      description={description}
      keywords={keywords}
      image={image}
      type="product"
    >
      <Helmet>
        {/* Product Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name,
            description,
            image,
            brand: brand ? { '@type': 'Brand', name: brand } : undefined,
            offers: {
              '@type': 'Offer',
              price,
              priceCurrency: 'TRY',
              availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          })}
        </script>
      </Helmet>
    </SEO>
  );
}
