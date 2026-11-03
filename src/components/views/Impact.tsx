'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { getImpactSummary, getWeeklyChartData, getPlantLevel } from '@/lib/storage';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { CHALLENGES } from '@/data';
import PlantVisual from '@/components/PlantVisual';

function ImpactStat({
  icon,
  value,
  label,
  sub,
  color = 'forest',
  delay = 0,
}: {
  icon: string;
  value: string | number;
  label: string;
  sub?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border text-center"
    >
      <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-dark-muted mx-auto mb-3 flex items-center justify-center">
        <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '24px' }}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-forest-800 dark:text-forest-200">{value}</p>
      <p className="text-sm font-medium text-sage-600 dark:text-sage-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-sage-400 dark:text-sage-500 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-forest-100 dark:border-dark-border rounded-xl px-3 py-2 shadow-soft text-sm">
      <p className="font-semibold text-forest-800 dark:text-forest-200 mb-1">{label}</p>
      <p style={{ color: '#16a34a' }}>Points: <strong>{payload[0]?.value}</strong></p>
    </div>
  );
}

export default function Impact() {
  const { stats, resetStats } = useApp();
  const impact = getImpactSummary(stats);
  const weekData = getWeeklyChartData(stats);
  const plantInfo = getPlantLevel(stats);

  // Category breakdown for radar
  const catBreakdown = ['transport', 'food', 'energy', 'waste', 'nature'].map((cat) => ({
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    completed: CHALLENGES.filter(
      (c) =>
        c.category === cat &&
        stats.completedChallenges.some((cc) => cc.challengeId === c.id)
    ).length,
    total: CHALLENGES.filter((c) => c.category === cat).length,
  }));

  const radarData = catBreakdown.map((c) => ({
    subject: c.subject,
    score: c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0,
  }));

  // Bar chart - points per day
  const barColors = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d', '#166534', '#22c55e'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-200">Your Impact</h1>
        <p className="text-sm text-sage-500 dark:text-sage-400 mt-1">
          See how your green actions are making a real difference.
        </p>
      </motion.div>

      {/* Hero impact card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-700 to-mint-700 p-6 mb-6"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-forest-200 text-sm mb-1">Total CO₂ saved</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-4xl font-bold text-white">{impact.totalCo2Saved}</span>
              <span className="text-forest-300">kg CO₂</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-forest-200 text-sm flex items-center gap-2">
                <span className="material-symbols-rounded text-mint-300" style={{ fontSize: '16px' }}>forest</span>
                Equal to planting <strong className="text-white">{impact.treesEquivalent} trees</strong>
              </p>
              <p className="text-forest-200 text-sm flex items-center gap-2">
                <span className="material-symbols-rounded text-mint-300" style={{ fontSize: '16px' }}>directions_car</span>
                Avoided <strong className="text-white">{impact.drivingKmAvoided} km</strong> of car travel
              </p>
              <p className="text-forest-200 text-sm flex items-center gap-2">
                <span className="material-symbols-rounded text-mint-300" style={{ fontSize: '16px' }}>smartphone</span>
                Charged <strong className="text-white">{impact.phonesCharged.toLocaleString()} phones</strong>
              </p>
              <p className="text-forest-200 text-sm flex items-center gap-2">
                <span className="material-symbols-rounded text-mint-300" style={{ fontSize: '16px' }}>light_mode</span>
                Powered <strong className="text-white">{impact.lightbulbHours.toLocaleString()} hrs</strong> of LED light
              </p>
            </div>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <PlantVisual level={plantInfo.level} progress={plantInfo.progress} size="md" animate />
          </div>
        </div>
      </motion.div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <ImpactStat
          icon="stars"
          value={stats.totalPoints.toLocaleString()}
          label="Total Points"
          sub="green achievements"
          delay={0.08}
        />
        <ImpactStat
          icon="check_circle"
          value={stats.challengesCompleted}
          label="Challenges"
          sub="completed in total"
          delay={0.12}
        />
        <ImpactStat
          icon="local_fire_department"
          value={`${stats.longestStreak}d`}
          label="Best Streak"
          sub={`Current: ${stats.currentStreak}d`}
          delay={0.16}
        />
        <ImpactStat
          icon="eco"
          value={impact.treesEquivalent}
          label="Trees Equiv."
          sub="planted virtually"
          delay={0.20}
        />
      </div>

      {/* Points per day bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-5"
      >
        <h3 className="font-semibold text-forest-800 dark:text-forest-200 mb-4">Points This Week</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,162,120,0.1)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#86a278' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#86a278' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="points" radius={[6, 6, 0, 0]}>
              {weekData.map((_, i) => (
                <Cell key={i} fill={barColors[i % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar: category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-5"
      >
        <h3 className="font-semibold text-forest-800 dark:text-forest-200 mb-1">Challenge Coverage</h3>
        <p className="text-xs text-sage-400 dark:text-sage-500 mb-3">
          % of challenges completed per category
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid stroke="rgba(134,162,120,0.2)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: '#86a278' }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#16a34a"
              fill="#22c55e"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Human-readable summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="bg-forest-50 dark:bg-dark-card rounded-2xl p-5 border border-forest-100 dark:border-dark-border mb-5"
      >
        <h3 className="font-semibold text-forest-800 dark:text-forest-200 mb-3 flex items-center gap-2">
          <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '20px' }}>
            volunteer_activism
          </span>
          Your Story So Far
        </h3>
        <div className="space-y-2 text-sm text-sage-600 dark:text-sage-400 leading-relaxed">
          {stats.totalPoints === 0 ? (
            <p>You haven&apos;t started yet — complete your first challenge to begin your green journey! 🌱</p>
          ) : (
            <>
              <p>
                You&apos;ve earned <strong className="text-forest-700 dark:text-forest-300">{stats.totalPoints} green points</strong> and
                completed <strong className="text-forest-700 dark:text-forest-300">{stats.challengesCompleted} challenge{stats.challengesCompleted !== 1 ? 's' : ''}</strong>.
              </p>
              {impact.treesEquivalent > 0 && (
                <p>
                  Your actions are equivalent to planting{' '}
                  <strong className="text-forest-700 dark:text-forest-300">{impact.treesEquivalent} tree{impact.treesEquivalent !== 1 ? 's' : ''}</strong>{' '}
                  — a real impact on our planet.
                </p>
              )}
              {impact.drivingKmAvoided > 0 && (
                <p>
                  You&apos;ve avoided the equivalent of{' '}
                  <strong className="text-forest-700 dark:text-forest-300">{impact.drivingKmAvoided} km</strong> of petrol car driving —
                  that&apos;s real air quality improvement.
                </p>
              )}
              {impact.phonesCharged > 0 && (
                <p>
                  You could have charged{' '}
                  <strong className="text-forest-700 dark:text-forest-300">{impact.phonesCharged.toLocaleString()} phones</strong>{' '}
                  with the energy you saved.
                </p>
              )}
              {impact.lightbulbHours > 0 && (
                <p>
                  That&apos;s <strong className="text-forest-700 dark:text-forest-300">{impact.lightbulbHours.toLocaleString()} hours</strong> of
                  clean LED lighting powered by your green choices.
                </p>
              )}
              <p className="text-forest-600 dark:text-forest-400 font-medium">
                Keep going — your tree is growing stronger every day. 🌳
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Reset button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={() => {
            if (window.confirm('Reset all your GreenPulse data? This cannot be undone.')) {
              resetStats();
            }
          }}
          className="text-xs text-sage-400 dark:text-sage-600 hover:text-red-400 dark:hover:text-red-500 transition-colors underline underline-offset-2"
        >
          Reset all data
        </button>
      </motion.div>
    </div>
  );
}
