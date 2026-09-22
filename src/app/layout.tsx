import type { Metadata, Viewport } from 'next';
import { content } from '@/content';
import { fontVariables } from './fonts/fonts';
import { Atmosphere, Aurora } from '@/components/chrome/Atmosphere';
import { AudioToggle } from '@/components/chrome/AudioToggle';
import { ScrollProgress } from '@/components/chrome/ScrollProgress';
import './globals.css';

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  applicationName: content.meta.title,
  openGraph: {
    title: content.meta.ogTitle,
    description: content.meta.ogDescription,
    type: 'website',
    locale: 'ar_SY',
    // بلا صورة معاينة عن قصد: حتى لا تظهر صورنا في معاينة الرابط عند إرساله
  },
  twitter: {
    card: 'summary',
    title: content.meta.ogTitle,
    description: content.meta.ogDescription,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0918',
  colorScheme: 'dark',
  // ضروري حتى تعمل env(safe-area-inset-*) على الآيفون
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${fontVariables} antialiased`}>
        {/* الشفق خلف كل شيء، والحُبيبات فوق كل شيء */}
        <Aurora />
        <div className="relative z-10">{children}</div>
        <Atmosphere />
        <ScrollProgress />
        <AudioToggle />
      </body>
    </html>
  );
}
