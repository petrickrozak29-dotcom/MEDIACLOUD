"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://keen-warmth-production-2f2b.up.railway.app';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState('');
  const [locationStatus, setLocationStatus] = useState('Mencari lokasi Anda...');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 🔹 Ambil data lama + lokasi
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // sudah login → redirect
    }

    const storedUser = localStorage.getItem('magelangverse-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      } catch {}
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setLocationStatus('Lokasi Anda terdeteksi.');
        },
        () => {
          setLocationStatus('Izin lokasi ditolak.');
        }
      );
    } else {
      setLocationStatus('Geolocation tidak tersedia.');
    }
  }, [router]);

  // 🔹 HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Memproses...');

    try {
      const endpoint =
        mode === 'login' ? '/api/auth/login' : '/api/auth/register';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          latitude: userLocation?.lat,
          longitude: userLocation?.lng
        })
      });

      if (!response.ok) throw new Error('Gagal');

      const data = await response.json();

      // 🔹 Simpan token
      localStorage.setItem('token', data.token);

      // 🔹 Simpan profil
      localStorage.setItem(
        'magelangverse-user',
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          latitude: data.user.latitude,
          longitude: data.user.longitude
        })
      );

      setStatus('Berhasil! Redirecting...');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setStatus('Gagal. Cek email/password atau server.');
      console.error(err);
    }
  };

  return (
    <GradientBg>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20 text-white">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl">
          
          <h1 className="text-4xl font-bold text-cyan-300 mb-4">
            {mode === 'login' ? 'Login' : 'Register'}
          </h1>

          {/* SWITCH MODE */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-full ${
                mode === 'login' ? 'bg-cyan-500 text-black' : 'bg-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-full ${
                mode === 'register' ? 'bg-cyan-500 text-black' : 'bg-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {mode === 'register' && (
              <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800"
              required
            />

            {/* LOKASI */}
            <div className="p-4 bg-slate-800 rounded-xl">
              <p>{locationStatus}</p>
              {userLocation && (
                <p className="text-sm text-gray-400">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>

            <button className="w-full bg-cyan-500 py-3 rounded-full font-bold text-black">
              {mode === 'login' ? 'Login' : 'Register'}
            </button>

            <p className="text-sm text-gray-400">{status}</p>
          </form>
        </section>
      </main>
      <Footer />
    </GradientBg>
  );
}