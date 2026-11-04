'use client';

import { UserStats, EcoActivity, PlantHealth, WeeklySummary } from '@/types';
import { DAILY_CO2_TARGET_KG, MOTIVATIONAL_LINES, PLANT_STAGES, PLANT_PERSONALITY_QUOTES } from '@/data';

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
    // Migrate: ensure arrays and fields exist for old saves
    if (!parsed.earnedBadges) parsed.earnedBadges = [];
    if (!parsed.collectedLeaves) parsed.collectedLeaves = [];
    if (!parsed.activeSkin) parsed.activeSkin = 'emerald';
    if (!parsed.atmosphereEnabled) parsed.atmosphereEnabled = true;

    // Consistency fix: if totalCo2SavedKg is 0 but user has completed challenges or activities, repair totalCo2SavedKg
    const activityCo2 = (parsed.activities || []).reduce((sum, a) => sum + (a.co2Kg || 0), 0);
    const challengeCo2 = (parsed.completedChallenges || []).length * 1.5;
    if ((parsed.totalCo2SavedKg === 0 || !parsed.totalCo2SavedKg) && (activityCo2 > 0 || challengeCo2 > 0)) {
      parsed.totalCo2SavedKg = parseFloat((activityCo2 + challengeCo2).toFixed(2));
    }
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
  stageName: string;
  progress: number;
  nextThreshold: number;
  description: string;
  formTitle: string;
  isSpecial: boolean;
  ascensionTier: number;
  isAscended: boolean;
} {
  const points = stats.totalPoints;
  const levels = PLANT_STAGES;

  let current = levels[0];
  let nextThreshold = levels[1].threshold;

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].threshold) {
      current = levels[i];
      nextThreshold = i + 1 < levels.length ? levels[i + 1].threshold : levels[i].threshold + 800;
    }
  }

  const prevThreshold = current.threshold;
  const range = nextThreshold - prevThreshold;
  const progress = range > 0 ? Math.min(100, Math.max(0, ((points - prevThreshold) / range) * 100)) : 100;

  // Endless Ascension system once max base stage (3500+ pts) is achieved
  const maxThreshold = levels[levels.length - 1].threshold;
  const ascensionTier = points >= maxThreshold ? Math.floor((points - maxThreshold) / 800) + 1 : 0;
  const isAscended = ascensionTier > 0;

  const formTitle = isAscended
    ? `✦ Celestial Biosphere (Ascension Tier ${ascensionTier})`
    : current.formTitle;

  return {
    level: isAscended ? 8 + ascensionTier : current.level,
    name: isAscended ? `Celestial Grove ✦ Tier ${ascensionTier}` : current.name,
    stageName: isAscended ? `Ascended Legend · Tier ${ascensionTier}` : current.stageName,
    progress: isAscended ? Math.min(100, ((points - (maxThreshold + (ascensionTier - 1) * 800)) / 800) * 100) : progress,
    nextThreshold: isAscended ? maxThreshold + ascensionTier * 800 : nextThreshold,
    description: isAscended
      ? `A transcendent cosmic biosphere blooming with eternal starlight and infinite ecological mastery.`
      : current.description,
    formTitle,
    isSpecial: Boolean(current.isSpecial || isAscended),
    ascensionTier,
    isAscended,
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

// ─── Plant Health & Personality ───────────────────────────────────────────────

export function getPlantHealth(stats: UserStats): PlantHealth {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const hour = today.getHours();

  // Leaf count based on points + activities
  const leafCount = Math.max(2, Math.floor(stats.totalPoints / 18) + stats.activities.length * 2 + 4);

  // Find last action date (activity OR challenge completion)
  const allDates = [
    ...stats.activities.map((a) => a.date),
    ...stats.completedChallenges.map((c) => c.date),
  ].sort().reverse();

  const lastActionDate = allDates[0];

  const pickQuote = (arr: string[]) => arr[Math.floor((stats.totalPoints + stats.activities.length) % arr.length)];

  if (!lastActionDate) {
    return {
      status: 'needs-water',
      message: 'Your plant is waiting to grow. Log your first action! 🌱',
      personalityQuote: 'A single seed holds infinite possibilities. Ready to grow together? 🌱',
      daysSinceLastAction: 0,
      leafCount,
      vitalityPct: 60,
    };
  }

  const last = new Date(lastActionDate);
  const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) {
    const todayActs = stats.activities.filter((a) => a.date === todayStr);
    const todayChallenges = stats.completedChallenges.filter((c) => c.date === todayStr);
    const actCount = todayActs.length + todayChallenges.length;

    if (actCount >= 3) {
      return {
        status: 'thriving',
        message: 'Your plant is absolutely thriving! 🌳✨',
        personalityQuote: pickQuote(PLANT_PERSONALITY_QUOTES.thriving),
        daysSinceLastAction: 0,
        leafCount: leafCount + 6,
        vitalityPct: 100,
      };
    }

    const timeGreeting =
      hour < 12
        ? pickQuote(PLANT_PERSONALITY_QUOTES.morning)
        : hour < 18
        ? pickQuote(PLANT_PERSONALITY_QUOTES.afternoon)
        : pickQuote(PLANT_PERSONALITY_QUOTES.evening);

    return {
      status: 'healthy',
      message: 'Your plant is healthy and actively growing. 🌿',
      personalityQuote: timeGreeting || pickQuote(PLANT_PERSONALITY_QUOTES.healthy),
      daysSinceLastAction: 0,
      leafCount,
      vitalityPct: 85,
    };
  }

  if (diff === 1) {
    return {
      status: 'healthy',
      message: 'Your plant is resting and ready for today! 💚',
      personalityQuote: pickQuote(PLANT_PERSONALITY_QUOTES.healthy),
      daysSinceLastAction: 1,
      leafCount,
      vitalityPct: 80,
    };
  }

  if (diff <= 3) {
    return {
      status: 'needs-water',
      message: `Your plant needs care — ${diff} days without an eco action. 💧`,
      personalityQuote: pickQuote(PLANT_PERSONALITY_QUOTES['needs-water']),
      daysSinceLastAction: diff,
      leafCount: Math.max(2, leafCount - 4),
      vitalityPct: 50,
    };
  }

  return {
    status: 'wilting',
    message: `Your plant is slightly wilted after ${diff} days. Water it with an action! 🥺`,
    personalityQuote: pickQuote(PLANT_PERSONALITY_QUOTES.wilting),
    daysSinceLastAction: diff,
    leafCount: Math.max(1, leafCount - 8),
    vitalityPct: 25,
  };
}

