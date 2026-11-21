'use client';

import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft, Package, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-28 sm:px-6 md:py-32">
      {/* 🌄 Unsplash image – replaces both gradient divs */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80)',
        }}
      />

      <div className="w-full max-w-2xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="bg-linear-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-9xl font-bold text-transparent">
              404
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 sm:right-20"
            >
              <Package className="w-16 h-16 text-primary/30" />
            </motion.div>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or doesn&apos;t exist.
          </p>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-lg mx-auto">
            <Link
              href="/"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Back to Home</p>
                <p className="text-sm text-muted-foreground">
                  Return to homepage
                </p>
              </div>
            </Link>

            <Link
              href="/track"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Track Shipment</p>
                <p className="text-sm text-muted-foreground">
                  Check your package
                </p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">New Shipment</p>
                <p className="text-sm text-muted-foreground">Request a quote</p>
              </div>
            </Link>

            <a
              href="mailto:support@beluxtransit.com"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Get Help</p>
                <p className="text-sm text-muted-foreground">Contact support</p>
              </div>
            </a>
          </div>

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </main>
  );
}
