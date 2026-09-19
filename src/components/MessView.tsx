import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  ShieldCheck,
  Clock,
  Edit3,
  Trash2,
  PlusCircle,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { DayMeals } from '../types';

interface MessViewProps {
  messMenu: Record<string, DayMeals>;
  onEditMeal: (day: string, mealType: string, currentItems: string) => void;
  onClearMeal: (day: string, mealType: string) => void;
  darkMode: boolean;
}

export const MessView: React.FC<MessViewProps> = ({
  messMenu,
  onEditMeal,
  onClearMeal,
  darkMode,
}) => {
  // Determine current day of week (Mon, Tue, etc.)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[new Date().getDay()];

  const [selectedDay, setSelectedDay] = useState<string>(
    messMenu[todayName] ? todayName : 'Mon'
  );

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute what is serving in real time:
  const getRealtimeMealStatus = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentMins = hours * 60 + minutes;

    // Time ranges in minutes:
    // Breakfast: 7:30 (450) to 9:30 (570)
    // Lunch: 12:30 (750) to 14:30 (870)
    // Evening Snack: 17:00 (1020) to 18:30 (1110)
    // Dinner: 20:00 (1200) to 22:00 (1320)

    if (currentMins >= 450 && currentMins <= 570) {
      return {
        isLive: true,
        meal: 'Breakfast',
        window: '07:30 AM - 09:30 AM',
        message: 'Currently Being Served',
      };
    } else if (currentMins < 450) {
      return {
        isLive: false,
        meal: 'Breakfast',
        window: '07:30 AM - 09:30 AM',
        message: 'Serving Next at 07:30 AM',
      };
    } else if (currentMins > 570 && currentMins < 750) {
      return {
        isLive: false,
        meal: 'Lunch',
        window: '12:30 PM - 02:30 PM',
        message: 'Serving Next at 12:30 PM',
      };
    } else if (currentMins >= 750 && currentMins <= 870) {
      return {
        isLive: true,
        meal: 'Lunch',
        window: '12:30 PM - 02:30 PM',
        message: 'Currently Being Served',
      };
    } else if (currentMins > 870 && currentMins < 1020) {
      return {
        isLive: false,
        meal: 'Evening Snack',
        window: '05:00 PM - 06:15 PM',
        message: 'Serving Next at 05:00 PM',
      };
    } else if (currentMins >= 1020 && currentMins <= 1110) {
      return {
        isLive: true,
        meal: 'Evening Snack',
        window: '05:00 PM - 06:15 PM',
        message: 'Currently Being Served',
      };
    } else if (currentMins > 1110 && currentMins < 1200) {
      return {
        isLive: false,
        meal: 'Dinner',
        window: '08:00 PM - 10:00 PM',
        message: 'Serving Next at 08:00 PM',
      };
    } else if (currentMins >= 1200 && currentMins <= 1320) {
      return {
        isLive: true,
        meal: 'Dinner',
        window: '08:00 PM - 10:00 PM',
        message: 'Currently Being Served',
      };
    } else {
      return {
        isLive: false,
        meal: 'Breakfast',
        window: 'Tomorrow 07:30 AM',
        message: 'Kitchen closed for night. Breakfast starts at 07:30 AM',
      };
    }
  };

  const liveStatus = getRealtimeMealStatus();
  const currentMeals = messMenu[selectedDay] || messMenu['Mon'] || {
    Breakfast: '',
    Lunch: '',
    'Evening Snack': '',
    Dinner: '',
  };

  const mealCards = [
    {
      type: 'Breakfast',
      time: '07:30 AM - 09:30 AM',
      items: currentMeals.Breakfast,
      calories: '550 kcal avg',
      isNow: liveStatus.meal === 'Breakfast' && selectedDay === todayName,
    },
    {
      type: 'Lunch',
      time: '12:30 PM - 02:30 PM',
      items: currentMeals.Lunch,
      calories: '850 kcal avg',
      isNow: liveStatus.meal === 'Lunch' && selectedDay === todayName,
    },
    {
      type: 'Evening Snack',
      time: '05:00 PM - 06:15 PM',
      items: currentMeals['Evening Snack'],
      calories: '320 kcal avg',
      isNow: liveStatus.meal === 'Evening Snack' && selectedDay === todayName,
    },
    {
      type: 'Dinner',
      time: '08:00 PM - 10:00 PM',
      items: currentMeals.Dinner,
      calories: '780 kcal avg',
      isNow: liveStatus.meal === 'Dinner' && selectedDay === todayName,
    },
  ];

  return (
    <div id="mess-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
          darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
        }`}
      >
        <div>
          <span
            className={`text-xs font-mono uppercase tracking-widest ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Nutrition & Dining / Royal Paradise Mess
          </span>
          <h2
            id="mess-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Mess Schedule & Dietary Roster
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613] text-[#f2ca50]'
                : 'border-[#ded4c5] bg-white text-[#824f1c] shadow-xs'
            }`}
          >
            <Clock size={14} />
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Real-time Serving Now Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          liveStatus.isLive
            ? darkMode
              ? 'border-[#c8935c] bg-gradient-to-r from-[#241a12] to-[#1a140f] text-[#fbf9f5]'
              : 'border-[#824f1c] bg-gradient-to-r from-[#faf3eb] to-[#f4ede3] text-stone-950'
            : darkMode
            ? 'border-[#382e25] bg-[#1a1613] text-[#ede8e1]'
            : 'border-[#ded4c5] bg-white text-stone-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              liveStatus.isLive
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 animate-pulse'
                : 'bg-stone-500/10 text-stone-400 border border-stone-500/20'
            }`}
          >
            <Flame size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  liveStatus.isLive
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                {liveStatus.isLive ? 'LIVE NOW IN DINING HALL' : 'NEXT UPCOMING MEAL'}
              </span>
              <span className="text-xs font-mono opacity-80">
                {liveStatus.window}
              </span>
            </div>

            <h4 className="text-sm font-bold mt-1">
              {liveStatus.message}: <strong>{liveStatus.meal}</strong> (Today: {todayName})
            </h4>

            {messMenu[todayName] && (
              <p className="text-xs font-mono mt-0.5 opacity-90 line-clamp-1">
                Menu:{' '}
                {messMenu[todayName][liveStatus.meal as keyof DayMeals] ||
                  'Menu being updated'}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setSelectedDay(todayName)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-colors ${
            selectedDay === todayName
              ? 'bg-[#c8935c] text-white border-[#c8935c]'
              : darkMode
              ? 'border-[#382e25] text-[#f2ca50] hover:bg-[#201b17]'
              : 'border-[#ded4c5] text-[#824f1c] hover:bg-stone-100'
          }`}
        >
          View Today's Full Roster ({todayName})
        </button>
      </div>

      {/* Day Selector Buttons */}
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <button
            key={day}
            id={`day-tab-${day.toLowerCase()}`}
            onClick={() => setSelectedDay(day)}
            className={`py-3 px-2 rounded-xl border font-mono text-xs uppercase font-bold transition-all text-center cursor-pointer ${
              selectedDay === day
                ? 'border-[#c8935c] bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md'
                : darkMode
                ? 'border-[#382e25] bg-[#1a1613] text-[#a39e93] hover:text-[#fbf9f5]'
                : 'border-[#ded4c5] bg-white text-[#695747] hover:border-stone-400 shadow-xs'
            }`}
          >
            {day}
            {day === todayName && (
              <span className="block text-[9px] font-normal lowercase tracking-tighter opacity-80">
                (today)
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mealCards.map((meal, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
              meal.isNow
                ? darkMode
                  ? 'border-[#f2ca50] bg-[#1d1712] shadow-[0_0_15px_rgba(242,202,80,0.15)]'
                  : 'border-[#824f1c] bg-[#fffaf5] shadow-md'
                : darkMode
                ? 'border-[#382e25] bg-[#1a1613]'
                : 'border-[#ded4c5] bg-white shadow-xs'
            }`}
          >
            <div>
              {meal.isNow && (
                <div className="mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    ● Real-Time Active Meal
                  </span>
                </div>
              )}

              <div
                className={`border-b pb-3 flex justify-between items-start ${
                  darkMode ? 'border-[#382e25]' : 'border-[#ded4c5]'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase flex items-center gap-1 ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    <Clock size={11} /> {meal.time}
                  </span>
                  <h3
                    className={`text-base font-bold font-mono mt-1 ${
                      darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                    }`}
                  >
                    {meal.type}
                  </h3>
                </div>

                {/* Edit & Clear Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditMeal(selectedDay, meal.type, meal.items)}
                    title="Edit meal items"
                    className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                      darkMode
                        ? 'border-[#382e25] hover:border-[#c8935c] text-[#a39e93] hover:text-[#f2ca50]'
                        : 'border-[#ded4c5] hover:border-[#824f1c] text-stone-600 hover:text-[#824f1c]'
                    }`}
                  >
                    <Edit3 size={13} />
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to clear/delete ${meal.type} for ${selectedDay}? You can re-upload or edit it anytime.`
                        )
                      ) {
                        onClearMeal(selectedDay, meal.type);
                      }
                    }}
                    title="Clear/delete meal entry"
                    className="p-1.5 rounded-lg border border-transparent hover:border-rose-500/40 text-stone-400 hover:text-rose-500 cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <span
                  className={`text-[10px] font-mono uppercase font-bold ${
                    darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                  }`}
                >
                  Daily Offerings:
                </span>
                <div
                  className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed min-h-[90px] ${
                    meal.items
                      ? darkMode
                        ? 'border-[#382e25] bg-[#120f0d] text-[#ede8e1]'
                        : 'border-[#ded4c5] bg-[#fcfaf7] text-stone-900'
                      : 'border-dashed border-stone-400 text-stone-400 italic flex items-center justify-center'
                  }`}
                >
                  {meal.items || 'No menu entered yet. Click edit to upload.'}
                </div>
              </div>
            </div>

            <div
              className={`mt-4 pt-3 border-t flex justify-between items-center text-[10px] font-mono ${
                darkMode ? 'border-[#382e25] text-[#a39e93]' : 'border-[#ded4c5] text-[#695747]'
              }`}
            >
              <span className="flex items-center gap-1">
                <ShieldCheck
                  size={13}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                Hygiene: PASSED
              </span>
              <span
                className={`font-bold ${
                  darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                }`}
              >
                {meal.calories}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
