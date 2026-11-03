'use client';

import { UserStats, EcoActivity, PlantHealth, WeeklySummary } from '@/types';
import { DAILY_CO2_TARGET_KG, MOTIVATIONAL_LINES } from '@/data';

const STORAGE_KEY = 'greenpulse_user_stats';

const defaultStats: UserStats = {
  totalPoints: 0,
  totalCo2SavedKg: 0,
  challengesCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  weeklyGoalKg: 35,
  completedChallenges: [],
  activities: [],
  earnedBadges: [],
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

export function loadStats(): UserStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw) as UserStats;
    // Migrate: ensure earnedBadges exists for old saves
    if (!parsed.earnedBadges) parsed.earnedBadges = [];
    return parsed;
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function getTodayActivities(stats: UserStats): EcoActivity[] {
  const today = new Date().toISOString().split('T')[0];
  return stats.activities.filter((a) => a.date === today);
}

export function getTodayCo2(stats: UserStats): number {
  return getTodayActivities(stats).reduce((sum, a) => sum + a.co2Kg, 0);
}

export function getWeekActivities(stats: UserStats): EcoActivity[] {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  return stats.activities.filter((a) => a.date >= weekAgoStr);
}

export function getWeeklyCo2(stats: UserStats): number {
  return getWeekActivities(stats).reduce((sum, a) => sum + a.co2Kg, 0);
}

export function getWeeklyChartData(stats: UserStats) {
  const days: { day: string; date: string; co2: number; points: number }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayActivities = stats.activities.filter((a) => a.date === dateStr);
    const co2 = dayActivities.reduce((sum, a) => sum + a.co2Kg, 0);
    const points = stats.completedChallenges
      .filter((c) => c.date === dateStr)
      .reduce((sum, c) => sum + c.points, 0);

    days.push({ day: dayName, date: dateStr, co2: parseFloat(co2.toFixed(2)), points });
  }
  return days;
}

export function getPlantLevel(stats: UserStats): {
  level: number;
  name: string;
  progress: number;
  nextThreshold: number;
  stageName: string;
} {
  const points = stats.totalPoints;
  const levels = [
    { threshold: 0,    name: 'Seed',              stageName: 'Just planted',      level: 1 },
    { threshold: 100,  name: 'Sprout',             stageName: 'First leaves',      level: 2 },
    { threshold: 250,  name: 'Young Plant',         stageName: 'Growing strong',    level: 3 },
    { threshold: 500,  name: 'Healthy Plant',       stageName: 'Thriving',          level: 4 },
    { threshold: 900,  name: 'Flourishing Tree',    stageName: 'Standing tall',     level: 5 },
    { threshold: 1400, name: 'Ancient Forest',      stageName: 'A living legend',   level: 6 },
  ];

  let current = levels[0];
  let nextThreshold = levels[1].threshold;

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].threshold) {
      current = levels[i];
      nextThreshold = i + 1 < levels.length ? levels[i + 1].threshold : levels[i].threshold + 500;
    }
  }

  const prevThreshold = current.threshold;
  const range = nextThreshold - prevThreshold;
  const progress = range > 0 ? Math.min(100, ((points - prevThreshold) / range) * 100) : 100;

  return {
    level: current.level,
    name: current.name,
    stageName: current.stageName,
    progress,
    nextThreshold,
  };
}

export function getTodayProgress(stats: UserStats): number {
  const todayCo2 = getTodayCo2(stats);
  const ratio = todayCo2 / DAILY_CO2_TARGET_KG;
  return Math.max(0, Math.min(100, (1 - ratio) * 100));
}

export function isChallengeCompletedToday(stats: UserStats, challengeId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return stats.completedChallenges.some(
    (c) => c.challengeId === challengeId && c.date === today
  );
}

// ─── Plant Health ─────────────────────────────────────────────────────────────

