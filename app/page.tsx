import About from '@/components/About';
import Hero from '@/components/Hero';
import Services from '@/components/Service';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <div id="services" className="scroll-mt-20">
        <Services />
      </div>

      {/* About Section */}
      <div id="about" className="scroll-mt-20">
        <About />
      </div>
    </main>
  );
}
