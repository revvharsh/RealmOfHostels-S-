import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  UserCheck,
  RotateCcw,
  ShieldCheck,
  Send,
  AlertCircle,
  Users,
  Calendar,
  Layers,
} from 'lucide-react';
import { RoomCleaningState, RoomCleaningTask } from '../../types';

interface CleaningChecklistViewProps {
  darkMode: boolean;
  currentUserName?: string;
}

const STORAGE_KEY = 'hostel_room_cleaning_b004';

const INITIAL_TASKS: RoomCleaningTask[] = [
  {
    id: 'task-1',
    label: 'Floor Swept & Wet Mopped',
    category: 'Flooring & Surfaces',
    isCompleted: true,
    completedBy: 'Harsh',
    completedAt: '09:30 AM',
  },
  {
    id: 'task-2',
    label: 'Trash & Waste Bins Emptied',
    category: 'Sanitation',
    isCompleted: true,
    completedBy: 'Amar',
    completedAt: '10:15 AM',
  },
  {
    id: 'task-3',
    label: 'Attached Washroom & Basin Sanitized',
    category: 'Sanitation',
    isCompleted: true,
    completedBy: 'Harsh',
    completedAt: '10:45 AM',
  },
  {
    id: 'task-4',
    label: 'Study Desks & Bookshelves Wiped Down',
    category: 'Flooring & Surfaces',
    isCompleted: false,
  },
  {
    id: 'task-5',
    label: 'Beds Straightened & Linen Check',
    category: 'Linens & Bed',
    isCompleted: true,
    completedBy: 'Aksh',
    completedAt: '08:45 AM',
  },
  {
    id: 'task-6',
    label: 'Split AC Filter & Air Vent Dusting',
    category: 'Air & Ventilation',
    isCompleted: false,
  },
  {
    id: 'task-7',
    label: 'Door Handles & Light Switchboards Sanitized',
    category: 'Sanitation',
    isCompleted: false,
  },
];

const INITIAL_STATE: RoomCleaningState = {
  roomNumber: 'B-004',
  date: new Date().toISOString().split('T')[0],
  tasks: INITIAL_TASKS,
  housekeepingStatus: 'Pending',
  lastUpdatedBy: 'Harsh',
  lastUpdatedAt: '10:45 AM',
  housekeepingNotes: 'Daily morning checklist initiated for Room B-004.',
};

