import { createClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { calculatePrice } from '@/lib/calculatePrice';
import { generateUniqueTrackingId } from '@/lib/generateUniqueTrackingId';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SHIPMENT_TYPES = new Set([
  'Documents',
  'Small Parcel',
  'Large Package',
  'Fragile Item',
  'Bulk Shipment',
]);

const DELIVERY_SPEEDS = new Set([
  'Same Day Delivery',
  'Express (24hrs)',
  'Standard Delivery',
  'International Shipping',
]);

export async function POST(req: Request) {
  let raw: unknown;

  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = raw as Record<string, unknown>;
  const text = (key: string) =>
    typeof data[key] === 'string' ? (data[key] as string).trim() : '';

  const firstName = text('first_name');
  const lastName = text('last_name');
  const email = text('email');
  const phone = text('phone');
  const companyName = text('company_name');
  const shipmentType = text('shipment_type');
  const deliverySpeed = text('delivery_speed');
  const pickup = text('pickup');
  const delivery = text('delivery');
  const info = text('info');
  const weight = Number(data.weight);

  const missing = [
    ['first_name', firstName],
    ['last_name', lastName],
    ['email', email],
    ['phone', phone],
    ['shipment_type', shipmentType],
    ['delivery_speed', deliverySpeed],
    ['pickup', pickup],
    ['delivery', delivery],
    ['weight', weight],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missing.length) {
    return Response.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    return Response.json(
      { error: 'Weight must be a positive number' },
      { status: 400 },
    );
  }

  if (!SHIPMENT_TYPES.has(shipmentType)) {
    return Response.json({ error: 'Invalid shipment type' }, { status: 400 });
  }

  if (!DELIVERY_SPEEDS.has(deliverySpeed)) {
    return Response.json({ error: 'Invalid delivery speed' }, { status: 400 });
  }

  if (data.terms_accepted !== true || data.privacy_accepted !== true) {
    return Response.json(
      { error: 'Terms of Service and Privacy Policy must be accepted' },
      { status: 400 },
    );
  }

  const price = calculatePrice(weight, deliverySpeed);
  const trackingId = await generateUniqueTrackingId(supabase);

  const { error } = await supabase.from('shipments_info').insert({
    tracking_id: trackingId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    company_name: companyName || null,
    shipment_type: shipmentType,
    delivery_speed: deliverySpeed,
    pickup,
    delivery,
    weight,
    info: info || null,
    price,
    // Consent records
    terms_accepted: data.terms_accepted,
    privacy_accepted: data.privacy_accepted,
    marketing_consent: data.marketing_consent === true,
    consent_timestamp: new Date().toISOString(),
    ip_address:
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown',
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // The request is saved. Mirror it into the public shipments table so the
  // tracking ID returned to the customer works immediately on /track.
  let trackable = false;

  const { data: shipment, error: shipmentError } = await supabase
    .from('shipments')
    .insert({
      tracking_number: trackingId,
      sender: `${firstName} ${lastName}`.trim(),
      receiver: delivery,
      status: 'Shipment Created',
      current_location: 'Shipment Pending',
    })
    .select('id')
    .single();

  if (shipmentError || !shipment) {
    console.error(
      'Shipment request saved, but the trackable shipment could not be created:',
      shipmentError,
    );
  } else {
    trackable = true;

    const { error: updateError } = await supabase
      .from('tracking_updates')
      .insert({
        shipment_id: shipment.id,
        location: pickup,
        message: 'Shipment request received. Our team is reviewing it.',
      });

    if (updateError) {
      console.error(
        'Shipment created, but the initial tracking update could not be added:',
        updateError,
      );
    }
  }

  // The request is safely stored at this point. Email delivery is best-effort:
  // an SMTP outage must not turn a successful request into a 500 response.
  let emailSent = true;

  try {
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
Pickup: ${pickup}
Delivery: ${delivery}

Customer: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${companyName || 'N/A'}

Marketing Consent: ${data.marketing_consent === true ? 'Yes' : 'No'}
Consent Recorded: ${new Date().toISOString()}
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Shipment Request Received - Tracking ID: ${trackingId}`,
      text: `
Dear ${firstName} ${lastName},

Thank you for choosing Berlux Transit Solutions!

Your shipment request has been successfully received and our team is already working on it.

📦 Tracking ID: ${trackingId}
💰 Estimated Price: $${price}
📍 Pickup: ${pickup}
🏠 Delivery: ${delivery}

What happens next?
1. Our logistics team will review your request within 2-4 business hours
2. You'll receive a confirmation email with final details
3. Track your shipment in real-time at https://beluxtransit.com/track using the tracking ID above

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
  } catch (emailError) {
    emailSent = false;
    console.error('Contact request saved, but emails could not be sent:', emailError);
  }

  return Response.json({ trackingId, price, emailSent, trackable });
}
