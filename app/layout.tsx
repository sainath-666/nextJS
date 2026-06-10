import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AP Vision Care',
    template: '%s · AP Vision Care',
  },
  description:
    'Andhra Pradesh Digital Vision Care & Public Health Intelligence Platform — Government of Andhra Pradesh.',
  applicationName: 'AP Vision Care',
};

export const viewport: Viewport = {
  themeColor: '#0369a1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
