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
      // Olta Makineleri
      { name: 'Olta Makineleri: Spin', slug: 'olta-makineleri/spin' },
      { name: 'Olta Makineleri: LRF', slug: 'olta-makineleri/lrf' },
      { name: 'Olta Makineleri: Surf', slug: 'olta-makineleri/surf' },
      { name: 'Olta Makineleri: Genel Kullanım', slug: 'olta-makineleri/genel-kullanim' },
      // Olta Kamışları
      { name: 'Olta Kamışları: Telespin', slug: 'olta-kamislari/telespin' },
      { name: 'Olta Kamışları: Teleskopik', slug: 'olta-kamislari/teleskopik' },
      { name: 'Olta Kamışları: Spin', slug: 'olta-kamislari/spin' },
      { name: 'Olta Kamışları: LRF', slug: 'olta-kamislari/lrf' },
      { name: 'Olta Kamışları: Bot - Tekne', slug: 'olta-kamislari/bot-tekne' },
      { name: 'Olta Kamışları: Tatlı Su', slug: 'olta-kamislari/tatli-su' },
      { name: 'Olta Kamışları: Light Spin', slug: 'olta-kamislari/light-spin' },
      // Suni Yemler
      { name: 'Suni Yemler: Su Üstü Maketler', slug: 'su-ustu-maketler' },
      { name: 'Suni Yemler: Kaşık Yemler', slug: 'kasik-yemler' },
      { name: 'Suni Yemler: Silikon Yemler', slug: 'suni-yemler/silikon-yemler' },
      { name: 'Suni Yemler: Jig Yemler', slug: 'suni-yemler/jig-yemler' },
      { name: 'Suni Yemler: Kaşıklar ve Vibrasyonlar', slug: 'suni-yemler/kasiklar-ve-vibrasyonlar' },
      { name: 'Suni Yemler: Zokalar', slug: 'suni-yemler/zokalar' },
      { name: 'Suni Yemler: Meppsler', slug: 'suni-yemler/meppsler' },
      { name: 'Suni Yemler: Sazan Yemleri', slug: 'suni-yemler/sazan-yemleri' },
      // Misineler
      { name: 'Misineler: Monofilament', slug: 'misineler/monofilament' },
      { name: 'Misineler: Fluorocarbon', slug: 'misineler/fluorocarbon' },
      { name: 'Misineler: İp - Örgü', slug: 'misineler/ip-orgu' },
      // İğne ve Jighead
      { name: 'İğne ve Jighead: Kurşunlar', slug: 'igne-jighead/kursunlar' },
      { name: 'İğne ve Jighead: Jighead - Zoka', slug: 'igne-jighead/jighead-zoka' },
      { name: 'İğne ve Jighead: Assist Jig İğneleri', slug: 'igne-jighead/assist-jig-igneleri' },
      { name: 'İğne ve Jighead: Üçlü İğneler', slug: 'igne-jighead/uclu-igneler' },
      { name: 'İğne ve Jighead: Fırdöndü - Klips - Halkalar', slug: 'igne-jighead/firdondu-klips-halkalar' },
      { name: 'İğne ve Jighead: Tekli İğneler', slug: 'igne-jighead/tekli-igneler' },
      { name: 'İğne ve Jighead: Ofset İğneler', slug: 'igne-jighead/ofset-igneler' },
      // Aksesuarlar
      { name: 'Aksesuarlar: Çizmeler - Tulum', slug: 'aksesuarlar/cizmeler-ve-tulum-cizmeler' },
      { name: 'Aksesuarlar: Şamandıra ve Stopler', slug: 'aksesuarlar/samandira-ve-stopler' },
      { name: 'Aksesuarlar: Fenerler', slug: 'aksesuarlar/fenerler' },
      { name: 'Aksesuarlar: Pense - Gripper - Makas', slug: 'aksesuarlar/pense-gripper-makas' },
      { name: 'Aksesuarlar: Kepçe - Livar - Kakıç - Tripod', slug: 'aksesuarlar/kepce-livar-kakic-tripod' },
      { name: 'Aksesuarlar: Şişme Yataklar', slug: 'aksesuarlar/sisme-yataklar' },
      { name: 'Aksesuarlar: Alarm - Zil - Fosfor - Boncuk', slug: 'aksesuarlar/alarm-zil-fosfor-boncuk' },
      { name: 'Aksesuarlar: Gözlükler', slug: 'aksesuarlar/gozlukler' },
      { name: 'Aksesuarlar: Diğerleri', slug: 'aksesuarlar/digerleri' },
      // Diğer
      { name: 'Diğer: Balıkçı Kıyafetleri ve Eldivenler', slug: 'balikci-kiyafetleri-ve-eldivenler' },
      { name: 'Diğer: Çanta ve Kutular', slug: 'canta-ve-kutular' },
    ],
  },
  {
    title: 'Outdoor Giyim',
    slug: 'outdoor-giyim',
    iconKey: 'shirt',
    count: 312,
    subcategories: [
      { name: 'Erkek: Pantolon', slug: 'erkek/pantolon' },
      { name: 'Erkek: Tişört', slug: 'erkek/tisort' },
      { name: 'Erkek: Gömlek', slug: 'erkek/gomlek' },
      { name: 'Erkek: Mont & Ceket', slug: 'erkek/mont-ve-ceket' },
      { name: 'Erkek: Ayakkabı', slug: 'erkek/ayakkabi' },
      { name: 'Erkek: Bot', slug: 'erkek/bot' },
      { name: 'Erkek: Sweatshirts', slug: 'erkek/sweatshirts' },
      { name: 'Erkek: Polar', slug: 'erkek/polar' },
      { name: 'Erkek: Yelek', slug: 'erkek/yelek' },
      { name: 'Erkek: Şort', slug: 'erkek/sort' },
      { name: 'Kadın: Tişört', slug: 'kadin/tisort' },
      { name: 'Kadın: Ayakkabı', slug: 'kadin/ayakkabi' },
      { name: 'Kadın: Bot', slug: 'kadin/bot' },
      { name: 'Kadın: Mont & Ceket', slug: 'kadin/mont-ve-ceket' },
      { name: 'Kadın: Pantolon', slug: 'kadin/pantolon' },
      { name: 'Aksesuar: Çanta', slug: 'kadin/canta' },
      { name: 'Aksesuar: Şapka', slug: 'kadin/sapka' },
      { name: 'Aksesuar: Bere', slug: 'bere' },
      { name: 'Termal İçlik', slug: 'termal-iclik' },
    ],
  },
  {
    title: 'Kamp Malzemeleri',
    slug: 'kamp-malzemeleri',
    iconKey: 'tent',
    count: 289,
    subcategories: [
      { name: 'Kamp Ocağı', slug: 'kamp-ocagi' },
      { name: 'Kartuşlar', slug: 'kartuslar' },
      { name: 'Pürmüz', slug: 'purmuz' },
      { name: 'Kamp Mutfağı', slug: 'kamp-mutfagi' },
      { name: 'Çadırlar', slug: 'cadirlar' },
      { name: 'Uyku Tulumları', slug: 'uyku-tulumlari' },
      { name: 'Şişme Ürünler ve Matlar', slug: 'sisme-urunler-ve-matlar' },
      { name: 'Kamp Çantası', slug: 'kamp-cantasi' },
      { name: 'Aydınlatma', slug: 'aydinlatma' },
      { name: 'Kafa Lambası', slug: 'fenerler/kafa-lambasi' },
      { name: 'El Feneri', slug: 'fenerler/el-feneri' },
      { name: 'Masalar ve Sandalyeler', slug: 'masalar-ve-sandalyeler' },
      { name: 'Çizmeler', slug: 'cizmeler' },
      { name: 'Balta , Kürek', slug: 'balta-kurek' },
      { name: 'Köpek Kovucu', slug: 'kopek-kovucu' },
      { name: 'Kamp Ekipmanları', slug: 'kamp-ekipmanlari' },
    ],
  },
  {
    title: 'Dalış Ürünleri',
    slug: 'dalis-urunleri',
    iconKey: 'waves',
    count: 167,
    subcategories: [
      { name: 'Denge Yeleği (BCD)', slug: 'denge-yelegi-bcd' },
      { name: 'Dalış Bilgisayarı', slug: 'dalis-bilgisayari' },
      { name: 'Regülatörler', slug: 'regulatorler' },
      { name: 'Konsol & Pusula & Manometre', slug: 'konsol-pusula-manometre' },
      { name: 'Dalış Tüp ve Vanalar', slug: 'dalis-tup-ve-vanalar' },
      { name: 'Elbise & Yelek & Shorty', slug: 'dalis-elbise-yelek-shorty' },
      { name: 'Patik & Eldiven & Başlık', slug: 'patik-eldiven-baslik' },
      { name: 'Dalış Çantaları', slug: 'dalis-cantalari' },
      { name: 'Yedek Parça ve Aksesuar', slug: 'yedek-parca-ve-aksesuar' },
      { name: 'Zıpkın Modelleri', slug: 'zepkin-modelleri' },
      { name: 'Zıpkın Yedek Parçaları', slug: 'zipkin-yedek-parcalari' },
      { name: 'Dalış & Yüzücü Paletleri', slug: 'dalis-yuzucu-paletleri' },
      { name: 'Maske & Şnorkel & Gözlük', slug: 'maske-snorkel-gozluk' },
      { name: 'Dalış Bıçak ve Makaslar', slug: 'dalis-bicak-ve-makaslar' },
      { name: 'Dalış Şamandıraları', slug: 'dalis-samandiralari' },
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
      { name: 'Su Sporları Ekipmanları', slug: 'su-sporlari-ekipmanlari' },
      { name: 'Tenis Ekipmanları', slug: 'tenis-ekipmanlari' },
      { name: 'Futbol Ekipmanları', slug: 'futbol-ekipmanlari' },
      { name: 'Basketbol Ekipmanları', slug: 'basketbol-ekipmanlari' },
      { name: 'Kaykay ve Patenler', slug: 'kaykay-ve-patenler' },
      { name: 'Raketler', slug: 'raketler' },
      { name: 'Jimnastik Ekipmanları', slug: 'jimnastik-ekipmanlari' },
      { name: 'Toplar', slug: 'toplar' },
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

// Centralized filters for each root category
export const categoryFilters: Record<string, { name: string; options: string[] }[]> = {
  'balik-av-malzemeleri': [
    { name: 'Marka', options: ['Daiwa', 'Shimano', 'Penn', 'Abu Garcia'] },
    { name: 'Uzunluk', options: ['2.1m', '2.4m', '2.7m', '3.0m', '3.6m'] },
    { name: 'Test', options: ['5-25g', '10-40g', '20-60g', '40-100g'] },
    { name: 'Ağırlık', options: ['1 gr', '2 gr', '5 gr', '10 gr'] },
    { name: 'Fiyat', options: ['0-500₺', '500-1000₺', '1000-2000₺', '2000₺+'] },
  ],
  'outdoor-giyim': [
    { name: 'Marka', options: ['Columbia', 'The North Face', 'Merrell', 'Patagonia'] },
    { name: 'Kategori', options: ['Mont', 'Pantolon', 'Ayakkabı', 'Aksesuar'] },
    { name: 'Beden', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Fiyat', options: ['0-300₺', '300-600₺', '600-1000₺', '1000₺+'] },
  ],
  'kamp-malzemeleri': [
    { name: 'Marka', options: ['Coleman', 'Campingaz', 'Thermos', 'MSR'] },
    { name: 'Kategori', options: ['Çadır', 'Ocak', 'Uyku', 'Mutfak'] },
    { name: 'Kapasite', options: ['1-2 Kişi', '3-4 Kişi', '5+ Kişi'] },
    { name: 'Fiyat', options: ['0-500₺', '500-1000₺', '1000-2000₺', '2000₺+'] },
  ],
  'dalis-urunleri': [
    { name: 'Marka', options: ['Cressi', 'Mares', 'Seac', 'Aqualung'] },
    { name: 'Kategori', options: ['Regülatör', 'Elbise', 'Palet', 'Maske'] },
    { name: 'Fiyat', options: ['0-1000₺', '1000-3000₺', '3000-6000₺', '6000₺+'] },
  ],
  'termoslar-ve-mataralar': [
    { name: 'Marka', options: ['Stanley', 'Thermos', 'Contigo', 'CamelBak'] },
    { name: 'Hacim', options: ['350 ml', '500 ml', '750 ml', '1 L', '1.5 L+'] },
    { name: 'Tip', options: ['Termos', 'Matara', 'Termal Kupa'] },
    { name: 'Malzeme', options: ['Paslanmaz Çelik', 'Tritan', 'Alüminyum'] },
    { name: 'Fiyat', options: ['0-500₺', '500-1000₺', '1000-2000₺', '2000₺+'] },
  ],
  'spor-malzemeleri': [
    { name: 'Marka', options: ['Nike', 'Adidas', 'Under Armour', 'Decathlon'] },
    { name: 'Kategori', options: ['Aksesuar', 'Giyim', 'Ekipman'] },
    { name: 'Fiyat', options: ['0-500₺', '500-1000₺', '1000-2000₺', '2000₺+'] },
  ],
  'caki-bicak': [
    { name: 'Marka', options: ['Victorinox', 'Mora', 'Opinel', 'Benchmade'] },
    { name: 'Tip', options: ['Çakı', 'Sabit Bıçak', 'Katlanır Bıçak'] },
    { name: 'Boyut', options: ['Küçük', 'Orta', 'Büyük'] },
    { name: 'Fiyat', options: ['0-200₺', '200-500₺', '500-1000₺', '1000₺+'] },
  ],
  'kisiye-ozel': [
    { name: 'Kişiselleştirme', options: ['İsim', 'Logo', 'Renk'] },
    { name: 'Fiyat', options: ['0-500₺', '500-1000₺', '1000-2000₺', '2000₺+'] },
  ],
};
