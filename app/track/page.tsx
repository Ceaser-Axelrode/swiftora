'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Package,
  Calendar,
  ArrowRight,
  History,
  AlertCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';

type TrackingUpdate = {
  id: string | number;
  location: string;
  message: string;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
};

type Shipment = {
  id?: string | number;
  tracking_number: string;
  sender: string;
  receiver: string;
  status: string;
  current_location?: string | null;
  tracking_updates: TrackingUpdate[];
};

// Demo shipment so the "Try a demo tracking" button actually works without
// needing a record in Supabase.
function createDemoShipment(): Shipment {
  const now = Date.now();
  const hoursAgo = (hours: number) =>
    new Date(now - hours * 60 * 60 * 1000).toISOString();

  return {
    tracking_number: 'DEMO123456',
    sender: 'Swiftora Demo Store',
    receiver: 'Felix Rogers',
    status: 'Delivered',
    current_location: 'Paris, France',
    tracking_updates: [
      {
        id: 'demo-1',
        location: 'Amsterdam, Netherlands',
        message: 'Shipment picked up from sender',
        lat: 52.3676,
        lng: 4.9041,
        created_at: hoursAgo(30),
      },
      {
        id: 'demo-2',
        location: 'Rotterdam, Netherlands',
        message: 'Package arrived at sorting facility',
        lat: 51.9244,
        lng: 4.4777,
        created_at: hoursAgo(24),
      },
      {
        id: 'demo-3',
        location: 'Brussels, Belgium',
        message: 'In transit to destination',
        lat: 50.8503,
        lng: 4.3517,
        created_at: hoursAgo(14),
      },
      {
        id: 'demo-4',
        location: 'Paris, France',
        message: 'Delivered signed for by F. Rogers',
        lat: 48.8566,
        lng: 2.3522,
        created_at: hoursAgo(3),
      },
    ],
  };
}

// Client-only date component to avoid hydration mismatch
function ClientDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    const date = new Date(dateString);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormatted(Number.isNaN(date.getTime()) ? '' : date.toLocaleString());
  }, [dateString]);

  if (formatted) return <>{formatted}</>;

  const date = new Date(dateString);
  return (
    <>
      {Number.isNaN(date.getTime())
        ? 'Unknown date'
        : date.toISOString().slice(0, 16).replace('T', ' ')}
    </>
  );
}

