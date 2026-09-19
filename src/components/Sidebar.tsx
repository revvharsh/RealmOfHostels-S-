import React from 'react';
import {
  LayoutDashboard,
  Box,
  AlertCircle,
  Receipt,
  Utensils,
  Bus,
  Megaphone,
  X,
  PhoneCall,
  BedDouble,
  GraduationCap,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'rooms'
  | 'complaints'
  | 'payment'
  | 'mess'
  | 'transport'
  | 'notices';

interface SidebarProps {
  currentView: NavTab;
  setCurrentView: (view: NavTab) => void;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  pendingTicketsCount: number;
  noticesCount: number;
  darkMode: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onSwitchToStudent?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  totalBeds,
  occupiedBeds,
  occupancyRate,
  pendingTicketsCount,
  noticesCount,
  darkMode,
  isOpen = false,
  onClose,
  onMouseEnter,
  onMouseLeave,
  onSwitchToStudent,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | null;
    badgeColor?: string;
  }> = [
    {
      id: 'home',
      label: '1. Home Overview',
      icon: <LayoutDashboard size={15} />,
      badge: null,
    },
    {
      id: 'rooms',
      label: '2. Rooms & Matrix',
      icon: <Box size={15} />,
      badge: `${occupancyRate}%`,
      badgeColor: darkMode
        ? 'border-[#c8935c]/40 bg-[#c8935c]/15 text-[#f2ca50]'
        : 'border-amber-300 bg-amber-50 text-amber-900',
    },
    {
      id: 'complaints',
      label: '3. Complaints & Tickets',
      icon: <AlertCircle size={15} />,
      badge: pendingTicketsCount > 0 ? `${pendingTicketsCount} New` : null,
      badgeColor: 'border-rose-500/40 bg-rose-500/15 text-rose-500 font-bold',
    },
    {
      id: 'payment',
      label: '4. Payment Management',
      icon: <Receipt size={15} />,
      badge: 'Ledger',
    },
    {
      id: 'mess',
      label: '5. Mess Schedule',
      icon: <Utensils size={15} />,
      badge: 'Live',
    },
    {
      id: 'transport',
      label: '6. Transport Logistics',
      icon: <Bus size={15} />,
      badge: null,
    },
    {
      id: 'notices',
      label: '7. Notices & Alerts',
      icon: <Megaphone size={15} />,
      badge: `${noticesCount}`,
    },
  ];

  const handleNavClick = (id: NavTab) => {
    setCurrentView(id);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      id="main-sidebar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed top-16 left-3 z-40 w-68 max-w-[85vw] rounded-2xl border flex flex-col shrink-0 select-none transition-all duration-300 ease-out shadow-2xl backdrop-blur-md ${
        isOpen
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : '-translate-x-[110%] opacity-0 pointer-events-none'
      } ${
        darkMode
          ? 'border-[#382d24] bg-[#161311]/98 text-[#ede9e3] shadow-black/80'
          : 'border-[#ded4c5] bg-[#fbf9f5]/98 text-stone-900 shadow-stone-400/30'
      }`}
    >
      <div className="p-3.5 space-y-3">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-2 pb-2 border-b ${
            darkMode ? 'border-[#2d241c]' : 'border-[#e5dcd1]'
          }`}
        >
          <div>
            <p
              className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${
                darkMode ? 'text-[#c8935c]' : 'text-[#824f1c]'
              }`}
            >
              PORTAL NAVIGATION
            </p>
            <p
              className={`text-[9px] font-mono ${
                darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
              }`}
            >
              Hostel Command Center
            </p>
          </div>
          {onClose && (
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              title="Close sidebar"
              className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                darkMode
                  ? 'text-[#8c7e70] hover:text-white hover:bg-[#241e1a]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav id="sidebar-navigation" className="space-y-1 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left cursor-pointer ${
                  isActive
                    ? darkMode
                      ? 'bg-gradient-to-r from-[#c8935c]/25 to-transparent text-[#fbf9f5] font-bold border-l-4 border-[#c8935c] shadow-xs'
                      : 'bg-gradient-to-r from-[#ebdccb] to-white text-stone-950 font-bold border-l-4 border-[#824f1c] shadow-xs'
                    : darkMode
                    ? 'text-[#a39e93] hover:text-[#fbf9f5] hover:bg-[#1f1b17] border-l-4 border-transparent'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      isActive
                        ? darkMode
                          ? 'text-[#f2ca50]'
                          : 'text-[#824f1c]'
                        : darkMode
                        ? 'text-[#8c7e70]'
                        : 'text-stone-500'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="truncate text-[11px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${
                      item.badgeColor ||
                      (darkMode
                        ? 'border-[#2d241c] bg-[#100e0c] text-[#a39e93]'
                        : 'border-stone-200 bg-white text-stone-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Jump: Student Command Console */}
        {onSwitchToStudent && (
          <div className="pt-1">
            <button
              id="sidebar-switch-student-btn"
              onClick={() => {
                onSwitchToStudent();
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#f59e0b]/30 bg-[#1a1914] text-[#f59e0b] hover:border-[#f59e0b]'
                  : 'border-[#b47818]/40 bg-[#E8E4DC] text-[#966313] hover:border-[#b47818]'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={15} />
                <span>Student Portal</span>
              </div>
              <span className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
                /student
              </span>
            </button>
          </div>
        )}

        {/* Snug Occupancy Gauge */}
        <div
          id="capacity-telemetry-box"
          className={`p-3 rounded-xl border font-mono text-[10px] space-y-2 ${
            darkMode
              ? 'border-[#2d241c] bg-[#100e0c]'
              : 'border-[#dfd1c0] bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-bold flex items-center gap-1 uppercase tracking-wider ${
                darkMode ? 'text-[#c8935c]' : 'text-[#824f1c]'
              }`}
            >
              <BedDouble size={12} /> Bed Occupancy
            </span>
            <span className="text-emerald-500 font-bold">
              {occupancyRate}%
            </span>
          </div>

          <div
            className={`w-full h-1.5 rounded-full overflow-hidden ${
              darkMode ? 'bg-[#241e1a]' : 'bg-stone-200'
            }`}
          >
            <div
              className="bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>

          <div
            className={`flex justify-between text-[9px] ${
              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
            }`}
          >
            <span>{occupiedBeds} occupied</span>
            <span>{totalBeds - occupiedBeds} available</span>
          </div>
        </div>

        {/* Support Hotline */}
        <div
          className={`p-2.5 rounded-xl border font-mono text-[10px] flex items-center justify-between ${
            darkMode
              ? 'border-[#2d241c] bg-[#100e0c] text-[#8c7e70]'
              : 'border-[#dfd1c0] bg-white text-stone-600'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <PhoneCall size={11} className={darkMode ? 'text-[#c8935c]' : 'text-[#824f1c]'} />
            Warden Desk:
          </span>
          <a
            href="tel:+919811022110"
            className={`font-bold hover:underline ${
              darkMode ? 'text-[#ede8e1]' : 'text-stone-900'
            }`}
          >
            +91 98110 22110
          </a>
        </div>
      </div>
    </aside>
  );
};
