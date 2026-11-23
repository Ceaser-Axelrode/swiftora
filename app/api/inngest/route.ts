import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { sendNewsletterWelcome } from '@/lib/inngest/functions/newsletter';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendNewsletterWelcome],
});
