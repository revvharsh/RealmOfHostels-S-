import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  BedDouble,
  Wind,
  CheckCircle2,
  Sparkles,
  Shirt,
  Calendar,
  Layers,
  Phone,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ROOMMATES_B004, ROOM_SPECS_B004 } from './studentData';
import { BedDetailModal } from './BedDetailModal';
import { CalendarWidget } from './CalendarWidget';
import { UserProfile, Roommate } from '../../types';

interface MyRoomTabProps {
  darkMode: boolean;
  userProfile?: UserProfile;
  onNavigateToCleaning?: () => void;
  onNavigateToLaundry?: () => void;
}

export const MyRoomTab: React.FC<MyRoomTabProps> = ({
  darkMode,
  userProfile,
  onNavigateToCleaning,
  onNavigateToLaundry,
}) => {
  const { t } = useLanguage();
  const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);

  const roommatesList = ROOMMATES_B004.map((r) => {
    if (r.isSelf && userProfile) {
      return {
        ...r,
        name: userProfile.name,
        phone: userProfile.phone,
        email: userProfile.email,
        bloodGroup: userProfile.bloodGroup,
        homeCity: userProfile.homeCity,
      };
    }
    return r;
  });

  return (
    <div id="my-room-tab-content" className="space-y-6">
      {/* 1. ROOM IDENTITY BANNER (CLEAN & NON-COMPACT) */}
      <div
        id="room-identity-banner"
        className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-xs transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white font-mono font-black text-xl sm:text-2xl shadow-sm shrink-0">
              <BedDouble size={26} className="sm:w-[30px] sm:h-[30px]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] uppercase tracking-wider">
                  {ROOM_SPECS_B004.block}
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs font-semibold text-[#57534E] dark:text-[#A39E93]">
                  {ROOM_SPECS_B004.floor} · {ROOM_SPECS_B004.wing}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] mt-0.5 sm:mt-1">
                Room {ROOM_SPECS_B004.roomNumber}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#8C5828] text-white font-bold text-[11px] sm:text-xs">
                  <Wind size={12} />
                  {ROOM_SPECS_B004.roomType}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30 text-[11px] sm:text-xs">
                  <CheckCircle2 size={12} />
                  {t.occupied} (3 Beds)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Daily Cleaning & Laundry Services */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 font-mono text-xs w-full sm:w-auto">
            {onNavigateToCleaning && (
              <motion.button
                id="goto-cleaning-quick-btn"
                onClick={onNavigateToCleaning}
                whileTap={{ scale: 0.98 }}
                className={`min-h-[44px] sm:min-h-[46px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1A1914] text-[#FAF8F5] hover:border-[#8C5828]'
                    : 'border-[#DCD6CA] bg-[#FAF8F5] text-[#1C1917] hover:border-[#8C5828]'
                }`}
              >
                <Sparkles size={14} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <span className="truncate">{t.cleaningTitle}</span>
                <ChevronRight size={13} className="text-[#78716C] hidden sm:inline" />
              </motion.button>
            )}

            {onNavigateToLaundry && (
              <motion.button
                id="goto-laundry-quick-btn"
                onClick={onNavigateToLaundry}
                whileTap={{ scale: 0.98 }}
                className="min-h-[44px] sm:min-h-[46px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Shirt size={14} />
                <span className="truncate">{t.laundryTitle}</span>
                <ChevronRight size={13} className="text-white/70 hidden sm:inline" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ROOM BEDS (JUST SHOWS THEIR NAMES, CLICK OPENS FLOATING POPUP WITH STRUCTURED DETAILS) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
            <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
              {t.residentsTitle}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
            {t.residentsHint}
          </span>
        </div>

        {/* Clean, Non-compact Bed Cards: Just displays Bed + Resident Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roommatesList.map((roommate) => {
            const initial = roommate.name.charAt(0).toUpperCase();

            return (
              <motion.div
                key={roommate.id}
                id={`bed-card-${roommate.id}`}
                onClick={() => setSelectedRoommate(roommate)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  roommate.isSelf
                    ? darkMode
                      ? 'bg-[#181611] border-[#8C5828] shadow-sm ring-1 ring-[#8C5828]/40'
                      : 'bg-[#FFFDF9] border-[#8C5828] shadow-sm ring-1 ring-[#8C5828]/30'
                    : darkMode
                    ? 'bg-[#141310] border-[#2B2720] hover:border-[#8C5828]/60 shadow-xs'
                    : 'bg-white border-[#DCD6CA] hover:border-[#8C5828]/60 shadow-xs'
                }`}
              >
                <div>
                  {/* Bed Label */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                    <span className="font-mono text-xs font-black uppercase text-[#8C5828] dark:text-[#F2CA50]">
                      {roommate.bed}
                    </span>
                    {roommate.isSelf && (
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-[#8C5828] text-white">
                        {t.youBadge}
                      </span>
                    )}
                  </div>

                  {/* Bed Resident Name Display */}
                  <div className="mt-4 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-black text-lg font-mono shrink-0 shadow-2xs">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black font-sans text-[#1C1917] dark:text-[#FAF8F5] truncate">
                        {roommate.name}
                      </h3>
                      <p className="text-xs font-mono text-[#78716C] dark:text-[#A39E93] truncate mt-0.5">
                        {roommate.department}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Prompt (Replaces bulky buttons) */}
                <div className="mt-5 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720] flex items-center justify-between font-mono text-xs">
                  <span className="text-[11px] text-[#78716C] dark:text-[#A39E93]">
                    {roommate.phone}
                  </span>
                  <span className="text-[#8C5828] dark:text-[#F2CA50] font-bold flex items-center gap-1 group-hover:underline">
                    <span>{t.viewDetails}</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. RESIDENT ACADEMIC CALENDAR CONSOLE */}
      <div>
        <div className="flex items-center gap-2 mb-3.5">
          <Calendar size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
          <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
            Hostel & Academic Schedule
          </h2>
        </div>
        <CalendarWidget darkMode={darkMode} />
      </div>

      {/* 4. BED DETAIL POPUP / FLOATING MODAL */}
      <BedDetailModal
        roommate={selectedRoommate}
        isOpen={Boolean(selectedRoommate)}
        onClose={() => setSelectedRoommate(null)}
        darkMode={darkMode}
      />
    </div>
  );
};
