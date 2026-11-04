'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

type TimeOfDay = 'morning' | 'afternoon' | 'dusk' | 'night';

interface Particle {
  id: number;
  x: number; // initial horizontal position %
  delay: number;
  duration: number;
  size: number;
  type: 'leaf' | 'mote' | 'firefly';
  rotation: number;
  swing: number;
}

export default function ForestAtmosphere() {
  const { atmosphereEnabled, theme } = useApp();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else if (hour >= 18 && hour < 22) setTimeOfDay('dusk');
    else setTimeOfDay('night');
  }, []);

  // Generate stable deterministic particles
  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      const type: 'leaf' | 'mote' | 'firefly' =
        i % 3 === 0 ? 'leaf' : i % 3 === 1 ? 'mote' : 'firefly';
      list.push({
        id: i,
        type,
        x: (i * 5.6 + 4) % 96,
        delay: (i * 0.7) % 8,
        duration: 12 + (i % 7) * 2.5,
        size: type === 'leaf' ? 14 + (i % 3) * 4 : 4 + (i % 4) * 2,
        rotation: (i * 45) % 360,
        swing: 25 + (i % 4) * 15,
      });
    }
    return list;
  }, []);

  if (!mounted || !atmosphereEnabled) return null;

  // Time-of-day specific atmospheric colors
  const atmosphereStyles = {
    morning: {
      ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(134, 239, 172, 0.12), transparent)',
      leafColor: theme === 'dark' ? '#4ade80' : '#22c55e',
      moteColor: 'rgba(167, 243, 208, 0.5)',
      fireflyColor: 'rgba(253, 224, 71, 0.6)',
    },
    afternoon: {
      ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251, 191, 36, 0.10), transparent)',
      leafColor: theme === 'dark' ? '#86efac' : '#16a34a',
      moteColor: 'rgba(254, 240, 138, 0.45)',
      fireflyColor: 'rgba(250, 204, 21, 0.65)',
    },
    dusk: {
      ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(192, 132, 252, 0.08), transparent)',
      leafColor: theme === 'dark' ? '#a7f3d0' : '#15803d',
      moteColor: 'rgba(233, 213, 255, 0.4)',
      fireflyColor: 'rgba(254, 215, 170, 0.7)',
    },
    night: {
      ambientGlow: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20, 184, 166, 0.12), transparent)',
      leafColor: '#2dd4bf',
      moteColor: 'rgba(94, 234, 212, 0.35)',
      fireflyColor: 'rgba(250, 204, 21, 0.85)',
    },
  }[timeOfDay];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-opacity duration-1000"
    >
      {/* Ambient sky canopy tint */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: atmosphereStyles.ambientGlow }}
      />

      {/* Floating particles & falling leaves */}
      {particles.map((p) => {
        if (p.type === 'leaf') {
          return (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: '-40px',
                opacity: 0,
                rotate: p.rotation,
              }}
              animate={{
                y: '105vh',
                x: [`${p.x}vw`, `${p.x + p.swing * 0.08}vw`, `${p.x - p.swing * 0.08}vw`, `${p.x}vw`],
                opacity: [0, 0.45, 0.45, 0],
                rotate: [p.rotation, p.rotation + 90, p.rotation + 180, p.rotation + 270],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute will-change-transform"
              style={{ width: p.size, height: p.size }}
            >
              <svg viewBox="0 0 24 24" fill={atmosphereStyles.leafColor} opacity="0.7">
                <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" />
              </svg>
            </motion.div>
          );
        }

        if (p.type === 'firefly' && (timeOfDay === 'night' || timeOfDay === 'dusk')) {
          return (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: '95vh',
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                y: '-20px',
                x: [`${p.x}vw`, `${p.x + 4}vw`, `${p.x - 4}vw`, `${p.x}vw`],
                opacity: [0, 0.8, 0.2, 0.9, 0],
                scale: [0.8, 1.4, 0.9, 1.3, 0.8],
              }}
              transition={{
                duration: p.duration * 1.3,
                delay: p.delay * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full will-change-transform"
              style={{
                width: p.size + 1,
                height: p.size + 1,
                backgroundColor: atmosphereStyles.fireflyColor,
                boxShadow: `0 0 10px 3px ${atmosphereStyles.fireflyColor}`,
              }}
            />
          );
        }

        // Soft botanical motes / pollen
        return (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: '-20px',
              opacity: 0,
            }}
            animate={{
              y: '102vh',
              x: [`${p.x}vw`, `${p.x + 3}vw`, `${p.x - 3}vw`, `${p.x}vw`],
              opacity: [0, 0.5, 0.6, 0],
            }}
            transition={{
              duration: p.duration * 1.1,
              delay: p.delay * 0.9,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute rounded-full blur-[0.5px] will-change-transform"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: atmosphereStyles.moteColor,
            }}
          />
        );
      })}
    </div>
  );
}
