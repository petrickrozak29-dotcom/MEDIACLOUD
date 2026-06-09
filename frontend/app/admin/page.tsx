"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/navbar';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [status, setStatus] = useState('');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchEvents();
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Menyimpan event...');

    const payload = {
      ...formState,
      image: '/images/event-placeholder.jpg',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Gagal menambah event');
      }

      setFormState({ title: '', date: '', location: '', description: '' });
      setStatus('Event berhasil ditambahkan');
      await fetchEvents();
    } catch (error) {
      console.error(error);
      setStatus('Terjadi kesalahan saat menyimpan event.');
    }
  };

  // Show loading or access denied while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Memuat...</p>
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold">Dashboard Admin</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Kelola event Magelang untuk Smart Tourism & Smart City Portal.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-cyan-300">Tambah Event Baru</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block text-slate-200">
                Judul Event
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                />
              </label>

              <label className="block text-slate-200">
                Tanggal
                <input
                  type="date"
                  value={formState.date}
                  onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                />
              </label>

              <label className="block text-slate-200">
                Lokasi
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                />
              </label>

              <label className="block text-slate-200">
                Deskripsi
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  rows={4}
                  required
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Simpan Event
              </button>
            </form>
            <p className="mt-4 text-sm text-slate-400">{status}</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-cyan-300">Event Terkini</h2>
            <div className="mt-6 space-y-4">
              {events.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-400">Tanggal: {item.date}</p>
                  <p className="text-slate-400">Lokasi: {item.location}</p>
                  <p className="mt-2 text-slate-300">{item.description}</p>
                </article>
              ))}
              {events.length === 0 && (
                <p className="text-slate-500 text-sm">Belum ada event.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
