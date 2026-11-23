import type { SupabaseClient } from '@supabase/supabase-js';
import { generateTrackingId } from '@/lib/generateTrackingId';

/**
 * Generates a tracking ID that is not already present in `shipments`.
 * Retries a few times before falling back to a plain random ID.
 */
export async function generateUniqueTrackingId(client: SupabaseClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateTrackingId();
    const { data, error } = await client
      .from('shipments')
      .select('id')
      .eq('tracking_number', candidate)
      .limit(1);

    if (!error && (!data || data.length === 0)) {
      return candidate;
    }
  }

  return generateTrackingId();
}
