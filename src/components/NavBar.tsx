'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TabId } from '@/types';
import { useApp } from '@/context/AppContext';

interface NavItem {
  id: TabId;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard',  label: 'Home',       icon: 'home'          },
  { id: 'tracker',    label: 'Track',      icon: 'add_circle'    },
  { id: 'challenges', label: 'Challenges', icon: 'emoji_events'  },
  { id: 'learn',      label: 'Learn',      icon: 'auto_stories'  },
  { id: 'impact',     label: 'Impact',     icon: 'bar_chart'     },
  { id: 'badges',     label: 'Badges',     icon: 'military_tech' },
];

interface NavBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const { theme, toggleTheme, stats } = useApp();

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-forest-100 dark:border-dark-border sticky top-0 z-40 transition-theme">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-green-sm">
            <span className="material-symbols-rounded text-white" style={{ fontSize: '20px' }}>
              eco
            </span>
          </div>
          <span className="font-bold text-lg text-forest-800 dark:text-forest-200 tracking-tight">
            GreenPulse
          </span>
        </div>

        {/* Desktop nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-sage-600 dark:text-sage-300 hover:bg-forest-50 dark:hover:bg-dark-card hover:text-forest-700 dark:hover:text-forest-300'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-forest-600 to-forest-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="material-symbols-rounded relative z-10" style={{ fontSize: '18px' }}>
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-50 dark:bg-dark-card border border-forest-100 dark:border-dark-border">
            <span className="material-symbols-rounded text-forest-600 dark:text-forest-400" style={{ fontSize: '16px' }}>
              stars
            </span>
            <span className="text-sm font-semibold text-forest-700 dark:text-forest-300">
              {stats.totalPoints.toLocaleString()}
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300 hover:bg-forest-50 dark:hover:bg-dark-card transition-colors"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md border-t border-forest-100 dark:border-dark-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl flex-1 transition-all duration-200 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-xl bg-forest-50 dark:bg-dark-card"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`material-symbols-rounded relative z-10 transition-colors ${
                    isActive ? 'text-forest-600 dark:text-forest-400' : 'text-sage-400 dark:text-sage-500'
                  }`}
                  style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[9px] font-medium relative z-10 transition-colors leading-none ${
                    isActive ? 'text-forest-700 dark:text-forest-300' : 'text-sage-400 dark:text-sage-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-forest-100 dark:border-dark-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
            <span className="material-symbols-rounded text-white" style={{ fontSize: '17px' }}>eco</span>
          </div>
          <span className="font-bold text-forest-800 dark:text-forest-200">GreenPulse</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-50 dark:bg-dark-card border border-forest-100 dark:border-dark-border">
            <span className="material-symbols-rounded text-forest-600" style={{ fontSize: '14px' }}>stars</span>
            <span className="text-xs font-semibold text-forest-700 dark:text-forest-300">{stats.totalPoints}</span>
          </div>
          <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-sage-500 dark:text-sage-400">
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
