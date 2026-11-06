export const KAABA = { latitude: 21.422487, longitude: 39.826206 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Arah kiblat (derajat dari utara sejati, searah jarum jam) — rumus great-circle. */
export function qiblaBearing(latitude: number, longitude: number): number {
  const φ1 = rad(latitude);
  const φ2 = rad(KAABA.latitude);
  const Δλ = rad(KAABA.longitude - longitude);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Jarak ke Ka'bah (km), rumus haversine. */
export function distanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371;
  const dφ = rad(KAABA.latitude - latitude);
  const dλ = rad(KAABA.longitude - longitude);
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(rad(latitude)) * Math.cos(rad(KAABA.latitude)) * Math.sin(dλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function compassLabel(bearing: number): string {
  const dirs = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  return dirs[Math.round(bearing / 45) % 8];
}

/** Selisih sudut terkecil (-180..180) */
export function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}