// ─── Impact Summary ───────────────────────────────────────────────────────────

export function getImpactSummary(stats: UserStats) {
  // Ensure real CO2 is counted even if totalCo2SavedKg was missed
  const effectiveCo2 = stats.totalCo2SavedKg > 0
    ? stats.totalCo2SavedKg
    : (stats.activities || []).reduce((sum, a) => sum + (a.co2Kg || 0), 0) + (stats.completedChallenges || []).length * 1.5;

  const treesEquivalent = Math.floor(effectiveCo2 / 22);
  const drivingKmAvoided = Math.floor(effectiveCo2 / 0.192);
  const phonesCharged = Math.floor(effectiveCo2 / 0.005); // ~5g CO2 per phone charge
  const lightbulbHours = Math.floor(effectiveCo2 / 0.01); // ~10g per LED hour
  const plantsGrown = Math.floor(stats.totalPoints / 500);
  const quickLogs = stats.activities.filter((a) => a.isQuickLog).length;
  const plasticBagsAvoided = Math.floor(effectiveCo2 / 0.033) + stats.activities.filter((a) => a.category === 'waste').length * 4;
  const waterLitersSaved = Math.floor(effectiveCo2 * 125) + stats.activities.filter((a) => a.category === 'food').length * 150;
  const leavesGrown = Math.max(2, Math.floor(stats.totalPoints / 18) + stats.activities.length * 2 + 4);

  return {
    treesEquivalent,
    drivingKmAvoided,
    phonesCharged,
    lightbulbHours,
    plantsGrown,
    quickLogs,
    plasticBagsAvoided,
    waterLitersSaved,
    leavesGrown,
    totalCo2Saved: effectiveCo2.toFixed(1),
  };
}

// ─── Weekly Summary ───────────────────────────────────────────────────────────

export function getWeeklySummary(stats: UserStats, prevPlantLevel: number): WeeklySummary {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const weekChallenges = stats.completedChallenges.filter((c) => c.date >= weekAgoStr);
  const weekActivities = stats.activities.filter((a) => a.date >= weekAgoStr);
  const weekPoints = weekChallenges.reduce((sum, c) => sum + c.points, 0) + weekActivities.reduce((sum, a) => sum + (a.isQuickLog ? 15 : 10), 0);
  
  const weekCo2Saved = weekActivities.reduce((sum, a) => sum + a.co2Kg, 0) + 
    weekChallenges.length * 1.2;

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
