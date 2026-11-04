'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { QUICK_ACTIONS } from '@/data';

interface QuickLogGridProps {
  onActionLogged?: () => void;
}

interface BurstFeedback {
  id: number;
  actionId: string;
  points: number;
  label: string;
  co2Saved: number;
}

export default function QuickLogGrid({ onActionLogged }: QuickLogGridProps) {
  const { quickLog } = useApp();
  const [bursts, setBursts] = useState<BurstFeedback[]>([]);
  const [activeTapId, setActiveTapId] = useState<string | null>(null);

  const actionStyleConfig: Record<
    string,
    { gradient: string; border: string; glow: string; co2Text: string }
  > = {
    'q-walk': {
      gradient: 'from-blue-500 to-sky-600',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
      glow: 'rgba(59, 130, 246, 0.25)',
      co2Text: '-0.96 kg CO₂',
    },
    'q-plant-meal': {
      gradient: 'from-emerald-500 to-forest-600',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      glow: 'rgba(16, 185, 129, 0.25)',
      co2Text: '-1.85 kg CO₂',
    },
    'q-no-plastic': {
      gradient: 'from-teal-500 to-cyan-600',
      border: 'hover:border-teal-300 dark:hover:border-teal-700',
      glow: 'rgba(20, 184, 166, 0.25)',
      co2Text: '-0.45 kg CO₂',
    },
    'q-electricity': {
      gradient: 'from-amber-400 to-orange-500',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
      glow: 'rgba(245, 158, 11, 0.25)',
      co2Text: '-0.85 kg CO₂',
    },
    'q-public-transport': {
      gradient: 'from-indigo-500 to-purple-600',
      border: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      glow: 'rgba(99, 102, 241, 0.25)',
      co2Text: '-1.45 kg CO₂',
    },
  };

  const handleTap = (actionId: string) => {
    setActiveTapId(actionId);
    const result = quickLog(actionId);

    if (result.success) {
      if (onActionLogged) onActionLogged();

      const burstId = Date.now();
      setBursts((prev) => [
        ...prev,
        { id: burstId, actionId, points: result.points, label: result.label, co2Saved: result.co2Saved },
      ]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 1600);
      setTimeout(() => setActiveTapId(null), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white dark:bg-dark-card rounded-3xl p-5 md:p-6 shadow-soft border border-forest-50 dark:border-dark-border mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '22px' }}>
              bolt
            </span>
            <h3 className="font-bold text-forest-900 dark:text-forest-100 text-base md:text-lg">
              Quick Log Eco Actions
            </h3>
          </div>
          <p className="text-xs text-sage-500 dark:text-sage-400 mt-0.5">
            One-tap to instantly log habits, award points, and prevent atmospheric CO₂
          </p>
        </div>
      </div>

      {/* Grid of 5 Large Prominent Touch Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const cfg = actionStyleConfig[action.id] || {
            gradient: 'from-forest-500 to-forest-700',
            border: 'hover:border-forest-300',
            glow: 'rgba(34, 197, 94, 0.2)',
            co2Text: `-${action.co2Kg} kg CO₂`,
          };
          const isTapped = activeTapId === action.id;
          const myBursts = bursts.filter((b) => b.actionId === action.id);

          return (
            <div key={action.id} className="relative">
              {/* Floating Point & CO2 Burst Feedback */}
              <AnimatePresence>
                {myBursts.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [-10, -45, -60],
                      scale: [0.6, 1.12, 0.9],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
                  >
                    <span className="px-2.5 py-1 rounded-full bg-forest-700 text-white font-extrabold text-[11px] shadow-lg whitespace-nowrap border border-mint-400/30 flex items-center gap-1">
                      <span>+{b.points} pts</span>
                      <span className="text-mint-300">· -{b.co2Saved}kg CO₂</span>
                      <span>🌱</span>
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                onClick={() => handleTap(action.id)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.93 }}
                animate={isTapped ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`w-full h-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isTapped
                    ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/30 ring-2 ring-forest-400'
                    : `border-forest-100 dark:border-dark-border bg-forest-50/40 dark:bg-dark-muted/20 ${cfg.border} hover:shadow-soft-md`
                }`}
              >
                {/* Icon with gradient container */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-sm`}
                    style={{ boxShadow: `0 4px 12px ${cfg.glow}` }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '22px' }}>
                      {action.icon}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-dark-muted text-forest-700 dark:text-forest-300 font-bold text-xs">
                    +{action.points}
                  </span>
                </div>

                {/* Title & Real CO2 impact indicator */}
                <div>
                  <h4 className="font-bold text-forest-900 dark:text-forest-100 text-sm leading-tight mb-1">
                    {action.label}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{cfg.co2Text} prevented</span>
                  </div>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
