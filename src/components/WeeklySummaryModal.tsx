'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { getPlantLevel, getWeeklySummary } from '@/lib/storage';
import { MOTIVATIONAL_LINES } from '@/data';
import PlantVisual from '@/components/PlantVisual';

export default function WeeklySummaryModal() {
  const { stats, showWeeklySummary, dismissWeeklySummary } = useApp();

  const plantInfo = getPlantLevel(stats);
  const summary = getWeeklySummary(stats, Math.max(1, plantInfo.level - 1));

  // Pick a stable motivational line (seeded by week number)
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const motivationalLine = MOTIVATIONAL_LINES[weekNum % MOTIVATIONAL_LINES.length];

  return (
    <AnimatePresence>
      {showWeeklySummary && (
        <motion.div
          key="weekly-summary-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismissWeeklySummary();
          }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="max-w-md w-full bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-forest-100 dark:border-dark-border"
          >
            {/* Botanical corner decorations */}
            <svg
              className="absolute -top-3 -right-3 opacity-[0.08] text-forest-600 pointer-events-none"
              width="130"
              height="130"
              viewBox="0 0 120 120"
              fill="currentColor"
            >
              <ellipse cx="90" cy="30" rx="35" ry="20" transform="rotate(-40 90 30)" />
              <ellipse cx="70" cy="10" rx="28" ry="16" transform="rotate(-60 70 10)" />
              <ellipse cx="105" cy="55" rx="22" ry="13" transform="rotate(-20 105 55)" />
            </svg>

            {/* Close button */}
            <button
              onClick={dismissWeeklySummary}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sage-400 dark:text-sage-500 hover:bg-forest-50 dark:hover:bg-dark-muted transition-colors"
            >
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
                close
              </span>
            </button>

            {/* Header with Plant Preview */}
            <div className="flex flex-col items-center mb-5">
              <div className="mb-2">
                <PlantVisual level={plantInfo.level} progress={plantInfo.progress} size="sm" animate />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-forest-900 dark:text-forest-100 text-center">
                Weekly Sustainability Summary
              </h2>
              <p className="text-xs text-sage-500 dark:text-sage-400 mt-0.5">
                Here is what you nurtured over the past 7 days
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted/40 border border-forest-100/60 dark:border-dark-border/50">
                <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1" style={{ fontSize: '20px' }}>
                  emoji_events
                </span>
                <span className="text-lg md:text-xl font-extrabold text-forest-900 dark:text-forest-100">
                  {summary.weekChallenges}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight">
                  challenges
                </span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted/40 border border-forest-100/60 dark:border-dark-border/50">
                <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1" style={{ fontSize: '20px' }}>
                  stars
                </span>
                <span className="text-lg md:text-xl font-extrabold text-forest-900 dark:text-forest-100">
                  {summary.weekPoints}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight">
                  points earned
                </span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted/40 border border-forest-100/60 dark:border-dark-border/50">
                <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1" style={{ fontSize: '20px' }}>
                  nature
                </span>
                <span className="text-lg md:text-xl font-extrabold text-forest-900 dark:text-forest-100">
                  Lv {plantInfo.level}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight truncate w-full">
                  {plantInfo.name}
                </span>
              </div>
            </div>

            {/* Plant progress bar */}
            <div className="p-3.5 rounded-2xl bg-forest-50/70 dark:bg-dark-muted/30 border border-forest-100 dark:border-dark-border mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-forest-800 dark:text-forest-200 mb-1.5">
                <span>Next Evolution Progress</span>
                <span className="text-mint-600 dark:text-mint-400 font-bold">{Math.round(plantInfo.progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-forest-100 dark:bg-dark-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-500 to-mint-400"
                  style={{ width: `${plantInfo.progress}%` }}
                />
              </div>
              <p className="text-[11px] text-sage-500 dark:text-sage-400 mt-1.5">
                {plantInfo.level < 8
                  ? `${plantInfo.nextThreshold - stats.totalPoints} points until ${plantInfo.stageName} evolves`
                  : '✧ Living Legendary Celestial Biosphere!'}
              </p>
            </div>

            {/* Motivational quote */}
            <div className="p-3 rounded-2xl bg-forest-50/40 dark:bg-dark-muted/20 border border-forest-100/40 dark:border-dark-border/30 text-center mb-6">
              <p className="text-xs italic text-forest-800 dark:text-forest-200 leading-relaxed">
                &ldquo;{motivationalLine}&rdquo;
              </p>
            </div>

            {/* Dismiss CTA */}
            <button
              onClick={dismissWeeklySummary}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-forest-700 to-forest-600 text-white font-bold text-xs md:text-sm shadow-green-md hover:from-forest-800 hover:to-forest-700 transition-all active:scale-[0.98]"
            >
              Continue Greener Journey 🌿
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
