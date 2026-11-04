'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { BADGE_DEFINITIONS } from '@/data';

// Map badge color strings to actual hex values
const getBadgeColors = (colorClass: string): [string, string] => {
  const map: Record<string, [string, string]> = {
    'from-forest-400 to-forest-600': ['#4ade80', '#16a34a'],
    'from-amber-400 to-amber-600':   ['#fbbf24', '#d97706'],
    'from-orange-400 to-red-500':     ['#fb923c', '#ef4444'],
    'from-forest-500 to-mint-600':    ['#22c55e', '#0d9488'],
    'from-purple-500 to-indigo-600':  ['#a855f7', '#4f46e5'],
    'from-mint-500 to-forest-600':    ['#14b8a6', '#16a34a'],
    'from-yellow-400 to-amber-600':   ['#facc15', '#d97706'],
    'from-cyan-400 to-blue-600':      ['#22d3ee', '#2563eb'],
    'from-forest-600 to-forest-800':  ['#16a34a', '#14532d'],
    'from-forest-700 to-sage-800':    ['#15803d', '#374c30'],
    'from-sky-400 to-cyan-600':       ['#38bdf8', '#0891b2'],
    'from-forest-500 to-sage-600':    ['#22c55e', '#6b8f63'],
    'from-lime-400 to-forest-500':    ['#a3e635', '#22c55e'],
    'from-emerald-400 to-forest-600': ['#34d399', '#16a34a'],
    'from-forest-500 to-mint-500':    ['#22c55e', '#14b8a6'],
    'from-emerald-400 to-teal-600':   ['#34d399', '#0d9488'],
    'from-amber-400 to-rose-500':     ['#fbbf24', '#f43f5e'],
    'from-teal-400 to-emerald-600':   ['#2dd4bf', '#059669'],
    'from-indigo-400 to-cyan-600':    ['#818cf8', '#06b6d4'],
    'from-emerald-400 to-teal-500':   ['#34d399', '#14b8a6'],
  };
  return map[colorClass] ?? ['#22c55e', '#16a34a'];
};

export default function BadgeNotification() {
  const { newBadges, clearNewBadges } = useApp();

  useEffect(() => {
    if (newBadges.length === 0) return;
    const timer = setTimeout(() => clearNewBadges(), 3500);
    return () => clearTimeout(timer);
  }, [newBadges, clearNewBadges]);

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {newBadges.map((badgeId) => {
          const badge = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
          if (!badge) return null;
          const [startColor, endColor] = getBadgeColors(badge.color);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-dark-card rounded-2xl px-4 py-3 shadow-green-lg border border-forest-100 dark:border-dark-border flex items-center gap-3 min-w-[240px] max-w-[300px] pointer-events-auto"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                }}
              >
                <span
                  className="material-symbols-rounded text-white"
                  style={{ fontSize: '20px' }}
                >
                  {badge.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-forest-600 dark:text-forest-400 uppercase tracking-wider">
                  Badge Unlocked! 🏅
                </p>
                <p className="text-sm font-bold text-forest-800 dark:text-forest-200 truncate">
                  {badge.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
