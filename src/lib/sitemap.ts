/**
 * Sitemap generator for SEO
 * This should be run as a build script or serverless function
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlset = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

// Static pages
export const staticPages: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/urun-kategorileri', changefreq: 'weekly', priority: 0.9 },
  { loc: '/urunler', changefreq: 'daily', priority: 0.9 },
  { loc: '/hakkimizda', changefreq: 'monthly', priority: 0.7 },
  { loc: '/iletisim', changefreq: 'monthly', priority: 0.7 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.8 },
  { loc: '/sss', changefreq: 'monthly', priority: 0.6 },
  { loc: '/kargo-bilgileri', changefreq: 'monthly', priority: 0.6 },
  { loc: '/iade-degisim', changefreq: 'monthly', priority: 0.6 },
  { loc: '/gizlilik-politikasi', changefreq: 'yearly', priority: 0.5 },
  { loc: '/kullanim-kosullari', changefreq: 'yearly', priority: 0.5 },
  { loc: '/cerez-politikasi', changefreq: 'yearly', priority: 0.5 },
];

// Generate robots.txt
export function generateRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin
Disallow: /giris
Disallow: /hesabim
Disallow: /sepet
Disallow: /odeme

# Sitemap
Sitemap: ${sitemapUrl}
`;
}
