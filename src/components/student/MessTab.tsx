import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Coffee,
  Check,
} from 'lucide-react';
import { MESS_MENU_DATA, WEEKLY_MEAL_PLAN } from './studentData';

export type MealSlot = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

interface MealScheduleConfig {
  slot: MealSlot;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  timingStr: string;
}

const SCHEDULES: MealScheduleConfig[] = [
  { slot: 'Breakfast', startHour: 7, startMin: 30, endHour: 9, endMin: 0, timingStr: '07:30 AM - 09:00 AM' },
  { slot: 'Lunch', startHour: 12, startMin: 10, endHour: 13, endMin: 30, timingStr: '12:10 PM - 01:30 PM' },
  { slot: 'Snacks', startHour: 17, startMin: 0, endHour: 18, endMin: 0, timingStr: '05:00 PM - 06:00 PM' },
  { slot: 'Dinner', startHour: 20, startMin: 0, endHour: 21, endMin: 0, timingStr: '08:00 PM - 09:00 PM' },
];

interface MessTabProps {
  darkMode: boolean;
}

export const MessTab: React.FC<MessTabProps> = ({ darkMode }) => {
  const [activeMeal, setActiveMeal] = useState<MealSlot>('Lunch');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [residentPref, setResidentPref] = useState<'Veg' | 'Non-Veg'>('Non-Veg');
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [activeDay, setActiveDay] = useState<string>('Monday');

  // Real-time tracking state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentServingMeal, setCurrentServingMeal] = useState<MealSlot | null>(null);
  const [nextUpcomingMeal, setNextUpcomingMeal] = useState<MealSlot>('Lunch');
  const [closingTimeLeft, setClosingTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null>(null);
  const [nextMealTimeLeft, setNextMealTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Helper to format remaining time
  const formatTimePad = (num: number) => String(num).padStart(2, '0');

  useEffect(() => {
    const evaluateLiveMealState = () => {
      const now = new Date();
      setCurrentTime(now);
      const curHour = now.getHours();
      const curMin = now.getMinutes();
      const curSec = now.getSeconds();
      const curTotalSec = curHour * 3600 + curMin * 60 + curSec;

      let foundActive: MealSlot | null = null;
      let activeClosingSec = 0;

      // Check which meal is active right now
      for (const sched of SCHEDULES) {
        const startSec = sched.startHour * 3600 + sched.startMin * 60;
        const endSec = sched.endHour * 3600 + sched.endMin * 60;

        if (curTotalSec >= startSec && curTotalSec < endSec) {
          foundActive = sched.slot;
          activeClosingSec = endSec - curTotalSec;
          break;
        }
      }

      setCurrentServingMeal(foundActive);

      if (foundActive) {
        // Calculate countdown to closing
        const hrs = Math.floor(activeClosingSec / 3600);
        const rem = activeClosingSec % 3600;
        const mins = Math.floor(rem / 60);
        const secs = rem % 60;
        setClosingTimeLeft({
          hours: hrs,
          minutes: mins,
          seconds: secs,
          totalSeconds: activeClosingSec,
        });
        setNextMealTimeLeft(null);
      } else {
        setClosingTimeLeft(null);

        // Find next upcoming meal
        let nextSched: MealScheduleConfig | null = null;
        let diffSec = 0;

        for (const sched of SCHEDULES) {
          const startSec = sched.startHour * 3600 + sched.startMin * 60;
          if (startSec > curTotalSec) {
            nextSched = sched;
            diffSec = startSec - curTotalSec;
            break;
          }
        }

        // If after Dinner (after 21:00), next meal is tomorrow's Breakfast (07:30)
        if (!nextSched) {
          nextSched = SCHEDULES[0]; // Breakfast
          const breakfastStartSec = 7 * 3600 + 30 * 60;
          const endOfDaySec = 24 * 3600 - curTotalSec;
          diffSec = endOfDaySec + breakfastStartSec;
        }

        setNextUpcomingMeal(nextSched.slot);
        const hrs = Math.floor(diffSec / 3600);
        const rem = diffSec % 3600;
        const mins = Math.floor(rem / 60);
        const secs = rem % 60;
        setNextMealTimeLeft({ hours: hrs, minutes: mins, seconds: secs });
      }
    };

    evaluateLiveMealState();
    const timer = setInterval(evaluateLiveMealState, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync active viewed meal tab with the active serving meal on first load or slot change
  useEffect(() => {
    if (currentServingMeal) {
      setActiveMeal(currentServingMeal);
    } else {
      setActiveMeal(nextUpcomingMeal);
    }
  }, [currentServingMeal, nextUpcomingMeal]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
    }, 4000);
  };

  const currentMealData = MESS_MENU_DATA[activeMeal];
  const filteredDishes = currentMealData.dishes.filter((dish) => {
    if (dietFilter === 'All') return true;
    return dish.type === dietFilter;
  });

  return (
    <div id="mess-tab-content" className="space-y-6">
      {/* 1. TOP MESS BANNER */}
      <div
        id="mess-top-banner"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-[#141310] border-[#2B2720] shadow-md'
            : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white font-mono font-black text-xl shadow-sm shrink-0">
              <Utensils size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] uppercase tracking-wider">
                  Royal Dining Hall
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Ground Floor Annex
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] mt-1">
                Mess & Real-Time Dining Terminal
              </h1>
              <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-1">
                Official Timings: Breakfast (7:30–9:00 AM) · Lunch (12:10–1:30 PM) · Snacks (5:00–6:00 PM) · Dinner (8:00–9:00 PM)
              </p>
            </div>
          </div>

          {/* Resident Preference Switcher: Veg vs Non-Veg */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 ${
              darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#FAF6F0] border-[#DCD6CA]'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] block font-bold">
                My Dietary Preference
              </span>
              <span className="font-mono text-xs font-bold text-[#1C1917] dark:text-white">
                {residentPref === 'Veg' ? 'Vegetarian Resident' : 'Non-Vegetarian Resident'}
              </span>
            </div>
            <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720]">
              <button
                id="pref-veg-btn"
                onClick={() => setResidentPref('Veg')}
                className={`px-2.5 py-1 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                  residentPref === 'Veg'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
              >
                Veg
              </button>
              <button
                id="pref-nonveg-btn"
                onClick={() => setResidentPref('Non-Veg')}
                className={`px-2.5 py-1 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                  residentPref === 'Non-Veg'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME SERVING STATUS & CLOSING COUNTDOWN BANNER */}
      <div
        id="mess-live-timer-banner"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          currentServingMeal
            ? darkMode
              ? 'bg-[#181510] border-[#8C5828]/60 shadow-lg ring-1 ring-[#8C5828]/40'
              : 'bg-[#FAF6F0] border-[#8C5828] shadow-md ring-1 ring-[#8C5828]/30'
            : darkMode
            ? 'bg-[#141310] border-[#2B2720]'
            : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: What's serving now or what you will get next */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                currentServingMeal
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50] border border-[#8C5828]/30'
              }`}
            >
              {currentServingMeal ? (
                <Flame size={24} className="animate-pulse" />
              ) : (
                <Clock size={24} />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider ${
                    currentServingMeal
                      ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentServingMeal ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                    }`}
                  />
                  {currentServingMeal
                    ? `MESS OPEN NOW · SERVING ${currentServingMeal.toUpperCase()}`
                    : 'MESS CURRENTLY CLOSED (PREPARATION IN PROGRESS)'}
                </span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Hostel Clock: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              {/* Dynamic message: What you are getting or what you will be getting next */}
              <div className="mt-1.5">
                {currentServingMeal ? (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                      You are getting: <span className="text-[#8C5828] dark:text-[#F2CA50]">{currentServingMeal} Buffet</span>
                    </h2>
                    <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-0.5">
                      Counter active: {MESS_MENU_DATA[currentServingMeal].timing} · Fresh live dining station ready.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                      Up Next: You will be getting{' '}
                      <span className="text-[#8C5828] dark:text-[#F2CA50]">{nextUpcomingMeal}</span>
                    </h2>
                    <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-0.5">
                      Next serving starts at {MESS_MENU_DATA[nextUpcomingMeal].timing.split(' - ')[0]} · Kitchen staff currently prepping fresh courses.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Real-time Countdown Timer (Closing In vs Opening In) */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center min-w-[240px] text-center ${
              currentServingMeal
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                : darkMode
                ? 'bg-[#1A1813] border-[#2B2720] text-[#D6D3CD]'
                : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
          >
            {currentServingMeal && closingTimeLeft ? (
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 block mb-1">
                  MESS CLOSING IN
                </span>
                <div className="flex items-center justify-center gap-1.5 font-mono font-black text-2xl sm:text-3xl text-amber-700 dark:text-amber-400">
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(closingTimeLeft.hours)}
                    <span className="text-[9px] block font-normal text-amber-800/80 dark:text-amber-300/80">HRS</span>
                  </div>
                  <span>:</span>
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(closingTimeLeft.minutes)}
                    <span className="text-[9px] block font-normal text-amber-800/80 dark:text-amber-300/80">MIN</span>
                  </div>
                  <span>:</span>
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(closingTimeLeft.seconds)}
                    <span className="text-[9px] block font-normal text-amber-800/80 dark:text-amber-300/80">SEC</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-amber-800 dark:text-amber-300 block mt-1.5 font-semibold">
                  Doors lock at {MESS_MENU_DATA[currentServingMeal].timing.split(' - ')[1]}
                </span>
              </div>
            ) : nextMealTimeLeft ? (
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50] block mb-1">
                  NEXT MEAL ({nextUpcomingMeal.toUpperCase()}) OPENS IN
                </span>
                <div className="flex items-center justify-center gap-1.5 font-mono font-black text-2xl sm:text-3xl text-[#1C1917] dark:text-white">
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(nextMealTimeLeft.hours)}
                    <span className="text-[9px] block font-normal text-[#78716C] dark:text-[#A39E93]">HRS</span>
                  </div>
                  <span>:</span>
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(nextMealTimeLeft.minutes)}
                    <span className="text-[9px] block font-normal text-[#78716C] dark:text-[#A39E93]">MIN</span>
                  </div>
                  <span>:</span>
                  <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 min-w-[42px]">
                    {formatTimePad(nextMealTimeLeft.seconds)}
                    <span className="text-[9px] block font-normal text-[#78716C] dark:text-[#A39E93]">SEC</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#57534E] dark:text-[#A39E93] block mt-1.5">
                  Scheduled start: {MESS_MENU_DATA[nextUpcomingMeal].timing.split(' - ')[0]}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. MEAL WINDOW TABS (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as MealSlot[]).map((slot) => {
          const isSelected = activeMeal === slot;
          const isLiveNow = currentServingMeal === slot;
          const isNext = !currentServingMeal && nextUpcomingMeal === slot;
          const timing = MESS_MENU_DATA[slot].timing;

          return (
            <button
              key={slot}
              id={`meal-slot-tab-${slot.toLowerCase()}`}
              onClick={() => setActiveMeal(slot)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#8C5828] bg-[#8C5828]/10 shadow-sm ring-1 ring-[#8C5828]'
                  : darkMode
                  ? 'border-[#2B2720] bg-[#141310] hover:border-[#3E3A32]'
                  : 'border-[#DCD6CA] bg-white hover:border-[#8C5828]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs font-black uppercase tracking-wider ${
                    isSelected ? 'text-[#8C5828] dark:text-[#F2CA50]' : 'text-[#78716C] dark:text-[#A39E93]'
                  }`}
                >
                  {slot}
                </span>

                {isLiveNow ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-emerald-500 text-white animate-pulse">
                    LIVE NOW
                  </span>
                ) : isNext ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-[#8C5828] text-white">
                    UP NEXT
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-xs font-bold text-[#1C1917] dark:text-white mt-1.5">
                {timing}
              </p>
            </button>
          );
        })}
      </div>

      {/* 4. DISHES LIST FOR ACTIVE MEAL WITH VEG / NON-VEG ONLY FILTER */}
      <div
        id="active-meal-dishes-card"
        className={`p-5 sm:p-6 rounded-2xl border ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black font-sans uppercase text-[#1C1917] dark:text-[#FAF8F5]">
                {activeMeal} Menu Courses
              </h2>
              <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
                ({currentMealData.timing})
              </span>
              {currentServingMeal === activeMeal && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Currently Being Served
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-0.5">
              {currentMealData.description}
            </p>
          </div>

          {/* Filter: All, Veg Only, Non-Veg Only */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] font-mono text-xs">
            <button
              onClick={() => setDietFilter('All')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dietFilter === 'All'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setDietFilter('Veg')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dietFilter === 'Veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Veg Only
            </button>
            <button
              onClick={() => setDietFilter('Non-Veg')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dietFilter === 'Non-Veg'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Non-Veg Only
            </button>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {filteredDishes.map((dish, idx) => {
            const isVeg = dish.type === 'Veg';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isVeg
                    ? darkMode
                      ? 'bg-[#181C17] border-emerald-900/40 hover:border-emerald-700/60'
                      : 'bg-[#F4FBF6] border-[#CEEAD6] hover:border-emerald-400'
                    : darkMode
                    ? 'bg-[#1F1717] border-red-900/40 hover:border-red-700/60'
                    : 'bg-[#FEF6F6] border-[#FAD2CF] hover:border-red-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Veg / Non-Veg Icon Box */}
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      isVeg ? 'border-emerald-600 bg-white dark:bg-[#181C17]' : 'border-red-600 bg-white dark:bg-[#1F1717]'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                      {dish.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#57534E] dark:text-[#A39E93]">
                      {dish.category}
                    </span>
                  </div>
                </div>

                {/* Tag */}
                <span
                  className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isVeg
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                  }`}
                >
                  {dish.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. WEEKLY MEAL TIMETABLE (MONDAY - SUNDAY) */}
      <div
        id="weekly-meal-plan-card"
        className={`p-5 sm:p-6 rounded-2xl border ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
            <h3 className="font-bold font-sans uppercase tracking-wider text-sm text-[#1C1917] dark:text-[#FAF8F5]">
              Weekly Rotating Diet Matrix
            </h3>
          </div>
          <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
            Cycle: Week 2 · Term 1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mt-4">
          {WEEKLY_MEAL_PLAN.map((plan) => {
            const isToday = plan.day === activeDay;

            return (
              <button
                key={plan.day}
                onClick={() => setActiveDay(plan.day)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isToday
                    ? 'border-[#8C5828] bg-[#8C5828]/10 ring-1 ring-[#8C5828]'
                    : darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] hover:border-[#3E3A32]'
                    : 'border-[#DCD6CA] bg-[#FAF6F0] hover:border-[#8C5828]/50'
                }`}
              >
                <div>
                  <span className="font-mono text-xs font-black uppercase text-[#8C5828] dark:text-[#F2CA50] block">
                    {plan.day}
                  </span>
                  <div className="mt-2 text-[11px] font-mono">
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                      • {plan.vegSpecial}
                    </div>
                    <div className="text-red-700 dark:text-red-400 font-medium mt-1">
                      • {plan.nonVegSpecial}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. MEAL RATING & FEEDBACK BOX */}
      <div
        id="mess-feedback-section"
        className={`p-5 sm:p-6 rounded-2xl border ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
          <Star size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
          <h3 className="font-bold font-sans uppercase tracking-wider text-sm text-[#1C1917] dark:text-[#FAF8F5]">
            Rate Today's Food Quality & Taste
          </h3>
        </div>

        {feedbackSent ? (
          <div className="p-4 rounded-xl border border-[#CEEAD6] bg-[#E6F4EA] text-[#137333] font-mono text-xs font-bold flex items-center gap-2 mt-4 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>Thank you, Harsh! Your meal feedback has been transmitted to Chef & Mess Warden.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#57534E] dark:text-[#A39E93] mb-1.5 uppercase">
                Score Today's Dining (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? 'fill-[#8C5828] text-[#8C5828]'
                          : 'text-[#DCD6CA] dark:text-[#2B2720]'
                      }
                    />
                  </button>
                ))}
                <span className="font-mono text-xs font-bold ml-2 text-[#8C5828] dark:text-[#F2CA50]">
                  {rating === 5 ? 'Excellent Taste' : rating === 4 ? 'Very Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#57534E] dark:text-[#A39E93] mb-1.5 uppercase">
                Feedback / Request to Head Chef
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g., Paneer gravy was fantastic today, please add more hot tandoori rotis..."
                className={`w-full p-3 rounded-xl border font-mono text-xs outline-none transition-all ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] text-white focus:border-[#8C5828]'
                    : 'border-[#DCD6CA] bg-[#FAF6F0] text-[#1C1917] focus:border-[#8C5828]'
                }`}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Send size={14} />
              <span>Submit Meal Review</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