export const CleaningChecklistView: React.FC<CleaningChecklistViewProps> = ({
  darkMode,
  currentUserName = 'Harsh',
}) => {
  const [cleaningState, setCleaningState] = useState<RoomCleaningState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STATE;
  });

  const [activeRoommateSim, setActiveRoommateSim] = useState<string>(currentUserName);
  const [requestSent, setRequestSent] = useState(false);
  const [justSyncedToast, setJustSyncedToast] = useState<string | null>(null);

  // Sync with localStorage & other tabs in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCleaningState(parsed);
          setJustSyncedToast(`Real-time update received: Updated by ${parsed.lastUpdatedBy}`);
          setTimeout(() => setJustSyncedToast(null), 3500);
        } catch (err) {
          console.error(err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<RoomCleaningState>;
      if (customEvent.detail) {
        setCleaningState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('room-cleaning-sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('room-cleaning-sync', handleCustomSync);
    };
  }, []);

  const saveAndBroadcast = (newState: RoomCleaningState) => {
    setCleaningState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      window.dispatchEvent(
        new CustomEvent('room-cleaning-sync', { detail: newState })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTasks = cleaningState.tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextCompleted,
          completedBy: nextCompleted ? activeRoommateSim : undefined,
          completedAt: nextCompleted ? nowStr : undefined,
        };
      }
      return t;
    });

    const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
    const isAllDone = completedCount === updatedTasks.length;

    const newState: RoomCleaningState = {
      ...cleaningState,
      tasks: updatedTasks,
      housekeepingStatus: isAllDone ? 'Cleaned & Verified' : 'Pending',
      lastUpdatedBy: activeRoommateSim,
      lastUpdatedAt: nowStr,
    };

    saveAndBroadcast(newState);
  };

  const handleRequestHousekeeping = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newState: RoomCleaningState = {
      ...cleaningState,
      housekeepingStatus: 'Housekeeping Requested',
      lastUpdatedBy: activeRoommateSim,
      lastUpdatedAt: nowStr,
      housekeepingNotes: `Housekeeping request triggered by ${activeRoommateSim}. Staff allocated: Mahesh Kumar (Housekeeping Team A).`,
    };
    saveAndBroadcast(newState);
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 4000);
  };

  const handleResetChecklist = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const resetTasks = cleaningState.tasks.map((t) => ({
      ...t,
      isCompleted: false,
      completedBy: undefined,
      completedAt: undefined,
    }));
    const newState: RoomCleaningState = {
      ...cleaningState,
      tasks: resetTasks,
      housekeepingStatus: 'Pending',
      lastUpdatedBy: activeRoommateSim,
      lastUpdatedAt: nowStr,
    };
    saveAndBroadcast(newState);
  };

  const completedTasks = cleaningState.tasks.filter((t) => t.isCompleted).length;
  const totalTasks = cleaningState.tasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div id="cleaning-checklist-view" className="space-y-6">
      {/* Real-time Toast */}
      <AnimatePresence>
        {justSyncedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 rounded-xl bg-emerald-700 text-white font-mono text-xs flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{justSyncedToast}</span>
            </div>
            <button
              onClick={() => setJustSyncedToast(null)}
              className="font-bold hover:underline cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Card */}
      <div
        className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-xs transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-mono shrink-0 shadow-xs">
              <Sparkles size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase text-[#8C5828] dark:text-[#F2CA50]">
                  Room B-004
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Ground Floor · South Wing
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-sans text-[#1C1917] dark:text-[#FAF8F5] mt-0.5">
                Daily Room Cleaning Checklist
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-Time Roommate Synced
                </span>
                <span className="text-[#78716C] dark:text-[#A39E93]">
                  Last change by <strong>{cleaningState.lastUpdatedBy}</strong> at {cleaningState.lastUpdatedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Housekeeping Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              id="request-housekeeping-btn"
              onClick={handleRequestHousekeeping}
              className={`min-h-[46px] px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                cleaningState.housekeepingStatus === 'Housekeeping Requested'
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#8C5828] hover:bg-[#72451E] text-white'
              }`}
            >
              <Send size={14} />
              <span>
                {cleaningState.housekeepingStatus === 'Housekeeping Requested'
                  ? 'Staff Dispatched ✓'
                  : 'Request Deep Housekeeping'}
              </span>
            </button>

            <button
              id="reset-checklist-btn"
              onClick={handleResetChecklist}
              title="Reset today's checklist"
              className={`min-h-[46px] p-2.5 px-3.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#A39E93] hover:text-white'
                  : 'border-[#DCD6CA] bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Roommate Switcher (To test and experience real-time roommate sync!) */}
        <div className="mt-5 pt-4 border-t border-[#DCD6CA] dark:border-[#2B2720] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#57534E] dark:text-[#A39E93]">
            <Users size={14} className="text-[#8C5828] dark:text-[#F2CA50]" />
            <span>Active Roommate ID (Simulate ID change):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['Harsh', 'Amar', 'Aksh'].map((name) => (
              <button
                key={name}
                onClick={() => setActiveRoommateSim(name)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRoommateSim === name
                    ? 'bg-[#8C5828] text-white shadow-xs'
                    : darkMode
                    ? 'bg-[#1E1C16] text-[#A39E93] hover:text-white'
                    : 'bg-[#EAE6DE] text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {name} {name === currentUserName ? '(You)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress & Live Status Banner */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-xs mb-2">
          <span className="font-bold text-[#1C1917] dark:text-white">
            Daily Completion: {completedTasks} of {totalTasks} Tasks ({progressPercent}%)
          </span>
          <span className="font-bold text-[#8C5828] dark:text-[#F2CA50]">
            {progressPercent === 100 ? 'All Tasks Verified ✓' : 'In Progress'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full transition-all ${
              progressPercent === 100 ? 'bg-emerald-500' : 'bg-[#8C5828]'
            }`}
          />
        </div>
      </div>

      {/* Interactive Checklist Tasks */}
      <div className="space-y-3">
        {cleaningState.tasks.map((task) => (
          <div
            key={task.id}
            id={`task-row-${task.id}`}
            onClick={() => handleToggleTask(task.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              task.isCompleted
                ? darkMode
                  ? 'bg-[#161B14] border-emerald-900/50 text-[#FAF8F5]'
                  : 'bg-[#F2F8F4] border-emerald-600/30 text-[#1C1917]'
                : darkMode
                ? 'bg-[#141310] border-[#2B2720] hover:border-[#3E3A32]'
                : 'bg-white border-[#DCD6CA] hover:border-[#8C5828]/50 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  task.isCompleted
                    ? 'bg-emerald-600 text-white'
                    : darkMode
                    ? 'border-2 border-[#57534E] text-transparent'
                    : 'border-2 border-[#A8A29E] text-transparent'
                }`}
              >
                {task.isCompleted && <CheckCircle2 size={16} />}
              </button>

              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase text-[#78716C] dark:text-[#A39E93] block">
                  {task.category}
                </span>
                <h3
                  className={`text-sm sm:text-base font-bold font-sans ${
                    task.isCompleted
                      ? 'line-through text-[#57534E] dark:text-[#8C8880]'
                      : 'text-[#1C1917] dark:text-white'
                  }`}
                >
                  {task.label}
                </h3>
              </div>
            </div>

            {/* Completed By Badge */}
            <div className="shrink-0 text-right font-mono text-xs">
              {task.isCompleted ? (
                <div className="inline-flex flex-col items-end">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    ✓ Completed by {task.completedBy}
                  </span>
                  {task.completedAt && (
                    <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] mt-0.5">
                      at {task.completedAt}
                    </span>
                  )}
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-lg border border-dashed border-[#DCD6CA] dark:border-[#3E3A32] text-[10px] font-bold text-[#78716C] dark:text-[#A39E93]">
                  Click to Mark Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Housekeeping Supervisor Log & Guidelines */}
      <div
        className={`p-5 rounded-2xl border font-mono text-xs space-y-2 ${
          darkMode ? 'bg-[#181611] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
        }`}
      >
        <div className="flex items-center gap-2 text-[#8C5828] dark:text-[#F2CA50] font-bold uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Hostel Hygiene & Inspection Standard</span>
        </div>
        <p className="text-[#57534E] dark:text-[#A39E93] leading-relaxed">
          Daily room cleaning inspections are carried out between 11:30 AM and 01:30 PM by the floor
          warden. Both student self-checks and housekeeping tasks are synchronized in real-time
          across all 3 residents of Room B-004.
        </p>
      </div>
    </div>
  );
};
