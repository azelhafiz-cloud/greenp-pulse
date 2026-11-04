'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserStats, EcoActivity, Theme, PlantSkinId, CollectibleLeaf } from '@/types';
import { loadStats, saveStats, getPlantLevel, getPlantHealth } from '@/lib/storage';
import {
  CHALLENGES,
  QUICK_ACTIONS,
  checkBadges,
  PLANT_PERSONALITY_QUOTES,
  checkCollectibleLeaves,
  COLLECTIBLE_LEAVES,
} from '@/data';

interface AppContextValue {
  stats: UserStats;
  theme: Theme;
  toggleTheme: () => void;
  atmosphereEnabled: boolean;
  toggleAtmosphere: () => void;
  addActivity: (activity: Omit<EcoActivity, 'id' | 'createdAt'>) => void;
  quickLog: (actionId: string) => { success: boolean; points: number; label: string; co2Saved: number };
  completeChallenge: (challengeId: string) => { success: boolean; points: number; co2Saved: number };
  nurturePlant: (action: 'water' | 'sun' | 'mist') => { success: boolean; message: string; quote: string; revived: boolean };
  setActiveSkin: (skinId: PlantSkinId) => void;
  recordClimateViewed: () => void;
  completeOnboarding: () => void;
  resetStats: () => void;
  isChallengeCompleted: (challengeId: string) => boolean;
  newBadges: string[];
  clearNewBadges: () => void;
  newLeafDiscovered: CollectibleLeaf | null;
  clearNewLeaf: () => void;
  dismissWeeklySummary: () => void;
  openWeeklySummary: () => void;
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
        collectedLeaves: [],
        activeSkin: 'emerald',
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        atmosphereEnabled: true,
        companionAffection: 15,
      };
    }
    return loadStats();
  });

  const [theme, setTheme] = useState<Theme>('light');
  const [atmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [newLeafDiscovered, setNewLeafDiscovered] = useState<CollectibleLeaf | null>(null);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  // Load theme and atmosphere from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('greenpulse_theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');

    const savedAtmo = localStorage.getItem('greenpulse_atmosphere');
    if (savedAtmo !== null) {
      setAtmosphereEnabled(savedAtmo === 'true');
    }
  }, []);

  // Persist stats whenever they change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Check for weekly summary on mount (after onboarding)
  useEffect(() => {
    if (!stats.onboardingComplete) return;
    const lastShown = stats.lastWeeklySummaryShown;
    if (!lastShown) {
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

  const toggleAtmosphere = useCallback(() => {
    setAtmosphereEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('greenpulse_atmosphere', String(next));
      return next;
    });
  }, []);

  // Helper: check and award any newly unlocked badges & collectible leaves
  const awardMilestones = useCallback((updatedStats: UserStats): UserStats => {
    const plantLevel = getPlantLevel(updatedStats).level;
    const newlyBadges = checkBadges(
      {
        totalPoints: updatedStats.totalPoints,
        challengesCompleted: updatedStats.challengesCompleted,
        currentStreak: updatedStats.currentStreak,
        activities: updatedStats.activities,
        earnedBadges: updatedStats.earnedBadges,
        totalCo2SavedKg: updatedStats.totalCo2SavedKg,
        viewedClimateData: updatedStats.viewedClimateData,
        revivedPlantCount: updatedStats.revivedPlantCount,
      },
      plantLevel
    );

    const newlyLeaves = checkCollectibleLeaves(
      {
        activities: updatedStats.activities,
        currentStreak: updatedStats.currentStreak,
        collectedLeaves: updatedStats.collectedLeaves,
      },
      plantLevel
    );

    let nextStats = { ...updatedStats };

    if (newlyBadges.length > 0) {
      nextStats.earnedBadges = [...nextStats.earnedBadges, ...newlyBadges];
      setNewBadges((prev) => [...prev, ...newlyBadges]);
    }

    if (newlyLeaves.length > 0) {
      const existingLeaves = nextStats.collectedLeaves ?? [];
      nextStats.collectedLeaves = [...existingLeaves, ...newlyLeaves];
      const leafObj = COLLECTIBLE_LEAVES.find((l) => l.id === newlyLeaves[0]);
      if (leafObj) {
        setNewLeafDiscovered(leafObj);
      }
    }

    return nextStats;
  }, []);

  const addActivity = useCallback(
    (activity: Omit<EcoActivity, 'id' | 'createdAt'>) => {
      const newActivity: EcoActivity = {
        ...activity,
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };

      setStats((prev) => {
        const health = getPlantHealth(prev);
        const wasWilted = health.status === 'wilting' || health.status === 'needs-water';
        const earnedPoints = Math.max(10, Math.round((activity.co2Kg || 1) * 12));

        const updated: UserStats = {
          ...prev,
          totalPoints: prev.totalPoints + earnedPoints,
          totalCo2SavedKg: parseFloat((prev.totalCo2SavedKg + (activity.co2Kg || 0)).toFixed(3)),
          activities: [...prev.activities, newActivity],
          revivedPlantCount: wasWilted ? (prev.revivedPlantCount ?? 0) + 1 : prev.revivedPlantCount,
          companionAffection: Math.min(100, (prev.companionAffection ?? 15) + 3),
        };
        return awardMilestones(updated);
      });
    },
    [awardMilestones]
  );

  // Quick log — one-tap eco action from dashboard with accurate CO2 saved!
  const quickLog = useCallback(
    (actionId: string): { success: boolean; points: number; label: string; co2Saved: number } => {
      const action = QUICK_ACTIONS.find((q) => q.id === actionId);
      if (!action) return { success: false, points: 0, label: '', co2Saved: 0 };

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
        const health = getPlantHealth(prev);
        const wasWilted = health.status === 'wilting' || health.status === 'needs-water';

        // Fix: Both totalPoints AND totalCo2SavedKg are properly incremented!
        const updated: UserStats = {
          ...prev,
          totalPoints: prev.totalPoints + action.points,
          totalCo2SavedKg: parseFloat((prev.totalCo2SavedKg + action.co2Kg).toFixed(3)),
          activities: [...prev.activities, newActivity],
          revivedPlantCount: wasWilted ? (prev.revivedPlantCount ?? 0) + 1 : prev.revivedPlantCount,
          companionAffection: Math.min(100, (prev.companionAffection ?? 15) + 2),
        };
        return awardMilestones(updated);
      });

      return {
        success: true,
        points: action.points,
        label: action.label,
        co2Saved: action.co2Kg,
      };
    },
    [awardMilestones]
  );

  const completeChallenge = useCallback(
    (challengeId: string): { success: boolean; points: number; co2Saved: number } => {
      const today = new Date().toISOString().split('T')[0];
      const alreadyDone = stats.completedChallenges.some(
        (c) => c.challengeId === challengeId && c.date === today
      );
      if (alreadyDone) return { success: false, points: 0, co2Saved: 0 };

      const challenge = CHALLENGES.find((c) => c.id === challengeId);
      if (!challenge) return { success: false, points: 0, co2Saved: 0 };

      const points = challenge.points;
      const co2Saved = challenge.co2SavedKg;

      setStats((prev) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const completedYesterday = prev.completedChallenges.some((c) => c.date === yesterdayStr);

        const newStreak = completedYesterday ? prev.currentStreak + 1 : 1;
        const newLongest = Math.max(prev.longestStreak, newStreak);
        const health = getPlantHealth(prev);
        const wasWilted = health.status === 'wilting' || health.status === 'needs-water';

        const updated: UserStats = {
          ...prev,
          totalPoints: prev.totalPoints + points,
          totalCo2SavedKg: parseFloat((prev.totalCo2SavedKg + co2Saved).toFixed(3)),
          challengesCompleted: prev.challengesCompleted + 1,
          currentStreak: newStreak,
          longestStreak: newLongest,
          revivedPlantCount: wasWilted ? (prev.revivedPlantCount ?? 0) + 1 : prev.revivedPlantCount,
          companionAffection: Math.min(100, (prev.companionAffection ?? 15) + 5),
          completedChallenges: [
            ...prev.completedChallenges,
            { challengeId, date: today, points },
          ],
        };
        return awardMilestones(updated);
      });

      return { success: true, points, co2Saved };
    },
    [stats.completedChallenges, awardMilestones]
  );

  // Pure Plant Care: NO free points! Pure plant care and companion bond only.
  const nurturePlant = useCallback(
    (action: 'water' | 'sun' | 'mist'): { success: boolean; message: string; quote: string; revived: boolean } => {
      let revived = false;
      const quotes = PLANT_PERSONALITY_QUOTES.nurtured;
      const quote = quotes[Math.floor(Math.random() * quotes.length)];

      const actionLabels = {
        water: 'Watered with love 💧',
        sun: 'Sunlight channeled ☀️',
        mist: 'Botanical mist applied 🍃',
      };

      const today = new Date().toISOString().split('T')[0];

      setStats((prev) => {
        const health = getPlantHealth(prev);
        if (health.status === 'wilting' || health.status === 'needs-water') {
          revived = true;
        }

        // Register care date so plant stays hydrated, NO POINTS added!
        const careActivity: EcoActivity = {
          id: `care_${Date.now()}`,
          date: today,
          category: 'nature',
          action: `Plant Care: ${action}`,
          quantity: 1,
          unit: 'care',
          co2Kg: 0,
          createdAt: new Date().toISOString(),
          isQuickLog: false,
        };

        const updated: UserStats = {
          ...prev,
          activities: [...prev.activities, careActivity],
          lastNurturedDate: today,
          lastNurturedAction: action,
          revivedPlantCount: revived ? (prev.revivedPlantCount ?? 0) + 1 : prev.revivedPlantCount,
          companionAffection: Math.min(100, (prev.companionAffection ?? 15) + 4),
        };

        return awardMilestones(updated);
      });

      return {
        success: true,
        message: actionLabels[action],
        quote,
        revived,
      };
    },
    [awardMilestones]
  );

  const setActiveSkin = useCallback((skinId: PlantSkinId) => {
    setStats((prev) => ({ ...prev, activeSkin: skinId }));
  }, []);

  const recordClimateViewed = useCallback(() => {
    setStats((prev) => {
      if (prev.viewedClimateData) return prev;
      const updated: UserStats = {
        ...prev,
        viewedClimateData: true,
      };
      return awardMilestones(updated);
    });
  }, [awardMilestones]);

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
      collectedLeaves: [],
      activeSkin: 'emerald',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      atmosphereEnabled: true,
      companionAffection: 15,
    };
    setStats(fresh);
    setNewBadges([]);
    setNewLeafDiscovered(null);
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
  const clearNewLeaf = useCallback(() => setNewLeafDiscovered(null), []);

  const dismissWeeklySummary = useCallback(() => {
    setShowWeeklySummary(false);
    setStats((prev) => ({
      ...prev,
      lastWeeklySummaryShown: new Date().toISOString(),
    }));
  }, []);

  const openWeeklySummary = useCallback(() => {
    setShowWeeklySummary(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        stats,
        theme,
        toggleTheme,
        atmosphereEnabled,
        toggleAtmosphere,
        addActivity,
        quickLog,
        completeChallenge,
        nurturePlant,
        setActiveSkin,
        recordClimateViewed,
        completeOnboarding,
        resetStats,
        isChallengeCompleted,
        newBadges,
        clearNewBadges,
        newLeafDiscovered,
        clearNewLeaf,
        dismissWeeklySummary,
        openWeeklySummary,
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
