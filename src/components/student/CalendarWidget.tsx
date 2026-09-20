import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Bell,
  Sparkles,
  Utensils,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';

interface HostelEvent {
  id: string;
  dayOfMonth?: number; // if recurring on specific day
  dayOfWeek?: number; // 0=Sun, 6=Sat
  title: string;
  category: 'mess' | 'inspection' | 'fee' | 'academic' | 'gatepass';
  time: string;
  desc: string;
}

const HOSTEL_SCHEDULE_EVENTS: HostelEvent[] = [
  {
    id: 'evt-sun-feast',
    dayOfWeek: 0, // Every Sunday
    title: 'Royal Sunday Dining Feast',
    category: 'mess',
    time: '08:00 PM - 10:00 PM',
    desc: 'Special Hyderabadi Dum Biryani, Paneer Lababdar & Hot Gulab Jamun',
  },
  {
    id: 'evt-sat-curfew',
    dayOfWeek: 6, // Every Saturday
    title: 'Extended Weekend Gate Pass Limit',
    category: 'gatepass',
    time: 'Curfew: 10:30 PM',
    desc: 'Extended campus entry permissible with validated digital outpass',
  },
  {
    id: 'evt-fee-due',
    dayOfMonth: 15,
    title: 'Term 2 Hostel Installment Due',
    category: 'fee',
    time: 'Due by 11:59 PM',
    desc: 'Hostel Finance Cell auto-clearance cutoff date',
  },
  {
    id: 'evt-room-inspection',
    dayOfMonth: 5,
    title: 'Bi-Weekly Room Sanitization & Inspection',
    category: 'inspection',
    time: '11:00 AM - 01:00 PM',
    desc: 'Deep cleaning of Room B-004 fixtures, bathroom & floor mop',
  },
  {
    id: 'evt-room-inspection-2',
    dayOfMonth: 20,
    title: 'Mid-Month Asset & Electrical Audit',
    category: 'inspection',
    time: '02:00 PM - 04:00 PM',
    desc: 'Estate team inspection of split AC filter and Wi-Fi routers',
  },
  {
    id: 'evt-mid-term',
    dayOfMonth: 28,
    title: 'Mid-Semester Examinations Commencement',
    category: 'academic',
    time: 'All Day',
    desc: 'Quiet study hours enforced in Royal Paradise Block 10:00 PM - 06:00 AM',
  },
];

