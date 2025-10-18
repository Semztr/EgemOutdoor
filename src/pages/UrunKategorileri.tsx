import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Fish, Shirt, Tent, Waves, CupSoda, Dumbbell } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { siteCategories } from '@/data/categories';
import { Input } from '@/components/ui/input';

const specialCategories = [
  { title: 'Yeni Gelenler', slug: 'yeni-gelenler', icon: '🆕', count: 64 },
  { title: 'Çok Satanlar', slug: 'cok-satanlar', icon: '🔥', count: 120 },
  { title: 'İndirimdekiler', slug: 'indirim', icon: '🏷️', count: 210 },
];

const UrunKategorileri = () => {
  const [search, setSearch] = React.useState('');
  const filteredCategories = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return siteCategories;
    return siteCategories
      .map(cat => ({
        ...cat,
        subcategories: cat.subcategories.filter(sub => sub.name.toLowerCase().includes(q))
      }))
      .filter(cat => cat.title.toLowerCase().includes(q) || cat.subcategories.length > 0);
  }, [search]);
  return (
    <>
      <Helmet>
        <title>Ürün Kategorileri | EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor'da balık av malzemeleri, outdoor giyim, kamp ve dalış ekipmanları, termos-mataralar ve spor malzemeleri. Tüm kategorileri keşfedin." />
        <meta name="keywords" content="egem outdoor, ürün kategorileri, balık av malzemeleri, outdoor giyim, kamp malzemeleri, dalış ürünleri, termos, matara, spor malzemeleri" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-10">

          {/* Ana Kategoriler (Özel Kategoriler altına taşındı) */}
          <div className="mt-0">
            <h2 className="text-2xl font-bold text-foreground mb-8">Ürün Kategorileri</h2>
            <div className="mb-6 max-w-xl">
              <Input placeholder="Alt kategori ara..." onChange={(e) => (setSearch(e.target.value))} value={search} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCategories.map((category, index) => {
                const iconMap: Record<string, any> = { fish: Fish, shirt: Shirt, tent: Tent, waves: Waves, cup: CupSoda, dumbbell: Dumbbell };
                const Icon = iconMap[category.iconKey] ?? Fish;
                return (
                  <div key={category.slug} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Link to={`/${category.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                        {category.title}
                      </Link>
                    </div>
                    {(() => {
                      const q = search.toLowerCase();
                      const subs = category.subcategories
                        .slice()
                        .filter((s) => s.name.toLowerCase().includes(q));
                      const groups: Record<string, { title: string; items: { name: string; slug: string }[] }> = {};
                      subs.forEach((s) => {
                        const match = s.name.split(':');
                        let group = '';
                        let itemName = '';
                        if (match.length > 1) {
                          group = match[0].trim();
                          itemName = match.slice(1).join(':').trim();
                        } else if (/^termal içlik$/i.test(s.name.trim())) {
                          group = 'Termal İçlik';
                          itemName = s.name.trim();
                        } else {
                          group = 'Diğer';
                          itemName = s.name.trim();
                        }
                        if (!groups[group]) groups[group] = { title: group, items: [] };
                        groups[group].items.push({ name: itemName, slug: s.slug });
                      });
                      const orderedGroupKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'tr'));
                      return (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {orderedGroupKeys.map((gk) => (
                            <div key={gk}>
                              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{gk}</h4>
                              <div className="space-y-2">
                                {groups[gk].items
                                  .slice()
                                  .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
                                  .map((item, i) => (
                                    <Link
                                      key={i}
                                      to={`/${category.slug}/${item.slug}`}
                                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                      className="group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                    >
                                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{item.name}</span>
                                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Özel Kategoriler */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Özel Kategoriler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialCategories.map((category, index) => (
                <Link key={category.slug} to={`/kategori/${category.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Card className="transition-smooth border-border bg-card hover:shadow-lg hover:ring-1 hover:ring-primary/30 animate-fade-in rounded-2xl" style={{ animationDelay: `${(index + siteCategories.length) * 80}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{category.icon}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">Özel seçkiler</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <section className="bg-muted/50 mt-16 rounded-2xl p-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Ürün Kategorileri</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Sitemizde yer alan güncel kategorileri keşfedin ve ihtiyacınız olan ürüne hızlıca ulaşın.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UrunKategorileri;