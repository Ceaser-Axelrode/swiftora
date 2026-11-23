import { Inngest } from 'inngest';

/**
 * Shared Inngest client for Swiftora background jobs.
 *
 * In production set INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY. In development
 * run `npm run inngest:dev` and leave those unset so the SDK talks to the
 * local dev server.
 */
export const inngest = new Inngest({
  id: 'swiftora-courier',
  name: 'Swiftora Courier',
});
