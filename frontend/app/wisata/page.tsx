"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Ticket, Camera, Mountain } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

interface TourismItem {
  id: number;
  name: string;
  description: string;
  ticketPrice: string;
  openingHours: string;
  rating: number;
  category: string;
  highlights?: string[];
}

const MAGELANG_ATTRACTIONS = [
  {
    id: 1,
    name: 'Candi Borobudur',
    description: 'Kompleks candi Buddha terbesar di dunia dengan 504 patung Buddha yang tersebar di 9 tingkatan. Dibangun pada abad ke-8 dan merupakan warisan dunia UNESCO.',
    ticketPrice: 'Rp 50.000',
    openingHours: '06:00 - 17:00',
    rating: 4.9,
    category: 'Candi Bersejarah',
    highlights: ['Sunrise tour', 'Patung Buddha', 'Pemandangan panorama', 'Galeri interaktif']
  },
  {
    id: 2,
    name: 'Punthuk Setumbu',
    description: 'Bukit dengan pemandangan spektakuler terhadap Candi Borobudur. Tempat terbaik untuk menyaksikan sunrise dan landscape photography.',
    ticketPrice: 'Rp 30.000',
    openingHours: '06:00 - 18:00',
    rating: 4.7,
    category: 'Alam & Pemandangan',
    highlights: ['Sunrise view', 'Photography', 'Treehouse cafe', 'Hiking trail']
  },
  {
    id: 3,
    name: 'Mendut Temple',
    description: 'Candi Buddha kecil bersejarah yang terletak dekat dengan Borobudur. Dikenal dengan arsitektur yang indah dan patung Buddha yang megah.',
    ticketPrice: 'Rp 35.000',
    openingHours: '07:00 - 17:00',
    rating: 4.6,
    category: 'Candi Bersejarah',
    highlights: ['Patung Buddha', 'Relief indah', 'Suasana tenang', 'Spiritual journey']
  },
  {
    id: 4,
    name: 'Taman Kyai Langgeng',
    description: 'Taman botani seluas 17 hektar dengan koleksi tanaman langka dari seluruh nusantara. Sempurna untuk keluarga dan pecinta alam.',
    ticketPrice: 'Rp 20.000',
    openingHours: '08:00 - 16:00',
    rating: 4.5,
    category: 'Taman & Rekreasi',
    highlights: ['Tanaman langka', 'Area bermain anak', 'Kebun koleksi', 'Perpustakaan hijau']
  },
  {
    id: 5,
    name: 'Puncak Tidar',
    description: 'Bukit tertinggi di Magelang dengan ketinggian 523 meter. Memiliki pemandangan 360 derajat ke seluruh kota Magelang.',
    ticketPrice: 'Gratis',
    openingHours: '24 Jam',
    rating: 4.8,
    category: 'Alam & Pemandangan',
    highlights: ['Panorama 360', 'Monumen sejarah', 'Spot jogging', 'Sunset view']
  },
  {
    id: 6,
    name: 'Embung Kupang',
    description: 'Danau buatan yang indah dengan fasilitas wisata lengkap. Cocok untuk keluarga, olahraga air, dan piknik santai.',
    ticketPrice: 'Rp 15.000',
    openingHours: '07:00 - 18:00',
    rating: 4.4,
    category: 'Wisata Air',
    highlights: ['Olahraga air', 'Picnic area', 'Kafe waterfront', 'Sunset spot']
  }
];

export default function WisataPage() {
  const [tourism, setTourism] = useState<TourismItem[]>(MAGELANG_ATTRACTIONS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Semua');

  const categories = ['Semua', 'Candi Bersejarah', 'Alam & Pemandangan', 'Taman & Rekreasi', 'Wisata Air'];
  const filtered = filter === 'Semua' ? tourism : tourism.filter(item => item.category === filter);

  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />
      
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <Mountain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent sm:text-6xl">Destinasi Wisata</h1>
            <Camera className="h-10 w-10 text-purple-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Jelajahi 50+ landmark ikonik dan keindahan alam Kota Magelang yang menakjubkan</p>
          <p className="mt-2 text-sm text-cyan-300">Warisan budaya, alam indah, dan pengalaman tak terlupakan menanti Anda</p>
        </motion.div>

        {/* Filter Categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-6 py-2 font-semibold transition ${
                filter === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'border-2 border-cyan-400/50 text-cyan-300 hover:border-cyan-300'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="mx-auto mt-12 flex justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
          </motion.div>
        ) : (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ translateY: -12, scale: 1.05 }}
                className="group relative rounded-3xl border-2 border-cyan-400/50 overflow-hidden"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-blue-900/40 to-slate-950 z-0" />
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">{item.name}</h2>
                      <p className="mt-1 text-sm bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-semibold">{item.category}</p>
                    </div>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex items-center gap-1 rounded-full bg-yellow-500/30 px-3 py-1 border border-yellow-400/50">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-300">{item.rating}</span>
                    </motion.div>
                  </div>

                  <p className="mt-4 text-slate-200 leading-relaxed">{item.description}</p>

                  {/* Highlights */}
                  {item.highlights && (
                    <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                      {item.highlights.map((highlight, i) => (
                        <span key={i} className="text-xs rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-200 border border-cyan-400/30">
                          ✓ {highlight}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <div className="mt-6 space-y-3">
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-300">
                      <Ticket className="h-5 w-5 text-orange-400" />
                      <span className="font-semibold">{item.ticketPrice}</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-300">
                      <Clock className="h-5 w-5 text-green-400" />
                      <span>{item.openingHours}</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-300">
                      <MapPin className="h-5 w-5 text-pink-400" />
                      <span>Magelang, Jawa Tengah</span>
                    </motion.div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 px-6 py-3 font-semibold text-cyan-300 transition hover:from-cyan-500/60 hover:to-blue-500/60 border border-cyan-400/30">
                    Lihat di Peta →
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
