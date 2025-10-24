import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "2024'ün En İyi Balık Avlama Teknikleri",
      excerpt: "Profesyonel balıkçıların 2024'te kullandığı en etkili teknikleri ve ipuçlarını keşfedin.",
      content: "Balık avlama sanatı sürekli gelişiyor...",
      author: "Mehmet Avcı",
      date: "2024-01-15",
      category: "Teknik",
      readTime: "8 dk okuma",
      image: "🎣",
      featured: true,
      tags: ["balık avlama", "teknik", "ipuçları"]
    },
    {
      id: 2,
      title: "Kamp Malzemesi Seçerken Dikkat Edilmesi Gerekenler",
      excerpt: "Doğa kampında konfor ve güvenlik için doğru malzeme seçiminin püf noktaları.",
      content: "Kamp malzemesi seçerken kalite çok önemli...",
      author: "Ayşe Doğan",
      date: "2024-01-10",
      category: "Kamp",
      readTime: "6 dk okuma", 
      image: "⛺",
      featured: false,
      tags: ["kamp", "outdoor", "malzeme"]
    },
    {
      id: 3,
      title: "Outdoor Kıyafet Rehberi: Mevsime Göre Giyim",
      excerpt: "Her mevsim için uygun outdoor kıyafet seçimi ve katmanlı giyim teknikleri.",
      content: "Outdoor aktivitelerde doğru kıyafet seçimi...",
      author: "Emre Kaya",
      date: "2024-01-08",
      category: "Giyim",
      readTime: "7 dk okuma",
      image: "🧥",
      featured: true,
      tags: ["outdoor", "giyim", "mevsim"]
    },
    {
      id: 4,
      title: "Çakı Bakımı ve Muhafaza Yöntemleri",
      excerpt: "Çakılarınızın uzun yıllar keskin kalması için bakım ve muhafaza tavsiyeleri.",
      content: "Kaliteli bir çakının ömrünü uzatmanın yolları...",
      author: "Hakan Şahin",
      date: "2024-01-05",
      category: "Bakım",
      readTime: "5 dk okuma",
      image: "🔪",
      featured: false,
      tags: ["çakı", "bakım", "muhafaza"]
    },
    {
      id: 5,
      title: "Başlangıç Seviyesi Balıkçılık Rehberi",
      excerpt: "Balıkçılığa yeni başlayanlar için kapsamlı rehber ve temel malzeme önerileri.",
      content: "Balıkçılık hobisine adım atmak isteyenler için...",
      author: "Zeynep Yılmaz",
      date: "2024-01-03",
      category: "Başlangıç",
      readTime: "10 dk okuma",
      image: "🎯",
      featured: true,
      tags: ["başlangıç", "rehber", "balıkçılık"]
    },
    {
      id: 6,
      title: "Kış Kampı için Gerekli Malzemeler",
      excerpt: "Soğuk hava koşullarında güvenli ve konforlu kamp yapmanın sırları.",
      content: "Kış kampı özel hazırlık gerektirir...",
      author: "Murat Özcan",
      date: "2023-12-28",
      category: "Kamp",
      readTime: "9 dk okuma",
      image: "❄️",
      featured: false,
      tags: ["kış", "kamp", "soğuk hava"]
    }
  ];

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'Teknik', label: 'Teknik' },
    { value: 'Kamp', label: 'Kamp' },
    { value: 'Giyim', label: 'Giyim' },
    { value: 'Bakım', label: 'Bakım' },
    { value: 'Başlangıç', label: 'Başlangıç' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-foreground mb-6">
                BalıkPro Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Balıkçılık, outdoor yaşam ve doğa sporları hakkında uzman yazıları,
                ipuçları ve rehberler sizlerle.
              </p>
              
              {/* Search and Filter */}
              <div className="max-w-2xl mx-auto flex gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {searchQuery === '' && selectedCategory === 'all' && (
          <section className="py-12 md:py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 text-center">Öne Çıkan Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {featuredPosts.slice(0, 3).map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                    <Link to={`/blog/${post.id}`} className="block">
                      <CardHeader className="pb-4">
                        <div className="text-4xl mb-4">{post.image}</div>
                        <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {searchQuery || selectedCategory !== 'all' ? 
                  `Arama Sonuçları (${filteredPosts.length})` : 
                  'Tüm Yazılar'
                }
              </h2>
            </div>
            
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                    <Link to={`/blog/${post.id}`} className="block">
                      <CardHeader className="pb-4">
                        <div className="text-3xl mb-3">{post.image}</div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          {post.featured && <Badge variant="secondary" className="text-xs">Öne Çıkan</Badge>}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2 text-lg">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                            <span>Oku</span>
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Sonuç bulunamadı</h3>
                <p className="text-muted-foreground mb-6">
                  Aradığınız kriterlere uygun blog yazısı bulunamadı.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Tüm Yazıları Görüntüle
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Blog Güncellemelerini Kaçırmayın</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Yeni blog yazıları, ipuçları ve özel teklifleri e-posta ile alın.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="bg-background text-foreground"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Abone Ol
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;