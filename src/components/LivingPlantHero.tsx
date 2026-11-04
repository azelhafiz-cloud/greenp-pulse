'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { getPlantLevel, getPlantHealth } from '@/lib/storage';
import { PLANT_STAGES, PLANT_PERSONALITY_QUOTES, PLANT_SKINS, VIRTUAL_FOREST_FLORA, COLLECTIBLE_LEAVES } from '@/data';
import PlantVisual from '@/components/PlantVisual';
import CompanionCreature from '@/components/CompanionCreature';
import LeafHerbariumModal from '@/components/LeafHerbariumModal';
import { PlantSkinId } from '@/types';

interface LivingPlantHeroProps {
  leafBurstTrigger?: number;
}

export default function LivingPlantHero({ leafBurstTrigger = 0 }: LivingPlantHeroProps) {
  const { stats, nurturePlant, setActiveSkin } = useApp();
  const plantInfo = getPlantLevel(stats);
  const plantHealth = getPlantHealth(stats);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [showSanctuaryModal, setShowSanctuaryModal] = useState(false);
  const [showHerbarium, setShowHerbarium] = useState(false);
  const [careFeedback, setCareFeedback] = useState<string | null>(null);
  const [localBurst, setLocalBurst] = useState(0);

  const activeSkin = stats.activeSkin ?? 'emerald';
  const collectedLeavesCount = (stats.collectedLeaves ?? []).length;

  // Health configuration
  const healthConfig = {
    thriving: {
      label: 'Thriving',
      icon: 'favorite',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    },
    healthy: {
      label: 'Healthy & Vibrant',
      icon: 'eco',
      badgeBg: 'bg-green-500/20 text-green-300 border-green-400/30',
      dot: 'bg-green-400',
    },
    'needs-water': {
      label: 'Needs Water',
      icon: 'water_drop',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      dot: 'bg-amber-400',
    },
    wilting: {
      label: 'Slightly Wilted',
      icon: 'sentiment_dissatisfied',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
      dot: 'bg-rose-400',
    },
  }[plantHealth.status];

  // Plant quote pool
  const quotePool = PLANT_PERSONALITY_QUOTES[plantHealth.status] || PLANT_PERSONALITY_QUOTES.healthy;
  const currentQuote = quotePool[quoteIndex % quotePool.length] || plantHealth.personalityQuote;

  const cycleQuote = () => {
    setQuoteIndex((prev) => prev + 1);
  };

  // Pure care action - No point rewards! Pure plant vitality, mood & companion bond.
  const handleNurture = (action: 'water' | 'sun' | 'mist') => {
    const res = nurturePlant(action);
    setLocalBurst((prev) => prev + 1);
    setCareFeedback(`${res.message} · Hydrated!`);
    setTimeout(() => setCareFeedback(null), 2500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-forest-900 via-forest-800 to-forest-950 text-white p-6 md:p-8 shadow-green-lg border border-forest-700/50 mb-6"
      >
        {/* Ambient atmospheric backdrop */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-forest-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-mint-500/10 blur-2xl pointer-events-none" />

        {/* Top Header Row with Controls */}
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2.5 mb-4">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${healthConfig.badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${healthConfig.dot}`} />
              <span>{healthConfig.label}</span>
              <span className="text-white/40">·</span>
              <span>{plantHealth.vitalityPct}% Vitality</span>
            </div>

            {plantInfo.isAscended && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span className="material-symbols-rounded text-xs">auto_awesome</span>
                Ascension ✦ Tier {plantInfo.ascensionTier}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Herbarium Collectibles Button */}
            <button
              onClick={() => setShowHerbarium(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-forest-200 hover:text-white transition-all"
              title="View your collected leaf specimens"
            >
              <span className="material-symbols-rounded text-sm text-amber-300">spa</span>
              <span>Herbarium</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 font-bold">
                {collectedLeavesCount}/{COLLECTIBLE_LEAVES.length}
              </span>
            </button>

            {/* Virtual Grove & Skins Button */}
            <button
              onClick={() => setShowSanctuaryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-forest-200 hover:text-white transition-all"
              title="Virtual Grove flora & cosmetic plant themes"
            >
              <span className="material-symbols-rounded text-sm text-mint-300">palette</span>
              <span>Grove & Skins</span>
            </button>

            {/* Evolution Stages Button */}
            <button
              onClick={() => setShowEvolutionModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-forest-200 hover:text-white transition-all"
            >
              <span className="material-symbols-rounded text-sm">nature</span>
              <span>Stages</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 font-bold">
                {Math.min(8, plantInfo.level)}/8
              </span>
            </button>
          </div>
        </div>

        {/* Main Centerstage Showcase */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Plant Personality Dialogue Bubble */}
          <motion.div
            onClick={cycleQuote}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer relative max-w-md mx-auto mb-3 px-4 py-2.5 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/15 text-forest-100 text-xs md:text-sm font-medium shadow-soft transition-all hover:bg-white/15"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-forest-300 text-base">💬</span>
              <span className="italic">&ldquo;{currentQuote}&rdquo;</span>
              <span className="material-symbols-rounded text-white/40 group-hover:text-white text-xs transition-colors">
                refresh
              </span>
            </div>
            {/* Bubble arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 border-b border-r border-white/15 rotate-45" />
          </motion.div>

          {/* Plant Showcase & Pip Companion */}
          <div className="relative my-2 w-full max-w-md flex items-end justify-center">
            {/* Companion Creature (Pip) placed beside the pot */}
            <div className="absolute left-6 md:left-12 bottom-2 z-20">
              <CompanionCreature reactionTrigger={leafBurstTrigger + localBurst} />
            </div>

            {/* Care feedback notification banner */}
            <AnimatePresence>
              {careFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute -top-8 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg z-30 flex items-center gap-1.5 border border-emerald-400"
                >
                  <span className="material-symbols-rounded text-sm">sparkles</span>
                  {careFeedback}
                </motion.div>
              )}
            </AnimatePresence>

            <PlantVisual
              level={plantInfo.level}
              progress={plantInfo.progress}
              size="hero"
              animate
              healthStatus={plantHealth.status}
              leafBurstTrigger={leafBurstTrigger + localBurst}
              skin={activeSkin}
              ascensionTier={plantInfo.ascensionTier}
            />
          </div>

          {/* Plant Identity & Stage Lore */}
          <div className="mt-2 mb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {plantInfo.name}
              </h2>
              {plantInfo.isSpecial && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 shadow-sm">
                  {plantInfo.isAscended ? '✦ Ascended Legend' : 'Special Evolved'}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-forest-300 max-w-md mx-auto">
              {plantInfo.description}
            </p>
          </div>

          {/* Evolution Progress Bar */}
          <div className="w-full max-w-sm bg-black/20 rounded-2xl p-3 border border-white/10 mb-5">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-forest-200">
                {plantInfo.stageName}
              </span>
              <span className="text-mint-300 font-bold">{Math.round(plantInfo.progress)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-mint-400 via-forest-400 to-emerald-300 shadow-[0_0_12px_#34d399]"
                initial={{ width: 0 }}
                animate={{ width: `${plantInfo.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-forest-300/80 mt-1.5">
              <span>{stats.totalPoints} sustainability points</span>
              <span>
                {plantInfo.isAscended
                  ? `${plantInfo.nextThreshold - stats.totalPoints} pts to Tier ${plantInfo.ascensionTier + 1}`
                  : `${plantInfo.nextThreshold - stats.totalPoints} pts to next stage`}
              </span>
            </div>
          </div>

          {/* Interactive Plant Care Toolbar (Pure Care - No points!) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNurture('water')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-600/80 to-blue-600/80 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-soft border border-sky-400/30 transition-all"
            >
              <span className="material-symbols-rounded text-base">water_drop</span>
              <span>Water Plant</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNurture('sun')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600/80 to-yellow-600/80 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-semibold shadow-soft border border-amber-400/30 transition-all"
            >
              <span className="material-symbols-rounded text-base">wb_sunny</span>
              <span>Bask in Sun</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNurture('mist')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-600/80 to-emerald-600/80 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-soft border border-teal-400/30 transition-all"
            >
              <span className="material-symbols-rounded text-base">air</span>
              <span>Botanical Mist</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Virtual Grove & Skins Modal ────────────────────── */}
      <AnimatePresence>
        {showSanctuaryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSanctuaryModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-2xl border border-forest-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between pb-4 border-b border-forest-100 dark:border-dark-border mb-6">
                <div>
                  <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100">
                    Virtual Grove & Tree Skins
                  </h3>
                  <p className="text-xs text-sage-500 dark:text-sage-400">
                    Customize your tree&apos;s appearance and cultivate companion flora
                  </p>
                </div>
                <button
                  onClick={() => setShowSanctuaryModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sage-500 hover:bg-forest-50"
                >
                  ✕
                </button>
              </div>

              {/* Canopy Skins Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-forest-900 dark:text-forest-100 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-base text-forest-600">palette</span>
                  <span>Canopy Cosmetic Themes</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLANT_SKINS.map((skin) => {
                    const isUnlocked = plantInfo.level >= skin.levelRequired;
                    const isActive = activeSkin === skin.id;

                    return (
                      <div
                        key={skin.id}
                        onClick={() => {
                          if (isUnlocked) setActiveSkin(skin.id);
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isActive
                            ? 'border-forest-500 bg-forest-50/80 dark:bg-forest-900/30 ring-2 ring-forest-400'
                            : isUnlocked
                            ? 'border-forest-200 dark:border-dark-border hover:border-forest-400'
                            : 'border-dashed border-sage-200 dark:border-dark-border/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full shadow-xs"
                            style={{ backgroundColor: skin.primary }}
                          />
                          {isActive && (
                            <span className="text-[10px] font-bold text-forest-600 dark:text-forest-300">
                              Active
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="text-[10px] font-bold text-sage-400">
                              Lv {skin.levelRequired}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-forest-900 dark:text-forest-100">{skin.name}</h5>
                        <p className="text-[10px] text-sage-500 dark:text-sage-400 line-clamp-1 mt-0.5">
                          {skin.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tiny Virtual Forest Companion Flora */}
              <div>
                <h4 className="text-sm font-bold text-forest-900 dark:text-forest-100 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-base text-forest-600">park</span>
                  <span>Companion Grove Ecosystem</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {VIRTUAL_FOREST_FLORA.map((flora) => {
                    const isFloraUnlocked = plantInfo.level >= flora.levelRequired;

                    return (
                      <div
                        key={flora.id}
                        className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                          isFloraUnlocked
                            ? 'bg-forest-50/50 dark:bg-dark-muted/20 border-forest-200 dark:border-dark-border'
                            : 'border-dashed border-sage-200 dark:border-dark-border/60 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                            isFloraUnlocked ? `bg-gradient-to-br ${flora.color}` : 'bg-slate-300 text-slate-500'
                          }`}
                        >
                          <span className="material-symbols-rounded text-xl">
                            {isFloraUnlocked ? flora.icon : 'lock'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-forest-900 dark:text-forest-100 truncate">
                              {flora.name}
                            </h5>
                            <span className="text-[10px] font-semibold text-sage-500">
                              {isFloraUnlocked ? flora.stageName : `Unlocks Lv ${flora.levelRequired}`}
                            </span>
                          </div>
                          <p className="text-[10px] text-sage-500 dark:text-sage-400 line-clamp-1 mt-0.5">
                            {flora.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Evolution Stages Modal ──────────────────────────── */}
      <AnimatePresence>
        {showEvolutionModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEvolutionModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-2xl border border-forest-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between pb-4 border-b border-forest-100 dark:border-dark-border mb-6">
                <div>
                  <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100">
                    Plant Evolution Journey
                  </h3>
                  <p className="text-xs text-sage-500 dark:text-sage-400">
                    Grow from a humble seed to an eternal celestial biosphere through your eco actions
                  </p>
                </div>
                <button
                  onClick={() => setShowEvolutionModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sage-500 hover:bg-forest-50"
                >
                  ✕
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {PLANT_STAGES.map((st) => {
                  const isCurrent = plantInfo.level === st.level;
                  const isUnlocked = plantInfo.level >= st.level;

                  return (
                    <div
                      key={st.level}
                      className={`relative rounded-2xl p-4 border transition-all ${
                        isCurrent
                          ? 'border-forest-500 bg-forest-50/80 dark:bg-forest-900/30 ring-2 ring-forest-400'
                          : isUnlocked
                          ? 'border-forest-200 dark:border-dark-border bg-white dark:bg-dark-surface'
                          : 'border-dashed border-sage-200 dark:border-dark-border/60 bg-sage-50/50 dark:bg-dark-muted/20 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <PlantVisual
                            level={st.level}
                            progress={100}
                            size="sm"
                            animate={false}
                            skin={activeSkin}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 dark:bg-dark-muted text-forest-700 dark:text-forest-300">
                              Level {st.level}
                            </span>
                            {st.isSpecial && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 uppercase">
                                Special Form
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-forest-800 dark:text-forest-200 text-sm mt-1">
                            {st.name}
                          </h4>
                          <p className="text-[11px] text-sage-500 dark:text-sage-400 line-clamp-2 mt-0.5">
                            {st.description}
                          </p>
                          <div className="mt-2 text-[10px] font-semibold text-forest-600 dark:text-forest-400">
                            {st.threshold === 0 ? 'Starting Stage' : `${st.threshold} points`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Leaf Herbarium Modal ────────────────────────────── */}
      <LeafHerbariumModal isOpen={showHerbarium} onClose={() => setShowHerbarium(false)} />
    </>
  );
}
