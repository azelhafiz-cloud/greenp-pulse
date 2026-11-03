'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  getTodayCo2,
  getWeeklyCo2,
  getWeeklyChartData,
  getPlantLevel,
  getTodayProgress,
  isChallengeCompletedToday,
  getPlantHealth,
} from '@/lib/storage';
import { DAILY_CO2_TARGET_KG, WEEKLY_CO2_TARGET_KG, CHALLENGES, QUICK_ACTIONS } from '@/data';
import PlantVisual from '@/components/PlantVisual';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TabId } from '@/types';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

function StatCard({
  icon,
  label,
  value,
  unit,
  sub,
  delay = 0,
}: {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-soft border border-forest-50 dark:border-dark-border"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wide mb-1 truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-forest-800 dark:text-forest-200">{value}</span>
            {unit && (
              <span className="text-xs text-sage-500 dark:text-sage-400">{unit}</span>
            )}
          </div>
          {sub && <p className="text-[10px] text-sage-400 dark:text-sage-500 mt-0.5 truncate">{sub}</p>}
        </div>
        <div className="w-8 h-8 rounded-xl bg-forest-50 dark:bg-dark-muted flex items-center justify-center flex-shrink-0 ml-2">
          <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '18px' }}>
            {icon}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Custom Recharts tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-forest-100 dark:border-dark-border rounded-xl px-3 py-2 shadow-soft-md text-sm">
      <p className="font-semibold text-forest-800 dark:text-forest-200 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>{' '}
          {entry.name === 'CO₂' ? 'kg' : 'pts'}
        </p>
      ))}
    </div>
  );
}

