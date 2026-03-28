import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clostra',
  description: 'Field Sales Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
