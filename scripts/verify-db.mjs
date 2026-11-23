#!/usr/bin/env node
/**
 * Verifies the Swiftora Supabase project end to end.
 *
 * Usage:
 *   npm run verify:db
 *
 * The script uses the credentials in .env, checks the schema, RLS, auth, and
 * performs a create/read/update/delete cycle with temporary rows. Every test
 * row is removed in the finally block.
 */

import { readFileSync } from 'node:fs';

function loadEnv(file) {
  const text = readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

loadEnv(new URL('../.env', import.meta.url));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error(
    'Missing Supabase credentials. Expected NEXT_PUBLIC_SUPABASE_URL, ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.',
  );
  process.exit(1);
}

const TEST_ID = `VERIFY-${Date.now()}`;
const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n${title}`);
}

async function request(path, { method = 'GET', key = serviceKey, body, headers = {} } = {}) {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { status: res.status, data };
}

function columnsOf(spec, table) {
  return Object.keys(spec.data?.definitions?.[table]?.properties ?? {});
}

async function main() {
  console.log(`Swiftora database verification`);
  console.log(`Project: ${url}`);

  section('Schema');
  const spec = await request('/rest/v1/');
  record('REST API reachable', spec.status === 200, `HTTP ${spec.status}`);

  const required = {
    shipments: [
      'id',
      'tracking_number',
      'sender',
      'receiver',
      'status',
      'current_location',
      'created_at',
    ],
    tracking_updates: [
      'id',
      'shipment_id',
      'location',
      'message',
      'lat',
      'lng',
      'created_at',
    ],
    shipments_info: [
      'id',
      'tracking_id',
      'first_name',
      'last_name',
      'email',
      'phone',
      'shipment_type',
      'delivery_speed',
      'pickup',
      'delivery',
      'weight',
      'price',
      'status',
      'created_at',
      'company_name',
      'info',
      'terms_accepted',
      'privacy_accepted',
      'marketing_consent',
      'consent_timestamp',
      'ip_address',
    ],
    profiles: [
      'id',
      'user_id',
      'role',
      'full_name',
      'phone',
      'avatar_url',
      'created_at',
      'updated_at',
    ],
    newsletter_subscribers: [
      'id',
      'email',
      'name',
      'subscribed_at',
      'is_active',
      'source',
      'ip_address',
      'user_agent',
      'unsubscribed_at',
    ],
  };

  for (const [table, requiredColumns] of Object.entries(required)) {
    const exists = Boolean(spec.data?.definitions?.[table]);
    record(`table ${table} exists`, exists);
    if (!exists) continue;

    const actual = columnsOf(spec, table);
    const missing = requiredColumns.filter((column) => !actual.includes(column));
    record(
      `table ${table} has all app columns`,
      missing.length === 0,
      missing.length ? `missing: ${missing.join(', ')}` : '',
    );
  }

  const fkDescription =
    spec.data?.definitions?.tracking_updates?.properties?.shipment_id
      ?.description ?? '';
  record(
    'tracking_updates.shipment_id points to shipments.id',
    fkDescription.includes('shipments.id'),
  );

  section('Auth');
  const authHealth = await request('/auth/v1/health', { key: anonKey });
  record('auth service healthy', authHealth.status === 200, `HTTP ${authHealth.status}`);

  section('Public tracking access (anon key)');
  const anonShipments = await request('/rest/v1/shipments?select=id&limit=1', {
    key: anonKey,
  });
  record(
    'anon can read shipments',
    anonShipments.status === 200,
    `HTTP ${anonShipments.status}`,
  );

  const anonUpdates = await request(
    '/rest/v1/tracking_updates?select=id&limit=1',
    { key: anonKey },
  );
  record(
    'anon can read tracking_updates',
    anonUpdates.status === 200,
    `HTTP ${anonUpdates.status}`,
  );

  const anonInfo = await request('/rest/v1/shipments_info?select=id&limit=1', {
    key: anonKey,
  });
  record(
    'anon CANNOT read shipments_info (personal data)',
    [401, 403].includes(anonInfo.status),
    anonInfo.status === 200
      ? 'PUBLIC PII EXPOSED — run the core migration'
      : `HTTP ${anonInfo.status}`,
  );

  const anonInsert = await request('/rest/v1/shipments', {
    method: 'POST',
    key: anonKey,
    headers: { Prefer: 'return=representation' },
    body: {
      tracking_number: `${TEST_ID}-ANON`,
      sender: 'Anon test',
      receiver: 'Anon test',
      status: 'Shipment Created',
      current_location: 'Test',
    },
  });
  record(
    'anon CANNOT insert shipments',
    [401, 403].includes(anonInsert.status),
    `HTTP ${anonInsert.status}`,
  );

  const anonProfiles = await request('/rest/v1/profiles?select=id&limit=1', {
    key: anonKey,
  });
  record(
    'anon CANNOT read profiles',
    [401, 403].includes(anonProfiles.status),
    `HTTP ${anonProfiles.status}`,
  );

  const anonNewsletter = await request(
    '/rest/v1/newsletter_subscribers?select=id&limit=1',
    { key: anonKey },
  );
  record(
    'anon CANNOT read newsletter_subscribers',
    [401, 403].includes(anonNewsletter.status),
    `HTTP ${anonNewsletter.status}`,
  );

  section('Admin directory');
  const profilesRead = await request(
    '/rest/v1/profiles?select=id,user_id,role&limit=5',
  );
  record(
    'profiles backfilled for existing auth users',
    profilesRead.status === 200 &&
      Array.isArray(profilesRead.data) &&
      profilesRead.data.length > 0,
    `HTTP ${profilesRead.status}, ${profilesRead.data?.length ?? 0} rows`,
  );

  const newsletterRead = await request(
    '/rest/v1/newsletter_subscribers?select=id,email,is_active&limit=1',
  );
  record(
    'service role can read newsletter_subscribers',
    newsletterRead.status === 200,
    `HTTP ${newsletterRead.status}`,
  );

  section('Service-role write cycle');
  let shipmentId = null;
  let infoId = null;
  let newsletterId = null;

  try {
    const infoInsert = await request('/rest/v1/shipments_info', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: {
        tracking_id: TEST_ID,
        first_name: 'Verification',
        last_name: 'Run',
        email: 'verify@example.com',
        phone: '0000000000',
        company_name: 'Automated verification',
        shipment_type: 'Documents',
        delivery_speed: 'Standard Delivery',
        pickup: 'Verification pickup',
        delivery: 'Verification delivery',
        weight: 1,
        price: 60,
        info: 'Automated verification row - safe to delete',
        terms_accepted: true,
        privacy_accepted: true,
        marketing_consent: false,
        consent_timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1',
      },
    });
    infoId = infoInsert.data?.[0]?.id ?? null;
    record(
      'service role can insert shipment requests',
      [200, 201].includes(infoInsert.status),
      `HTTP ${infoInsert.status}`,
    );

    const shipmentInsert = await request('/rest/v1/shipments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: {
        tracking_number: TEST_ID,
        sender: 'Verification',
        receiver: 'Verification',
        status: 'Shipment Created',
        current_location: 'Origin Facility',
      },
    });
    shipmentId = shipmentInsert.data?.[0]?.id ?? null;
    record(
      'service role can insert shipments',
      [200, 201].includes(shipmentInsert.status) && Boolean(shipmentId),
      `HTTP ${shipmentInsert.status}`,
    );

    if (shipmentId) {
      const updateInsert = await request('/rest/v1/tracking_updates', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: {
          shipment_id: shipmentId,
          location: 'Verification Hub',
          message: 'Automated verification update',
          lat: 1.23,
          lng: 4.56,
        },
      });
      record(
        'service role can insert tracking updates',
        [200, 201].includes(updateInsert.status),
        `HTTP ${updateInsert.status}`,
      );

      const shipmentUpdate = await request(
        `/rest/v1/shipments?id=eq.${shipmentId}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: {
            status: 'In Transit',
            current_location: 'Verification Hub',
          },
        },
      );
      record(
        'service role can update shipment status',
        shipmentUpdate.status === 200 &&
          shipmentUpdate.data?.[0]?.status === 'In Transit',
        `HTTP ${shipmentUpdate.status}`,
      );

      const nested = await request(
        `/rest/v1/shipments?select=tracking_number,status,tracking_updates!fk_shipment(location,message)&tracking_number=eq.${TEST_ID}`,
        { key: anonKey },
      );
      const nestedRow = Array.isArray(nested.data) ? nested.data[0] : null;
      record(
        'public nested tracking query works (fk_shipment)',
        nested.status === 200 && nestedRow?.tracking_updates?.length === 1,
        `HTTP ${nested.status}`,
      );
    }

    const newsletterInsert = await request(
      '/rest/v1/newsletter_subscribers',
      {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: {
          email: `${TEST_ID.toLowerCase()}@example.com`,
          name: 'Verification',
          is_active: true,
          source: 'verify',
          ip_address: '127.0.0.1',
          user_agent: 'verify-db',
        },
      },
    );
    newsletterId = newsletterInsert.data?.[0]?.id ?? null;
    record(
      'service role can insert newsletter subscribers',
      [200, 201].includes(newsletterInsert.status) && Boolean(newsletterId),
      `HTTP ${newsletterInsert.status}`,
    );

    if (newsletterId) {
      const unsubscribe = await request(
        `/rest/v1/newsletter_subscribers?id=eq.${newsletterId}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: {
            is_active: false,
            unsubscribed_at: new Date().toISOString(),
          },
        },
      );
      record(
        'service role can unsubscribe a subscriber',
        unsubscribe.status === 200 &&
          unsubscribe.data?.[0]?.is_active === false,
        `HTTP ${unsubscribe.status}`,
      );
    }
  } finally {
    if (shipmentId) {
      await request(`/rest/v1/tracking_updates?shipment_id=eq.${shipmentId}`, {
        method: 'DELETE',
      });
      await request(`/rest/v1/shipments?id=eq.${shipmentId}`, {
        method: 'DELETE',
      });
    }
    if (infoId) {
      await request(`/rest/v1/shipments_info?id=eq.${infoId}`, {
        method: 'DELETE',
      });
    }
    if (newsletterId) {
      await request(
        `/rest/v1/newsletter_subscribers?id=eq.${newsletterId}`,
        { method: 'DELETE' },
      );
    }
    await request(
      `/rest/v1/shipments?tracking_number=eq.${TEST_ID}-ANON`,
      { method: 'DELETE' },
    );
  }

  const cleanupShipment = await request(
    `/rest/v1/shipments?select=id&tracking_number=eq.${TEST_ID}`,
  );
  const cleanupInfo = await request(
    `/rest/v1/shipments_info?select=id&tracking_id=eq.${TEST_ID}`,
  );
  const cleanupNewsletter = await request(
    `/rest/v1/newsletter_subscribers?select=id&email=eq.${TEST_ID.toLowerCase()}@example.com`,
  );
  record(
    'temporary test rows cleaned up',
    Array.isArray(cleanupShipment.data) &&
      cleanupShipment.data.length === 0 &&
      Array.isArray(cleanupInfo.data) &&
      cleanupInfo.data.length === 0 &&
      Array.isArray(cleanupNewsletter.data) &&
      cleanupNewsletter.data.length === 0,
  );

  const failed = results.filter((result) => !result.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} checks passed`,
  );

  if (failed.length) {
    console.log('\nFailed checks:');
    for (const result of failed) {
      console.log(`- ${result.name}${result.detail ? ` (${result.detail})` : ''}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('\nVerification crashed:', error);
  process.exitCode = 1;
});
