'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { CHALLENGES, CATEGORY_COLORS } from '@/data';
import { Challenge } from '@/types';

// Confetti particle
function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: x, top: y, backgroundColor: color }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        y: y + Math.random() * 200 + 100,
        x: x + (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
  );
}

const DIFFICULTY_COLORS = {
  easy:   { bg: 'bg-forest-50 dark:bg-forest-900/30', text: 'text-forest-600 dark:text-forest-400', border: 'border-forest-200 dark:border-forest-800' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-900/30',   text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-200 dark:border-amber-800'   },
  hard:   { bg: 'bg-red-50 dark:bg-red-900/30',       text: 'text-red-600 dark:text-red-400',       border: 'border-red-200 dark:border-red-800'       },
};

const CAT_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'transport', label: 'Transport' },
  { id: 'food',      label: 'Food' },
  { id: 'energy',    label: 'Energy' },
  { id: 'waste',     label: 'Waste' },
  { id: 'nature',    label: 'Nature' },
] as const;

interface ParticleData { id: number; x: number; y: number; color: string }

export default function Challenges() {
  const { stats, completeChallenge, isChallengeCompleted } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; points: number } | null>(null);

  const filtered = filter === 'all'
    ? CHALLENGES
    : CHALLENGES.filter((c) => c.category === filter);

  const handleComplete = useCallback(
    (challenge: Challenge, e: React.MouseEvent) => {
      const result = completeChallenge(challenge.id);
      if (!result.success) return;

      setCelebrating(challenge.id);

      // Spawn confetti
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const colors = ['#22c55e', '#86efac', '#4ade80', '#fbbf24', '#34d399', '#a3e635'];
      const newParticles: ParticleData[] = Array.from({ length: 18 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + Math.random() * rect.width,
        y: rect.top + window.scrollY + Math.random() * rect.height,
        color: colors[i % colors.length],
      }));
      setParticles((p) => [...p, ...newParticles]);

      // Toast
      setToastMsg({ text: `${challenge.title} completed! 🎉`, points: result.points });

      setTimeout(() => {
        setCelebrating(null);
        setParticles((p) => p.filter((pt) => !newParticles.find((np) => np.id === pt.id)));
        setToastMsg(null);
      }, 3500);
    },
    [completeChallenge]
  );

  const todayCompleted = CHALLENGES.filter((c) => isChallengeCompleted(c.id)).length;
  const totalPoints = CHALLENGES.filter((c) => isChallengeCompleted(c.id)).reduce(
    (sum, c) => sum + c.points,
    0
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8 relative">
      {/* Confetti layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
          ))}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-dark-card border border-forest-200 dark:border-forest-800 rounded-2xl px-5 py-3 shadow-green-md flex items-center gap-3"
          >
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 text-2xl">
              celebration
            </span>
            <div>
              <p className="text-sm font-semibold text-forest-800 dark:text-forest-200">{toastMsg.text}</p>
              <p className="text-xs text-forest-600 dark:text-forest-400">+{toastMsg.points} green points earned</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-200">Green Challenges</h1>
        <p className="text-sm text-sage-500 dark:text-sage-400 mt-1">
          Complete daily challenges to earn points and grow your tree.
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { icon: 'check_circle', label: 'Done today', value: todayCompleted },
          { icon: 'stars',        label: 'Points earned', value: totalPoints },
          { icon: 'local_fire_department', label: 'Streak', value: `${stats.currentStreak}d` },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dark-card rounded-2xl p-3 text-center shadow-soft border border-forest-50 dark:border-dark-border"
          >
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '20px' }}>
              {s.icon}
            </span>
            <p className="text-lg font-bold text-forest-800 dark:text-forest-200 leading-tight">{s.value}</p>
            <p className="text-xs text-sage-400 dark:text-sage-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {CAT_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-forest-600 text-white shadow-green-sm'
                : 'bg-forest-50 dark:bg-dark-muted text-sage-600 dark:text-sage-300 hover:bg-forest-100 dark:hover:bg-dark-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Challenge cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((challenge, i) => {
            const completed = isChallengeCompleted(challenge.id);
            const isCelebrating = celebrating === challenge.id;
            const diff = DIFFICULTY_COLORS[challenge.difficulty];
            const catColors = CATEGORY_COLORS[challenge.category];

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white dark:bg-dark-card rounded-2xl p-4 shadow-soft border transition-all duration-200 ${
                  completed
                    ? 'border-forest-200 dark:border-forest-800 bg-forest-50/50 dark:bg-forest-950/30'
                    : 'border-forest-50 dark:border-dark-border hover:border-forest-200 dark:hover:border-dark-muted'
                } ${isCelebrating ? 'ring-2 ring-forest-400 ring-offset-2' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl ${catColors.bg} flex items-center justify-center flex-shrink-0 ${
                      completed ? 'opacity-60' : ''
                    }`}
                  >
                    <span
                      className={`material-symbols-rounded ${catColors.icon}`}
                      style={{ fontSize: '22px' }}
                    >
                      {challenge.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-semibold leading-tight ${
                          completed
                            ? 'line-through text-sage-400 dark:text-sage-600'
                            : 'text-forest-800 dark:text-forest-200'
                        }`}
                      >
                        {challenge.title}
                      </h3>
                      {/* Points badge */}
                      <span className="flex-shrink-0 text-xs font-bold text-forest-600 dark:text-forest-400 bg-forest-50 dark:bg-dark-muted px-2 py-0.5 rounded-full">
                        +{challenge.points}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      completed ? 'text-sage-300 dark:text-sage-600' : 'text-sage-500 dark:text-sage-400'
                    }`}>
                      {challenge.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${diff.bg} ${diff.text} ${diff.border}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-sage-400 dark:text-sage-500 flex items-center gap-1">
                        <span className="material-symbols-rounded" style={{ fontSize: '12px' }}>co2</span>
                        saves ~{challenge.co2SavedKg} kg CO₂
                      </span>
                    </div>
                  </div>

                  {/* Complete button */}
                  <motion.button
                    onClick={(e) => !completed && handleComplete(challenge, e)}
                    whileHover={!completed ? { scale: 1.1 } : undefined}
                    whileTap={!completed ? { scale: 0.9 } : undefined}
                    disabled={completed}
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      completed
                        ? 'border-forest-400 bg-forest-400 dark:border-forest-600 dark:bg-forest-600'
                        : 'border-forest-200 dark:border-dark-border hover:border-forest-500 dark:hover:border-forest-400 hover:bg-forest-50 dark:hover:bg-dark-muted'
                    }`}
                  >
                    {completed ? (
                      <span className="material-symbols-rounded text-white" style={{ fontSize: '18px' }}>
                        check
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-forest-200 dark:border-dark-muted" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-rounded text-sage-300 dark:text-sage-600" style={{ fontSize: '48px' }}>
            search_off
          </span>
          <p className="text-sage-400 dark:text-sage-500 mt-2">No challenges in this category</p>
        </div>
      )}
    </div>
  );
}
