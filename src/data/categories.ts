export type Subcat = { name: string; slug: string };
export type SiteCategory = {
  title: string;
  slug: string;
  iconKey: 'fish' | 'shirt' | 'tent' | 'waves' | 'cup' | 'dumbbell';
  count: number;
  subcategories: Subcat[];
};

export const siteCategories: SiteCategory[] = [
  {
    title: 'Balık Av Malzemeleri',
    slug: 'balik-av-malzemeleri',
    iconKey: 'fish',
    count: 456,
    subcategories: [
      { name: 'Olta Makineleri', slug: 'olta-makineleri' },
      { name: 'Olta Kamışları', slug: 'olta-kamislari' },
      { name: 'Suni Yemler', slug: 'suni-yemler' },
      { name: 'Misineler', slug: 'misineler' },
      { name: 'İğne ve Jighead', slug: 'igne-jighead' },
      { name: 'Aksesuarlar', slug: 'aksesuarlar' },
      { name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    title: 'Outdoor Giyim',
    slug: 'outdoor-giyim',
    iconKey: 'shirt',
    count: 312,
    subcategories: [
      { name: 'Erkek: Pantolon', slug: 'erkek/pantolon' },
      { name: 'Erkek: Mont & Ceket', slug: 'erkek/mont-ve-ceket' },
      { name: 'Erkek: Ayakkabı & Bot', slug: 'erkek/ayakkabi' },
      { name: 'Kadın: Tişört', slug: 'kadin/tisort' },
      { name: 'Kadın: Ayakkabı & Bot', slug: 'kadin/ayakkabi' },
      { name: 'Aksesuar: Çanta, Şapka, Bere', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Kamp Malzemeleri',
    slug: 'kamp-malzemeleri',
    iconKey: 'tent',
    count: 289,
    subcategories: [
      { name: 'Pişirme: Kamp Ocağı, Kartuş, Pürmüz', slug: 'pisirme' },
      { name: 'Barınma & Uyku: Çadır, Uyku Tulumu', slug: 'barinma-uyku' },
      { name: 'Aksesuar: Çanta, Aydınlatma, Kafa Lambası', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Dalış Ürünleri',
    slug: 'dalis-urunleri',
    iconKey: 'waves',
    count: 167,
    subcategories: [
      { name: 'Denge Yeleği (BCD), Regülatör', slug: 'ekipman' },
      { name: 'Elbise, Patik & Eldiven & Başlık', slug: 'giyim-parca' },
      { name: 'Zıpkın, Palet, Maske & Şnorkel', slug: 'av-aksesuar' },
    ],
  },
  {
    title: 'Termoslar ve Mataralar',
    slug: 'termoslar-ve-mataralar',
    iconKey: 'cup',
    count: 98,
    subcategories: [
      { name: 'Termoslar', slug: 'termoslar' },
      { name: 'Mataralar', slug: 'mataralar' },
      { name: 'Yedek Parça & Aksesuar', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Spor Malzemeleri',
    slug: 'spor-malzemeleri',
    iconKey: 'dumbbell',
    count: 120,
    subcategories: [
      { name: 'Toplar', slug: 'toplar' },
      { name: 'Fitness Bantları', slug: 'fitness-bantlari' },
      { name: 'Saha Ekipmanları', slug: 'saha-ekipmanlari' },
    ],
  },
];

export const allSubcategoryOptions = siteCategories.flatMap((cat) =>
  cat.subcategories.map((sub) => ({
    mainSlug: cat.slug,
    mainTitle: cat.title,
    subSlug: sub.slug,
    subName: sub.name,
  }))
);
