'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SkeletonCardProps {
  className?: string;
  children?: ReactNode;
}

export function SkeletonCard({ className = '', children }: SkeletonCardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl p-6 ${className}`}
    >
      {children ? (
        children
      ) : (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded"
          style={{ width: `${100 - (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonTimeline({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 pt-2">
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="w-full h-[300px] bg-muted rounded-xl animate-pulse flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function SkeletonShipmentDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid lg:grid-cols-3 gap-8"
    >
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-32" />
              <div className="h-8 bg-muted rounded w-48" />
            </div>
            <div className="h-10 bg-muted rounded w-32" />
          </div>
          <div className="h-2 bg-muted rounded-full mt-4" />
        </SkeletonCard>

        <SkeletonCard>
          <div className="h-64 bg-muted/50 rounded-lg" />
        </SkeletonCard>

        <SkeletonCard className="p-8">
          <div className="h-6 bg-muted rounded w-40 mb-6" />
          <SkeletonTimeline items={4} />
        </SkeletonCard>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SkeletonCard className="p-6">
          <div className="h-5 bg-muted rounded w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between py-3 border-b border-border last:border-0"
              >
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="h-5 bg-primary/20 rounded w-24 mb-2" />
          <div className="h-4 bg-primary/10 rounded w-full mb-4" />
          <div className="h-4 bg-primary/20 rounded w-32" />
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonForm({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      ))}
      <div className="h-12 bg-muted rounded animate-pulse mt-6" />
    </div>
  );
}
