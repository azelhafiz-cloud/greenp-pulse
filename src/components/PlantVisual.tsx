'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlantProps {
  level: number; // 1-6
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  healthStatus?: 'thriving' | 'healthy' | 'needs-water' | 'wilting';
  wilted?: boolean; // shorthand — treated as healthStatus === 'wilting'
}

const sizes = {
  sm:  { w: 80,  h: 100 },
  md:  { w: 120, h: 150 },
  lg:  { w: 180, h: 220 },
  xl:  { w: 240, h: 300 },
};

// Map health status → color adjustments
function getHealthColors(
  health: 'thriving' | 'healthy' | 'needs-water' | 'wilting',
  primary: string,
  leaf: string
): { primary: string; leaf: string; opacity: number } {
  if (health === 'wilting')     return { primary: '#b5a642', leaf: '#c8b84a', opacity: 0.75 };
  if (health === 'needs-water') return { primary, leaf, opacity: 0.85 };
  return { primary, leaf, opacity: 1 };
}

export default function PlantVisual({
  level,
  progress,
  size = 'lg',
  animate = true,
  healthStatus,
  wilted = false,
}: PlantProps) {
  const { w, h } = sizes[size];

  // Resolve effective health
  const effectiveHealth = wilted ? 'wilting' : (healthStatus ?? 'healthy');
  const isWilting = effectiveHealth === 'wilting';
  const isThriving = effectiveHealth === 'thriving';

  // Level-based base colors
  const greenShades = [
    '#86efac', // level 1
    '#4ade80', // level 2
    '#22c55e', // level 3
    '#16a34a', // level 4
    '#15803d', // level 5
    '#14532d', // level 6
  ];
  const baseGreen = greenShades[Math.min(level - 1, 5)];
  const baseLeaf  = level <= 2 ? '#bbf7d0' : level <= 4 ? '#86efac' : '#4ade80';

  const { primary: primaryGreen, leaf: leafGreen, opacity } = getHealthColors(effectiveHealth, baseGreen, baseLeaf);
  const trunkBrown = isWilting ? '#a38a5a' : '#92400e';
  const soilColor  = '#a16207';

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 120, damping: 15 },
      }
    : {};

  // Wilting droop animation for canopy groups
  const droopProps = isWilting
    ? {
        animate: { rotate: [0, 1.5, -1, 0.5, 0], y: [0, 3, 2, 3, 0] },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  // Thriving pulse for glow ring handled inline below

  return (
    <Wrapper {...wrapperProps} className="flex items-end justify-center" style={{ opacity }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: isThriving ? 'drop-shadow(0 4px 16px rgba(22,163,74,0.45))' : 'drop-shadow(0 4px 12px rgba(22,163,74,0.25))' }}
      >
        {/* Thriving glow ring */}
        {isThriving && animate && (
          <motion.ellipse
            cx={w / 2}
            cy={h - 8}
            rx={w * 0.35}
            ry={10}
            fill="#22c55e"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Soil / pot base */}
        <ellipse cx={w / 2} cy={h - 8} rx={w * 0.28} ry={8} fill={soilColor} opacity="0.6" />

        {/* Main trunk — tilts slightly if wilting */}
        {level >= 1 && (
          <motion.rect
            x={w / 2 - 4}
            y={h - 20}
            width={8}
            height={level === 1 ? 20 : level <= 3 ? 35 : 55}
            rx={4}
            fill={trunkBrown}
            initial={animate ? { scaleY: 0 } : undefined}
            animate={isWilting ? { scaleY: 1, rotate: 2 } : animate ? { scaleY: 1 } : undefined}
            style={{ transformOrigin: `${w / 2}px ${h - 8}px` }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        )}

        {/* Level 1: Single sprout */}
        {level === 1 && (
          <motion.ellipse
            cx={w / 2}
            cy={h - 38}
            rx={12}
            ry={18}
            fill={primaryGreen}
            initial={animate ? { scale: 0 } : undefined}
            animate={animate ? { scale: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ transformOrigin: `${w / 2}px ${h - 38}px` }}
          />
        )}

        {/* Level 2: Sprout with two leaves */}
        {level === 2 && (
          <>
            {/* Left leaf */}
            <motion.ellipse
              cx={w / 2 - 14}
              cy={h - 45}
              rx={12}
              ry={8}
              fill={leafGreen}
              transform={`rotate(-30 ${w / 2 - 14} ${h - 45})`}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{ transformOrigin: `${w / 2 - 14}px ${h - 45}px` }}
            />
            {/* Right leaf */}
            <motion.ellipse
              cx={w / 2 + 14}
              cy={h - 45}
              rx={12}
              ry={8}
              fill={primaryGreen}
              transform={`rotate(30 ${w / 2 + 14} ${h - 45})`}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.6 }}
              style={{ transformOrigin: `${w / 2 + 14}px ${h - 45}px` }}
            />
            {/* Top bud */}
            <motion.ellipse
              cx={w / 2}
              cy={h - 56}
              rx={9}
              ry={12}
              fill={leafGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.7 }}
              style={{ transformOrigin: `${w / 2}px ${h - 56}px` }}
            />
          </>
        )}

        {/* Level 3+: Small tree with canopy */}
        {level >= 3 && level < 5 && (
          <motion.g {...droopProps}>
            {/* Side branches */}
            <motion.line
              x1={w / 2} y1={h - 40} x2={w / 2 - 22} y2={h - 58}
              stroke={trunkBrown} strokeWidth="4" strokeLinecap="round"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.line
              x1={w / 2} y1={h - 48} x2={w / 2 + 22} y2={h - 66}
              stroke={trunkBrown} strokeWidth="4" strokeLinecap="round"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* Canopy clusters */}
            <motion.circle
              cx={w / 2} cy={h - 80} r={isWilting ? 20 : 24}
              fill={primaryGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
              style={{ transformOrigin: `${w / 2}px ${h - 80}px` }}
            />
            <motion.circle
              cx={w / 2 - 20} cy={h - 66} r={isWilting ? 15 : 18}
              fill={leafGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 100, delay: 0.7 }}
              style={{ transformOrigin: `${w / 2 - 20}px ${h - 66}px` }}
            />
            <motion.circle
              cx={w / 2 + 20} cy={h - 66} r={isWilting ? 15 : 18}
              fill={leafGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
              style={{ transformOrigin: `${w / 2 + 20}px ${h - 66}px` }}
            />
          </motion.g>
        )}

        {/* Level 4: Medium tree */}
        {level === 4 && (
          <motion.g {...droopProps}>
            <motion.line
              x1={w / 2} y1={h - 40} x2={w / 2 - 26} y2={h - 62}
              stroke={trunkBrown} strokeWidth="4" strokeLinecap="round"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.35 }}
            />
            <motion.line
              x1={w / 2} y1={h - 50} x2={w / 2 + 26} y2={h - 70}
              stroke={trunkBrown} strokeWidth="4" strokeLinecap="round"
              initial={animate ? { pathLength: 0 } : undefined}
              animate={animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
            <motion.circle
              cx={w / 2} cy={h - 92} r={isWilting ? 24 : 28}
              fill={primaryGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ type: 'spring', delay: 0.55 }}
              style={{ transformOrigin: `${w / 2}px ${h - 92}px` }}
            />
            {[
              { cx: -24, cy: -74, r: isWilting ? 17 : 20 },
              { cx:  24, cy: -74, r: isWilting ? 17 : 20 },
              { cx:   0, cy: -110, r: isWilting ? 15 : 18 },
            ].map((c, i) => (
              <motion.circle
                key={i}
                cx={w / 2 + c.cx}
                cy={h + c.cy}
                r={c.r}
                fill={i % 2 === 0 ? leafGreen : primaryGreen}
                initial={animate ? { scale: 0 } : undefined}
                animate={animate ? { scale: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 90, delay: 0.6 + i * 0.08 }}
                style={{ transformOrigin: `${w / 2 + c.cx}px ${h + c.cy}px` }}
              />
            ))}
          </motion.g>
        )}

        {/* Level 5-6: Full lush tree */}
        {level >= 5 && (
          <motion.g {...droopProps}>
            {/* Multiple branches */}
            {[
              { x1: 0, y1: -40, x2: -32, y2: -65, delay: 0.3 },
              { x1: 0, y1: -52, x2: 32,  y2: -72, delay: 0.35 },
              { x1: 0, y1: -62, x2: -20, y2: -82, delay: 0.4 },
              { x1: 0, y1: -65, x2: 20,  y2: -88, delay: 0.45 },
            ].map((b, i) => (
              <motion.line
                key={i}
                x1={w / 2 + b.x1} y1={h + b.y1}
                x2={w / 2 + b.x2} y2={h + b.y2}
                stroke={trunkBrown}
                strokeWidth="3"
                strokeLinecap="round"
                initial={animate ? { pathLength: 0 } : undefined}
                animate={animate ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.4, delay: b.delay }}
              />
            ))}
            {/* Large layered canopy */}
            <motion.circle
              cx={w / 2} cy={h - 105} r={isWilting ? 28 : 32}
              fill={primaryGreen}
              initial={animate ? { scale: 0 } : undefined}
              animate={animate ? { scale: 1 } : undefined}
              transition={{ type: 'spring', delay: 0.5 }}
              style={{ transformOrigin: `${w / 2}px ${h - 105}px` }}
            />
            {[
              { cx: -28, cy: -80,  r: isWilting ? 19 : 22 },
              { cx:  28, cy: -80,  r: isWilting ? 19 : 22 },
              { cx: -18, cy: -68,  r: isWilting ? 15 : 18 },
              { cx:  18, cy: -68,  r: isWilting ? 15 : 18 },
              { cx:   0, cy: -128, r: isWilting ? 17 : 20 },
              { cx: -12, cy: -118, r: isWilting ? 14 : 16 },
              { cx:  12, cy: -118, r: isWilting ? 14 : 16 },
            ].map((c, i) => (
              <motion.circle
                key={i}
                cx={w / 2 + c.cx}
                cy={h + c.cy}
                r={c.r}
                fill={i % 2 === 0 ? leafGreen : primaryGreen}
                initial={animate ? { scale: 0 } : undefined}
                animate={animate ? { scale: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 90, delay: 0.55 + i * 0.06 }}
                style={{ transformOrigin: `${w / 2 + c.cx}px ${h + c.cy}px` }}
              />
            ))}
          </motion.g>
        )}

        {/* Progress glow ring at base */}
        {progress > 0 && (
          <motion.ellipse
            cx={w / 2}
            cy={h - 8}
            rx={w * 0.28 * (progress / 100)}
            ry={5}
            fill={primaryGreen}
            opacity={0.4}
            initial={animate ? { scaleX: 0 } : undefined}
            animate={animate ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ transformOrigin: `${w / 2}px ${h - 8}px` }}
          />
        )}
      </svg>
    </Wrapper>
  );
}
