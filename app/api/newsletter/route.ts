import { createClient } from '@supabase/supabase-js';
import { inngest } from '@/lib/inngest/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(['footer', 'contact', 'admin']);

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
  const email =
    typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const name =
    typeof data.name === 'string' ? data.name.trim().slice(0, 120) : null;
  const requestedSource =
    typeof data.source === 'string' ? data.source.trim().toLowerCase() : 'footer';
  const source = ALLOWED_SOURCES.has(requestedSource)
    ? requestedSource
    : 'footer';

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  // Upsert by email: a returning subscriber is reactivated instead of getting
  // a duplicate row.
  const { error } = await supabase.from('newsletter_subscribers').upsert(
    {
      email,
      name: name || null,
      is_active: true,
      source,
      ip_address: ipAddress,
      user_agent: userAgent,
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    },
    { onConflict: 'email' },
  );

  if (error) {
    console.error('Newsletter signup failed:', error);
    return Response.json(
      { error: 'Unable to subscribe right now. Please try again.' },
      { status: 500 },
    );
  }

  // The subscriber is stored. Sending the welcome email is best-effort so a
  // missing Inngest configuration or mail outage cannot fail the signup.
  let queued = false;

  try {
    await inngest.send({
      name: 'newsletter/subscribed',
      data: { email, name },
    });
    queued = true;
  } catch (sendError) {
    console.error(
      'Newsletter subscriber saved, but the welcome email event was not queued:',
      sendError,
    );
  }

  return Response.json({ ok: true, queued });
}
