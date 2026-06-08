import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAGELANGVERSE.ID',
  description: 'Smart Tourism & Digital City Portal Magelang',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
