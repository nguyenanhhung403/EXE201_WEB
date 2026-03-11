/**
 * Vietnam administrative units for UI filters:
 * Province/City -> Ward/Commune (Xã/Phường/Thị trấn)
 * Source: https://provinces.open-api.vn (public dataset, widely used)
 */
const BASE_URL = 'https://provinces.open-api.vn/api';

let cached = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export async function getProvincesWithWards({ force = false } = {}) {
  const now = Date.now();
  if (!force && cached && now - cachedAt < CACHE_TTL_MS) return cached;

  const res = await fetch(`${BASE_URL}/?depth=3`);
  if (!res.ok) throw new Error(`Failed to load VN admin units (${res.status})`);
  const data = await res.json();

  cached = (Array.isArray(data) ? data : []).map((p) => {
    const wards = [];
    (p.districts || []).forEach((d) => {
      (d.wards || []).forEach((w) => {
        wards.push({ code: w.code, name: w.name });
      });
    });
    const seen = new Set();
    const uniqueWards = wards.filter((w) => {
      const key = String(w.code);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { code: p.code, name: p.name, wards: uniqueWards };
  });

  cachedAt = now;
  return cached;
}

