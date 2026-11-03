'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserStats, EcoActivity, Theme, QuickAction } from '@/types';
import { loadStats, saveStats, getPlantLevel } from '@/lib/storage';
import { CHALLENGES, QUICK_ACTIONS, checkBadges } from '@/data';

interface AppContextValue {
  stats: UserStats;
  theme: Theme;
  toggleTheme: () => void;
  addActivity: (activity: Omit<EcoActivity, 'id' | 'createdAt'>) => void;
  quickLog: (actionId: string) => { success: boolean; points: number; label: string };
  completeChallenge: (challengeId: string) => { success: boolean; points: number };
  completeOnboarding: () => void;
  resetStats: () => void;
  isChallengeCompleted: (challengeId: string) => boolean;
  newBadges: string[]; // IDs of newly earned badges to show notification
  clearNewBadges: () => void;
  dismissWeeklySummary: () => void;
  showWeeklySummary: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window === 'undefined') {
      return {
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
    }
    return loadStats();
  });

  const [theme, setTheme] = useState<Theme>('light');
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('greenpulse_theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  // Persist stats whenever they change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Check for weekly summary on mount (after onboarding)
  useEffect(() => {
    if (!stats.onboardingComplete) return;
    const today = new Date().toISOString().split('T')[0];
    const lastShown = stats.lastWeeklySummaryShown;
    if (!lastShown) {
      // First time — only show if there's meaningful data
      if (stats.challengesCompleted > 0 || stats.activities.length > 0) {
        setShowWeeklySummary(true);
      }
    } else {
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince >= 7) setShowWeeklySummary(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.onboardingComplete]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('greenpulse_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  // Helper: award any newly unlocked badges
  const awardBadges = useCallback((updatedStats: UserStats) => {
    const plantLevel = getPlantLevel(updatedStats).level;
    const newly = checkBadges(
      {
        totalPoints: updatedStats.totalPoints,
        challengesCompleted: updatedStats.challengesCompleted,
        currentStreak: updatedStats.currentStreak,
        activities: updatedStats.activities,
        earnedBadges: updatedStats.earnedBadges,
        totalCo2SavedKg: updatedStats.totalCo2SavedKg,
      },
      plantLevel
    );
    if (newly.length > 0) {
      const now = new Date().toISOString();
      const withBadges: UserStats = {
        ...updatedStats,
        earnedBadges: [...updatedStats.earnedBadges, ...newly],
      };
      setNewBadges((prev) => [...prev, ...newly]);
      return withBadges;
    }
    return updatedStats;
  }, []);

  const addActivity = useCallback(
    (activity: Omit<EcoActivity, 'id' | 'createdAt'>) => {
      const newActivity: EcoActivity = {
        ...activity,
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };

      setStats((prev) => {
        const updated: UserStats = {
          ...prev,
          activities: [...prev.activities, newActivity],
        };
        return awardBadges(updated);
      });
    },
    [awardBadges]
  );

  // Quick log — one-tap eco action from dashboard
  const quickLog = useCallback(
    (actionId: string): { success: boolean; points: number; label: string } => {
      const action = QUICK_ACTIONS.find((q) => q.id === actionId);
      if (!action) return { success: false, points: 0, label: '' };

      const today = new Date().toISOString().split('T')[0];
      const newActivity: EcoActivity = {
        id: `ql_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: today,
        category: action.category,
        action: action.action,
        quantity: action.quantity,
        unit: action.unit,
        co2Kg: action.co2Kg,
        createdAt: new Date().toISOString(),
        isQuickLog: true,
      };

      setStats((prev) => {
        const updated: UserStats = {
          ...prev,
          totalPoints: prev.totalPoints + action.points,
          activities: [...prev.activities, newActivity],
        };
        return awardBadges(updated);
      });

      return { success: true, points: action.points, label: action.label };
    },
    [awardBadges]
  );

  const completeChallenge = useCallback(
    (challengeId: string): { success: boolean; points: number } => {
      const today = new Date().toISOString().split('T')[0];
      const alreadyDone = stats.completedChallenges.some(
        (c) => c.challengeId === challengeId && c.date === today
      );
      if (alreadyDone) return { success: false, points: 0 };

      const challenge = CHALLENGES.find((c) => c.id === challengeId);
      if (!challenge) return { success: false, points: 0 };

      const points = challenge.points;

      setStats((prev) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const completedYesterday = prev.completedChallenges.some((c) => c.date === yesterdayStr);

        const newStreak = completedYesterday ? prev.currentStreak + 1 : 1;
        const newLongest = Math.max(prev.longestStreak, newStreak);

        const updated: UserStats = {
          ...prev,
          totalPoints: prev.totalPoints + points,
          totalCo2SavedKg: parseFloat((prev.totalCo2SavedKg + challenge.co2SavedKg).toFixed(3)),
          challengesCompleted: prev.challengesCompleted + 1,
          currentStreak: newStreak,
          longestStreak: newLongest,
          completedChallenges: [
            ...prev.completedChallenges,
            { challengeId, date: today, points },
          ],
        };
        return awardBadges(updated);
      });

      return { success: true, points };
    },
    [stats.completedChallenges, awardBadges]
  );

  const completeOnboarding = useCallback(() => {
    setStats((prev) => ({ ...prev, onboardingComplete: true }));
  }, []);

  const resetStats = useCallback(() => {
    const fresh: UserStats = {
      totalPoints: 0,
      totalCo2SavedKg: 0,
      challengesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoalKg: 35,
      completedChallenges: [],
      activities: [],
      earnedBadges: [],
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };
    setStats(fresh);
    setNewBadges([]);
    setShowWeeklySummary(false);
  }, []);

  const isChallengeCompleted = useCallback(
    (challengeId: string) => {
      const today = new Date().toISOString().split('T')[0];
      return stats.completedChallenges.some(
        (c) => c.challengeId === challengeId && c.date === today
      );
    },
    [stats.completedChallenges]
  );

  const clearNewBadges = useCallback(() => setNewBadges([]), []);

  const dismissWeeklySummary = useCallback(() => {
    setShowWeeklySummary(false);
    setStats((prev) => ({
      ...prev,
      lastWeeklySummaryShown: new Date().toISOString(),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        stats,
        theme,
        toggleTheme,
        addActivity,
        quickLog,
        completeChallenge,
        completeOnboarding,
        resetStats,
        isChallengeCompleted,
        newBadges,
        clearNewBadges,
        dismissWeeklySummary,
        showWeeklySummary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
