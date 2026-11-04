'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  getTodayCo2,
  getWeeklyCo2,
  getWeeklyChartData,
  getTodayProgress,
  isChallengeCompletedToday,
} from '@/lib/storage';
import { DAILY_CO2_TARGET_KG, WEEKLY_CO2_TARGET_KG, CHALLENGES } from '@/data';
import LivingPlantHero from '@/components/LivingPlantHero';
import QuickLogGrid from '@/components/QuickLogGrid';
import ClimatePulse from '@/components/ClimatePulse';
import { LeafDiscoveryToast } from '@/components/LeafHerbariumModal';
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
          <p className="text-[10px] font-semibold text-sage-500 dark:text-sage-400 uppercase tracking-wider mb-1 truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold text-forest-900 dark:text-forest-100">{value}</span>
            {unit && (
              <span className="text-xs font-semibold text-sage-500 dark:text-sage-400">{unit}</span>
            )}
          </div>
          {sub && <p className="text-[11px] text-sage-400 dark:text-sage-500 mt-0.5 truncate">{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-dark-muted flex items-center justify-center flex-shrink-0 ml-2 text-forest-600 dark:text-forest-400">
          <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
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
    <div className="bg-white dark:bg-dark-card border border-forest-100 dark:border-dark-border rounded-xl px-3 py-2 shadow-soft-md text-xs">
      <p className="font-bold text-forest-800 dark:text-forest-200 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: <strong>{entry.value}</strong>{' '}
          {entry.name === 'CO₂' ? 'kg' : 'pts'}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { stats, openWeeklySummary } = useApp();
  const [leafBurst, setLeafBurst] = useState(0);

  const todayCo2 = getTodayCo2(stats);
  const weeklyCo2 = getWeeklyCo2(stats);
  const chartData = getWeeklyChartData(stats);
  const todayProgress = getTodayProgress(stats);

  const todayPct = Math.min(100, (todayCo2 / DAILY_CO2_TARGET_KG) * 100);
  const weeklyPct = Math.min(100, (weeklyCo2 / WEEKLY_CO2_TARGET_KG) * 100);

  const co2Color =
    todayPct < 40 ? 'bg-forest-500' : todayPct < 70 ? 'bg-amber-400' : 'bg-rose-500';

  // Pending challenges for today
  const todayChallenges = CHALLENGES.slice(0, 3).filter(
    (c) => !isChallengeCompletedToday(stats, c.id)
  );

  const handleActionLogged = useCallback(() => {
    setLeafBurst((p) => p + 1);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-12">
      {/* Toast when a collectible leaf is unlocked */}
      <LeafDiscoveryToast />

      {/* ── 1. Central Living Plant Sanctuary ─────────────── */}
      <LivingPlantHero leafBurstTrigger={leafBurst} />

      {/* ── Encouraging Starter Banner (when user has 0 points / new) ── */}
      {stats.totalPoints === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-forest-50 to-mint-50/70 dark:from-dark-card dark:to-dark-muted/30 border border-emerald-200 dark:border-dark-border mb-6 flex items-start sm:items-center gap-4 shadow-soft"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-forest-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-rounded text-2xl">spa</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-forest-900 dark:text-forest-100 text-sm md:text-base">
              Welcome to GreenPulse! Your Journey Begins Here
            </h4>
            <p className="text-xs text-sage-600 dark:text-sage-300 mt-1 leading-relaxed">
              Your seedling is resting peacefully. Tap any of the Quick Log buttons below (such as walked, plant-based meal, or saved electricity) to sprout your first leaves, earn points, and record your first avoided carbon!
            </p>
          </div>
        </motion.div>
      )}

      {/* ── 2. Prominent Quick Log Buttons ─────────────────── */}
      <QuickLogGrid onActionLogged={handleActionLogged} />

      {/* ── 3. Real Climate Data / Climate Pulse ───────────── */}
      <ClimatePulse />

      {/* ── 4. Stat Cards Grid (Warm & Human) ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon="co2"
          label="Today's CO₂"
          value={todayCo2.toFixed(1)}
          unit="kg"
          sub={todayCo2 === 0 ? 'Clean Slate · 5.0kg budget' : `of ${DAILY_CO2_TARGET_KG}kg budget`}
          delay={0.1}
        />
        <StatCard
          icon="calendar_month"
          label="Weekly CO₂"
          value={weeklyCo2.toFixed(1)}
          unit="kg"
          sub={weeklyCo2 === 0 ? 'Fresh week · 35kg budget' : `of ${WEEKLY_CO2_TARGET_KG}kg weekly`}
          delay={0.15}
        />
        <StatCard
          icon="stars"
          label="Total Points"
          value={stats.totalPoints > 0 ? stats.totalPoints.toLocaleString() : 'Ready!'}
          sub={stats.totalPoints === 0 ? 'Tap an action to earn' : `${stats.challengesCompleted} challenges completed`}
          delay={0.2}
        />
        <StatCard
          icon="local_fire_department"
          label="Green Streak"
          value={stats.currentStreak > 0 ? `${stats.currentStreak}d` : 'Day 1'}
          sub={stats.currentStreak === 0 ? 'Begins with first action' : `Best: ${stats.longestStreak} days`}
          delay={0.25}
        />
      </div>

      {/* ── 5. Budget & Weekly Progress Card ───────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Daily CO2 Budget */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm md:text-base">
              Personal Carbon Budget
            </h3>
            <span className="text-xs font-semibold text-sage-500 dark:text-sage-400">
              {Math.round(todayProgress)}% Eco Score
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-sage-600 dark:text-sage-400 mb-1.5 font-medium">
                <span>Today's Emissions</span>
                <span className={todayPct > 70 ? 'text-rose-500 font-bold' : 'text-forest-600 dark:text-forest-400'}>
                  {todayCo2.toFixed(1)} / {DAILY_CO2_TARGET_KG} kg
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${co2Color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${todayPct}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-sage-600 dark:text-sage-400 mb-1.5 font-medium">
                <span>7-Day Total</span>
                <span>{weeklyCo2.toFixed(1)} / {WEEKLY_CO2_TARGET_KG} kg</span>
              </div>
              <div className="h-2.5 rounded-full bg-forest-50 dark:bg-dark-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${weeklyPct < 60 ? 'bg-forest-500' : weeklyPct < 85 ? 'bg-amber-400' : 'bg-rose-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyPct}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tracker')}
            className="mt-4 text-xs font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Log customized activity
            <span className="material-symbols-rounded text-sm">arrow_forward</span>
          </button>
        </motion.div>

        {/* Weekly Summary & Motivation Card */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-forest-50 to-mint-50/50 dark:from-dark-card dark:to-dark-muted/40 rounded-3xl p-5 shadow-soft border border-forest-100 dark:border-dark-border flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-forest-100 dark:bg-dark-muted text-forest-800 dark:text-forest-200 text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-rounded text-sm">workspace_premium</span>
                Weekly Overview
              </span>
              <span className="text-xs text-sage-500">Last 7 Days</span>
            </div>
            <h4 className="font-bold text-forest-900 dark:text-forest-100 text-base mb-1">
              Your Environmental Momentum
            </h4>
            <p className="text-xs text-sage-600 dark:text-sage-300 leading-relaxed mb-4">
              Review your complete progress report, points earned, challenges overcome, and motivational insights.
            </p>
          </div>

          <button
            onClick={openWeeklySummary}
            className="w-full py-2.5 px-4 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span className="material-symbols-rounded text-base">summarize</span>
            <span>Open Weekly Summary Report</span>
          </button>
        </motion.div>
      </div>

      {/* ── 6. Weekly Chart ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm md:text-base">
              Weekly Carbon Trend (kg CO₂)
            </h3>
            <p className="text-xs text-sage-400 dark:text-sage-500">Daily tracked impact over the past 7 days</p>
          </div>
          <span className="material-symbols-rounded text-forest-400" style={{ fontSize: '20px' }}>
            show_chart
          </span>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,162,120,0.12)" />
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
              strokeWidth={2.5}
              fill="url(#co2Gradient)"
              dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#16a34a', stroke: '#dcfce7', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── 7. Today's Challenges ─────────────────────────── */}
      {todayChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-3xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-forest-900 dark:text-forest-100 text-sm md:text-base">
                Today&apos;s Recommended Challenges
              </h3>
              <p className="text-xs text-sage-400">Complete tasks to earn points and foster your plant</p>
            </div>
            <button
              onClick={() => onNavigate('challenges')}
              className="text-xs text-forest-600 dark:text-forest-400 font-bold hover:underline flex items-center gap-1"
            >
              See all
              <span className="material-symbols-rounded text-sm">chevron_right</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {todayChallenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => onNavigate('challenges')}
                className="group cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-forest-50/50 dark:bg-dark-muted/30 border border-forest-100/60 dark:border-dark-border/50 hover:border-forest-300 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-dark-muted flex items-center justify-center flex-shrink-0 text-forest-700 dark:text-forest-300 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
                    {ch.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-forest-900 dark:text-forest-100 truncate">
                    {ch.title}
                  </p>
                  <p className="text-xs text-sage-500 dark:text-sage-400">
                    +{ch.points} pts · Saves {ch.co2SavedKg} kg CO₂
                  </p>
                </div>
                <span className="material-symbols-rounded text-forest-400 group-hover:translate-x-1 transition-transform text-lg">
                  arrow_forward
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
