'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { getPlantLevel, getWeeklySummary } from '@/lib/storage';
import { MOTIVATIONAL_LINES } from '@/data';

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) dismissWeeklySummary(); }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="max-w-sm w-full bg-white dark:bg-dark-card rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Botanical corner decorations */}
            <svg
              className="absolute -top-2 -right-2 opacity-[0.07] text-forest-600"
              width="120" height="120" viewBox="0 0 120 120" fill="currentColor"
            >
              <ellipse cx="90" cy="30" rx="35" ry="20" transform="rotate(-40 90 30)" />
              <ellipse cx="70" cy="10" rx="28" ry="16" transform="rotate(-60 70 10)" />
              <ellipse cx="105" cy="55" rx="22" ry="13" transform="rotate(-20 105 55)" />
            </svg>
            <svg
              className="absolute -bottom-4 -left-4 opacity-[0.05] text-forest-500"
              width="100" height="100" viewBox="0 0 100 100" fill="currentColor"
            >
              <ellipse cx="20" cy="80" rx="30" ry="18" transform="rotate(40 20 80)" />
              <ellipse cx="40" cy="95" rx="24" ry="14" transform="rotate(60 40 95)" />
            </svg>

            {/* Close button */}
            <button
              onClick={dismissWeeklySummary}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sage-400 dark:text-sage-500 hover:bg-sage-100 dark:hover:bg-dark-muted transition-colors"
            >
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>close</span>
            </button>

            {/* Header icon */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-green-md mb-4">
                <span
                  className="material-symbols-rounded text-white"
                  style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
                >
                  park
                </span>
              </div>
              <h2 className="text-xl font-bold text-forest-800 dark:text-forest-200">This Week</h2>
              <p className="text-sm text-sage-500 dark:text-sage-400">Your green journey</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted">
                <span
                  className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1"
                  style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}
                >
                  emoji_events
                </span>
                <span className="text-xl font-bold text-forest-800 dark:text-forest-200">
                  {summary.weekChallenges}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight mt-0.5">
                  challenges
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted">
                <span
                  className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1"
                  style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
                <span className="text-xl font-bold text-forest-800 dark:text-forest-200">
                  {summary.weekPoints}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight mt-0.5">
                  points
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-2xl bg-forest-50 dark:bg-dark-muted">
                <span
                  className="material-symbols-rounded text-forest-600 dark:text-forest-400 mb-1"
                  style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}
                >
                  forest
                </span>
                <span className="text-xl font-bold text-forest-800 dark:text-forest-200">
                  Lv {plantInfo.level}
                </span>
                <span className="text-[10px] text-sage-500 dark:text-sage-400 text-center leading-tight mt-0.5">
                  {plantInfo.name}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-forest-100 dark:bg-dark-border mb-5" />

            {/* Motivational quote */}
            <p className="text-center text-sm italic text-sage-600 dark:text-sage-400 mb-6 leading-relaxed">
              &ldquo;{motivationalLine}&rdquo;
            </p>

            {/* CTA */}
            <button
              onClick={dismissWeeklySummary}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-forest-600 to-forest-500 text-white font-semibold text-sm shadow-green-md hover:from-forest-700 hover:to-forest-600 transition-all active:scale-[0.98]"
            >
              Let&apos;s keep going! 🌿
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
