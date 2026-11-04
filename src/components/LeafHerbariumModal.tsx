'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { COLLECTIBLE_LEAVES } from '@/data';
import { CollectibleLeaf } from '@/types';

interface LeafHerbariumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeafDiscoveryToast() {
  const { newLeafDiscovered, clearNewLeaf } = useApp();

  if (!newLeafDiscovered) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-3xl bg-gradient-to-r from-forest-800 to-mint-800 text-white shadow-2xl border border-mint-400/40 flex items-center gap-3 max-w-sm w-full mx-4"
      >
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${newLeafDiscovered.color} flex items-center justify-center flex-shrink-0 text-white shadow-md`}
        >
          <span className="material-symbols-rounded text-2xl">{newLeafDiscovered.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-white/20 text-mint-200">
              New Leaf Discovered!
            </span>
          </div>
          <h4 className="font-extrabold text-white text-sm truncate">{newLeafDiscovered.name}</h4>
          <p className="text-[11px] text-forest-200 line-clamp-1">{newLeafDiscovered.description}</p>
        </div>

        <button
          onClick={clearNewLeaf}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-xs"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LeafHerbariumModal({ isOpen, onClose }: LeafHerbariumModalProps) {
  const { stats } = useApp();
  const [selectedLeaf, setSelectedLeaf] = useState<CollectibleLeaf | null>(null);

  if (!isOpen) return null;

  const collectedSet = new Set(stats.collectedLeaves ?? []);
  const discoveredCount = COLLECTIBLE_LEAVES.filter((l) => collectedSet.has(l.id)).length;
  const totalCount = COLLECTIBLE_LEAVES.length;

  const rarityBadgeColor = {
    common: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    uncommon: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    rare: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    legendary: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-2xl border border-forest-100 dark:border-dark-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-forest-100 dark:border-dark-border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-dark-muted flex items-center justify-center text-forest-700 dark:text-forest-300">
              <span className="material-symbols-rounded text-2xl">spa</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100">
                Leaf Herbarium
              </h3>
              <p className="text-xs text-sage-500 dark:text-sage-400">
                Collectible botanical specimens discovered across your sustainability journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sage-500 hover:bg-forest-50 dark:hover:bg-dark-muted"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 p-4 rounded-2xl bg-forest-50/70 dark:bg-dark-muted/30 border border-forest-100 dark:border-dark-border">
          <div className="flex justify-between items-center text-xs font-bold text-forest-900 dark:text-forest-100 mb-1.5">
            <span>Specimens Collected</span>
            <span className="text-forest-600 dark:text-forest-400">
              {discoveredCount} / {totalCount} ({Math.round((discoveredCount / totalCount) * 100)}%)
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-forest-100 dark:bg-dark-surface overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-forest-500 via-mint-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${(discoveredCount / totalCount) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Leaves Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COLLECTIBLE_LEAVES.map((leaf) => {
            const isDiscovered = collectedSet.has(leaf.id);

            return (
              <motion.div
                key={leaf.id}
                onClick={() => setSelectedLeaf(leaf)}
                whileHover={{ y: -3 }}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-center flex flex-col items-center justify-between ${
                  isDiscovered
                    ? 'bg-white dark:bg-dark-card border-forest-200 dark:border-dark-border shadow-soft hover:shadow-soft-md'
                    : 'bg-sage-50/50 dark:bg-dark-muted/20 border-dashed border-sage-200 dark:border-dark-border/50 opacity-70'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-xs ${
                      isDiscovered
                        ? `bg-gradient-to-br ${leaf.color} text-white`
                        : 'bg-slate-200 dark:bg-dark-surface text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-rounded text-2xl">
                      {isDiscovered ? leaf.icon : 'lock'}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      rarityBadgeColor[leaf.rarity]
                    }`}
                  >
                    {leaf.rarity}
                  </span>

                  <h4 className="font-bold text-forest-900 dark:text-forest-100 text-xs mt-1.5 leading-tight line-clamp-1">
                    {isDiscovered ? leaf.name : 'Unknown Specimen'}
                  </h4>
                </div>

                <p className="text-[10px] text-sage-500 dark:text-sage-400 mt-2 line-clamp-2">
                  {isDiscovered ? leaf.description : leaf.discoveryHint}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Leaf Detail Modal */}
        <AnimatePresence>
          {selectedLeaf && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedLeaf(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-sm w-full bg-white dark:bg-dark-card rounded-3xl p-6 shadow-2xl border border-forest-100 dark:border-dark-border text-center"
              >
                <div
                  className={`w-16 h-16 rounded-3xl mx-auto mb-3 flex items-center justify-center shadow-md ${
                    collectedSet.has(selectedLeaf.id)
                      ? `bg-gradient-to-br ${selectedLeaf.color} text-white`
                      : 'bg-slate-200 dark:bg-dark-surface text-slate-400'
                  }`}
                >
                  <span className="material-symbols-rounded text-3xl">
                    {collectedSet.has(selectedLeaf.id) ? selectedLeaf.icon : 'lock'}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    rarityBadgeColor[selectedLeaf.rarity]
                  }`}
                >
                  {selectedLeaf.rarity}
                </span>

                <h4 className="text-base font-extrabold text-forest-900 dark:text-forest-100 mt-2">
                  {collectedSet.has(selectedLeaf.id) ? selectedLeaf.name : 'Hidden Botanical Specimen'}
                </h4>
                <p className="text-xs text-sage-600 dark:text-sage-300 mt-1 leading-relaxed">
                  {collectedSet.has(selectedLeaf.id) ? selectedLeaf.description : selectedLeaf.discoveryHint}
                </p>

                <button
                  onClick={() => setSelectedLeaf(null)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-forest-600 text-white font-bold text-xs"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
