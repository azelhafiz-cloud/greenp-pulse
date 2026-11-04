'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

interface CompanionCreatureProps {
  reactionTrigger?: number; // increments on quick action or plant care
}

const PIP_DIALOGUES = [
  "Squeak! I'm Pip, your forest sprite companion! 🌱",
  "Every green choice you make makes the whole forest sing! ✨",
  "Did you know city trees can talk to each other through fungi underground? 🍄",
  "Your plant is looking so happy and vibrant today! 🌿",
  "Breathe in... that's pure fresh oxygen we grew together! 🍃",
  "You're my favorite human on this whole planet! 💚",
  "Pip loves clean air! Let's do another green deed today! 🚲",
];

export default function CompanionCreature({ reactionTrigger = 0 }: CompanionCreatureProps) {
  const { stats } = useApp();
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const affection = stats.companionAffection ?? 25;
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 5;

  const currentDialogue = PIP_DIALOGUES[dialogueIdx % PIP_DIALOGUES.length];

  const handleClick = () => {
    setDialogueIdx((prev) => prev + 1);
    setShowSpeech(true);
    setClickCount((p) => p + 1);
    setTimeout(() => setShowSpeech(false), 3800);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Pip's speech bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.85 }}
            className="absolute -top-16 z-30 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-black/90 text-forest-900 dark:text-forest-100 text-[11px] font-bold shadow-md border border-forest-200 dark:border-forest-800 whitespace-nowrap max-w-[220px] text-center"
          >
            <span>{currentDialogue}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-black rotate-45 border-r border-b border-forest-200 dark:border-forest-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pip Character Avatar */}
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }}
        whileTap={{ scale: 0.9, y: 5 }}
        animate={{
          y: isNight ? [0, 2, 0] : [-4, 4, -4],
          rotate: isNight ? 0 : [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: isNight ? 4 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="cursor-pointer relative select-none flex flex-col items-center"
        title="Pip the Forest Sprite — Click to talk!"
      >
        {/* Heart/Star reaction on action trigger */}
        {reactionTrigger > 0 && (
          <motion.div
            key={reactionTrigger}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -28, scale: 1.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -top-3 text-sm pointer-events-none z-20"
          >
            ✨💚
          </motion.div>
        )}

        <svg width="48" height="48" viewBox="0 0 60 60" fill="none" className="drop-shadow-sm overflow-visible">
          {/* Gentle glow aura */}
          <circle cx="30" cy="32" r="22" fill="#86efac" opacity="0.3" />

          {/* Tiny fluttering leaf wings */}
          <motion.ellipse
            cx="14"
            cy="30"
            rx="8"
            ry="4"
            fill="#a7f3d0"
            transform="rotate(-25 14 30)"
            animate={{ rotate: [-25, -40, -25] }}
            transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx="46"
            cy="30"
            rx="8"
            ry="4"
            fill="#a7f3d0"
            transform="rotate(25 46 30)"
            animate={{ rotate: [25, 40, 25] }}
            transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Body */}
          <ellipse cx="30" cy="34" rx="16" ry="14" fill="#22c55e" />
          <ellipse cx="30" cy="36" rx="13" ry="11" fill="#4ade80" />

          {/* Sprout head antenna with curled leaf */}
          <path d="M 30 20 Q 30 11 36 8 Q 42 6 42 12 Q 38 15 30 20" fill="#15803d" />
          <ellipse cx="38" cy="8" rx="5" ry="3" transform="rotate(20 38 8)" fill="#86efac" />

          {/* Eyes */}
          {isNight ? (
            // Sleepy curved eyes
            <>
              <path d="M 22 32 Q 25 35 28 32" stroke="#052e16" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 32 32 Q 35 35 38 32" stroke="#052e16" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Big joyful sparkling eyes
            <>
              <ellipse cx="24" cy="32" rx="3.5" ry="4" fill="#052e16" />
              <circle cx="23" cy="30.5" r="1.3" fill="white" />
              <ellipse cx="36" cy="32" rx="3.5" ry="4" fill="#052e16" />
              <circle cx="35" cy="30.5" r="1.3" fill="white" />
            </>
          )}

          {/* Rosy cheeks */}
          <circle cx="19" cy="36" r="3" fill="#f472b6" opacity="0.6" />
          <circle cx="41" cy="36" r="3" fill="#f472b6" opacity="0.6" />

          {/* Happy smile */}
          <path d="M 27 37 Q 30 40 33 37" stroke="#052e16" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>

        {/* Companion Name & Affection Pill */}
        <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-forest-900/60 dark:bg-black/60 border border-white/20 text-[9px] font-bold text-mint-300 backdrop-blur-xs">
          <span>Pip</span>
          <span className="text-white/40">·</span>
          <span>{affection}% Bond</span>
        </div>
      </motion.div>
    </div>
  );
}
