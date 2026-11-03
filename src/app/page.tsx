'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { TabId } from '@/types';
import NavBar from '@/components/NavBar';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/views/Dashboard';
import EcoTracker from '@/components/views/EcoTracker';
import Challenges from '@/components/views/Challenges';
import Learn from '@/components/views/Learn';
import Impact from '@/components/views/Impact';
import Badges from '@/components/views/Badges';
import WeeklySummaryModal from '@/components/WeeklySummaryModal';
import BadgeNotification from '@/components/BadgeNotification';

export default function HomePage() {
  const { stats, completeOnboarding } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR placeholder
    return (
      <div className="min-h-screen bg-[#f6f8f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" />
            </svg>
          </div>
          <p className="text-green-700 text-sm font-medium">Loading GreenPulse...</p>
        </div>
      </div>
    );
  }

  if (!stats.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -8 },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-theme">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Global overlays */}
      <WeeklySummaryModal />
      <BadgeNotification />

      <main className="md:pt-0 pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'dashboard'  && <Dashboard  onNavigate={setActiveTab} />}
            {activeTab === 'tracker'    && <EcoTracker />}
            {activeTab === 'challenges' && <Challenges />}
            {activeTab === 'learn'      && <Learn      />}
            {activeTab === 'impact'     && <Impact     />}
            {activeTab === 'badges'     && <Badges     />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
