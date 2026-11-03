'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlantVisual from './PlantVisual';

const steps = [
  {
    icon: 'eco',
    title: 'Welcome to GreenPulse',
    subtitle: 'Your personal sustainability companion',
    description:
      "Every small action adds up. GreenPulse helps you track your eco impact, take on green challenges, and watch your understanding of sustainability grow — just like a plant.",
    cta: 'Let\'s Begin',
    bg: 'from-forest-600 to-forest-800',
  },
  {
    icon: 'track_changes',
    title: 'Track Your Daily Impact',
    subtitle: 'Know your carbon footprint',
    description:
      'Log your transport, food, energy use, and waste in seconds. See your real CO₂ impact, set goals, and celebrate every improvement you make.',
    cta: 'Sounds great',
    bg: 'from-sage-600 to-forest-700',
  },
  {
    icon: 'emoji_nature',
    title: 'Grow Your Green Tree',
    subtitle: 'Watch your commitment flourish',
    description:
      'Every challenge you complete and every eco choice you make earns points. Your personal tree grows greener and taller as you build better habits. Ready to plant your first seed?',
    cta: 'Start My Journey',
    bg: 'from-mint-600 to-forest-700',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setIsExiting(true);
      setTimeout(onComplete, 500);
    }
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background botanical pattern */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-5"
                style={{
                  left: `${(i * 37 + 10) % 100}%`,
                  top:  `${(i * 53 + 5)  % 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 8 + (i % 4) * 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <span className="material-symbols-rounded text-forest-400" style={{ fontSize: '64px' }}>
                  {['eco', 'local_florist', 'forest', 'yard', 'nature'][i % 5]}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="relative w-full max-w-lg mx-4">
            {/* Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
                className="bg-dark-card rounded-3xl overflow-hidden shadow-green-lg border border-dark-border"
              >
                {/* Top gradient banner */}
                <div className={`bg-gradient-to-br ${current.bg} p-8 flex flex-col items-center`}>
                  {step === 2 ? (
                    <div className="mb-2">
                      <PlantVisual level={3} progress={60} size="md" animate />
                    </div>
                  ) : (
                    <motion.div
                      className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="material-symbols-rounded text-white" style={{ fontSize: '40px' }}>
                        {current.icon}
                      </span>
                    </motion.div>
                  )}
                  <h1 className="text-white text-2xl font-bold text-center">{current.title}</h1>
                  <p className="text-white/70 text-sm mt-1 text-center">{current.subtitle}</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-forest-200 text-base leading-relaxed text-center">
                    {current.description}
                  </p>

                  {/* Step dots */}
                  <div className="flex items-center justify-center gap-2 mt-6 mb-6">
                    {steps.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === step
                            ? 'w-6 bg-forest-400'
                            : i < step
                            ? 'w-2 bg-forest-600'
                            : 'w-2 bg-dark-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-forest-600 to-forest-500 text-white font-semibold text-base shadow-green-md flex items-center justify-center gap-2"
                  >
                    {current.cta}
                    <span className="material-symbols-rounded text-xl">arrow_forward</span>
                  </motion.button>

                  {step < steps.length - 1 && (
                    <button
                      onClick={() => { setIsExiting(true); setTimeout(onComplete, 300); }}
                      className="w-full mt-3 text-dark-muted text-sm text-center hover:text-forest-400 transition-colors"
                    >
                      Skip intro
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
