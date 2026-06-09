"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';
import AnimatedBackground from '../../components/animated-background';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ItineraryItem {
  order: number;
  destination: any;
  startTime: string;
  endTime: string;
  stayDuration: number;
  travelTime: number;
  estimatedCost: number;
  notes: string;
  directions: string;
}

interface ItineraryResult {
  itinerary: ItineraryItem[];
  totalDistance: number;
  totalCost: number;
  totalDuration: number;
  summary: string;
  tips: string[];
}

export default function AIAssistantPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [hours, setHours] = useState('8');
  const [budget, setBudget] = useState('500000');
  const [interests, setInterests] = useState<string[]>(['culture', 'nature']);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const availableInterests = [
    { value: 'culture', label: '🏛️ Budaya' },
    { value: 'nature', label: '🌿 Alam' },
    { value: 'food', label: '🍜 Kuliner' },
    { value: 'history', label: '📜 Sejarah' },
    { value: 'adventure', label: '⛰️ Petualangan' },
  ];

  useEffect(() => {
    if (isAuthenticated && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Failed to get location:', err);
        }
      );
    }
  }, [isAuthenticated]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setError('Silakan login terlebih dahulu');
      return;
    }

    if (interests.length === 0) {
      setError('Pilih minimal 1 minat');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          duration: parseFloat(hours),
          startTime: new Date().toISOString(),
          interests,
          budget: parseFloat(budget),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal generate itinerary');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <GradientBg>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-20 text-white text-center">
          <h1 className="text-4xl font-bold text-cyan-300 mb-4">AI Travel Assistant</h1>
          <p className="text-slate-300">Silakan login terlebih dahulu untuk menggunakan AI Assistant.</p>
          <a
            href="/login"
            className="inline-block mt-6 px-6 py-3 bg-cyan-500 text-black rounded-full font-bold hover:bg-cyan-400 transition"
          >
            Login
          </a>
        </main>
        <Footer />
      </GradientBg>
    );
  }

  return (
    <GradientBg>
      <AnimatedBackground />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div className="mb-4 flex justify-center gap-2 items-center">
            <Brain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent sm:text-6xl">
              🤖 AI Travel Assistant
            </h1>
            <Sparkles className="h-10 w-10 text-indigo-400" />
          </motion.div>
          <p className="mt-4 text-xl text-slate-200">AI akan generate itinerary berdasarkan lokasi Anda saat ini</p>
          {userLocation && (
            <p className="mt-2 text-sm text-green-400">
              ✓ Lokasi terdeteksi: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl border-2 border-cyan-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-blue-900/40 to-slate-950 z-0" />

            <div className="relative z-10 space-y-6 p-8 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl text-center mb-4"
              >
                ⏱️
              </motion.div>

              <div>
                <label className="block text-lg font-bold text-white mb-4 drop-shadow-lg">
                  Berapa lama waktu Anda?
                </label>
                <div className="space-y-3">
                  {[4, 8, 12].map((duration) => (
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
                        {duration === 4 ? '½ Hari' : duration === 8 ? '1 Hari' : 'Full Day'}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2">💰 Budget (IDR):</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-2xl border-2 border-cyan-400/50 bg-slate-950/50 px-4 py-3 text-white outline-none focus:border-cyan-300 focus:bg-slate-900/50 backdrop-blur-sm transition"
                  placeholder="Rp 500.000"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-slate-200 font-semibold mb-3">❤️ Minat (pilih minimal 1):</label>
                <div className="space-y-2">
                  {availableInterests.map((item) => (
                    <motion.label
                      key={item.value}
                      whileHover={{ scale: 1.03 }}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 border transition ${
                        interests.includes(item.value)
                          ? 'bg-cyan-500/30 border-cyan-400'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(item.value)}
                        onChange={() => toggleInterest(item.value)}
                        className="h-5 w-5 accent-cyan-400"
                      />
                      <span className="text-white font-semibold">{item.label}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-4 font-bold text-white transition disabled:opacity-50 hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/50"
              >
                {loading ? '⏳ Membuat itinerary...' : '🚀 Buat Itinerary Sekarang'}
              </motion.button>
            </div>
          </motion.form>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl border-2 border-indigo-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-950 z-0" />

            <div className="relative z-10 p-8 backdrop-blur-sm">
              {!result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-96 flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <p className="text-lg text-slate-200 font-semibold">Siap membuat perjalanan impian Anda?</p>
                  <p className="text-sm text-slate-400 mt-2">
                    AI akan merekomendasikan destinasi terdekat dari lokasi Anda
                  </p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">📋 Itinerary Anda</h2>
                  <p className="text-sm text-slate-300">{result.summary}</p>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-gray-400">Jarak Total</p>
                      <p className="text-white font-bold">{result.totalDistance.toFixed(1)} km</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-gray-400">Biaya</p>
                      <p className="text-white font-bold">Rp {result.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-gray-400">Durasi</p>
                      <p className="text-white font-bold">
                        {Math.floor(result.totalDuration / 60)}h {result.totalDuration % 60}m
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 max-h-96 overflow-y-auto space-y-3 pr-2">
                    {result.itinerary.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ translateX: 5 }}
                        className="rounded-2xl border-2 border-indigo-400/50 bg-indigo-500/20 p-4 backdrop-blur-sm hover:bg-indigo-500/30 transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center pt-1">
                            <Clock className="h-5 w-5 text-cyan-400" />
                            {idx < result.itinerary.length - 1 && (
                              <div className="mt-1 h-12 w-1 bg-gradient-to-b from-indigo-400 to-transparent" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-bold text-cyan-300 text-sm">
                              {new Date(item.startTime).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className="mt-1 text-white font-semibold">{item.destination.name}</p>
                            <p className="text-sm text-gray-400">{item.directions}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Stay: {item.stayDuration}m | Travel: {item.travelTime}m | Rp{' '}
                              {item.estimatedCost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {result.tips && result.tips.length > 0 && (
                    <div className="mt-4 bg-white/5 rounded-xl p-4">
                      <p className="text-white font-semibold mb-2">💡 Tips:</p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {result.tips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </GradientBg>
  );
}
