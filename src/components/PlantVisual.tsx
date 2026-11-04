'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlantSkinId } from '@/types';
import { PLANT_SKINS } from '@/data';

interface PlantProps {
  level: number; // 1-8+
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  animate?: boolean;
  healthStatus?: 'thriving' | 'healthy' | 'needs-water' | 'wilting';
  wilted?: boolean;
  leafBurstTrigger?: number; // increments on quick action or challenge completion
  skin?: PlantSkinId;
  ascensionTier?: number;
}

const sizes = {
  sm:   { w: 90,  h: 110, scale: 0.5 },
  md:   { w: 140, h: 170, scale: 0.75 },
  lg:   { w: 200, h: 240, scale: 1.0 },
  xl:   { w: 260, h: 300, scale: 1.25 },
  hero: { w: 320, h: 350, scale: 1.45 },
};

function getHealthPalette(
  health: 'thriving' | 'healthy' | 'needs-water' | 'wilting',
  level: number,
  skin?: PlantSkinId
) {
  if (health === 'wilting') {
    return {
      primary: '#a89f68',
      secondary: '#b8ab64',
      leaf: '#c2b368',
      trunk: '#8a7355',
      glow: 'rgba(180, 160, 90, 0.2)',
      opacity: 0.78,
      droopAngle: 7,
    };
  }
  if (health === 'needs-water') {
    return {
      primary: '#6b9055',
      secondary: '#86a86c',
      leaf: '#9ec084',
      trunk: '#8d6e4b',
      glow: 'rgba(107, 144, 85, 0.25)',
      opacity: 0.88,
      droopAngle: 3,
    };
  }

  // Active Cosmetic Skin (if unlocked / active)
  if (skin && skin !== 'emerald') {
    const customSkin = PLANT_SKINS.find((s) => s.id === skin);
    if (customSkin) {
      return {
        primary: customSkin.primary,
        secondary: customSkin.secondary,
        leaf: customSkin.leaf,
        trunk: customSkin.trunk,
        glow: customSkin.glow,
        blossom: customSkin.blossom ?? '#f472b6',
        opacity: 1,
        droopAngle: 0,
      };
    }
  }

  // Healthy & Thriving palettes according to level
  if (level >= 7) {
    // Special evolved forms
    return {
      primary: level >= 8 ? '#059669' : '#10b981',
      secondary: level >= 8 ? '#34d399' : '#6ee7b7',
      leaf: level >= 8 ? '#6ee7b7' : '#a7f3d0',
      trunk: level >= 8 ? '#582f0e' : '#78350f',
      glow: level >= 8 ? 'rgba(52, 211, 153, 0.55)' : 'rgba(16, 185, 129, 0.45)',
      blossom: level >= 8 ? '#fcd34d' : '#f472b6',
      opacity: 1,
      droopAngle: 0,
    };
  }

  return {
    primary: level <= 2 ? '#4ade80' : level <= 4 ? '#22c55e' : '#16a34a',
    secondary: level <= 2 ? '#86efac' : level <= 4 ? '#4ade80' : '#22c55e',
    leaf: level <= 2 ? '#bbf7d0' : level <= 4 ? '#86efac' : '#4ade80',
    trunk: '#78350f',
    glow: health === 'thriving' ? 'rgba(34, 197, 94, 0.45)' : 'rgba(34, 197, 94, 0.2)',
    opacity: 1,
    droopAngle: 0,
  };
}

