'use client';

import React from 'react';

interface LeafPatternProps {
  className?: string;
  opacity?: number;
}

export default function LeafPattern({ className = '', opacity = 0.04 }: LeafPatternProps) {
  const leaves = [
    { x: 8, y: 12, r: -15, s: 1.0 },
    { x: 52, y: 5,  r: 20,  s: 0.7 },
    { x: 85, y: 30, r: -30, s: 1.1 },
    { x: 25, y: 55, r: 45,  s: 0.8 },
    { x: 70, y: 65, r: -10, s: 0.9 },
    { x: 42, y: 80, r: 60,  s: 0.6 },
    { x: 92, y: 72, r: -45, s: 1.2 },
    { x: 15, y: 88, r: 10,  s: 0.75 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {leaves.map((l, i) => (
          <g
            key={i}
            transform={`translate(${l.x}%, ${l.y}%) rotate(${l.r}) scale(${l.s})`}
          >
            <path
              d="M0-20 Q15 0 0 20 Q-15 0 0-20"
              fill="currentColor"
              className="text-forest-500"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
