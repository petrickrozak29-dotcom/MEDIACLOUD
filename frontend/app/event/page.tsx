"use client";

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Ticket, Clock } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

const events = [
  {
    title: 'UMKM Expo Magelang 2026',
    date: '20 Agustus 2026',
    time: '09:00 - 17:00',
    location: 'Alun-alun Magelang',
    description: 'Pameran produk UMKM dan kuliner khas Magelang dengan berbagai booth penjual lokal, workshop, dan pertunjukan musik live.',
    attendees: '5000+',
    status: 'Mendatang',
    highlights: ['Workshop Gratis', 'Live Music', 'Diskon Khusus', 'Food Festival'],
    color: 'from-pink-600 to-rose-600'
  },
  {
    title: 'Car Free Day Magelang',
    date: '5 September 2026',
    time: '06:00 - 12:00',
    location: 'Jalan Pemuda',
    description: 'Kegiatan joging, bersepeda, dan pertunjukan seni di jalan tanpa kendaraan bermotor untuk mempromosikan gaya hidup sehat dan ramah lingkungan.',
    attendees: '3000+',
    status: 'Mendatang',
    highlights: ['Joging Bersama', 'Bersepeda', 'Pertunjukan Seni', 'Lomba Anak-anak'],
    color: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Festival Borobudur',
    date: '15 Oktober 2026',
    time: '18:00 - 23:00',
    location: 'Kawasan Candi Borobudur',
    description: 'Festival seni dan budaya tahunan dengan pertunjukan wayang kulit, tari tradisional, dan pameran karya seni lokal di sekitar kompleks Candi Borobudur yang megah.',
    attendees: '10000+',
    status: 'Mendatang',
    highlights: ['Wayang Kulit', 'Tari Tradisional', 'Pameran Seni', 'Makanan Tradisional'],
    color: 'from-orange-600 to-amber-600'
  },
  {
    title: 'Magelang Marathon 2026',
    date: '12 November 2026',
    time: '05:00 - 10:00',
    location: 'Lapangan Tidar',
    description: 'Acara lari marathon dengan rute yang menakjubkan melintasi pemandangan indah Kota Magelang, dengan kategori untuk semua tingkat kemampuan.',
    attendees: '2000+',
    status: 'Mendatang',
    highlights: ['Marathon 42km', 'Half Marathon', 'Lari 10km', 'Medali & Piala'],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Bazar Kuliner Magelang',
    date: '27 Desember 2026',
    time: '16:00 - 22:00',
    location: 'Taman Kyai Langgeng',
    description: 'Acara bazar kuliner tradisional dengan lebih dari 100 penjual makanan khas Magelang, minuman tradisional, dan camilan lokal yang lezat.',
    attendees: '8000+',
    status: 'Mendatang',
    highlights: ['100+ Food Vendor', 'Live Cooking', 'Tasting Session', 'Food Contest'],
    color: 'from-red-600 to-pink-600'
  },
  {
    title: 'Pagelaran Seni Tradisional',
    date: '3 Januari 2027',
    time: '19:00 - 23:00',
    location: 'Pendopo Kabupaten',
    description: 'Pertunjukan seni tradisional Jawa dengan gamelan, tari klasik, dan drama tradisional yang diselenggarakan oleh seniman lokal berbakat.',
    attendees: '1500+',
    status: 'Mendatang',
    highlights: ['Gamelan Tradisional', 'Tari Klasik', 'Drama Tradisional', 'Pertunjukan Khusus'],
    color: 'from-purple-600 to-indigo-600'
  }
];

export default function EventPage() {
  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <Calendar className="h-10 w-10 text-pink-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent sm:text-6xl">Event & Festival</h1>
            <Ticket className="h-10 w-10 text-red-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Agenda terbaru festival budaya, olahraga, dan acara spesial Magelang</p>
          <p className="mt-2 text-sm text-pink-300">100+ event per tahun memeriahkan kota dengan kegembiraan dan kebersamaan</p>
        </motion.div>

        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((item, idx) => (
            <motion.article
              key={item.title}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ translateY: -12, scale: 1.05 }}
              className="group relative rounded-3xl border-2 border-pink-400/50 overflow-hidden"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-60 z-0`} />
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">{item.title}</h2>
                  </div>
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full bg-yellow-400/30 px-3 py-1 text-xs font-bold text-yellow-200 border border-yellow-400/50">
                    {item.status}
                  </motion.span>
                </div>

                <p className="mt-3 text-slate-100 leading-relaxed">{item.description}</p>

                {/* Highlights */}
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((highlight, i) => (
                    <span key={i} className="text-xs rounded-full bg-white/20 px-2 py-1 text-white/80 border border-white/20">
                      ✓ {highlight}
                    </span>
                  ))}
                </motion.div>

                <div className="mt-6 space-y-3">
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-100">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">{item.date}</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-100">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span>{item.time}</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-100">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <span>{item.location}</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-slate-100">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span>{item.attendees} diharapkan</span>
                  </motion.div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/30 border border-white/20 backdrop-blur-sm">
                  Dapatkan Tiket →
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
