'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="text-8xl mb-6"
        >
          🌿
        </motion.div>
        <h1 className="text-4xl font-bold text-forest-800 dark:text-forest-200 mb-2">404</h1>
        <p className="text-sage-500 dark:text-sage-400 mb-6">
          This page got lost in the forest.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-600 text-white font-semibold hover:bg-forest-700 transition-colors"
        >
          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>home</span>
          Back to GreenPulse
        </Link>
      </div>
    </div>
  );
}
