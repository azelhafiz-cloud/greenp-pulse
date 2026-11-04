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
  delay = 0,
}: {
  icon: string;
  value: string | number;
  label: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-soft border border-forest-50 dark:border-dark-border text-center"
    >
      <div className="w-10 h-10 rounded-2xl bg-forest-50 dark:bg-dark-muted mx-auto mb-2 flex items-center justify-center text-forest-700 dark:text-forest-300">
        <span className="material-symbols-rounded" style={{ fontSize: '22px' }}>
          {icon}
        </span>
      </div>
      <p className="text-xl md:text-2xl font-extrabold text-forest-900 dark:text-forest-100">{value}</p>
      <p className="text-xs font-semibold text-sage-600 dark:text-sage-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-sage-400 dark:text-sage-500 mt-0.5 truncate">{sub}</p>}
    </motion.div>
  );
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-forest-100 dark:border-dark-border rounded-xl px-3 py-2 shadow-soft text-xs">
      <p className="font-bold text-forest-800 dark:text-forest-200 mb-1">{label}</p>
      <p style={{ color: '#16a34a' }} className="font-semibold">
        Points: <strong>{payload[0]?.value}</strong>
      </p>
    </div>
  );
}

export default function Impact() {
  const { stats, resetStats, openWeeklySummary } = useApp();
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

  const barColors = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d', '#166534', '#22c55e'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Your Tangible Impact</h1>
          <p className="text-xs text-sage-500 dark:text-sage-400 mt-0.5">
            Real-world planetary equivalents translated from your daily green actions
          </p>
        </div>

        <button
          onClick={openWeeklySummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <span className="material-symbols-rounded text-sm">summarize</span>
          <span>Weekly Report</span>
        </button>
      </motion.div>

      {/* Hero impact card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-700 to-mint-800 text-white p-6 md:p-8 mb-6 shadow-green-lg"
      >
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
          <div className="flex-1 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-forest-200 text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
              Net Environmental Reduction
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl md:text-5xl font-black text-white">{impact.totalCo2Saved}</span>
              <span className="text-forest-200 font-bold text-lg">kg CO₂ prevented</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-forest-100 font-medium">
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">forest</span>
                <span>Equal to growing <strong>{impact.treesEquivalent} tree{impact.treesEquivalent !== 1 ? 's' : ''}</strong> for 1 yr</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">directions_car</span>
                <span>Avoided <strong>{impact.drivingKmAvoided} km</strong> of car travel</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">water_drop</span>
                <span>Conserved <strong>{impact.waterLitersSaved.toLocaleString()} L</strong> clean water</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">recycling</span>
                <span>Saved <strong>{impact.plasticBagsAvoided}</strong> plastic containers/bags</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">light_mode</span>
                <span>Powered <strong>{impact.lightbulbHours.toLocaleString()} hrs</strong> of home LEDs</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-rounded text-mint-300 text-lg">smartphone</span>
                <span>Spared <strong>{impact.phonesCharged.toLocaleString()}</strong> mobile charges</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center flex-shrink-0 bg-white/5 p-4 rounded-3xl border border-white/10">
            <PlantVisual level={plantInfo.level} progress={plantInfo.progress} size="md" animate skin={stats.activeSkin ?? 'emerald'} />
            <span className="text-xs font-bold text-mint-200 mt-2">{plantInfo.name}</span>
            <span className="text-[11px] text-forest-300">Level {plantInfo.level} · {impact.leavesGrown} Leaves</span>
          </div>
        </div>
      </motion.div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <ImpactStat
          icon="stars"
          value={stats.totalPoints.toLocaleString()}
          label="Total Points"
          sub="sustainability score"
          delay={0.08}
        />
        <ImpactStat
          icon="check_circle"
          label="Challenges Done"
          value={stats.challengesCompleted}
          sub="daily & weekly tasks"
          delay={0.12}
        />
        <ImpactStat
          icon="local_fire_department"
          value={`${stats.currentStreak}d`}
          label="Active Streak"
          sub={`Record: ${stats.longestStreak} days`}
          delay={0.16}
        />
        <ImpactStat
          icon="nature"
          value={impact.leavesGrown}
          label="Leaves Grown"
          sub="on your living plant"
          delay={0.20}
        />
      </div>

      {/* Points Bar Chart & Challenge Radar */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Points per day */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm mb-4">Points Earned This Week</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,162,120,0.12)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#86a278' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#86a278' }} axisLine={false} tickLine={false} />
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
          className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm mb-1">Challenge Balance by Category</h3>
          <p className="text-xs text-sage-400 dark:text-sage-500 mb-2">% of habits explored across lifestyle areas</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="rgba(134,162,120,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#86a278' }} />
              <Radar name="Score" dataKey="score" stroke="#16a34a" fill="#22c55e" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Narrative Story */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="bg-forest-50/70 dark:bg-dark-card rounded-3xl p-6 border border-forest-100 dark:border-dark-border mb-6"
      >
        <h3 className="font-bold text-forest-900 dark:text-forest-100 text-base mb-3 flex items-center gap-2">
          <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '22px' }}>
            auto_stories
          </span>
          Your Sustainability Story
        </h3>
        <div className="space-y-2 text-xs md:text-sm text-sage-600 dark:text-sage-300 leading-relaxed">
          {stats.totalPoints === 0 ? (
            <div className="py-1">
              <p className="font-bold text-forest-800 dark:text-forest-200">
                Your sustainability story begins with your very first step! 🌱
              </p>
              <p className="text-xs text-sage-500 dark:text-sage-400 mt-1 leading-relaxed">
                You haven&apos;t logged actions yet. Walk or cycle, enjoy a plant-based meal, save electricity, or complete a green challenge to see your impact metrics come to life in trees grown, clean water conserved, and carbon avoided!
              </p>
            </div>
          ) : (
            <>
              <p>
                By making conscious daily choices, you have accumulated <strong className="text-forest-700 dark:text-forest-300">{stats.totalPoints} sustainability points</strong> and
                completed <strong className="text-forest-700 dark:text-forest-300">{stats.challengesCompleted} challenge{stats.challengesCompleted !== 1 ? 's' : ''}</strong>.
              </p>
              {impact.treesEquivalent > 0 && (
                <p>
                  Your reduction of {impact.totalCo2Saved} kg of carbon is equivalent to the biological absorption of{' '}
                  <strong className="text-forest-700 dark:text-forest-300">{impact.treesEquivalent} full-grown tree{impact.treesEquivalent !== 1 ? 's' : ''}</strong> working around the clock for an entire year.
                </p>
              )}
              {impact.drivingKmAvoided > 0 && (
                <p>
                  You have prevented the air pollution equivalent to <strong className="text-forest-700 dark:text-forest-300">{impact.drivingKmAvoided} km</strong> of gasoline vehicular transit.
                </p>
              )}
              <p className="text-forest-600 dark:text-forest-400 font-semibold pt-1">
                Your living companion plant is currently a {plantInfo.name} ({plantInfo.stageName}) and is thriving with {impact.leavesGrown} leaves! 🌳✨
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Reset button */}
      <div className="text-center">
        <button
          onClick={() => {
            if (window.confirm('Reset all your GreenPulse stats? This will reset your plant and achievements.')) {
              resetStats();
            }
          }}
          className="text-xs text-sage-400 dark:text-sage-600 hover:text-red-500 transition-colors underline underline-offset-4"
        >
          Reset application data
        </button>
      </div>
    </div>
  );
}
