'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import * as z from 'zod';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import {
  Package,
  Truck,
  Shield,
  Headphones,
  Globe,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

/* ----------------------- */
/* ✅ Zod Schema */
/* ----------------------- */
const FormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  company_name: z.string().optional(),
  shipment_type: z.enum([
    'Documents',
    'Small Parcel',
    'Large Package',
    'Fragile Item',
    'Bulk Shipment',
  ]),
  delivery_speed: z.enum([
    'Same Day Delivery',
    'Express (24hrs)',
    'Standard Delivery',
    'International Shipping',
  ]),
  pickup: z.string().min(5, 'Pickup address is required'),
  delivery: z.string().min(5, 'Delivery address is required'),

  weight: z.coerce.number().min(1, 'Weight is required'),
  info: z.string().optional(),

  // Separate consent checkboxes
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Service',
  }),
  privacy_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy',
  }),
  marketing_consent: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<{
    trackingId: string;
    price: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company_name: '',
      shipment_type: 'Small Parcel',
      delivery_speed: 'Standard Delivery',
      pickup: '',
      delivery: '',
      weight: 0,
      info: '',
      terms_accepted: false,
      privacy_accepted: false,
      marketing_consent: false,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setLoading(true);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error || 'Request failed');
      }
      const result = await res.json();

      setTrackingInfo({ trackingId: result.trackingId, price: result.price });
      setSubmitted(true);
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-background antialiased relative overflow-hidden">
      {/* 🌄 Unsplash image – replaces both gradient divs */}
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/Bgcontact.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional: extra readability overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="min-w-0"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Package className="w-4 h-4" />
              New Shipment
            </span>

            <h1 className="mb-6 text-balance break-words text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Request a{' '}
              <span className="bg-linear-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Shipment
              </span>
            </h1>

            <p className="text-lg text-gray-200 mb-10 max-w-lg">
              Ready to ship with Swiftora? Fill out the form and our team will
              get your package moving quickly and securely.
            </p>

            {/* Feature Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                {
                  icon: Truck,
                  title: 'Real-time Tracking',
                  desc: 'Monitor every step',
                },
                {
                  icon: Shield,
                  title: 'Secure Handling',
                  desc: 'Your items protected',
                },
                {
                  icon: Headphones,
                  title: '24/7 Support',
                  desc: 'Always here to help',
                },
                {
                  icon: Globe,
                  title: 'Global Delivery',
                  desc: 'Worldwide shipping',
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group"
                >
                  <feature.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0"
          >
            <Form {...form}>
              {!submitted ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl"
                >
                  {/* Names */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            First name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Last name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <PhoneInputWithCountry
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter phone number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company */}
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Company name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Services */}
                  <FormField
                    control={form.control}
                    name="shipment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          What are you shipping
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            <SelectItem value="Documents">Documents</SelectItem>
                            <SelectItem value="Small Parcel">
                              Small Parcel
                            </SelectItem>
                            <SelectItem value="Large Package">
                              Large Package
                            </SelectItem>
                            <SelectItem value="Fragile Item">
                              Fragile Item
                            </SelectItem>
                            <SelectItem value="Bulk Shipment">
                              Bulk Shipment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Delivery Speed */}
                  <FormField
                    control={form.control}
                    name="delivery_speed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Delivery Speed Required
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            <SelectItem value="Same Day Delivery">
                              Same Day Delivery
                            </SelectItem>
                            <SelectItem value="Express (24hrs)">
                              Express (24hrs)
                            </SelectItem>
                            <SelectItem value="Standard Delivery">
                              Standard Delivery
                            </SelectItem>
                            <SelectItem value="International Shipping">
                              International Shipping
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="pickup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Pickup Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter pickup location"
                              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="delivery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Delivery Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter delivery location"
                              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Approximate Weight (kg) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 2kg, 5kg"
                            value={field.value?.toString() ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Info */}
                  <FormField
                    control={form.control}
                    name="info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Package description / special instructions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Terms of Service */}
                  <FormField
                    control={form.control}
                    name="terms_accepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-xs font-normal cursor-pointer text-muted-foreground">
                            I agree to the{' '}
                            <a
                              href="/terms-of-service"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-primary hover:text-primary/80"
                            >
                              Terms of Service
                            </a>{' '}
                            *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Privacy Policy */}
                  <FormField
                    control={form.control}
                    name="privacy_accepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-xs font-normal cursor-pointer text-muted-foreground">
                            I have read and agree to the{' '}
                            <a
                              href="/privacy-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-primary hover:text-primary/80"
                            >
                              Privacy Policy
                            </a>{' '}
                            *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Marketing Consent (Optional) */}
                  <FormField
                    control={form.control}
                    name="marketing_consent"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-xs font-normal cursor-pointer text-muted-foreground">
                            I consent to receive marketing communications about
                            new services, promotions, and updates (optional)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Request
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl border border-border bg-card shadow-xl text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Request Submitted Successfully!
                  </h3>

                  {trackingInfo && (
                    <div className="mb-6 space-y-4">
                      <div className="bg-muted/50 border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Your Tracking ID
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <code className="text-xl font-mono font-bold text-foreground bg-background px-4 py-2 rounded border">
                            {trackingInfo.trackingId}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                trackingInfo.trackingId,
                              );
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Package className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-muted/50 border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Estimated Price
                        </p>
                        <div className="text-2xl font-bold text-primary">
                          ${trackingInfo.price}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground mb-6">
                    We&apos;ve received your shipment request and will contact
                    you shortly with your tracking details.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    📧 Check your email for confirmation and detailed
                    information
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setTrackingInfo(null);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Submit another request
                  </button>
                </motion.div>
              )}
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
