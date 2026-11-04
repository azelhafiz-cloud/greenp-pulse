import { ClimatePulseData } from '@/types';

const CLIMATE_CACHE_KEY = 'greenpulse_climate_co2_cache';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const DEFAULT_CLIMATE_DATA: ClimatePulseData = {
  co2Ppm: 426.85,
  date: new Date().toISOString().split('T')[0],
  source: 'NOAA Global Monitoring Laboratory (Mauna Loa Observatory)',
  isEstimate: false,
  changeFromLastYear: 2.45,
  preIndustrialBaseline: 280.0,
  planetaryBoundary: 350.0,
  cachedAt: new Date().toISOString(),
};

export async function fetchClimatePulseData(): Promise<ClimatePulseData> {
  // Check client localStorage cache first
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CLIMATE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { data: ClimatePulseData; timestamp: number };
        const age = Date.now() - parsed.timestamp;
        if (age < CACHE_TTL_MS && parsed.data?.co2Ppm) {
          return parsed.data;
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Fetch from our cached Next.js API route
  try {
    const res = await fetch('/api/climate');
    if (res.ok) {
      const data: ClimatePulseData = await res.json();
      if (typeof window !== 'undefined' && data?.co2Ppm) {
        localStorage.setItem(
          CLIMATE_CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch climate data from API, using default baseline', err);
  }

  return DEFAULT_CLIMATE_DATA;
}

/**
 * Estimated Global CO2 Emissions Ticker
 * Benchmark: ~37.4 billion metric tonnes (Gt) of CO2/year (Global Carbon Project / IEA).
 * Rate: ~1,185.12 metric tonnes per second.
 */
export const GLOBAL_ANNUAL_EMISSIONS_TONNES = 37_400_000_000;
export const TONNES_PER_SECOND = GLOBAL_ANNUAL_EMISSIONS_TONNES / (365.25 * 24 * 3600); // ~1,185.12 tonnes/sec

export function getEstimatedEmissionsToday(now: Date = new Date()): number {
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const secondsElapsed = (now.getTime() - startOfDay.getTime()) / 1000;
  return secondsElapsed * TONNES_PER_SECOND;
}
