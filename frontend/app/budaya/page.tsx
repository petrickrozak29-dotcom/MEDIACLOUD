"use client";

import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Users, Music } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

const cultureItems = [
  {
    title: 'Sejarah Magelang',
    description: 'Magelang memiliki sejarah panjang yang dimulai dari era Kerajaan Majapahit. Kota ini berkembang menjadi pusat perdagangan dan kemudian menjadi pusat pendidikan militer. Berbagai peninggalan sejarah seperti candi dan benteng masih dapat ditemukan di kota ini.',
    details: ['Era Majapahit (1350-1525)', 'Periode Kesultanan (1525-1799)', 'Zaman Kolonial Belanda', 'Era Kemerdekaan Indonesia'],
    icon: '📜',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Festival Budaya',
    description: 'Setiap tahun Magelang mengadakan berbagai festival budaya yang meriah. Festival ini menampilkan tari tradisional, musik gamelan, wayang kulit, dan pameran kerajinan lokal yang memukau pengunjung dari berbagai daerah.',
    details: ['Sinau Bareng Borobudur', 'Festival Magelang', 'Perayaan Hari Jadi Kota', 'Pertunjukan Gamelan Malam'],
    icon: '🎭',
    color: 'from-pink-600 to-red-600'
  },
  {
    title: 'Kerajinan Lokal',
    description: 'Magelang terkenal dengan produk kerajinan tangan berkualitas tinggi. Para pengrajin lokal menghasilkan batik unik, tenun tradisional, keramik, dan barang-barang kerajinan lainnya yang merupakan karya seni tinggi.',
    details: ['Batik Magelang', 'Tenun Tradisional', 'Keramik Tangan', 'Ukiran Kayu Artistik'],
    icon: '🎨',
    color: 'from-orange-600 to-yellow-600'
  },
  {
    title: 'Seni Pertunjukan',
    description: 'Komunitas seni Magelang melestarikan berbagai seni pertunjukan tradisional. Gamelan, cajon, tari tradisional, dan kesenian lainnya masih diajarkan dan dipertunjukkan secara reguler di berbagai acara budaya.',
    details: ['Gamelan Tradisional', 'Tari Jaipong', 'Musik Cajon', 'Pertunjukan Wayang Kulit'],
    icon: '🎵',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Kuliner Tradisional',
    description: 'Warisan kuliner Magelang mencakup makanan dan minuman tradisional yang telah diproduksi turun-temurun. Resep rahasia dipertahankan oleh keluarga pengrajin untuk menjaga keaslian rasa dan kualitas produk.',
    details: ['Getuk Trio Legendaris', 'Kue Tradisional', 'Minuman Herbal', 'Sambal Khas Magelang'],
    icon: '🍲',
    color: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Tradisi Masyarakat',
    description: 'Masyarakat Magelang masih mempertahankan berbagai tradisi lokal dalam kehidupan sehari-hari. Gotong royong, upacara adat, dan pertemuan komunitas tetap menjadi bagian penting dari identitas sosial masyarakat.',
    details: ['Gotong Royong', 'Upacara Adat', 'Arisan Komunitas', 'Pertemuan Keluarga Besar'],
    icon: '👥',
    color: 'from-indigo-600 to-purple-600'
  }
];

export default function BudayaPage() {
  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <BookOpen className="h-10 w-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent sm:text-6xl">Warisan Budaya Magelang</h1>
            <Sparkles className="h-10 w-10 text-pink-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Pelajari kekayaan budaya dan tradisi yang masih hidup di Kota Magelang</p>
          <p className="mt-2 text-sm text-purple-300">Warisan 700+ tahun yang dilestarikan dengan bangga oleh masyarakat lokal</p>
        </motion.div>

        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cultureItems.map((item, idx) => (
            <motion.article
              key={item.title}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ translateY: -12, scale: 1.05 }}
              className="group relative rounded-3xl border-2 border-purple-400/50 overflow-hidden"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-60 z-0`} />
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-4">
                  {item.icon}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{item.title}</h2>
                <p className="mt-4 text-slate-100 leading-relaxed">{item.description}</p>

                {/* Details list */}
                <motion.ul initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="mt-4 space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                      <span className="h-2 w-2 rounded-full bg-white/50"></span>
                      {detail}
                    </li>
                  ))}
                </motion.ul>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/30 border border-white/20 backdrop-blur-sm">
                  Pelajari Lebih Lanjut →
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
      </section>

      <Footer />
    </GradientBg>
  );
}
