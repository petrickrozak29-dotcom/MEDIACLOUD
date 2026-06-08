"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, MapPin, Brain, Sparkles } from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

interface ItineraryItem {
  time: string;
  activity: string;
}

const sampleItineraries = {
  4: [
    { time: '08:00', activity: 'Sarapan di Café lokal - Coba Getuk Trio Legendaris & Kopi Magelang' },
    { time: '09:30', activity: 'Kunjungi Taman Kyai Langgeng - Berjalan santai di taman hijau' },
    { time: '11:30', activity: 'Makan siang kuliner Magelang - Kupat Tahu & Perkedel' },
    { time: '13:00', activity: 'Istirahat di hotel atau tempat penginapan' }
  ],
  8: [
    { time: '06:00', activity: 'Sunrise tour di Punthuk Setumbu dengan pemandangan Borobudur' },
    { time: '08:00', activity: 'Sarapan tradisional Magelang' },
    { time: '09:30', activity: 'Tur Candi Borobudur - Jelajahi 504 patung Buddha' },
    { time: '12:00', activity: 'Makan siang dengan pemandangan pegunungan' },
    { time: '13:30', activity: 'Kunjungi Mendut Temple - Candi bersejarah kecil' },
    { time: '15:30', activity: 'Workshop batik tradisional dengan pengrajin lokal' },
    { time: '17:30', activity: 'Makan malam dengan menu seafood lokal' },
    { time: '19:00', activity: 'Istirahat atau hiburan malam' }
  ],
  12: [
    { time: '06:00', activity: 'Sunrise di Puncak Tidar - Panorama 360 derajat Magelang' },
    { time: '08:00', activity: 'Sarapan di warung lokal dengan menu tradisional' },
    { time: '09:30', activity: 'Tur lengkap Candi Borobudur dengan pemandu wisata' },
    { time: '12:00', activity: 'Makan siang - Hidangan nusantara dengan bumbu khas' },
    { time: '13:30', activity: 'Kunjungi Mendut & Pawon Temple' },
    { time: '15:00', activity: 'Berbelanja kerajinan lokal di galeri seni' },
    { time: '16:30', activity: 'Teh tradisional & camilan di café dengan pemandangan' },
    { time: '18:00', activity: 'Workshop kesenian tradisional Jawa' },
    { time: '19:30', activity: 'Makan malam istimewa - Menu fusion lokal' },
    { time: '21:00', activity: 'Pertunjukan wayang kulit tradisional' },
    { time: '23:00', activity: 'Malam santai di penginapan' },
    { time: '23:30', activity: 'Persiapan tidur' }
  ],
  24: [
    { time: '06:00', activity: 'Sunrise tour di Punthuk Setumbu & Puncak Tidar' },
    { time: '08:00', activity: 'Sarapan pagi dengan menu lengkap tradisional' },
    { time: '09:30', activity: 'Tur komprehensif Candi Borobudur (3 jam)' },
    { time: '12:30', activity: 'Makan siang special di restoran dengan pemandangan' },
    { time: '14:00', activity: 'Kunjungi Mendut & Pawon Temple' },
    { time: '16:00', activity: 'Workshop batik & kerajinan tangan' },
    { time: '17:30', activity: 'Teh tradisional di café lokal' },
    { time: '18:30', activity: 'Makan malam pertama - Kuliner tradisional' },
    { time: '20:00', activity: 'Pertunjukan gamelan & tari tradisional' },
    { time: '22:00', activity: 'Istirahat malam - Akomodasi berkualitas' },
    { time: '06:00', activity: 'Pagi berikutnya - Sarapan pagi di hotel' },
    { time: '07:30', activity: 'Eksplorasi pasar tradisional Magelang' },
    { time: '10:00', activity: 'Kunjungi Embung Kupang - Aktivitas air & rekreasi' },
    { time: '12:00', activity: 'Makan siang kedua - Menu seafood segar' },
    { time: '13:30', activity: 'Taman Kyai Langgeng - Berjalan santai' },
    { time: '15:00', activity: 'Kelas memasak kuliner Magelang tradisional' },
    { time: '17:00', activity: 'Istirahat & relaksasi di spa tradisional' },
    { time: '18:30', activity: 'Makan malam terakhir - Menu spesial' },
    { time: '20:00', activity: 'Pertunjukan musik lokal & hiburan' },
    { time: '22:00', activity: 'Kenangan terakhir di kota Magelang' }
  ]
};

