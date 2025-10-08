import React from 'react';
import { Helmet } from 'react-helmet-async';

const Aksesuarlar: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Aksesuarlar | EgemOutdoor</title>
        <meta name="description" content="Balık avı aksesuarları: Çizmeler, Şamandıra ve Stopler, Fenerler, Pense - Gripper - Makas, Kepçe - Livar - Kakıç - Tripod, Şişme Yataklar, Alarm - Zil - Fosfor - Boncuk, Gözlükler ve diğerleri." />
      </Helmet>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Aksesuarlar</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a href="/balik-av-malzemeleri/aksesuarlar/cizmeler-ve-tulum-cizmeler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Çizmeler - Tulum Çizmeler</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/samandira-ve-stopler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Şamandıra ve Stopler</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/fenerler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Fenerler</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/pense-gripper-makas" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Pense - Gripper - Makas</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Kepçe - Livar - Kakıç - Tripod</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/sisme-yataklar" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Şişme Yataklar</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/alarm-zil-fosfor-boncuk" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Alarm - Zil - Fosfor - Boncuk</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/gozlukler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Gözlükler</a>
        <a href="/balik-av-malzemeleri/aksesuarlar/digerleri" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Diğerleri</a>
      </div>
    </main>
  );
};

export default Aksesuarlar;
