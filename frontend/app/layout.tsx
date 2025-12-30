/**
 * PHTS System - Root Layout
 *
 * Next.js App Router root layout with MUI theme integration
 */

import type { Metadata, Viewport } from 'next';
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
  title: 'PHTS - Public Health Talent System',
  description: 'ระบบจัดการค่าตอบแทนกำลังคนด้านสาธารณสุข',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