interface CalendarWidgetProps {
  darkMode: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ darkMode }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [userNotes, setUserNotes] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('roh_student_calendar_notes');
      return saved ? JSON.parse(saved) : {
        '2026-9-14': ['Room B-004 cleaning check at 10:15 AM', 'Study session with Aksh & Amar'],
        '2026-9-15': ['Hostel fee installment reminder'],
      };
    } catch {
      return {};
    }
  });

  const [newNoteInput, setNewNoteInput] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // Save notes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('roh_student_calendar_notes', JSON.stringify(userNotes));
    } catch (e) {
      // Ignore storage errors
    }
  }, [userNotes]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  // Get date key for notes
  const dateKey = `${year}-${month + 1}-${selectedDay}`;
  const currentDayNotes = userNotes[dateKey] || [];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setUserNotes((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newNoteInput.trim()],
    }));
    setNewNoteInput('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = (idx: number) => {
    setUserNotes((prev) => {
      const updated = [...(prev[dateKey] || [])];
      updated.splice(idx, 1);
      return { ...prev, [dateKey]: updated };
    });
  };

  // Find events for specific day
  const getEventsForDay = (day: number) => {
    const dayDate = new Date(year, month, day);
    const dayOfWeek = dayDate.getDay();

    return HOSTEL_SCHEDULE_EVENTS.filter((evt) => {
      if (evt.dayOfMonth !== undefined && evt.dayOfMonth === day) return true;
      if (evt.dayOfWeek !== undefined && evt.dayOfWeek === dayOfWeek) return true;
      return false;
    });
  };

  const selectedDayEvents = getEventsForDay(selectedDay);

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const getCategoryBadge = (cat: HostelEvent['category']) => {
    switch (cat) {
      case 'mess':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">MESS FEAST</span>;
      case 'fee':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">FEE CUTOFF</span>;
      case 'inspection':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">INSPECTION</span>;
      case 'gatepass':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">OUTPASS CURFEW</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30">ACADEMIC</span>;
    }
  };

  return (
    <div
      id="hostel-calendar-console"
      className={`p-3.5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
        darkMode ? 'bg-[#141310] border-[#2B2720] shadow-md' : 'bg-white border-[#DCD6CA] shadow-xs'
      }`}
    >
      <div>
        {/* Top Header & Month Navigator */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8C5828]/10 text-[#8C5828] dark:text-[#F2CA50] flex items-center justify-center shrink-0">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="font-bold font-sans uppercase text-sm text-[#1C1917] dark:text-[#FAF8F5] leading-none">
                Campus & Room Calendar
              </h3>
              <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                {monthNames[month]} {year}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleJumpToToday}
              className="px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold transition-all cursor-pointer border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-[#44403C] dark:text-[#D6D3CD] hover:border-[#8C5828]"
            >
              Today
            </button>
            <div className="flex items-center">
              <button
                onClick={handlePrevMonth}
                title="Previous Month"
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#78716C] dark:text-[#A39E93] cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                title="Next Month"
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#78716C] dark:text-[#A39E93] cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="mt-3">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[#78716C] dark:text-[#A39E93] mb-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Month Days Matrix */}
          <div className="grid grid-cols-7 gap-1 font-mono text-xs">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8 sm:h-9" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = selectedDay === dayNum;
              const isCurrToday = isToday(dayNum);
              const dayEvts = getEventsForDay(dayNum);
              const hasNotes = Boolean(userNotes[`${year}-${month + 1}-${dayNum}`]?.length);

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`relative h-8 sm:h-9 rounded-lg flex flex-col items-center justify-center font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#8C5828] text-white shadow-xs font-black ring-2 ring-[#8C5828]/40'
                      : isCurrToday
                      ? 'border-2 border-[#8C5828] text-[#8C5828] dark:text-[#F2CA50] bg-[#8C5828]/10'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#1C1917] dark:text-[#FAF8F5]'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{dayNum}</span>

                  {/* Indicator dots for events / notes */}
                  <div className="absolute bottom-1 flex items-center gap-0.5">
                    {dayEvts.length > 0 && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-amber-500'
                        }`}
                      />
                    )}
                    {hasNotes && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-emerald-400'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED DATE DETAILS & HOSTEL SCHEDULE */}
        <div className="mt-4 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-[#1C1917] dark:text-[#FAF8F5]">
                {monthNames[month]} {selectedDay}, {year}
              </span>
              {isToday(selectedDay) && (
                <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase bg-emerald-600 text-white">
                  TODAY
                </span>
              )}
            </div>

            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#8C5828] dark:text-[#F2CA50] hover:underline cursor-pointer"
            >
              <Plus size={12} />
              <span>{isAddingNote ? 'Cancel' : 'Add Note'}</span>
            </button>
          </div>

          {/* Add Note Form */}
          {isAddingNote && (
            <form onSubmit={handleAddNote} className="mb-3 flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="E.g., Lab exam / Laundry bag / Call parents..."
                className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs outline-none ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] text-white focus:border-[#8C5828]'
                    : 'border-[#DCD6CA] bg-[#F6F4EE] text-[#1C1917] focus:border-[#8C5828]'
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Save
              </button>
            </form>
          )}

          {/* Schedule Events for Selected Day */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedDayEvents.length === 0 && currentDayNotes.length === 0 ? (
              <div className="py-3 text-center font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
                No special hostel events or personal notes logged for this day.
              </div>
            ) : null}

            {/* Official Hostel Events */}
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.015] dark:bg-white/[0.015] flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    {getCategoryBadge(evt.category)}
                    <strong className="font-mono text-xs text-[#1C1917] dark:text-[#FAF8F5]">
                      {evt.title}
                    </strong>
                  </div>
                  <p className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93] mt-1">
                    {evt.desc}
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#78716C] dark:text-[#A39E93] shrink-0 text-right">
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-[#8C5828] dark:text-[#F2CA50]" />
                    <span>{evt.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Personal Resident Notes */}
            {currentDayNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-[#1C1917] dark:text-[#FAF8F5]">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>{note}</span>
                </div>
                <button
                  onClick={() => handleDeleteNote(idx)}
                  className="p-1 text-[#78716C] hover:text-red-500 cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-2.5 border-t border-[#DCD6CA] dark:border-[#2B2720] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#78716C] dark:text-[#A39E93]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Hostel Event</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Personal Note</span>
          </span>
        </div>
        <span>Room B-004 Log</span>
      </div>
    </div>
  );
};
