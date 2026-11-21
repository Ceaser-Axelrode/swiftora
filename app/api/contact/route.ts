import { createClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { calculatePrice } from '@/lib/calculatePrice';
import { generateTrackingId } from '@/lib/generateTrackingId';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const data = await req.json();

  const price = calculatePrice(Number(data.weight), data.delivery_speed);
  const trackingId = generateTrackingId();

  const { error } = await supabase.from('shipments_info').insert({
    tracking_id: trackingId,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    company_name: data.company_name || null,
    shipment_type: data.shipment_type,
    delivery_speed: data.delivery_speed,
    pickup: data.pickup,
    delivery: data.delivery,
    weight: data.weight,
    info: data.info || null,
    price: price,
    // Consent records
    terms_accepted: data.terms_accepted,
    privacy_accepted: data.privacy_accepted,
    marketing_consent: data.marketing_consent || false,
    consent_timestamp: new Date().toISOString(),
    ip_address:
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown',
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // EMAIL ALERT TO ADMIN
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.NODEMAILER_EMAIL!,
      pass: process.env.NODEMAILER_PASSWORD!,
    },
  });

  // Send notification to admin
  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: process.env.SUPPORT_EMAIL,
    subject: 'New Shipment Request',
    text: `
New Shipment Created

Tracking ID: ${trackingId}
Price: $${price}
Pickup: ${data.pickup}
Delivery: ${data.delivery}

Customer: ${data.first_name} ${data.last_name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company_name || 'N/A'}

Marketing Consent: ${data.marketing_consent ? 'Yes' : 'No'}
Consent Recorded: ${new Date().toISOString()}
    `,
  });

  // Send confirmation email to user
  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: data.email,
    subject: `Shipment Request Received - Tracking ID: ${trackingId}`,
    text: `
Dear ${data.first_name} ${data.last_name},

Thank you for choosing Berlux Transit Solutions!

Your shipment request has been successfully received and our team is already working on it.

📦 Tracking ID: ${trackingId}
💰 Estimated Price: $${price}
📍 Pickup: ${data.pickup}
🏠 Delivery: ${data.delivery}

What happens next?
1. Our logistics team will review your request within 2-4 business hours
2. You'll receive a confirmation email with final details
3. Track your shipment in real-time at beluxtransit.com/track

Need immediate assistance?
📧 Email: support@beluxtransit.com
🌐 Track online: https://beluxtransit.com/track
🕒 Office Hours: Mon – Sat, 9:00 AM – 5:00 PM (UTC)

We appreciate your trust in Berlux Transit Solutions.

Best regards,
Berlux Transit Solutions Team
A division of Belux Enterprises (BE)
    `,
  });

  return Response.json({ trackingId, price });
}
