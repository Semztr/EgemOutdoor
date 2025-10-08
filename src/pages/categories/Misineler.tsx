import React from 'react';
import { Helmet } from 'react-helmet-async';

const Misineler: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Misineler | EgemOutdoor</title>
        <meta name="description" content="Monofilament, Fluorocarbon ve İp-Örgü misinaları keşfedin." />
      </Helmet>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Misineler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a href="/balik-av-malzemeleri/misineler/monofilament" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Monofilament Misineler</a>
        <a href="/balik-av-malzemeleri/misineler/fluorocarbon" className="p-4 rounded-lg border hover:bg-secondary transition-colors">Fluorocarbon Misineler</a>
        <a href="/balik-av-malzemeleri/misineler/ip-orgu" className="p-4 rounded-lg border hover:bg-secondary transition-colors">İp - Örgü Misineler</a>
      </div>
    </main>
  );
};

export default Misineler;
