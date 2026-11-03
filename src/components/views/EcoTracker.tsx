'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { EMISSION_FACTORS, CATEGORY_COLORS } from '@/data';
import { EcoActivity } from '@/types';
import { getTodayActivities, getTodayCo2 } from '@/lib/storage';

const CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: 'directions_car' },
  { id: 'food',      label: 'Food',      icon: 'restaurant'    },
  { id: 'energy',    label: 'Energy',    icon: 'bolt'          },
  { id: 'waste',     label: 'Waste',     icon: 'delete'        },
] as const;

export default function EcoTracker() {
  const { stats, addActivity } = useApp();
  const [selectedCat, setSelectedCat] = useState<EcoActivity['category']>('transport');
  const [selectedFactor, setSelectedFactor] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showForm, setShowForm] = useState(true);

  const todayActivities = getTodayActivities(stats);
  const todayCo2 = getTodayCo2(stats);

  const filteredFactors = EMISSION_FACTORS.filter((f) => f.category === selectedCat);
  const chosenFactor = filteredFactors.find((f) => f.action === selectedFactor);

  const estimatedCo2 =
    chosenFactor && quantity ? parseFloat(quantity) * chosenFactor.factor : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenFactor || !quantity || isNaN(parseFloat(quantity))) return;

    const qty = parseFloat(quantity);
    addActivity({
      date: new Date().toISOString().split('T')[0],
      category: selectedCat,
      action: chosenFactor.action,
      quantity: qty,
      unit: chosenFactor.unit,
      co2Kg: parseFloat((qty * chosenFactor.factor).toFixed(3)),
    });

    const co2 = (qty * chosenFactor.factor).toFixed(2);
    setSuccessMsg(
      co2 === '0.00'
        ? `✨ Zero-emission activity logged! Great choice.`
        : `Logged! +${co2} kg CO₂ for ${chosenFactor.label}.`
    );
    setQuantity('');
    setSelectedFactor('');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-200">Eco Tracker</h1>
        <p className="text-sm text-sage-500 dark:text-sage-400 mt-1">
          Log your daily activities to see your carbon footprint.
        </p>
      </motion.div>

      {/* Today's summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-2xl p-5 mb-6 flex items-center justify-between"
      >
        <div>
          <p className="text-forest-200 text-sm">Today&apos;s emissions</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-bold text-white">{todayCo2.toFixed(2)}</span>
            <span className="text-forest-300 text-sm">kg CO₂</span>
          </div>
          <p className="text-forest-300 text-xs mt-1">
            {todayActivities.length} activit{todayActivities.length === 1 ? 'y' : 'ies'} logged
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            todayCo2 === 0
              ? 'bg-mint-500/30 text-mint-300'
              : todayCo2 < 3
              ? 'bg-forest-500/30 text-forest-300'
              : todayCo2 < 6
              ? 'bg-amber-500/30 text-amber-300'
              : 'bg-red-500/30 text-red-300'
          }`}>
            {todayCo2 === 0
              ? '🌿 Zero emissions!'
              : todayCo2 < 3
              ? '✅ Great day'
              : todayCo2 < 6
              ? '⚡ Moderate'
              : '🔴 High impact'}
          </div>
        </div>
      </motion.div>

      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-forest-50 dark:bg-dark-card border border-forest-200 dark:border-forest-800 rounded-xl p-3 mb-4 flex items-center gap-3"
          >
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '20px' }}>
              check_circle
            </span>
            <p className="text-sm text-forest-700 dark:text-forest-300 font-medium">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border mb-6"
      >
        <h2 className="font-semibold text-forest-800 dark:text-forest-200 mb-4 flex items-center gap-2">
          <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '20px' }}>
            add_circle
          </span>
          Log Activity
        </h2>

        {/* Category tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id);
                setSelectedFactor('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                selectedCat === cat.id
                  ? 'bg-forest-600 text-white shadow-green-sm'
                  : 'bg-forest-50 dark:bg-dark-muted text-sage-600 dark:text-sage-300 hover:bg-forest-100 dark:hover:bg-dark-border'
              }`}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '15px' }}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity select */}
          <div>
            <label className="block text-xs font-medium text-sage-500 dark:text-sage-400 mb-1.5 uppercase tracking-wide">
              Activity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredFactors.map((f) => (
                <button
                  key={f.action}
                  type="button"
                  onClick={() => setSelectedFactor(f.action)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedFactor === f.action
                      ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/30'
                      : 'border-forest-100 dark:border-dark-border hover:border-forest-300 dark:hover:border-dark-muted bg-white dark:bg-dark-surface'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedFactor === f.action
                        ? 'bg-forest-100 dark:bg-forest-800'
                        : 'bg-forest-50 dark:bg-dark-muted'
                    }`}
                  >
                    <span
                      className={`material-symbols-rounded ${
                        selectedFactor === f.action ? 'text-forest-700 dark:text-forest-300' : 'text-sage-400'
                      }`}
                      style={{ fontSize: '16px' }}
                    >
                      {f.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-forest-800 dark:text-forest-200 leading-tight">
                      {f.label}
                    </p>
                    <p className="text-xs text-sage-400 dark:text-sage-500">
                      {f.factor === 0 ? '0 kg CO₂' : `${f.factor} kg CO₂/${f.unit}`}
                    </p>
                  </div>
                  {selectedFactor === f.action && (
                    <span className="material-symbols-rounded text-forest-600 dark:text-forest-400 ml-auto flex-shrink-0" style={{ fontSize: '18px' }}>
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity input */}
          {selectedFactor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-xs font-medium text-sage-500 dark:text-sage-400 mb-1.5 uppercase tracking-wide">
                Quantity ({chosenFactor?.unit})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`e.g. 10 ${chosenFactor?.unit}`}
                  className="flex-1 px-4 py-3 rounded-xl border border-forest-100 dark:border-dark-border bg-forest-50/50 dark:bg-dark-surface text-forest-800 dark:text-forest-200 text-sm focus:border-forest-400 transition-colors placeholder:text-sage-300 dark:placeholder:text-sage-600"
                />
                {/* CO2 estimate badge */}
                {quantity && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-3 py-3 rounded-xl text-sm font-semibold flex-shrink-0 ${
                      estimatedCo2 === 0
                        ? 'bg-mint-50 dark:bg-mint-900/30 text-mint-700 dark:text-mint-400'
                        : estimatedCo2 < 2
                        ? 'bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400'
                        : estimatedCo2 < 5
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {estimatedCo2 === 0 ? '0 kg ✨' : `~${estimatedCo2.toFixed(2)} kg`}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!selectedFactor || !quantity}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-forest-600 to-forest-500 text-white font-semibold text-sm shadow-green-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-green-md transition-shadow"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>add</span>
            Log Activity
          </button>
        </form>
      </motion.div>

      {/* Today's log */}
      {todayActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-forest-50 dark:border-dark-border"
        >
          <h2 className="font-semibold text-forest-800 dark:text-forest-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '20px' }}>
              history
            </span>
            Today&apos;s Log
          </h2>
          <div className="space-y-2">
            <AnimatePresence>
              {[...todayActivities].reverse().map((act) => {
                const colors = CATEGORY_COLORS[act.category];
                const factor = EMISSION_FACTORS.find((f) => f.action === act.action);
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-forest-50/40 dark:bg-dark-surface/60 border border-forest-50 dark:border-dark-border"
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-rounded ${colors.icon}`} style={{ fontSize: '16px' }}>
                        {factor?.icon ?? 'eco'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest-800 dark:text-forest-200 truncate">
                        {factor?.label ?? act.action}
                      </p>
                      <p className="text-xs text-sage-400 dark:text-sage-500">
                        {act.quantity} {act.unit}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold flex-shrink-0 ${
                      act.co2Kg === 0 ? 'text-mint-600 dark:text-mint-400' : 'text-forest-700 dark:text-forest-300'
                    }`}>
                      {act.co2Kg === 0 ? '0 kg ✨' : `${act.co2Kg.toFixed(2)} kg`}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
