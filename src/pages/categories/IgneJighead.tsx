import React from 'react';
import { Helmet } from 'react-helmet-async';

const IgneJighead: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>İğne ve Jighead | EgemOutdoor</title>
        <meta name="description" content="Kurşunlar, Jighead - Zoka, Assist Jig İğneleri, Üçlü İğneler, Fırdöndü - Klips - Halkalar, Tekli İğneler, Ofset İğneler." />
      </Helmet>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">İğne ve Jighead</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a href="/balik-av-malzemeleri/igne-jighead/kursunlar" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Kurşunlar</a>
        <a href="/balik-av-malzemeleri/igne-jighead/jighead-zoka" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Jighead - Zoka</a>
        <a href="/balik-av-malzemeleri/igne-jighead/assist-jig-igneleri" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Assist Jig İğneleri</a>
        <a href="/balik-av-malzemeleri/igne-jighead/uclu-igneler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Üçlü İğneler</a>
        <a href="/balik-av-malzemeleri/igne-jighead/firdondu-klips-halkalar" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Fırdöndü - Klips - Halkalar</a>
        <a href="/balik-av-malzemeleri/igne-jighead/tekli-igneler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Tekli İğneler</a>
        <a href="/balik-av-malzemeleri/igne-jighead/ofset-igneler" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Ofset İğneler</a>
      </div>
    </main>
  );
};

export default IgneJighead;
