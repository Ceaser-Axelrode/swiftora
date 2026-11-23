'use client';

import { supabase } from '@/lib/supabase';
import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { generateUniqueTrackingId } from '@/lib/generateUniqueTrackingId';
import {
  Plus,
  MapPin,
  MessageSquare,
  Truck,
  LogOut,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Loader2,
  Users,
  Mail,
  RefreshCw,
} from 'lucide-react';

type ProfileRow = {
  id: string;
  user_id: string;
  role: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type SubscriberRow = {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
  source: string | null;
};

export default function AdminPage() {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Processing');

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directoryError, setDirectoryError] = useState('');
  const [updatingSubscriberId, setUpdatingSubscriberId] = useState<
    string | null
  >(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const router = useRouter();

  const loadDirectory = useCallback(async () => {
    setDirectoryLoading(true);
    setDirectoryError('');

    const [profilesResult, subscribersResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id,user_id,role,full_name,phone,created_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('newsletter_subscribers')
        .select('id,email,name,subscribed_at,is_active,source')
        .order('subscribed_at', { ascending: false })
        .limit(100),
    ]);

    if (profilesResult.error || subscribersResult.error) {
      setDirectoryError(
        profilesResult.error?.message ||
          subscribersResult.error?.message ||
          'Unable to load profiles and subscribers.',
      );
    }

    setProfiles((profilesResult.data as ProfileRow[] | null) ?? []);
    setSubscribers((subscribersResult.data as SubscriberRow[] | null) ?? []);
    setDirectoryLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/login');
        return;
      }

      setLoading(false);
      await loadDirectory();
    };
    checkUser();
  }, [router, loadDirectory]);

  async function lookupShipment() {
    if (!trackingId) {
      setNotification({
        type: 'error',
        message: 'Please enter a tracking number',
      });
      return;
    }
    setLookupLoading(true);
    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('status, current_location')
      .eq('tracking_number', trackingId)
      .single();
    if (error || !shipment) {
      setNotification({ type: 'error', message: 'Shipment not found' });
      setCurrentStatus(null);
    } else {
      setCurrentStatus(shipment.status);
      setNotification({
        type: 'success',
        message: `Current status: ${shipment.status}`,
      });
    }
    setLookupLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Checking authentication...
        </div>
      </main>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function createShipment() {
    if (!sender || !receiver) {
      setNotification({
        type: 'error',
        message: 'Please fill in sender and receiver',
      });
      return;
    }

    setSubmitting(true);
    const tracking = await generateUniqueTrackingId(supabase);

    const { data: shipment, error } = await supabase
      .from('shipments')
      .insert({
        tracking_number: tracking,
        sender,
        receiver,
        status: 'Shipment Created',
        current_location: 'Shipment Pending',
      })
      .select()
      .single();

    if (error || !shipment) {
      setNotification({ type: 'error', message: 'Failed to create shipment' });
      setSubmitting(false);
      return;
    }

    await supabase.from('tracking_updates').insert({
      shipment_id: shipment.id,
      location: 'Origin Facility',
      message: 'Shipment Created',
    });

    setSender('');
    setReceiver('');
    setSubmitting(false);
    setNotification({
      type: 'success',
      message: `Shipment Created: ${tracking}`,
    });

    setTimeout(() => setNotification(null), 5000);
  }

  async function addUpdate() {
    if (!trackingId || !location || !message) {
      setNotification({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    setSubmitting(true);

    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('id')
      .eq('tracking_number', trackingId)
      .single();

    if (error || !shipment) {
      setNotification({ type: 'error', message: 'Shipment not found' });
      setSubmitting(false);
      return;
    }

    // Determine new status: use selected status from dropdown
    const newStatus = selectedStatus;

    // Insert tracking update
    await supabase.from('tracking_updates').insert({
      shipment_id: shipment.id,
      location,
      message,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    });

    // Update shipment status and current location
    const { error: updateError } = await supabase
      .from('shipments')
      .update({
        status: newStatus,
        current_location: location,
      })
      .eq('id', shipment.id);

    if (updateError) {
      setNotification({
        type: 'error',
        message: `Failed to update status: ${updateError.message}`,
      });
      setSubmitting(false);
      return;
    }

    setTrackingId('');
    setLocation('');
    setMessage('');
    setLat('');
    setLng('');
    setSelectedStatus('Processing');
    setSubmitting(false);
    setNotification({
      type: 'success',
      message: `Update added! Status set to: ${newStatus}`,
    });

    setTimeout(() => setNotification(null), 5000);
  }

  async function toggleSubscriber(subscriber: SubscriberRow) {
    setUpdatingSubscriberId(subscriber.id);

    const nextActive = !subscriber.is_active;
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: nextActive,
        unsubscribed_at: nextActive ? null : new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (error) {
      setNotification({
        type: 'error',
        message: `Failed to update subscriber: ${error.message}`,
      });
    } else {
      setSubscribers((current) =>
        current.map((row) =>
          row.id === subscriber.id
            ? { ...row, is_active: nextActive }
            : row,
        ),
      );
      setNotification({
        type: 'success',
        message: nextActive
          ? `${subscriber.email} reactivated`
          : `${subscriber.email} unsubscribed`,
      });
      setTimeout(() => setNotification(null), 5000);
    }

    setUpdatingSubscriberId(null);
  }

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.is_active,
  ).length;

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage shipments and tracking updates
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Shipment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Create Shipment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Generate a new tracking number
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Sender
                </label>
                <input
                  value={sender}
                  placeholder="Enter sender name"
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Receiver
                </label>
                <input
                  value={receiver}
                  placeholder="Enter receiver name"
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>

              <button
                onClick={createShipment}
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5" />
                    Create Shipment
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Add Tracking Update Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Add Tracking Update
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update shipment status
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={trackingId}
                  placeholder="e.g., SAC12345"
                  className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <button
                  onClick={lookupShipment}
                  disabled={lookupLoading}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition disabled:opacity-50"
                >
                  {lookupLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Lookup'
                  )}
                </button>
              </div>
              {currentStatus && (
                <p className="text-sm text-muted-foreground">
                  Current Status:{' '}
                  <span className="font-semibold text-foreground">
                    {currentStatus}
                  </span>
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    value={location}
                    placeholder="Current location"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Latitude (optional)
                  </label>
                  <input
                    value={lat}
                    placeholder="0.0000"
                    type="number"
                    step="any"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Longitude (optional)
                  </label>
                  <input
                    value={lng}
                    placeholder="0.0000"
                    type="number"
                    step="any"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Package Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="Pending">Pending (Order Placed)</option>
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Status Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    value={message}
                    placeholder="Update message (e.g., Package arrived at facility)"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={addUpdate}
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-5 h-5" />
                    Add Update
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Profiles + Newsletter */}
        <div className="mt-8">
          {directoryError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{directoryError}</span>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Profiles
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {profiles.length} admin account
                      {profiles.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={loadDirectory}
                  disabled={directoryLoading}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50"
                  aria-label="Refresh profiles and subscribers"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${directoryLoading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>

              {directoryLoading && profiles.length === 0 ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading profiles...
                </div>
              ) : profiles.length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">
                  No profiles yet. New auth users get one automatically.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {profiles.map((profile) => (
                    <li
                      key={profile.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {profile.full_name || 'Unnamed user'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {profile.phone || profile.user_id}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                        {profile.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Newsletter
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {activeSubscribers} active / {subscribers.length} total
                    </p>
                  </div>
                </div>
              </div>

              {directoryLoading && subscribers.length === 0 ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading subscribers...
                </div>
              ) : subscribers.length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">
                  No subscribers yet. Signups from the footer will appear here.
                </p>
              ) : (
                <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                  {subscribers.map((subscriber) => (
                    <li
                      key={subscriber.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {subscriber.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {subscriber.name
                            ? `${subscriber.name} · `
                            : ''}
                          {subscriber.source || 'footer'} ·{' '}
                          {new Date(subscriber.subscribed_at)
                            .toISOString()
                            .slice(0, 10)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSubscriber(subscriber)}
                        disabled={updatingSubscriberId === subscriber.id}
                        title={
                          subscriber.is_active
                            ? 'Click to unsubscribe'
                            : 'Click to reactivate'
                        }
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                          subscriber.is_active
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {updatingSubscriberId === subscriber.id
                          ? '...'
                          : subscriber.is_active
                            ? 'Active'
                            : 'Inactive'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