export default function PlantVisual({
  level = 1,
  progress = 0,
  size = 'lg',
  animate = true,
  healthStatus = 'healthy',
  wilted = false,
  leafBurstTrigger = 0,
  skin = 'emerald',
  ascensionTier = 0,
}: PlantProps) {
  const { w, h } = sizes[size] || sizes.lg;
  const effectiveHealth = wilted ? 'wilting' : healthStatus;
  const isWilting = effectiveHealth === 'wilting';
  const isNeedsWater = effectiveHealth === 'needs-water';
  const isThriving = effectiveHealth === 'thriving';
  const isSpecialEvolved = level >= 7 || ascensionTier > 0;

  const palette = getHealthPalette(effectiveHealth, level, skin);

  // Droop animation for wilting states
  const droopMotion = (isWilting || isNeedsWater) && animate
    ? {
        animate: {
          rotate: isWilting ? [0, palette.droopAngle, 0, -palette.droopAngle * 0.5, 0] : [0, 1.5, 0],
          y: isWilting ? [0, 4, 1, 3, 0] : [0, 1.5, 0],
        },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  // Gentle wind sway for healthy plants
  const swayMotion = animate && !isWilting
    ? {
        animate: {
          rotate: [-1.2, 1.2, -1.2],
        },
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <div
      className="relative flex items-end justify-center select-none"
      style={{ width: w, height: h }}
    >
      {/* Floating leaf bursts on action */}
      {animate && leafBurstTrigger > 0 && (
        <motion.div
          key={leafBurstTrigger}
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {[-25, 0, 25].map((angle, idx) => (
            <motion.div
              key={idx}
              initial={{ x: w / 2, y: h / 2, scale: 0.4, opacity: 0 }}
              animate={{
                x: w / 2 + Math.sin((angle * Math.PI) / 180) * 55,
                y: h / 2 - Math.cos((angle * Math.PI) / 180) * 50 - 20,
                scale: 1,
                opacity: [0, 1, 1, 0],
                rotate: angle * 2,
              }}
              transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
              className="absolute"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e">
                <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main SVG Render */}
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 6px 20px ${palette.glow})`,
          opacity: palette.opacity,
        }}
        className="transition-all duration-700 overflow-visible"
      >
        {/* Defs for gradients and glow filters */}
        <defs>
          <radialGradient id={`aura-${level}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`trunkGrad-${level}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.trunk} />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id={`leafGrad-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.secondary} />
            <stop offset="100%" stopColor={palette.primary} />
          </linearGradient>
        </defs>

        {/* Thriving / Celestial Aura */}
        {(isThriving || isSpecialEvolved) && animate && (
          <motion.ellipse
            cx={w / 2}
            cy={h * 0.45}
            rx={w * 0.44}
            ry={h * 0.38}
            fill={`url(#aura-${level})`}
            initial={{ scale: 0.9, opacity: 0.3 }}
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Ascension Crown (Floating Stars for Tier I+) */}
        {ascensionTier > 0 && animate && (
          <motion.g
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {[-22, -10, 0, 10, 22].slice(0, Math.min(5, 2 + ascensionTier)).map((offset, i) => (
              <motion.g
                key={i}
                animate={{
                  y: [0, -3, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <circle
                  cx={w / 2 + offset}
                  cy={14 + Math.abs(offset) * 0.25}
                  r={3.5}
                  fill="#fbbf24"
                  style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }}
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* Base soil mound & ceramic pot */}
        <ellipse cx={w / 2} cy={h - 12} rx={w * 0.32} ry={10} fill="#78350f" opacity="0.3" />
        <ellipse cx={w / 2} cy={h - 14} rx={w * 0.28} ry={7} fill="#92400e" opacity="0.8" />
        <ellipse cx={w / 2} cy={h - 14} rx={w * 0.22} ry={4} fill="#451a03" />

        {/* ─── STAGE 1: Seed of Hope ──────────────────────────────── */}
        {level === 1 && (
          <motion.g
            initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: `${w / 2}px ${h - 20}px` }}
          >
            {/* The dormant seed pod with gentle golden glow */}
            <ellipse cx={w / 2} cy={h - 22} rx={14} ry={9} fill="#b45309" />
            <ellipse cx={w / 2 - 2} cy={h - 23} rx={11} ry={7} fill="#d97706" />

            {/* Emergent sprout tip */}
            <motion.path
              d={`M ${w / 2} ${h - 22} Q ${w / 2 - 4} ${h - 36} ${w / 2 - 1} ${h - 44}`}
              stroke={palette.primary}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            {/* Tiny cotyledon leaf */}
            <motion.ellipse
              cx={w / 2 + 2}
              cy={h - 45}
              rx={7}
              ry={5}
              transform={`rotate(-25 ${w / 2 + 2} ${h - 45})`}
              fill={palette.leaf}
              initial={animate ? { scale: 0 } : undefined}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </motion.g>
        )}

        {/* ─── STAGE 2: First Sprout ─────────────────────────────── */}
        {level === 2 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Stalk */}
            <motion.path
              d={`M ${w / 2} ${h - 14} Q ${w / 2} ${h - 35} ${w / 2} ${h - 58}`}
              stroke={palette.primary}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            {/* Left Leaf */}
            <motion.ellipse
              cx={w / 2 - 16}
              cy={h - 48}
              rx={15}
              ry={9}
              transform={`rotate(-35 ${w / 2 - 16} ${h - 48})`}
              fill={palette.leaf}
              initial={animate ? { scale: 0 } : undefined}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />
            {/* Right Leaf */}
            <motion.ellipse
              cx={w / 2 + 16}
              cy={h - 52}
              rx={16}
              ry={10}
              transform={`rotate(32 ${w / 2 + 16} ${h - 52})`}
              fill={palette.primary}
              initial={animate ? { scale: 0 } : undefined}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            />
            {/* Top Terminal Bud */}
            <motion.circle
              cx={w / 2}
              cy={h - 62}
              r={7}
              fill={palette.secondary}
              initial={animate ? { scale: 0 } : undefined}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
          </motion.g>
        )}

        {/* ─── STAGE 3: Young Sapling ────────────────────────────── */}
        {level === 3 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Wooden Trunk */}
            <path
              d={`M ${w / 2 - 3} ${h - 14} L ${w / 2 - 2} ${h - 65} L ${w / 2 + 2} ${h - 65} L ${w / 2 + 3} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />
            {/* Branches */}
            <path
              d={`M ${w / 2} ${h - 45} Q ${w / 2 - 16} ${h - 55} ${w / 2 - 28} ${h - 65}`}
              stroke={palette.trunk}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M ${w / 2} ${h - 52} Q ${w / 2 + 16} ${h - 62} ${w / 2 + 26} ${h - 72}`}
              stroke={palette.trunk}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Leaves Cluster */}
            {[
              { cx: w / 2 - 30, cy: h - 68, rx: 14, ry: 9, rot: -30, color: palette.leaf },
              { cx: w / 2 + 28, cy: h - 74, rx: 15, ry: 10, rot: 30, color: palette.primary },
              { cx: w / 2, cy: h - 84, rx: 20, ry: 16, rot: 0, color: palette.secondary },
              { cx: w / 2 - 12, cy: h - 78, rx: 13, ry: 8, rot: -15, color: palette.primary },
              { cx: w / 2 + 12, cy: h - 80, rx: 14, ry: 9, rot: 20, color: palette.leaf },
            ].map((leaf, idx) => (
              <motion.ellipse
                key={idx}
                cx={leaf.cx}
                cy={leaf.cy}
                rx={leaf.rx}
                ry={leaf.ry}
                transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
                fill={leaf.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
              />
            ))}
          </motion.g>
        )}

        {/* ─── STAGE 4: Healthy Grove Plant ──────────────────────── */}
        {level === 4 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Trunk */}
            <path
              d={`M ${w / 2 - 5} ${h - 14} L ${w / 2 - 3} ${h - 80} L ${w / 2 + 3} ${h - 80} L ${w / 2 + 5} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />
            {/* Layered Foliage Canopy */}
            {[
              { cx: w / 2, cy: h - 105, r: 28, color: palette.primary },
              { cx: w / 2 - 28, cy: h - 85, r: 22, color: palette.secondary },
              { cx: w / 2 + 28, cy: h - 88, r: 23, color: palette.leaf },
              { cx: w / 2 - 14, cy: h - 70, r: 18, color: palette.primary },
              { cx: w / 2 + 16, cy: h - 72, r: 19, color: palette.secondary },
            ].map((cl, i) => (
              <motion.circle
                key={i}
                cx={cl.cx}
                cy={cl.cy}
                r={cl.r}
                fill={cl.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.15 + i * 0.08 }}
              />
            ))}
          </motion.g>
        )}

        {/* ─── STAGE 5: Flourishing Tree ─────────────────────────── */}
        {level === 5 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Trunk with root flare */}
            <path
              d={`M ${w / 2 - 8} ${h - 14} Q ${w / 2 - 4} ${h - 50} ${w / 2 - 3} ${h - 95} L ${w / 2 + 3} ${h - 95} Q ${w / 2 + 4} ${h - 50} ${w / 2 + 8} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />
            {/* Branches */}
            <path d={`M ${w / 2} ${h - 70} Q ${w / 2 - 22} ${h - 82} ${w / 2 - 38} ${h - 95}`} stroke={palette.trunk} strokeWidth="4" strokeLinecap="round" />
            <path d={`M ${w / 2} ${h - 75} Q ${w / 2 + 22} ${h - 85} ${w / 2 + 38} ${h - 98}`} stroke={palette.trunk} strokeWidth="4" strokeLinecap="round" />

            {/* Dense Lush Canopy */}
            {[
              { cx: w / 2, cy: h - 128, r: 35, color: palette.primary },
              { cx: w / 2 - 34, cy: h - 105, r: 26, color: palette.secondary },
              { cx: w / 2 + 34, cy: h - 108, r: 27, color: palette.leaf },
              { cx: w / 2 - 20, cy: h - 85, r: 21, color: palette.primary },
              { cx: w / 2 + 20, cy: h - 86, r: 22, color: palette.secondary },
              { cx: w / 2, cy: h - 148, r: 22, color: palette.leaf },
            ].map((cl, i) => (
              <motion.circle
                key={i}
                cx={cl.cx}
                cy={cl.cy}
                r={cl.r}
                fill={cl.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.1 + i * 0.06 }}
              />
            ))}
          </motion.g>
        )}

        {/* ─── STAGE 6: Ancient Forest Elder ─────────────────────── */}
        {level === 6 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Majestic gnarly trunk */}
            <path
              d={`M ${w / 2 - 13} ${h - 14} Q ${w / 2 - 6} ${h - 60} ${w / 2 - 4} ${h - 110} L ${w / 2 + 4} ${h - 110} Q ${w / 2 + 6} ${h - 60} ${w / 2 + 13} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />
            {/* Trunk bark texture */}
            <path d={`M ${w / 2 - 2} ${h - 22} L ${w / 2 - 1} ${h - 85}`} stroke="#381a05" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

            {/* Elder branches */}
            <path d={`M ${w / 2} ${h - 80} Q ${w / 2 - 32} ${h - 96} ${w / 2 - 50} ${h - 110}`} stroke={palette.trunk} strokeWidth="5" strokeLinecap="round" />
            <path d={`M ${w / 2} ${h - 88} Q ${w / 2 + 32} ${h - 102} ${w / 2 + 50} ${h - 116}`} stroke={palette.trunk} strokeWidth="5" strokeLinecap="round" />

            {/* Grand Old-Growth Canopy */}
            {[
              { cx: w / 2, cy: h - 145, r: 40, color: palette.primary },
              { cx: w / 2 - 45, cy: h - 118, r: 30, color: palette.secondary },
              { cx: w / 2 + 45, cy: h - 120, r: 30, color: palette.leaf },
              { cx: w / 2 - 28, cy: h - 95, r: 24, color: palette.primary },
              { cx: w / 2 + 28, cy: h - 96, r: 25, color: palette.secondary },
              { cx: w / 2, cy: h - 170, r: 26, color: palette.leaf },
              { cx: w / 2 - 20, cy: h - 155, r: 24, color: palette.primary },
              { cx: w / 2 + 20, cy: h - 156, r: 24, color: palette.secondary },
            ].map((cl, i) => (
              <motion.circle
                key={i}
                cx={cl.cx}
                cy={cl.cy}
                r={cl.r}
                fill={cl.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 90, delay: 0.08 + i * 0.05 }}
              />
            ))}
          </motion.g>
        )}

        {/* ─── STAGE 7: Solar Bloom Wonder (Special Evolved Form I) ─── */}
        {level === 7 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Radiant glowing trunk */}
            <path
              d={`M ${w / 2 - 14} ${h - 14} Q ${w / 2 - 7} ${h - 60} ${w / 2 - 5} ${h - 115} L ${w / 2 + 5} ${h - 115} Q ${w / 2 + 7} ${h - 60} ${w / 2 + 14} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />

            {/* Glowing Canopy */}
            {[
              { cx: w / 2, cy: h - 150, r: 42, color: palette.primary },
              { cx: w / 2 - 46, cy: h - 120, r: 32, color: palette.secondary },
              { cx: w / 2 + 46, cy: h - 122, r: 32, color: palette.leaf },
              { cx: w / 2 - 26, cy: h - 96, r: 26, color: palette.primary },
              { cx: w / 2 + 26, cy: h - 98, r: 26, color: palette.secondary },
              { cx: w / 2, cy: h - 176, r: 28, color: palette.leaf },
            ].map((cl, i) => (
              <motion.circle
                key={i}
                cx={cl.cx}
                cy={cl.cy}
                r={cl.r}
                fill={cl.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 90, delay: 0.06 + i * 0.05 }}
              />
            ))}

            {/* Blooming Eco-Flowers / Blossoms */}
            {[
              { cx: w / 2 - 32, cy: h - 138, r: 6 },
              { cx: w / 2 + 30, cy: h - 142, r: 6 },
              { cx: w / 2 - 12, cy: h - 165, r: 7 },
              { cx: w / 2 + 16, cy: h - 115, r: 5.5 },
              { cx: w / 2, cy: h - 128, r: 7 },
            ].map((fl, idx) => (
              <motion.g
                key={idx}
                animate={{ scale: [0.9, 1.25, 0.9] }}
                transition={{ duration: 2.2, delay: idx * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              >
                <circle cx={fl.cx} cy={fl.cy} r={fl.r} fill="#f43f5e" opacity="0.85" />
                <circle cx={fl.cx} cy={fl.cy} r={fl.r * 0.5} fill="#fef08a" />
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* ─── STAGE 8: Celestial Biosphere (Special Evolved Form II) ─── */}
        {level >= 8 && (
          <motion.g
            {...swayMotion}
            {...droopMotion}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          >
            {/* Cosmic Emerald Tree Trunk */}
            <path
              d={`M ${w / 2 - 16} ${h - 14} Q ${w / 2 - 8} ${h - 60} ${w / 2 - 5} ${h - 120} L ${w / 2 + 5} ${h - 120} Q ${w / 2 + 8} ${h - 60} ${w / 2 + 16} ${h - 14} Z`}
              fill={`url(#trunkGrad-${level})`}
            />

            {/* Transcendent Multi-Tier Canopy */}
            {[
              { cx: w / 2, cy: h - 158, r: 45, color: '#059669' },
              { cx: w / 2 - 50, cy: h - 126, r: 34, color: '#10b981' },
              { cx: w / 2 + 50, cy: h - 128, r: 34, color: '#34d399' },
              { cx: w / 2 - 30, cy: h - 98, r: 28, color: '#059669' },
              { cx: w / 2 + 30, cy: h - 100, r: 28, color: '#10b981' },
              { cx: w / 2, cy: h - 188, r: 32, color: '#6ee7b7' },
            ].map((cl, i) => (
              <motion.circle
                key={i}
                cx={cl.cx}
                cy={cl.cy}
                r={cl.r}
                fill={cl.color}
                initial={animate ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 90, delay: 0.05 + i * 0.04 }}
              />
            ))}

            {/* Orbiting Starlight Firefly Orbs */}
            {[
              { cx: w / 2 - 40, cy: h - 170, delay: 0 },
              { cx: w / 2 + 42, cy: h - 165, delay: 0.6 },
              { cx: w / 2 - 15, cy: h - 125, delay: 1.2 },
              { cx: w / 2 + 20, cy: h - 135, delay: 1.8 },
              { cx: w / 2, cy: h - 200, delay: 2.4 },
            ].map((orb, i) => (
              <motion.circle
                key={i}
                cx={orb.cx}
                cy={orb.cy}
                r={4}
                fill="#fbbf24"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 1, 0.6],
                  y: [-3, 3, -3],
                }}
                transition={{
                  duration: 2.5,
                  delay: orb.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.g>
        )}

        {/* Progress Halo ring at the base of the plant */}
        {progress > 0 && (
          <motion.ellipse
            cx={w / 2}
            cy={h - 14}
            rx={w * 0.28 * (progress / 100)}
            ry={5}
            fill={palette.primary}
            opacity={0.4}
            initial={animate ? { scaleX: 0 } : undefined}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: `${w / 2}px ${h - 14}px` }}
          />
        )}
      </svg>
    </div>
  );
}
