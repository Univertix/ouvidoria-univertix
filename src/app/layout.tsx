import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Canal de Ouvidoria Segura - Univértix',
  description: 'Sistema institucional seguro para denúncias anônimas e identificadas.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}