#!/usr/bin/env node
/**
 * Applies the Swiftora SQL migrations through the Supabase Management API.
 *
 * The token is read from SUPABASE_ACCESS_TOKEN and is never written to disk.
 *
 * Usage (bash):
 *   SUPABASE_ACCESS_TOKEN=sbp_... npm run db:apply
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_ACCESS_TOKEN="sbp_..."; npm run db:apply
 *
 * The unused shipping_rates table is kept by default. To remove it as well:
 *   SUPABASE_ACCESS_TOKEN=sbp_... npm run db:apply -- --drop-shipping-rates
 */

import { readdirSync, readFileSync } from 'node:fs';

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

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!token) {
  console.error(
    'Missing SUPABASE_ACCESS_TOKEN. Create a personal access token at ' +
      'https://supabase.com/dashboard/account/tokens and run this script with it.',
  );
  process.exit(1);
}

if (!projectUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.');
  process.exit(1);
}

const projectRef = new URL(projectUrl).hostname.split('.')[0];
const dropShippingRates = process.argv.includes('--drop-shipping-rates');

// Apply every migration in filename order. The destructive drop migration is
// opt-in so a normal `npm run db:apply` can never remove the table.
const migrations = readdirSync(new URL('../supabase/migrations/', import.meta.url))
  .filter((file) => file.endsWith('.sql'))
  .filter((file) => dropShippingRates || !file.includes('drop_unused_shipping_rates'))
  .sort();

async function apply(file) {
  const sql = readFileSync(
    new URL(`../supabase/migrations/${file}`, import.meta.url),
    'utf8',
  );

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  const body = await response.text();
  console.log(`${file}: HTTP ${response.status}`);

  if (!response.ok) {
    throw new Error(body || 'Migration failed');
  }

  if (body) {
    console.log(body);
  }
}

async function main() {
  console.log(`Project: ${projectRef}`);
  console.log(
    `Applying ${migrations.length} migration${migrations.length > 1 ? 's' : ''}...`,
  );

  for (const file of migrations) {
    await apply(file);
  }

  console.log('\nMigrations applied. Run `npm run verify:db` to verify.');
}

main().catch((error) => {
  console.error('\nMigration failed:', error.message);
  process.exitCode = 1;
});
