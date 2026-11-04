'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { fetchClimatePulseData, getEstimatedEmissionsToday, TONNES_PER_SECOND, DEFAULT_CLIMATE_DATA } from '@/lib/climate';
import { ClimatePulseData } from '@/types';

export default function ClimatePulse() {
  const { recordClimateViewed } = useApp();
  const [data, setData] = useState<ClimatePulseData>(DEFAULT_CLIMATE_DATA);
  const [loading, setLoading] = useState(true);
  const [emissionsToday, setEmissionsToday] = useState<number>(0);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Trigger climate viewed badge on mount
  useEffect(() => {
    recordClimateViewed();
    let isSubscribed = true;

    fetchClimatePulseData().then((res) => {
      if (isSubscribed) {
        setData(res);
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [recordClimateViewed]);

  // Smooth live emissions counter
  useEffect(() => {
    // Initial calculation
    setEmissionsToday(getEstimatedEmissionsToday());

    const interval = setInterval(() => {
      setEmissionsToday(getEstimatedEmissionsToday());
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Gauge calculation: 280 ppm (0%) -> 450 ppm (100%)
  const minPpm = 280;
  const maxPpm = 450;
  const gaugePercent = Math.min(
    100,
    Math.max(0, ((data.co2Ppm - minPpm) / (maxPpm - minPpm)) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-soft border border-forest-100 dark:border-dark-border mb-6"
    >
      {/* Header with live indicator */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>
              public
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-forest-900 dark:text-forest-100 text-base md:text-lg">
                Climate Pulse · Global Atmospheric CO₂
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {loading ? 'Connecting...' : 'Live Data'}
              </span>
            </div>
            <p className="text-xs text-sage-500 dark:text-sage-400">
              Real-time atmospheric measurements from NOAA & global climate monitoring
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfoModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 dark:bg-dark-muted hover:bg-forest-100 text-xs font-semibold text-forest-700 dark:text-forest-300 transition-colors"
        >
          <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
            info
          </span>
          <span>About This Metric</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Left: Atmospheric CO2 Gauge Card */}
        <div className="p-5 rounded-2xl bg-forest-50/60 dark:bg-dark-muted/30 border border-forest-100/80 dark:border-dark-border">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-500 dark:text-sage-400">
              Atmospheric Concentration
            </span>
            <span className="text-[11px] font-medium text-forest-600 dark:text-forest-400">
              +{data.changeFromLastYear} ppm/yr
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-forest-900 dark:text-forest-100">
              {data.co2Ppm.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-forest-600 dark:text-forest-400">ppm</span>
            <span className="text-xs text-sage-400 dark:text-sage-500 ml-auto">
              {data.date}
            </span>
          </div>

          {/* Planetary Context Horizontal Gauge */}
          <div className="space-y-1.5">
            <div className="h-3 rounded-full bg-slate-200 dark:bg-dark-surface overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${gaugePercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              {/* Safe boundary marker at 350 ppm */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/90 dark:bg-white z-10"
                style={{ left: `${((350 - minPpm) / (maxPpm - minPpm)) * 100}%` }}
                title="350 ppm: Safe planetary boundary"
              />
            </div>

            <div className="flex justify-between text-[10px] text-sage-500 dark:text-sage-400 font-medium">
              <span>280 ppm (Pre-industrial)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">350 ppm (Safe Limit)</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">{data.co2Ppm} ppm (Today)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-forest-100 dark:border-dark-border/60 flex items-center justify-between text-[11px] text-sage-500 dark:text-sage-400">
            <span>Source: {data.source}</span>
            <span className="text-forest-600 dark:text-forest-400 font-medium">Updated Daily</span>
          </div>
        </div>

        {/* Right: Estimated Global Emissions Rate Ticker */}
        <div className="p-5 rounded-2xl bg-forest-50/60 dark:bg-dark-muted/30 border border-forest-100/80 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-500 dark:text-sage-400">
              Estimated Global Emissions Today
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
              Model Estimate
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2 font-mono">
            <span className="text-2xl md:text-3xl font-extrabold text-forest-900 dark:text-forest-100 tracking-tight">
              {emissionsToday > 0 ? emissionsToday.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
            </span>
            <span className="text-xs font-semibold text-sage-500 dark:text-sage-400 font-sans">
              tonnes CO₂
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3 text-xs text-forest-700 dark:text-forest-300">
            <span className="material-symbols-rounded text-sm text-forest-500">speed</span>
            <span>
              Global flow rate: ~<strong>{Math.round(TONNES_PER_SECOND).toLocaleString()}</strong> tonnes / second
            </span>
          </div>

          <p className="text-[11px] text-sage-500 dark:text-sage-400 leading-relaxed bg-white/60 dark:bg-dark-surface/60 p-2.5 rounded-xl border border-forest-100/50 dark:border-dark-border/40">
            Calculated from the ~37.4 billion tonnes/year annual fossil emission benchmark (Global Carbon Project / IEA). Your personal actions here in GreenPulse directly help reverse this curve.
          </p>
        </div>
      </div>

      {/* Metric Information Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInfoModal(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white dark:bg-dark-card rounded-3xl p-6 shadow-2xl border border-forest-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-forest-900 dark:text-forest-100 text-base">
                Understanding Atmospheric CO₂ (ppm)
              </h4>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sage-500 hover:bg-forest-50"
              >
                <span className="material-symbols-rounded text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-sage-600 dark:text-sage-300 leading-relaxed">
              <p>
                <strong>ppm (parts per million)</strong> measures the ratio of carbon dioxide molecules to all other molecules in dry air. For every million air particles, ~426 are now CO₂.
              </p>
              <p>
                <strong>Pre-industrial Era (~280 ppm):</strong> For over 10,000 years of recorded human civilization, atmospheric CO₂ remained steady near 280 ppm.
              </p>
              <p>
                <strong>Safe Boundary (350 ppm):</strong> Leading climate scientists (Hansen et al., Stockholm Resilience Centre) designate 350 ppm as the threshold to preserve ice sheets and stable weather patterns.
              </p>
              <p>
                <strong>Daily Source:</strong> Recorded at the NOAA Mauna Loa Observatory in Hawaii (the global benchmark Keeling Curve) and syndicated via open environmental monitoring APIs with hourly caching.
              </p>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-forest-600 text-white font-semibold text-xs hover:bg-forest-700 transition-colors"
            >
              Understood
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