// Quick log feedback burst
function PointsBurst({ points, label }: { points: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: [-8, -32, -48, -64], scale: [0.6, 1.1, 1, 0.8] }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 text-center"
    >
      <span className="text-forest-600 dark:text-forest-300 font-bold text-sm">+{points} pts</span>
      <div className="text-[10px] text-forest-500 dark:text-forest-400 whitespace-nowrap">{label}</div>
    </motion.div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { stats, quickLog } = useApp();

  const [bursts, setBursts] = useState<{ id: number; points: number; label: string; actionId: string }[]>([]);
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [plantPulse, setPlantPulse] = useState(0);

  const todayCo2 = getTodayCo2(stats);
  const weeklyCo2 = getWeeklyCo2(stats);
  const chartData = getWeeklyChartData(stats);
  const plantInfo = getPlantLevel(stats);
  const todayProgress = getTodayProgress(stats);
  const plantHealth = getPlantHealth(stats);

  // Today's CO2 % vs target
  const todayPct = Math.min(100, (todayCo2 / DAILY_CO2_TARGET_KG) * 100);
  const weeklyPct = Math.min(100, (weeklyCo2 / WEEKLY_CO2_TARGET_KG) * 100);

  // CO2 bar color
  const co2Color =
    todayPct < 40 ? 'bg-forest-500' : todayPct < 70 ? 'bg-amber-400' : 'bg-red-400';

  // Pending challenges for today
  const todayChallenges = CHALLENGES.slice(0, 3).filter(
    (c) => !isChallengeCompletedToday(stats, c.id)
  );

  // Plant health badge config
  const healthConfig = {
    thriving: { bg: 'bg-forest-100 dark:bg-forest-900/40', text: 'text-forest-700 dark:text-forest-300', icon: 'favorite' },
    healthy: { bg: 'bg-mint-50 dark:bg-mint-900/20', text: 'text-mint-700 dark:text-mint-300', icon: 'eco' },
    'needs-water': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', icon: 'water_drop' },
    wilting: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-300', icon: 'sentiment_dissatisfied' },
  };
  const hc = healthConfig[plantHealth.status];

  const handleQuickLog = useCallback(
    (actionId: string) => {
      const result = quickLog(actionId);
      if (result.success) {
        setLastTapped(actionId);
        setPlantPulse((p) => p + 1);
        const burstId = Date.now();
        setBursts((prev) => [...prev, { id: burstId, points: result.points, label: result.label, actionId }]);
        setTimeout(() => {
          setBursts((prev) => prev.filter((b) => b.id !== burstId));
        }, 1600);
        setTimeout(() => setLastTapped(null), 400);
      }
    },
    [quickLog]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-8">

      {/* ── Plant Hero Section ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-700 via-forest-600 to-mint-700 p-6 md:p-8 mb-5 shadow-green-lg"
      >
        {/* Botanical decorations */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-14 -left-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-16 h-16 rounded-full bg-white/[0.03]" />

        <div className="relative flex items-end justify-between gap-4">
          {/* Left: greeting + status */}
          <div className="flex-1 min-w-0">
            <p className="text-forest-200 text-sm font-medium mb-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
              Good{' '}
              {new Date().getHours() < 12
                ? 'Morning'
                : new Date().getHours() < 17
                ? 'Afternoon'
                : 'Evening'}{' '}
              🌿
            </h1>

            {/* Plant level name */}
            <p className="text-forest-200 text-sm mb-3">
              Your tree is a{' '}
              <strong className="text-white">{plantInfo.name}</strong>
              <span className="text-forest-300"> · {plantInfo.stageName}</span>
            </p>

            {/* Plant health badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full max-w-xs ${hc.bg} ${hc.text} text-xs font-medium mb-4`}>
              <span className="material-symbols-rounded flex-shrink-0" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>
                {hc.icon}
              </span>
              <span className="truncate">{plantHealth.message}</span>
            </div>

            {/* Today's progress bar */}
            <div>
              <div className="flex justify-between text-xs text-forest-200 mb-1.5">
                <span>Today&apos;s eco score</span>
                <span>{Math.round(todayProgress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden w-48 md:w-64">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-mint-400 to-forest-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Right: Large Plant Visual */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <motion.div
              key={plantPulse}
              animate={plantPulse > 0 ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <PlantVisual
                level={plantInfo.level}
                progress={plantInfo.progress}
                size="md"
                animate
                healthStatus={plantHealth.status}
              />
            </motion.div>
            <div className="text-center">
              <p className="text-white/80 text-[10px] font-medium">Lv {plantInfo.level}</p>
              <div className="w-16 h-1 rounded-full bg-white/20 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-mint-400"
                  style={{ width: `${plantInfo.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Log Buttons ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-forest-800 dark:text-forest-200 text-sm">Quick Log</h2>
            <p className="text-xs text-sage-400 dark:text-sage-500">One tap to track your green actions</p>
          </div>
          <span className="material-symbols-rounded text-forest-400" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <div className="grid grid-cols-5 gap-2 min-w-[300px]">
            {QUICK_ACTIONS.map((action) => {
              const isJustTapped = lastTapped === action.id;
              const myBurst = bursts.filter((b) => b.actionId === action.id);
              return (
                <div key={action.id} className="relative">
                  {/* Points burst */}
                  <AnimatePresence>
                    {myBurst.map((b) => (
                      <PointsBurst key={b.id} points={b.points} label="" />
                    ))}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => handleQuickLog(action.id)}
                    whileTap={{ scale: 0.88 }}
                    animate={isJustTapped ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 transition-all duration-200 ${
                      isJustTapped
                        ? 'border-forest-400 bg-forest-50 dark:bg-forest-900/30'
                        : 'border-forest-100 dark:border-dark-border bg-forest-50/50 dark:bg-dark-muted/30 hover:border-forest-300 dark:hover:border-forest-600 hover:bg-forest-50 dark:hover:bg-dark-muted/60'
                    }`}
                    title={action.label}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${actionColors[action.id]?.[0] ?? '#22c55e'}, ${actionColors[action.id]?.[1] ?? '#16a34a'})`,
                      }}
                    >
                      <span
                        className="material-symbols-rounded text-white"
                        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                      >
                        {action.icon}
                      </span>
                    </div>
                    <span className="text-[9px] font-medium text-forest-700 dark:text-forest-300 text-center leading-tight line-clamp-2">
                      {action.label}
                    </span>
                    <span className="text-[8px] text-forest-500 dark:text-forest-400 font-semibold">
                      +{action.points}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon="co2"
          label="Today's CO₂"
          value={todayCo2.toFixed(1)}
          unit="kg"
          sub={`of ${DAILY_CO2_TARGET_KG}kg target`}
          delay={0.15}
        />
        <StatCard
          icon="calendar_month"
          label="Weekly CO₂"
          value={weeklyCo2.toFixed(1)}
          unit="kg"
          sub={`of ${WEEKLY_CO2_TARGET_KG}kg weekly`}
          delay={0.18}
        />
        <StatCard
          icon="stars"
          label="Total Points"
          value={stats.totalPoints.toLocaleString()}
          sub={`${stats.challengesCompleted} challenges`}
          delay={0.21}
        />
        <StatCard
          icon="local_fire_department"
          label="Streak"
          value={stats.currentStreak}
          unit="days"
          sub={`Best: ${stats.longestStreak}`}
          delay={0.24}
        />
      </div>

      {/* ── Plant level + CO2 Budget ──────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {/* Plant level card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-forest-800 dark:text-forest-200">Your Plant</h3>
              <p className="text-sm text-sage-500 dark:text-sage-400">Level {plantInfo.level} · {plantInfo.name}</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-50 dark:bg-dark-muted text-xs font-semibold text-forest-700 dark:text-forest-300">
              <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>stars</span>
              {stats.totalPoints} pts
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PlantVisual level={plantInfo.level} progress={plantInfo.progress} size="sm" animate={false} healthStatus={plantHealth.status} />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-sage-500 dark:text-sage-400 mb-1.5">
                <span>Progress to next level</span>
                <span>{Math.round(plantInfo.progress)}%</span>
              </div>
              <div className="h-3 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-forest-500 to-mint-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${plantInfo.progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.35 }}
                />
              </div>
              <p className="text-xs text-sage-400 dark:text-sage-500 mt-1.5">
                {plantInfo.nextThreshold - stats.totalPoints} pts to{' '}
                {plantInfo.level < 6 ? 'next level' : 'Ancient Forest!'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CO2 budget card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.31 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <h3 className="font-semibold text-forest-800 dark:text-forest-200 mb-4">CO₂ Budget</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-sage-500 dark:text-sage-400 mb-1.5">
                <span>Today</span>
                <span className={todayPct > 70 ? 'text-red-500' : 'text-forest-600 dark:text-forest-400'}>
                  {todayCo2.toFixed(1)} / {DAILY_CO2_TARGET_KG} kg
                </span>
              </div>
              <div className="h-3 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${co2Color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${todayPct}%` }}
                  transition={{ duration: 1, delay: 0.38 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-sage-500 dark:text-sage-400 mb-1.5">
                <span>This week</span>
                <span>{weeklyCo2.toFixed(1)} / {WEEKLY_CO2_TARGET_KG} kg</span>
              </div>
              <div className="h-3 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${weeklyPct < 60 ? 'bg-forest-500' : weeklyPct < 85 ? 'bg-amber-400' : 'bg-red-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyPct}%` }}
                  transition={{ duration: 1, delay: 0.45 }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tracker')}
            className="mt-4 text-sm text-forest-600 dark:text-forest-400 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Log an activity
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </motion.div>
      </div>

      {/* ── Weekly chart ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-800 dark:text-forest-200">Weekly CO₂ (kg)</h3>
          <span className="text-xs text-sage-400 dark:text-sage-500">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0}  />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,162,120,0.1)" />
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="co2"
              name="CO₂"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#co2Gradient)"
              dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#16a34a', stroke: '#dcfce7', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Pending challenges ────────────────────────── */}
      {todayChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-forest-800 dark:text-forest-200">Today&apos;s Challenges</h3>
            <button
              onClick={() => onNavigate('challenges')}
              className="text-xs text-forest-600 dark:text-forest-400 font-medium hover:underline"
            >
              See all
            </button>
          </div>
          <div className="space-y-2">
            {todayChallenges.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-forest-50/60 dark:bg-dark-muted/40 border border-forest-100/50 dark:border-dark-border/50"
              >
                <div className="w-8 h-8 rounded-lg bg-forest-100 dark:bg-dark-muted flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '18px' }}>
                    {ch.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest-800 dark:text-forest-200 truncate">{ch.title}</p>
                  <p className="text-xs text-sage-400 dark:text-sage-500">+{ch.points} pts</p>
                </div>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-forest-200 dark:border-dark-muted hover:border-forest-500 dark:hover:border-forest-400 transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Quick action color map (gradient stops)
const actionColors: Record<string, [string, string]> = {
  'q-walk':             ['#60a5fa', '#2563eb'],
  'q-plant-meal':       ['#22c55e', '#15803d'],
  'q-no-plastic':       ['#22d3ee', '#0891b2'],
  'q-electricity':      ['#fbbf24', '#d97706'],
  'q-public-transport': ['#a3b18a', '#6b8f63'],
};