const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
  ssr: false,
});

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered'))
      return {
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: CheckCircle,
        label: 'Delivered',
      };
    if (s.includes('transit'))
      return {
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: Truck,
        label: 'In Transit',
      };
    if (s.includes('pending'))
      return {
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Clock,
        label: 'Pending',
      };
    return {
      color: 'bg-primary/10 text-primary border-primary/20',
      icon: Package,
      label: status || 'Processing',
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color} font-medium text-sm`}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </div>
  );
}

// Progress bar component
function DeliveryProgress({ status }: { status: string }) {
  const getProgress = () => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered')) return 100;
    if (s.includes('transit')) return 66;
    if (s.includes('pending')) return 33;
    return 10;
  };

  const stages = [
    { label: 'Order Placed', icon: Package },
    { label: 'In Transit', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ];

  const progress = getProgress();

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = progress >= (idx + 1) * 33;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium hidden sm:block">
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
        />
      </div>
    </div>
  );
}

// Timeline item component
function TimelineItem({
  update,
  isLast,
  index,
}: {
  update: TrackingUpdate;
  isLast: boolean;
  index: number;
}) {
  const getStatusIcon = (message: string) => {
    const m = message?.toLowerCase() || '';
    if (m.includes('delivered'))
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (m.includes('transit') || m.includes('shipped'))
      return <Truck className="w-5 h-5 text-blue-500" />;
    if (m.includes('pending') || m.includes('processing'))
      return <Clock className="w-5 h-5 text-yellow-500" />;
    return <MapPin className="w-5 h-5 text-primary" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-4"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 w-px h-full bg-border" />
      )}

      {/* Icon */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
        {getStatusIcon(update.message)}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <p className="font-semibold text-foreground">{update.location}</p>
        <p className="text-muted-foreground text-sm mt-1">{update.message}</p>
        <p className="text-muted-foreground/60 text-xs mt-2 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <ClientDate dateString={update.created_at} />
        </p>
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState({ onDemo }: { onDemo: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-10"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Package className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Ready to Track Your Shipment
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Enter your tracking number above to see real-time updates on your
        package location and delivery status.
      </p>
      <button
        onClick={onDemo}
        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
      >
        Try a demo tracking
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 bg-card border border-border rounded-2xl p-8"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Tracking Number Not Found
      </h3>
      <p className="text-muted-foreground mb-6">
        We couldn&apos;t find a shipment with that tracking number. Please check
        and try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        <Search className="w-4 h-4" />
        Try Again
      </button>
    </motion.div>
  );
}

export default function TrackPage() {
  const [tracking, setTracking] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentTrackingSearches');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item) => typeof item === 'string'));
        }
      }
    } catch {
      // Ignore corrupted localStorage data and start with an empty list.
    }
  }, []);

  async function handleTrack(demoTracking?: string) {
    const searchTerm = (demoTracking || tracking).trim();
    if (!searchTerm) return;

    // Built-in demo shipment
    if (searchTerm.toUpperCase() === 'DEMO123456') {
      setError(false);
      setShipment(createDemoShipment());
      setTracking('DEMO123456');
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const { data, error: queryError } = await supabase
        .from('shipments')
        .select(
          `
          id,
          tracking_number,
          sender,
          receiver,
          status,
          current_location,
          tracking_updates!fk_shipment (
            id,
            location,
            message,
            lat,
            lng,
            created_at
          )
        `,
        )
        .eq('tracking_number', searchTerm)
        .single();

      if (queryError || !data) {
        setError(true);
        setShipment(null);
        return;
      }

      const result = data as unknown as Shipment;
      const sortedUpdates = [...(result.tracking_updates ?? [])].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      setShipment({
        ...result,
        tracking_updates: sortedUpdates,
      });

      // Save to recent searches
      if (!demoTracking) {
        const newRecent = [
          searchTerm,
          ...recentSearches.filter((s) => s !== searchTerm),
        ].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem(
          'recentTrackingSearches',
          JSON.stringify(newRecent),
        );
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const latestUpdate =
    shipment?.tracking_updates?.[shipment.tracking_updates.length - 1];

  const mapPoints =
    shipment?.tracking_updates
      ?.filter(
        (
          u,
        ): u is TrackingUpdate & {
          lat: number;
          lng: number;
        } => typeof u.lat === 'number' && typeof u.lng === 'number',
      )
      .map((u) => ({
        lat: u.lat,
        lng: u.lng,
        location: u.location,
      })) || [];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 py-16 md:py-24">
        {/* 🌄 Unsplash image background (replaces bg-muted/30 + radial gradient) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80)',
          }}
        />

        {/* Dark overlay keeps the hero readable in both themes */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-sm font-medium mb-4">
              <Truck className="w-4 h-4" />
              Track Your Package
            </span>
            <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              Shipment Tracking
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-100">
              Enter your tracking number to see real time updates on your
              package location and delivery status.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-2 shadow-xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter Tracking Number (e.g., SSE123456789)"
                    aria-label="Tracking number"
                    autoComplete="off"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
                <button
                  onClick={() => handleTrack()}
                  disabled={loading || !tracking.trim()}
                  className="bg-primary text-primary-foreground px-6 md:px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span className="hidden md:inline">Searching...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden md:inline">Track</span>
                      <ArrowRight className="w-5 h-5 md:hidden" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !shipment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-4 justify-center flex-wrap"
              >
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recent:</span>
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTracking(search);
                      handleTrack(search);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    {search}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {error ? (
              <ErrorState key="error" onRetry={() => setError(false)} />
            ) : shipment ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tracking Header */}
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Tracking Number
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                          {shipment.tracking_number}
                        </h2>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>

                    <DeliveryProgress status={shipment.status} />
                  </div>

                  {/* Map */}
                  {mapPoints.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Live Route Map
                      </h3>
                      <TrackingMap points={mapPoints} />
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                    <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Tracking History
                    </h3>
                    <div className="space-y-2">
                      {shipment.tracking_updates?.length > 0 ? (
                        shipment.tracking_updates.map((u, idx) => (
                          <TimelineItem
                            key={u.id}
                            update={u}
                            isLast={
                              idx === shipment.tracking_updates.length - 1
                            }
                            index={idx}
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No tracking updates yet. Check back soon!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Shipment Details */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Shipment Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">
                          Sender
                        </span>
                        <span className="font-medium text-foreground">
                          {shipment.sender}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">
                          Receiver
                        </span>
                        <span className="font-medium text-foreground">
                          {shipment.receiver}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">
                          Current Location
                        </span>
                        <span className="font-medium text-foreground text-right">
                          {latestUpdate?.location || 'Awaiting update...'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        {/* <span className="text-muted-foreground text-sm">
                          Last Update
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {latestUpdate ? (
                            <ClientDate dateString={latestUpdate.created_at} />
                          ) : (
                            'N/A'
                          )}
                        </span> */}
                      </div>
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      Need Help?
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Our support team is available 24/7 to assist with your
                      shipment inquiries.
                    </p>
                    <a
                      href="mailto:support@beluxtransit.com"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      Contact Support
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <EmptyState
                key="empty"
                onDemo={() => {
                  setTracking('DEMO123456');
                  handleTrack('DEMO123456');
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
