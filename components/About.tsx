'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, Clock, Shield, Users, Award } from 'lucide-react';

const stats = [
  { value: '50+', label: 'Countries Reached', icon: MapPin },
  { value: '10K+', label: 'Shipments Delivered', icon: Plane },
  { value: '99.8%', label: 'On-Time Performance', icon: Clock },
  { value: '24/7', label: 'Support Available', icon: Shield },
];

const values = [
  {
    icon: Plane,
    title: 'Technology Driven',
    description:
      'Real time tracking and smart logistics ensure you always know where your shipment is.',
  },
  {
    icon: MapPin,
    title: 'Global Network',
    description:
      'Connected partners in 50+ countries mean seamless international deliveries.',
  },
  {
    icon: Clock,
    title: 'On Time Performance',
    description:
      '99.8% on time delivery rate because we understand that timing is everything.',
  },
  {
    icon: Shield,
    title: 'Customer First Care',
    description:
      'Every shipment is handled with white glove care and 24/7 support availability.',
  },
];

export default function About() {
  return (
    <section className="py-20 md:py-32 bg-background transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            The Swiftora Story
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Where aviation discipline meets modern logistics, creating seamless
            pathways for businesses and individuals worldwide.
          </p>
        </motion.div>

        {/* Stats Section - Mobile scrollable, Desktop grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 md:mb-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center group hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-24">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Swiftora Solutions was created from a simple idea: to deliver
                parcels with the discipline of aviation and the speed of modern
                technology. In a world where deliveries are often delayed and
                tracking is uncertain, we saw the need for a courier platform
                that offers visibility, reliability, and precision.
              </p>
              <p>
                Every shipment is treated with the utmost care and
                professionalism. We combine cutting edge technology with decades
                of logistics expertise to deliver an experience that&apos;s both
                reliable and transparent. Our commitment goes beyond delivery we
                deliver peace of mind.
              </p>
              <p>
                From local shipments to international freight, every package
                benefits from our intelligent tracking systems, dedicated
                support team, and network of trusted partners across 50+
                countries.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              What Makes Us Different
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <value.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Our Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the most trusted logistics partner for businesses and
              individuals worldwide. We leverage technology, transparency, and
              dedicated support to make every delivery seamless, secure, and
              stress free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-orange-500/5 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Our Vision
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              To set the global standard for logistics excellence where every
              shipment, regardless of size or destination, receives the same
              commitment to quality, speed, and care.
            </p>
          </motion.div>
        </div>

        {/* Closing Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          // ✅ Add relative, remove opacity-30 and inset-0
          className="relative text-center border border-border rounded-2xl p-8 md:p-12 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1613690399151-65ea69478674?w=1920&q=80)',
          }}
        >
          {/* Dark overlay – sits on the image but behind the text */}
          <div className="absolute inset-0 bg-black/50 z-0" />

          {/* Text – placed above the overlay */}
          <div className="relative z-10">
            <p className="text-lg md:text-xl text-white mb-4 drop-shadow-md">
              When you ship with Swiftora, you&apos;re not just sending a
              package. You&apos;re placing it in the care of a partner dedicated
              to its safe, timely, and trackable journey from pickup to
              delivery.
            </p>
            <p className="text-white font-semibold text-lg drop-shadow-md">
              Swift in motion Your Cargo, Our Commitment.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
