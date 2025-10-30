/**
 * Sitemap generator script
 * Run with: tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://egemoutdoor.com';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const staticPages: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/urunler', changefreq: 'daily', priority: 0.9 },
  { loc: '/urun-kategorileri', changefreq: 'weekly', priority: 0.8 },
  { loc: '/balik-av-malzemeleri', changefreq: 'weekly', priority: 0.8 },
  { loc: '/outdoor-giyim', changefreq: 'weekly', priority: 0.8 },
  { loc: '/kamp-malzemeleri', changefreq: 'weekly', priority: 0.8 },
  { loc: '/termoslar-ve-mataralar', changefreq: 'weekly', priority: 0.8 },
  { loc: '/spor-malzemeleri', changefreq: 'weekly', priority: 0.8 },
  { loc: '/caki-bicak', changefreq: 'weekly', priority: 0.8 },
  { loc: '/dalis-urunleri', changefreq: 'weekly', priority: 0.8 },
  { loc: '/kisiye-ozel', changefreq: 'weekly', priority: 0.7 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
  { loc: '/hakkimizda', changefreq: 'monthly', priority: 0.6 },
  { loc: '/iletisim', changefreq: 'monthly', priority: 0.6 },
  { loc: '/sss', changefreq: 'monthly', priority: 0.5 },
  { loc: '/kargo-bilgileri', changefreq: 'monthly', priority: 0.5 },
  { loc: '/iade-degisim', changefreq: 'monthly', priority: 0.5 },
  { loc: '/gizlilik-politikasi', changefreq: 'yearly', priority: 0.3 },
  { loc: '/kullanim-kosullari', changefreq: 'yearly', priority: 0.3 },
  { loc: '/cerez-politikasi', changefreq: 'yearly', priority: 0.3 },
];

function generateSitemap(urls: SitemapUrl[]): string {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const urlEntries = urls.map(url => {
    const loc = `${BASE_URL}${url.loc}`;
    const changefreq = url.changefreq || 'weekly';
    const priority = url.priority || 0.5;
    const urlLastmod = url.lastmod || lastmod;
    
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${urlLastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Generate and save sitemap
const sitemap = generateSitemap(staticPages);
const outputPath = join(process.cwd(), 'public', 'sitemap.xml');

try {
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log('✅ Sitemap generated successfully at:', outputPath);
  console.log(`📄 Total URLs: ${staticPages.length}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}
