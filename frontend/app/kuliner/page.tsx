"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, DollarSign, ChefHat, Utensils } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

interface CulinaryItem {
  id: number;
  name: string;
  description: string;
  priceRange: string;
  rating: number;
  ingredients?: string[];
  origin?: string;
}

const MAGELANG_CULINARY = [
  {
    id: 1,
    name: 'Getuk Trio',
    description: 'Makanan tradisional berbentuk bulat yang terbuat dari ketela pohon, jagung, dan singkong. Teksturnya lembut dan rasanya manis alami. Ini adalah makanan khas Magelang yang paling terkenal.',
    priceRange: 'Rp 5.000 - 15.000',
    rating: 4.8,
    ingredients: ['Ketela Pohon', 'Jagung', 'Singkong', 'Gula Merah', 'Santan'],
    origin: 'Tradisional Magelang'
  },
  {
    id: 2,
    name: 'Kupat Tahu',
    description: 'Nasi yang dimasak dalam plastik atau daun dan dipotong dadu, disajikan dengan tahu goreng dan kuah kental yang lezat. Pelengkap sempurna dengan sambal kacang pedas.',
    priceRange: 'Rp 8.000 - 20.000',
    rating: 4.7,
    ingredients: ['Nasi', 'Tahu', 'Kuah Kental', 'Kacang', 'Sambal'],
    origin: 'Tradisional Jawa Tengah'
  },
  {
    id: 3,
    name: 'Lumpia Goreng Magelang',
    description: 'Lumpia gurih dengan isian daging, sayuran, dan tepung tapioka yang dikombinasikan dengan sempurna. Dipanggang atau digoreng hingga kulit kecokelatan dan renyah.',
    priceRange: 'Rp 10.000 - 25.000',
    rating: 4.6,
    ingredients: ['Kulit Lumpia', 'Daging', 'Sayuran', 'Tepung Tapioka', 'Bumbu'],
    origin: 'Tradisional Magelang'
  },
  {
    id: 4,
    name: 'Gethuk Lindri',
    description: 'Camilan tradisional yang terbuat dari ketela pohon yang dioven atau dibakar, kemudian dicampur dengan gula merah, kelapa, dan sedikit santan. Teksturnya empuk dan lembut.',
    priceRange: 'Rp 3.000 - 10.000',
    rating: 4.5,
    ingredients: ['Ketela Pohon', 'Gula Merah', 'Kelapa Parut', 'Santan'],
    origin: 'Tradisional Magelang'
  },
  {
    id: 5,
    name: 'Perkedel Magelang',
    description: 'Hidangan sampingan yang dibuat dari kentang yang dilumatkan, dicampur dengan telur, bawang, dan bumbu-bumbu. Digoreng hingga kulit cokelat keemasan.',
    priceRange: 'Rp 5.000 - 12.000',
    rating: 4.4,
    ingredients: ['Kentang', 'Telur', 'Bawang', 'Tepung Terigu', 'Bumbu'],
    origin: 'Hybrid Magelang'
  },
  {
    id: 6,
    name: 'Soto Ayam Magelang',
    description: 'Sup tradisional dengan broth ayam yang gurih, diperkaya dengan rempah-rempah pilihan seperti kunyit, jahe, dan lada putih. Disajikan dengan nasi atau lontong.',
    priceRange: 'Rp 15.000 - 35.000',
    rating: 4.7,
    ingredients: ['Ayam', 'Kunyit', 'Jahe', 'Lada Putih', 'Rempah'],
    origin: 'Tradisional Jawa'
  }
];

export default function KulinerPage() {
  const [culinary, setCulinary] = useState<CulinaryItem[]>(MAGELANG_CULINARY);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <ChefHat className="h-10 w-10 text-orange-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent sm:text-6xl">Kuliner Khas Magelang</h1>
            <Utensils className="h-10 w-10 text-yellow-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Rasakan cita rasa autentik dari 30+ makanan tradisional Magelang yang istimewa</p>
          <p className="mt-2 text-sm text-orange-300">Resep turun-temurun yang telah dijaga kualitasnya selama berabad-abad</p>
        </motion.div>

        {/* Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 flex flex-wrap justify-center gap-3">
          {['Semua', 'Tradisional', 'Populer', 'Terjangkau'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-6 py-2 font-semibold transition ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50'
                  : 'border-2 border-orange-400/50 text-orange-300 hover:border-orange-300'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="mx-auto mt-12 flex justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-orange-500/30 border-t-orange-500" />
          </motion.div>
        ) : (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {culinary.map((item, idx) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ translateY: -12, scale: 1.05 }}
                className="group relative rounded-3xl border-2 border-orange-400/50 overflow-hidden"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-amber-900/40 to-slate-950 z-0" />
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">{item.name}</h2>
                      <p className="mt-1 text-sm text-orange-300 font-semibold">🍲 {item.origin}</p>
                    </div>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex items-center gap-1 rounded-full bg-yellow-500/30 px-3 py-1 border border-yellow-400/50">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-300">{item.rating}</span>
                    </motion.div>
                  </div>

                  <p className="mt-4 text-slate-200 leading-relaxed">{item.description}</p>

                  {/* Ingredients */}
                  {item.ingredients && (
                    <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, i) => (
                        <span key={i} className="text-xs rounded-full bg-orange-500/20 px-3 py-1 text-orange-200 border border-orange-400/30">
                          🥘 {ingredient}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 border border-green-400/30">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-sm font-semibold text-green-300">{item.priceRange}</span>
                    </motion.div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/30 px-6 py-3 font-semibold text-orange-300 transition hover:from-orange-500/60 hover:to-amber-500/60 border border-orange-400/30">
                    Cari Restoran →
                  </motion.button>
                </div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </GradientBg>
  );
}
