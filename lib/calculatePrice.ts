export function calculatePrice(weight: number, speed: string) {
  let base = 60;

  if (weight > 5) base += 30;
  if (weight > 10) base += 50;

  if (speed === 'Same Day Delivery') base += 50;
  if (speed === 'Express (24hrs)') base += 55;
  if (speed === 'International Shipping') base += 70;

  return base;
}