export default function AIAssistantPage() {
  const [hours, setHours] = useState('8');
  const [result, setResult] = useState<ItineraryItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const duration = Number(hours) as keyof typeof sampleItineraries;
      setResult(sampleItineraries[duration] || sampleItineraries[8]);
      setLoading(false);
    }, 1000);
  };

  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2">
            <Brain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent sm:text-6xl">🤖 AI Travel Assistant</h1>
            <Sparkles className="h-10 w-10 text-indigo-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">Teknologi AI terdepan membuat itinerary perjalanan sempurna untuk Anda</p>
          <p className="mt-2 text-sm text-cyan-300">Personalisasi lengkap berdasarkan preferensi waktu, aktivitas, dan minat Anda</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl border-2 border-cyan-400/50 overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-blue-900/40 to-slate-950 z-0" />
            
            {/* Content */}
            <div className="relative z-10 space-y-6 p-8 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl text-center mb-4">
                ⏱️
              </motion.div>

              <div>
                <label className="block text-lg font-bold text-white mb-4 drop-shadow-lg">
                  Berapa lama waktu Anda di Magelang?
                </label>
                <div className="space-y-3">
                  {[4, 8, 12, 24].map((duration) => (
                    <motion.label 
                      key={duration} 
                      whileHover={{ scale: 1.05 }}
                      className="flex cursor-pointer items-center gap-3 rounded-full bg-white/10 px-4 py-3 border border-cyan-400/30 transition hover:bg-white/20 hover:border-cyan-300"
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={hours === String(duration)}
                        onChange={(e) => setHours(e.target.value)}
                        className="h-5 w-5 accent-cyan-400"
                      />
                      <span className="text-white font-semibold">{duration} jam</span>
                      <span className="ml-auto text-sm text-slate-300">
                        {duration === 4 ? '½ Hari' : duration === 8 ? '1 Hari' : duration === 12 ? 'Full Day' : '24+ Jam'}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-slate-200 font-semibold">📝 Atau masukkan durasi custom:</label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full rounded-2xl border-2 border-cyan-400/50 bg-slate-950/50 px-4 py-3 text-white outline-none focus:border-cyan-300 focus:bg-slate-900/50 backdrop-blur-sm transition"
                  placeholder="Masukkan jam (1-72)"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-4 font-bold text-white transition disabled:opacity-50 hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/50"
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                    ⏳ Membuat itinerary...
                  </motion.span>
                ) : (
                  '🚀 Buat Itinerary Sekarang'
                )}
              </motion.button>

              {/* Features list */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-sm font-semibold text-white mb-3">✨ Fitur AI Kami:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ Personalisasi berdasarkan preferensi</li>
                  <li>✓ Rekomendasi waktu optimal</li>
                  <li>✓ Saran kuliner terbaik</li>
                  <li>✓ Route pengunjungan efisien</li>
                </ul>
              </motion.div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.form>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl border-2 border-indigo-400/50 overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-950 z-0" />
            
            {/* Content */}
            <div className="relative z-10 p-8 backdrop-blur-sm">
              {!result ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex h-96 flex-col items-center justify-center text-center">
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-6xl mb-4">
                    ✨
                  </motion.div>
                  <p className="text-lg text-slate-200 font-semibold">Siap membuat perjalanan impian Anda?</p>
                  <p className="text-sm text-slate-400 mt-2">Isi form di sebelah untuk mendapatkan rekomendasi itinerary personal</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">📋 Rekomendasi Itinerary</h2>
                  <p className="text-sm text-slate-300">untuk {hours} jam perjalanan Anda di Magelang</p>

                  <div className="mt-6 max-h-96 overflow-y-auto space-y-3 pr-2">
                    {result.map((item, idx) => (
                      <motion.div
                        key={`${item.time}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ translateX: 5 }}
                        className="rounded-2xl border-2 border-indigo-400/50 bg-indigo-500/20 p-4 backdrop-blur-sm hover:bg-indigo-500/30 transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center pt-1">
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}>
                              <Clock className="h-5 w-5 text-cyan-400" />
                            </motion.div>
                            {idx < result.length - 1 && <div className="mt-1 h-12 w-1 bg-gradient-to-b from-indigo-400 to-transparent" />}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-bold text-cyan-300 text-sm">{item.time}</p>
                            <p className="mt-1 text-white text-sm leading-relaxed">{item.activity}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 px-6 py-3 font-semibold text-green-300 transition hover:from-green-500/60 hover:to-emerald-500/60 border border-green-400/50">
                    ✅ Simpan Itinerary
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </GradientBg>
  );
}