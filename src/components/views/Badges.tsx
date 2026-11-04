'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { BADGE_DEFINITIONS } from '@/data';
import { getPlantLevel } from '@/lib/storage';

// Map badge color strings to hex pairs
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

export default function Badges() {
  const { stats } = useApp();
  const plantInfo = getPlantLevel(stats);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

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

  const filteredBadges = badgesWithState.filter((b) => {
    if (filter === 'unlocked') return b.earned;
    if (filter === 'locked') return !b.earned;
    return true;
  });

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
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-12">
      {/* 1. Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-forest-100 dark:bg-dark-muted flex items-center justify-center text-forest-700 dark:text-forest-300">
            <span className="material-symbols-rounded" style={{ fontSize: '26px' }}>
              military_tech
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-forest-900 dark:text-forest-100">
              Badge Collection
            </h1>
            <p className="text-xs text-sage-500 dark:text-sage-400">
              Celebrate your milestone achievements and sustainability habits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 dark:bg-dark-card border border-forest-100 dark:border-dark-border text-xs font-bold text-forest-800 dark:text-forest-200">
          <span className="material-symbols-rounded text-forest-600 text-sm">nature</span>
          Level {plantInfo.level} · {plantInfo.name}
        </div>
      </motion.div>

      {/* 2. Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-100 dark:border-dark-border mb-6"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-bold text-forest-900 dark:text-forest-100">
            {earnedCount} of {totalBadges} Badges Unlocked
          </span>
          <span className="text-xs font-extrabold text-forest-600 dark:text-forest-400">
            {progressPct}% Completed
          </span>
        </div>
        <div className="h-3 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden relative">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-forest-500 via-mint-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-forest-50 dark:border-dark-border">
          {(['all', 'unlocked', 'locked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-forest-600 text-white shadow-xs'
                  : 'bg-forest-50 dark:bg-dark-muted text-sage-600 dark:text-sage-400 hover:text-forest-700'
              }`}
            >
              {tab === 'all'
                ? `All (${totalBadges})`
                : tab === 'unlocked'
                ? `Unlocked (${earnedCount})`
                : `Locked (${totalBadges - earnedCount})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3. Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {filteredBadges.map((badge, index) => {
          const [startColor, endColor] = getBadgeColors(badge.color);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedBadge(badge)}
              whileHover={{ y: -3 }}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                badge.earned
                  ? 'bg-white dark:bg-dark-card border-forest-100 dark:border-dark-border shadow-soft hover:shadow-soft-md'
                  : 'bg-sage-50/40 dark:bg-dark-card/40 border-sage-100 dark:border-dark-border/40 hover:border-forest-200'
              }`}
            >
              <div>
                {/* Icon Container */}
                <div className="relative inline-block mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      !badge.earned ? 'bg-sage-200/70 dark:bg-dark-muted' : ''
                    }`}
                    style={
                      badge.earned
                        ? {
                            background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                            boxShadow: `0 4px 14px ${startColor}40`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`material-symbols-rounded ${
                        badge.earned ? 'text-white' : 'text-sage-400 dark:text-sage-500'
                      }`}
                      style={{ fontSize: '24px' }}
                    >
                      {badge.icon}
                    </span>
                  </div>

                  {/* Corner lock indicator */}
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

                <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm leading-tight">
                  {badge.title}
                </h3>
                <p className="text-xs text-sage-500 dark:text-sage-400 mt-1 leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-forest-50/80 dark:border-dark-border/40 flex items-center justify-between">
                {badge.earned ? (
                  <span className="text-[10px] font-bold text-forest-600 dark:text-forest-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
                    Earned {getRelativeDate(badge.id)}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-sage-400">Locked Milestone</span>
                )}
                <span className="material-symbols-rounded text-sage-400 text-xs">info</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedBadge(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-sm w-full bg-white dark:bg-dark-card rounded-3xl p-6 shadow-2xl border border-forest-100 dark:border-dark-border text-center"
            >
              <div
                className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: selectedBadge.earned
                    ? `linear-gradient(135deg, ${getBadgeColors(selectedBadge.color)[0]}, ${getBadgeColors(selectedBadge.color)[1]})`
                    : '#94a3b8',
                }}
              >
                <span className="material-symbols-rounded text-white text-3xl">
                  {selectedBadge.icon}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedBadge.earned
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-dark-muted dark:text-slate-400'
                  }`}
                >
                  {selectedBadge.earned ? 'Unlocked Milestone' : 'Locked Milestone'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-forest-900 dark:text-forest-100 mb-1">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-sage-600 dark:text-sage-300 leading-relaxed mb-4">
                {selectedBadge.description}
              </p>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-forest-600 text-white font-bold text-xs hover:bg-forest-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