export function getPlantHealth(stats: UserStats): PlantHealth {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Find last action date (activity OR challenge completion)
  const allDates = [
    ...stats.activities.map((a) => a.date),
    ...stats.completedChallenges.map((c) => c.date),
  ].sort().reverse();

  const lastActionDate = allDates[0];

  if (!lastActionDate) {
    return {
      status: 'needs-water',
      message: 'Your plant is waiting to grow. Log your first action! 🌱',
      daysSinceLastAction: 0,
    };
  }

  const last = new Date(lastActionDate);
  const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) {
    // Check how much activity today
    const todayActs = stats.activities.filter((a) => a.date === todayStr);
    const todayChallenges = stats.completedChallenges.filter((c) => c.date === todayStr);
    const actCount = todayActs.length + todayChallenges.length;

    if (actCount >= 3) {
      return { status: 'thriving', message: 'Your plant is absolutely thriving! 🌳✨', daysSinceLastAction: 0 };
    }
    return { status: 'healthy', message: 'Your plant is healthy and growing. 🌿', daysSinceLastAction: 0 };
  }

  if (diff === 1) {
    return { status: 'healthy', message: 'Your plant misses you — do a green action today! 💚', daysSinceLastAction: 1 };
  }

  if (diff <= 3) {
    return { status: 'needs-water', message: `Your plant needs care — ${diff} days without action. 💧`, daysSinceLastAction: diff };
  }

  return { status: 'wilting', message: `Your plant is wilting after ${diff} days. Water it now! 🥺`, daysSinceLastAction: diff };
}

// ─── Impact Summary ───────────────────────────────────────────────────────────

export function getImpactSummary(stats: UserStats) {
  const treesEquivalent = Math.floor(stats.totalCo2SavedKg / 22);
  const drivingKmAvoided = Math.floor(stats.totalCo2SavedKg / 0.192);
  const phonesCharged = Math.floor(stats.totalCo2SavedKg / 0.005); // ~5g CO2 per phone charge
  const lightbulbHours = Math.floor(stats.totalCo2SavedKg / 0.01); // ~10g per LED hour
  const plantsGrown = Math.floor(stats.totalPoints / 500);
  const quickLogs = stats.activities.filter((a) => a.isQuickLog).length;

  return {
    treesEquivalent,
    drivingKmAvoided,
    phonesCharged,
    lightbulbHours,
    plantsGrown,
    quickLogs,
    totalCo2Saved: stats.totalCo2SavedKg.toFixed(1),
  };
}

// ─── Weekly Summary ───────────────────────────────────────────────────────────

export function getWeeklySummary(stats: UserStats, prevPlantLevel: number): WeeklySummary {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const weekChallenges = stats.completedChallenges.filter((c) => c.date >= weekAgoStr);
  const weekPoints = weekChallenges.reduce((sum, c) => sum + c.points, 0);
  const weekCo2Saved = weekChallenges.reduce((sum, c) => {
    return sum; // simplified — just count challenge-based
  }, 0);

  const currentLevel = getPlantLevel(stats).level;
  const plantLevelGained = currentLevel > prevPlantLevel;

  const line = MOTIVATIONAL_LINES[Math.floor(Math.random() * MOTIVATIONAL_LINES.length)];

  return {
    weekPoints,
    weekChallenges: weekChallenges.length,
    weekCo2Saved: parseFloat(weekCo2Saved.toFixed(1)),
    plantLevelGained,
    motivationalLine: line,
  };
}

export function shouldShowWeeklySummary(stats: UserStats): boolean {
  if (!stats.lastWeeklySummaryShown) return stats.challengesCompleted > 0 || stats.activities.length > 0;
  const today = new Date().toISOString().split('T')[0];
  const lastShown = new Date(stats.lastWeeklySummaryShown);
  const daysSince = Math.floor(
    (new Date().getTime() - lastShown.getTime()) / (1000 * 60 * 60 * 24)
  );
  // Show weekly summary if it's a new week (7+ days)
  return daysSince >= 7;
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function updateStreak(stats: UserStats): UserStats {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const completedToday = stats.completedChallenges.some((c) => c.date === today);
  const completedYesterday = stats.completedChallenges.some((c) => c.date === yesterdayStr);

  let { currentStreak, longestStreak } = stats;

  if (completedToday) {
    if (!completedYesterday && currentStreak === 0) {
      currentStreak = 1;
    } else if (completedYesterday) {
      // handled on completion
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  return { ...stats, currentStreak, longestStreak };
}
