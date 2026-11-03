'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KNOWLEDGE_CARDS, KNOWLEDGE_CATEGORY_LABELS } from '@/data';
import { KnowledgeCard } from '@/types';

const CATEGORY_FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'clean-energy',  label: 'Clean Energy' },
  { id: 'conservation',  label: 'Conservation' },
  { id: 'daily-habits',  label: 'Daily Habits' },
  { id: 'nature-facts',  label: 'Nature Facts' },
] as const;

const CATEGORY_ICONS: Record<string, string> = {
  'clean-energy':  'solar_power',
  'conservation':  'eco',
  'daily-habits':  'self_improvement',
  'nature-facts':  'forest',
};

function KnowledgeCardItem({ card, index }: { card: KnowledgeCard; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const catLabel = KNOWLEDGE_CATEGORY_LABELS[card.category];
  const catIcon  = CATEGORY_ICONS[card.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-soft border border-forest-50 dark:border-dark-border card-hover cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${card.color} p-5`}>
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="material-symbols-rounded text-white" style={{ fontSize: '24px' }}>
              {card.icon}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
            <span className="material-symbols-rounded text-white" style={{ fontSize: '12px' }}>
              {catIcon}
            </span>
            <span className="text-white text-xs font-medium">{catLabel}</span>
          </div>
        </div>
        <h3 className="text-white font-bold text-base mt-3 leading-tight">{card.title}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sage-600 dark:text-sage-300 text-sm leading-relaxed">
          {expanded ? card.content : `${card.content.slice(0, 100)}...`}
        </p>

        <AnimatePresence>
          {expanded && card.fact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-xl bg-forest-50 dark:bg-dark-muted border border-forest-100 dark:border-dark-border"
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 flex-shrink-0" style={{ fontSize: '16px' }}>
                  lightbulb
                </span>
                <p className="text-xs text-forest-700 dark:text-forest-300 font-medium leading-relaxed">
                  {card.fact}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-sage-400 dark:text-sage-500">
            {expanded ? 'Tap to collapse' : 'Tap to read more'}
          </span>
          <motion.span
            className="material-symbols-rounded text-sage-400 dark:text-sage-500"
            style={{ fontSize: '18px' }}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            expand_more
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Learn() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? KNOWLEDGE_CARDS
    : KNOWLEDGE_CARDS.filter((c) => c.category === filter);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-200">Green Knowledge</h1>
        <p className="text-sm text-sage-500 dark:text-sage-400 mt-1">
          Explore sustainability insights across energy, nature, and daily habits.
        </p>
      </motion.div>

      {/* Featured hero card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-700 via-forest-600 to-mint-700 p-6 mb-6"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-rounded text-mint-300" style={{ fontSize: '20px' }}>
              menu_book
            </span>
            <span className="text-mint-300 text-sm font-medium">Did you know?</span>
          </div>
          <p className="text-white text-base font-medium leading-relaxed">
            &ldquo;A single mature tree can absorb up to <strong>22 kg of CO₂</strong> per year —
            equivalent to driving 115 km in a petrol car.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-rounded text-white" style={{ fontSize: '14px' }}>forest</span>
            </div>
            <span className="text-forest-200 text-xs">Nature Facts</span>
          </div>
        </div>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-forest-600 text-white shadow-green-sm'
                : 'bg-forest-50 dark:bg-dark-muted text-sage-600 dark:text-sage-300 hover:bg-forest-100 dark:hover:bg-dark-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filtered.map((card, i) => (
            <KnowledgeCardItem key={card.id} card={card} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-rounded text-sage-300 dark:text-sage-600" style={{ fontSize: '48px' }}>
            search_off
          </span>
          <p className="text-sage-400 dark:text-sage-500 mt-2">No cards in this category</p>
        </div>
      )}
    </div>
  );
}
