import * as nodemailer from 'nodemailer';
import { inngest } from '@/lib/inngest/client';

type NewsletterSubscribedData = {
  email: string;
  name?: string | null;
};

/**
 * Sends the welcome email after a footer newsletter signup.
 *
 * The signup itself is committed by /api/newsletter before this event is sent,
 * so a mail outage never loses the subscriber. Inngest retries failed runs.
 */
export const sendNewsletterWelcome = inngest.createFunction(
  {
    id: 'newsletter-welcome',
    name: 'Send newsletter welcome email',
    triggers: [{ event: 'newsletter/subscribed' }],
  },
  async ({ event, step }) => {
    const { email, name } = event.data as NewsletterSubscribedData;

    const result = await step.run('send-welcome-email', async () => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_EMAIL!,
          pass: process.env.NODEMAILER_PASSWORD!,
        },
      });

      const greeting = name?.trim() ? `Hi ${name.trim()},` : 'Hello,';

      await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Welcome to the Swiftora Solutions newsletter',
        text: `${greeting}

Thanks for subscribing to Swiftora Solutions updates.

You'll hear from us about international shipping tips, service updates, and
logistics news. No spam, and you can unsubscribe at any time by replying to
this email.

Track a shipment anytime: https://swiftorasolutions.com/track
Questions? Email support@swiftorasolutions.com

Best regards,
Swiftora Solutions Team
A Sublet of Swiftora Distribution Network (SDN)
      `,
      });

      return { sent: true, email };
    });

    return result;
  },
);
