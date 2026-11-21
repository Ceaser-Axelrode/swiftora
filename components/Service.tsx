'use client';

import { motion } from 'framer-motion';
import { Truck, Package, Globe, Clock, Shield, Headphones } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Priority Express',
    description:
      'Fast, reliable city‑to‑city delivery with real‑time tracking and guaranteed timeframes.',
    image:
      'https://i.pinimg.com/1200x/f5/aa/22/f5aa22bb68b8039f47769154ae32d0f5.jpg',
    fallbackImage: '/fallbacks/express.jpg',
    features: [
      'Real‑time GPS tracking',
      'Guaranteed timeframes',
      'Priority handling',
    ],
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Package,
    title: 'White Glove Care',
    description:
      'Specialized handling for fragile, valuable, and oversized items with extra protection.',
    image:
      'https://i.pinimg.com/736x/dd/3e/3d/dd3e3d378d5f22d7336ac9fec2e9907c.jpg',
    fallbackImage: '/fallbacks/gloves-care.jpg',
    features: [
      'Fragile item expertise',
      'Custom packaging',
      'Insurance included',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'International Freight',
    description:
      'Seamless cross‑border shipping with customs clearance and documentation support.',
    image:
      'https://i.pinimg.com/736x/5f/c9/77/5fc977ed978022453f77fa977459df41.jpg',
    fallbackImage: '/fallbacks/international-freight.jpg',
    features: [
      'Customs clearance',
      'Documentation support',
      'Multi‑modal options',
    ],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'Same Day Delivery',
    description:
      'Urgent deliveries when timing is critical. Available in major metropolitan areas.',
    image:
      'https://i.pinimg.com/736x/1c/fa/30/1cfa300de2996d2de4d3204dd0f31617.jpg',
    fallbackImage: '/fallbacks/same-day-delivery.jpg',
    features: [
      'Under 8‑hour delivery',
      'Live ETA updates',
      'Dedicated courier',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Secure Transport',
    description:
      'Advanced security measures and insurance options for high‑value shipments.',
    image:
      'https://i.pinimg.com/1200x/14/26/e4/1426e4c969cc6440e562ccc2f98a84d7.jpg',
    fallbackImage: '/fallbacks/secure-transport.jpg',
    features: [
      'Tamper‑proof seals',
      'Chain of custody',
      'Insurance up to $50K',
    ],
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description:
      'Personal support team available around the clock to assist with any questions.',
    image:
      'https://i.pinimg.com/736x/14/45/6e/14456eaac0a034588c9e1e5a1d6be94b.jpg',
    fallbackImage: '/fallbacks/dedicated-support.jpg',
    features: [
      '24/7 availability',
      'Dedicated account manager',
      'Multi‑language support',
    ],
    color: 'from-indigo-500 to-violet-500',
  },
];

export default function Services() {
  return (
    <section className="py-20 md:py-32 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header – unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Services That Move You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From local deliveries to international freight, we offer
            comprehensive transit solutions tailored to your needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                {/* Image section */}
                <div className="relative h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      // Only swap if it isn't already the fallback (prevents infinite loop)
                      if (!target.src.endsWith(service.fallbackImage)) {
                        target.src = service.fallbackImage;
                      }
                    }}
                  />
                  {/* Gradient overlay that fades from transparent to card background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Icon on the image (bottom-left) */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="p-6 md:p-8">
                  {/* Gradient hover glow – stays subtle */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Feature bullets (optional – can remove if too much) */}
                    <ul className="space-y-1.5 mb-5">
                      {service.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Learn more hover link (desktop) */}
                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-primary font-medium text-sm flex items-center gap-1">
                        Learn more
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA – unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Ready to experience the Swift difference?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Start Your Journey
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
