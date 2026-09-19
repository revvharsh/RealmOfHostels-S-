import React from 'react';
import { Sun, Moon, PanelLeft, Crown, GraduationCap } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeBlock?: string;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onSwitchToStudent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeBlock = 'ROYAL PARADISE',
  isSidebarOpen = false,
  onToggleSidebar,
  onSwitchToStudent,
}) => {
  return (
    <header
      id="app-header"
      className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${
        darkMode
          ? 'bg-[#14110e]/95 border-[#382e25]'
          : 'bg-[#fbf9f5]/95 border-[#dfd3c3] shadow-xs'
      }`}
    >
      {/* Brand Monogram, Title & Sidebar Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {onToggleSidebar && (
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Close Navigation Sidebar' : 'Open Navigation Sidebar'}
            aria-label="Toggle Navigation Sidebar"
            className={`p-2 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isSidebarOpen
                ? 'border-[#c8935c] bg-[#c8935c]/20 text-[#f2ca50]'
                : darkMode
                ? 'border-[#382e25] bg-[#1a1613] hover:border-[#c8935c]/60 text-[#a39e93] hover:text-[#fbf9f5]'
                : 'border-[#dfd3c3] bg-white hover:border-[#b57a42] text-stone-800 shadow-xs'
            }`}
          >
            <PanelLeft size={18} />
          </button>
        )}

        <div
          id="brand-logo"
          className="w-9 h-9 rounded-xl border border-[#c8935c]/70 bg-gradient-to-br from-[#d4af37]/25 via-[#c8935c]/20 to-[#9e6932]/30 flex items-center justify-center text-[#f2ca50] shadow-md shrink-0 transition-transform hover:scale-105"
        >
          <Crown
            size={20}
            className="text-[#f2ca50] drop-shadow-[0_2px_6px_rgba(242,202,80,0.45)] stroke-[2.2]"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1
              id="brand-name"
              className={`text-sm sm:text-base font-extrabold tracking-wider uppercase font-sans ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              REALM OF HOSTELS
            </h1>
          </div>
          <span
            className={`text-[10px] font-mono tracking-[0.22em] uppercase ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            ROH · CAMPUS LIVING
          </span>
        </div>
      </div>

      {/* Quick Telemetry Status */}
      <div
        className={`hidden lg:flex items-center gap-6 font-mono text-xs ${
          darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className={darkMode ? 'text-[#ede8e1]' : 'text-[#231a14] font-medium'}>
            SYSTEM ONLINE: 99.98%
          </span>
        </div>
        <div
          className={`border-l pl-6 flex items-center gap-2 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <span className={darkMode ? 'text-[#877d70]' : 'text-[#695747]'}>
            RESIDENT SYNC:
          </span>
          <span className={darkMode ? 'text-[#ede8e1]' : 'text-[#231a14] font-bold'}>
            REALTIME (LAN-01)
          </span>
        </div>
        <div
          className={`border-l pl-6 flex items-center gap-2 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <span className={darkMode ? 'text-[#877d70]' : 'text-[#695747]'}>
            ACTIVE BLOCK:
          </span>
          <span
            className={`font-bold tracking-wide ${
              darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
            }`}
          >
            {activeBlock}
          </span>
        </div>
      </div>

      {/* Right Actions: Student Portal switch & Theme Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onSwitchToStudent && (
          <button
            id="switch-student-portal-btn"
            onClick={onSwitchToStudent}
            title="Switch to Student Command Portal (/student)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613] hover:border-[#f2ca50]/70 text-[#f2ca50]'
                : 'border-[#dfd3c3] bg-white hover:border-[#b57a42] text-[#824f1c] shadow-xs'
            }`}
          >
            <GraduationCap size={15} />
            <span className="hidden sm:inline">Student Portal</span>
            <span className="sm:hidden">Student</span>
            <span className="text-[10px] opacity-75 font-mono">/student</span>
          </button>
        )}

        <button
          id="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613] hover:border-[#c8935c]/60 text-[#f2ca50]'
              : 'border-[#dfd3c3] bg-white hover:border-[#b57a42] text-stone-800 shadow-xs'
          }`}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
