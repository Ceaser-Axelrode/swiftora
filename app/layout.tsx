import Navbar from '@/components/Navbar';
import './globals.css';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { ThemeProvider } from '@/lib/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://swiftorasolutions.com'),
  title: {
    default: 'Swiftora Solutions',
    template: '%s | Swiftora Solutions',
  },
  description:
    'Your trusted partner in global logistics and shipment delivery. Real-time tracking, international freight, and secure courier services.',
  openGraph: {
    title: 'Swiftora Solutions',
    description:
      'Fast, secure, and trackable logistics from pickup to delivery.',
    url: 'https://swiftorasolutions.com',
    siteName: 'Swiftora Solutions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swiftora Solutions',
    description:
      'Fast, secure, and trackable logistics from pickup to delivery.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/android-chrome-512x512.png',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// Skip navigation link for accessibility
function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-lg transition-all"
    >
      Skip to main content
    </a>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ErrorBoundary>
            <SkipNav />
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <CookieConsent />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
        {/* 🔴 Tawk.to Chat Widget – placed just before </body> */}
        <Script
          id="tawk-api"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();`,
          }}
        />
        <Script
          id="tawk-main"
          src="https://embed.tawk.to/6a2396616d77da1c401de0c2/1jqdg6s6n"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
