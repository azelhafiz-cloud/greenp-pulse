'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { BADGE_DEFINITIONS } from '@/data';
import { getPlantLevel } from '@/lib/storage';

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
  };
  return map[colorClass] ?? ['#22c55e', '#16a34a'];
};

export default function Badges() {
  const { stats } = useApp();
  const plantInfo = getPlantLevel(stats);

  const earned = new Set(stats.earnedBadges);
  const badgesWithState = BADGE_DEFINITIONS.map((b) => ({
    ...b,
    earned: earned.has(b.id),
  })).sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    if (a.earned && b.earned) {
      return stats.earnedBadges.indexOf(b.id) - stats.earnedBadges.indexOf(a.id);
    }
    return 0;
  });

  const earnedCount = badgesWithState.filter((b) => b.earned).length;
  const totalBadges = BADGE_DEFINITIONS.length;
  const progressPct = Math.round((earnedCount / totalBadges) * 100);

  // Next easiest badge to preview if none earned
  const nextBadge = BADGE_DEFINITIONS.find((b) => !earned.has(b.id)) ?? BADGE_DEFINITIONS[0];
  const [nextStartColor, nextEndColor] = getBadgeColors(nextBadge.color);

  // Helper for relative date of earned badge
  const getRelativeDate = (badgeId: string): string => {
    const allDates = [
      ...stats.activities.map((a) => a.date),
      ...stats.completedChallenges.map((c) => c.date),
    ].sort().reverse();

    const todayStr = new Date().toISOString().split('T')[0];
    const latestDate = allDates[0] || stats.createdAt?.split('T')[0] || todayStr;

    const today = new Date();
    const last = new Date(latestDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* 1. Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-dark-muted flex items-center justify-center">
            <span
              className="material-symbols-rounded text-forest-700 dark:text-forest-300"
              style={{ fontSize: '24px' }}
            >
              military_tech
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-200">Badges</h1>
            <p className="text-sm text-sage-500 dark:text-sage-400">Your green milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-50 dark:bg-dark-card border border-forest-100 dark:border-dark-border text-xs font-semibold text-forest-700 dark:text-forest-300">
          <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '16px' }}>
            yard
          </span>
          Level {plantInfo.level} · {plantInfo.name}
        </div>
      </motion.div>

      {/* 2. Summary Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-100 dark:border-dark-border mb-6"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-forest-800 dark:text-forest-200">
            {earnedCount} / {totalBadges} Badges Earned
          </span>
          <span className="text-xs font-bold text-forest-600 dark:text-forest-400">
            {progressPct}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-forest-500 to-mint-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      </motion.div>

      {/* 4. Empty State (if no badges earned yet) */}
      {earnedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-dashed border-forest-200 dark:border-dark-border text-center mb-6 shadow-soft"
        >
          <div className="w-14 h-14 rounded-2xl bg-forest-50 dark:bg-dark-muted mx-auto mb-3 flex items-center justify-center">
            <span
              className="material-symbols-rounded text-forest-600 dark:text-forest-400"
              style={{ fontSize: '32px' }}
            >
              yard
            </span>
          </div>
          <h3 className="text-base font-bold text-forest-800 dark:text-forest-200">
            No Badges Earned Yet
          </h3>
          <p className="text-sm text-sage-500 dark:text-sage-400 mt-1 max-w-sm mx-auto">
            Complete challenges to earn your first badge!
          </p>

          {/* Preview of next easiest badge */}
          <div className="mt-4 p-3.5 rounded-xl bg-forest-50/60 dark:bg-dark-muted/40 border border-forest-100 dark:border-dark-border/60 max-w-sm mx-auto text-left flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${nextStartColor}, ${nextEndColor})`,
              }}
            >
              <span className="material-symbols-rounded text-white" style={{ fontSize: '20px' }}>
                {nextBadge.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-forest-600 dark:text-forest-400 uppercase tracking-wider">
                Easiest to unlock next
              </p>
              <p className="text-xs font-bold text-forest-800 dark:text-forest-200 truncate">
                {nextBadge.title}
              </p>
              <p className="text-[11px] text-sage-500 dark:text-sage-400 truncate">
                {nextBadge.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badgesWithState.map((badge, index) => {
          const [startColor, endColor] = getBadgeColors(badge.color);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                badge.earned
                  ? 'bg-white dark:bg-dark-card border-forest-100 dark:border-dark-border shadow-soft'
                  : 'bg-sage-50/50 dark:bg-dark-card/50 border-sage-100 dark:border-dark-border/50'
              }`}
            >
              <div>
                {/* Icon circle */}
                <div className="relative inline-block">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                      !badge.earned ? 'bg-sage-200 dark:bg-dark-muted' : ''
                    }`}
                    style={
                      badge.earned
                        ? {
                            background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`material-symbols-rounded ${
                        badge.earned
                          ? 'text-white'
                          : 'text-sage-400 dark:text-sage-500'
                      }`}
                      style={{ fontSize: '24px' }}
                    >
                      {badge.icon}
                    </span>
                  </div>

                  {/* Corner lock overlay for locked badges */}
                  {!badge.earned && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sage-300 dark:bg-dark-surface border border-white dark:border-dark-card flex items-center justify-center shadow-xs">
                      <span
                        className="material-symbols-rounded text-sage-600 dark:text-sage-300"
                        style={{ fontSize: '12px' }}
                      >
                        lock
                      </span>
                    </div>
                  )}
                </div>

                {/* Badge title & description */}
                <h3 className="font-bold text-forest-800 dark:text-forest-200 text-sm mt-3 leading-tight">
                  {badge.title}
                </h3>
                <p className="text-xs text-sage-500 dark:text-sage-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Earned date or Locked status */}
              <div>
                {badge.earned ? (
                  <p className="text-[10px] text-forest-500 dark:text-forest-400 mt-2 font-medium">
                    Earned {getRelativeDate(badge.id)}
                  </p>
                ) : (
                  <p className="text-[10px] text-sage-400 mt-2">
                    Locked
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
