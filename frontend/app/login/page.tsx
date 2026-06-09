"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password harus minimal 8 karakter';
    if (!/[A-Z]/.test(pwd)) return 'Password harus mengandung huruf besar';
    if (!/[a-z]/.test(pwd)) return 'Password harus mengandung huruf kecil';
    if (!/\d/.test(pwd)) return 'Password harus mengandung angka';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password harus mengandung karakter spesial';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      if (mode === 'register') {
        // Validate password strength
        const passwordError = validatePasswordStrength(password);
        if (passwordError) {
          setStatus(passwordError);
          setLoading(false);
          return;
        }

        // Validate confirm password
        if (password !== confirmPassword) {
          setStatus('Password tidak cocok');
          setLoading(false);
          return;
        }

        if (!name.trim()) {
          setStatus('Nama harus diisi');
          setLoading(false);
          return;
        }

        await register(name, email, password);
        setStatus('Registrasi berhasil! Redirecting...');
        setTimeout(() => router.push('/smart-map'), 1500);
      } else {
        await login(email, password);
        setStatus('Login berhasil! Redirecting...');
        setTimeout(() => router.push('/smart-map'), 1500);
      }
    } catch (err: any) {
      setStatus(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
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
                className="w-full p-3 rounded-xl bg-slate-800 text-white"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 text-white"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 text-white"
              required
            />

            {mode === 'register' && (
              <>
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 text-white"
                  required
                />
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Password harus memiliki:</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Minimal 8 karakter</li>
                    <li>Huruf besar dan kecil</li>
                    <li>Angka</li>
                    <li>Karakter spesial (!@#$%^&*)</li>
                  </ul>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 py-3 rounded-full font-bold text-black hover:bg-cyan-400 transition disabled:opacity-50"
            >
              {loading ? 'Memproses...' : (mode === 'login' ? 'Login' : 'Register')}
            </button>

            {status && (
              <p className={`text-sm ${status.includes('berhasil') ? 'text-green-400' : 'text-red-400'}`}>
                {status}
              </p>
            )}
          </form>

          <div className="mt-6 text-sm text-gray-400">
            <p>
              {mode === 'login' 
                ? 'Belum punya akun? ' 
                : 'Sudah punya akun? '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-cyan-400 hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </GradientBg>
  );
}