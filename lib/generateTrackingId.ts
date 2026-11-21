export function generateTrackingId() {
  // Unified tracking ID format: SDN + 5 random digits
  // Used by both contact form and admin page
  return (
    'SDN' +
    Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0')
  );
}
