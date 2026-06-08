"use client";

import { motion } from 'framer-motion';
import { History, Calendar } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

const timeline = [
  { 
    year: '1350-1525', 
    period: 'Era Majapahit',
    detail: 'Magelang menjadi bagian penting dari Kerajaan Majapahit. Wilayah ini berkembang sebagai pusat perdagangan dan pertanian dengan sistem irigasi yang canggih untuk zamannya.',
    emoji: '👑',
    color: 'from-purple-600'
  },
  { 
    year: '1525-1799', 
    period: 'Periode Kesultanan',
    detail: 'Magelang berada di bawah kekuasaan kesultanan lokal dan menjadi pusat produksi batik. Berbagai upacara budaya dan tradisi diwariskan dari generasi ke generasi.',
    emoji: '🏰',
    color: 'from-pink-600'
  },
  { 
    year: '1800-1945', 
    period: 'Era Kolonial Belanda',
    detail: 'Magelang berkembang sebagai kota perdagangan dan pusat pemerintahan kolonial Belanda. Infrastruktur modern dibangun termasuk jalan raya, rel kereta api, dan berbagai fasilitas publik.',
    emoji: '🏛️',
    color: 'from-red-600'
  },
  { 
    year: '1945', 
    period: 'Proklamasi Kemerdekaan',
    detail: 'Magelang menjadi saksi pergerakan kemerdekaan Indonesia dan menjadi tempat pertempuran penting melawan tentara Belanda. Para tokoh nasional melewati kota ini dalam perjalanan revolusi.',
    emoji: '🇮🇩',
    color: 'from-red-500'
  },
  { 
    year: '1950-1970', 
    period: 'Pembangunan Pasca-Kemerdekaan',
    detail: 'Perkembangan infrastuktur dan pendidikan di Magelang semakin pesat dengan pembangunan sekolah, universitas, dan rumah sakit. Sistem irigasi diperbaharui untuk meningkatkan pertanian.',
    emoji: '🎓',
    color: 'from-blue-600'
  },
  { 
    year: '1970-2000', 
    period: 'Era Industrialisasi',
    detail: 'Magelang mengalami industrialisasi dengan pembangunan pabrik-pabrik tekstil dan kerajinan. Urbanisasi meningkat dan kota berkembang menjadi pusat ekonomi regional.',
    emoji: '🏭',
    color: 'from-green-600'
  },
  { 
    year: '2000-2025', 
    period: 'Era Pariwisata Digital',
    detail: 'Magelang diakui sebagai destinasi wisata dunia dengan Borobudur sebagai warisan UNESCO. Perkembangan teknologi digital mulai mengubah cara wisatawan mengeksplorasi kota.',
    emoji: '✈️',
    color: 'from-cyan-600'
  },
  { 
    year: '2026 & Seterusnya', 
    period: 'Transformasi Digital City',
    detail: 'Magelang bertransformasi menjadi Smart Tourism & Digital City Portal. Teknologi AI, IoT, dan big data diintegrasikan untuk memberikan pengalaman wisata yang tak terlupakan.',
    emoji: '🤖',
    color: 'from-indigo-600'
  }
];

export default function SejarahPage() {
  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <History className="h-10 w-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent sm:text-6xl">Perjalanan Sejarah Magelang</h1>
            <Calendar className="h-10 w-10 text-indigo-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Dari kerajaan kuno hingga smart city digital - 700+ tahun evolusi Magelang</p>
          <p className="mt-2 text-sm text-purple-300">Saksikan transformasi yang memukau dari masa lalu yang kaya hingga masa depan yang cerah</p>
        </motion.div>

        <div className="relative space-y-0">
          {/* Central timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-purple-500 via-pink-500 to-indigo-500 opacity-30" />

          {timeline.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative mb-12 flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Left/Right Content */}
              <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.05, translateY: -8 }}
                  className={`rounded-3xl border-2 bg-gradient-to-br ${item.color} bg-opacity-40 border-white/20 p-8 backdrop-blur-xl overflow-hidden relative`}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-br from-white/10 to-transparent" />
                  
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-5xl mb-3">
                    {item.emoji}
                  </motion.div>
                  
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{item.period}</p>
                  <p className="text-sm text-white/70 mt-1">{item.year}</p>
                  <p className="mt-4 text-slate-100 leading-relaxed relative z-10">{item.detail}</p>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              </div>

              {/* Center Timeline Point */}
              <div className="relative flex w-0 justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  className={`absolute h-6 w-6 rounded-full border-4 border-white bg-gradient-to-br ${item.color} shadow-lg shadow-purple-500/50 z-10`}
                />
              </div>

              {/* Invisible right/left spacer */}
              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </GradientBg>
  );
}
