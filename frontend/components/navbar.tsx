"use client";

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-slate-100">
        <Link href="/" className="font-semibold text-white">
          MAGELANGVERSE.ID
        </Link>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/wisata">Wisata</Link>
          <Link href="/kuliner">Kuliner</Link>
          <Link href="/budaya">Budaya</Link>
          <Link href="/sejarah">Sejarah</Link>
          <Link href="/event">Event</Link>
          <Link href="/smart-map">Smart Map</Link>
          <Link href="/ai-assistant">AI Assistant</Link>
          {isAuthenticated && (
            <Link href="/admin">Admin</Link>
          )}
          {!loading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-cyan-300 font-medium">👤 {user?.name}</span>
                <button
                  onClick={logout}
                  className="rounded-full bg-slate-700 px-4 py-1.5 text-white hover:bg-slate-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-cyan-500 px-4 py-1.5 font-semibold text-black hover:bg-cyan-400 transition"
              >
                Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
