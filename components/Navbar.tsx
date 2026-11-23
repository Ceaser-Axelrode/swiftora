'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Track', href: '/track' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/90 shadow-sm backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/homePageLogo.png"
            alt="Swiftora Solutions"
            width={48}
            height={48}
            priority
            className="h-10 w-10 object-contain sm:h-12 sm:w-12"
          />
          <h1 className="hidden whitespace-nowrap text-xl font-bold tracking-widest text-foreground md:block sm:text-2xl">
            Swiftora Solutions
          </h1>
          <span className="text-xl font-bold tracking-widest text-foreground md:hidden">
            Swiftora
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden gap-8 text-muted-foreground md:flex lg:gap-10">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`font-medium transition duration-300 hover:text-foreground ${
                  isActive(link.href) ? 'text-orange-400' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile button */}
        <button
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <ul className="flex flex-col gap-2 px-4 py-6">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-4 py-3 text-lg transition-colors hover:bg-accent hover:text-foreground ${
                      isActive(link.href)
                        ? 'text-orange-400'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
