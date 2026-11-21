import fs from 'node:fs';

// Removes the Next.js build cache. Useful when dev/build output gets into a
// bad state (for example after an interrupted build or a Windows file lock).
fs.rmSync('.next', { recursive: true, force: true });
console.log('Removed .next cache');
