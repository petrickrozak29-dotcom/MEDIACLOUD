import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-slate-100">
        <Link href="/" className="font-semibold text-white">MAGELANGVERSE.ID</Link>
        <nav className="flex flex-wrap gap-4">
          <Link href="/wisata">Wisata</Link>
          <Link href="/kuliner">Kuliner</Link>
          <Link href="/budaya">Budaya</Link>
          <Link href="/sejarah">Sejarah</Link>
          <Link href="/event">Event</Link>
          <Link href="/smart-map">Smart Map</Link>
          <Link href="/ai-assistant">AI Assistant</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
