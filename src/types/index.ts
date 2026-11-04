// Types for GreenPulse app

export type ActivityCategory = 'transport' | 'food' | 'energy' | 'waste' | 'nature';

export interface EcoActivity {
  id: string;
  date: string; // ISO date string
  category: ActivityCategory;
  action: string;
  quantity: number;
  unit: string;
  co2Kg: number; // CO2 equivalent in kg
  createdAt: string;
  isQuickLog?: boolean; // flagged if logged via quick-action button
}

export interface DailyLog {
  date: string;
  activities: EcoActivity[];
  totalCo2Kg: number;
  pointsEarned: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  points: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  co2SavedKg: number;
}

export interface CompletedChallenge {
  challengeId: string;
  date: string;
  points: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string; // Tailwind gradient classes
  earned: boolean;
  earnedAt?: string;
}

export interface PlantHealth {
  status: 'thriving' | 'healthy' | 'needs-water' | 'wilting';
  message: string;
  personalityQuote: string;
  daysSinceLastAction: number;
  leafCount: number;
  vitalityPct: number;
}

export interface PlantStage {
  level: number;
  name: string;
  stageName: string;
  threshold: number;
  description: string;
  specialForm?: boolean;
  formTitle?: string;
}

export interface ClimatePulseData {
  co2Ppm: number;
  date: string;
  source: string;
  isEstimate: boolean;
  changeFromLastYear: number;
  preIndustrialBaseline: number;
  planetaryBoundary: number;
  cachedAt: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  emoji: string;
  category: EcoActivity['category'];
  action: string;
  quantity: number;
  unit: string;
  co2Kg: number;
  points: number;
  color: string; // bg color classes
}

export interface WeeklySummary {
  weekPoints: number;
  weekChallenges: number;
  weekCo2Saved: number;
  plantLevelGained: boolean;
  motivationalLine: string;
}

export type PlantSkinId = 'emerald' | 'autumn' | 'sakura' | 'midnight' | 'celestial';

export interface CollectibleLeaf {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  icon: string;
  color: string;
  description: string;
  discoveryHint: string;
  unlockedAt?: string;
}

export interface ForestFlora {
  id: string;
  name: string;
  stageName: string;
  levelRequired: number;
  icon: string;
  color: string;
  description: string;
  unlocked: boolean;
}

export interface UserStats {
  totalPoints: number;
  totalCo2SavedKg: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoalKg: number; // target CO2 reduction per week
  completedChallenges: CompletedChallenge[];
  activities: EcoActivity[];
  earnedBadges: string[]; // badge IDs
  onboardingComplete: boolean;
  lastWeeklySummaryShown?: string; // date string
  createdAt: string;
  leavesGrown?: number;
  viewedClimateData?: boolean;
  revivedPlantCount?: number;
  atmosphereEnabled?: boolean;
  activeSkin?: PlantSkinId;
  ascensionTier?: number;
  collectedLeaves?: string[];
  lastNurturedDate?: string;
  lastNurturedAction?: string;
  companionAffection?: number;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  category: 'clean-energy' | 'conservation' | 'daily-habits' | 'nature-facts';
  icon: string;
  fact?: string;
  color: string;
}

export interface WeeklyData {
  day: string;
  co2: number;
  points: number;
}

export type TabId = 'dashboard' | 'tracker' | 'challenges' | 'learn' | 'impact' | 'badges';

export type Theme = 'light' | 'dark';

// CO2 emission factors (kg CO2 per unit)
export interface EmissionFactor {
  label: string;
  unit: string;
  factor: number; // kg CO2
  category: EcoActivity['category'];
  action: string;
  icon: string;
  description: string;
}
