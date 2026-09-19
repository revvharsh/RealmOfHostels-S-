import React from 'react';
import {
  Users,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Inbox,
  Sparkles,
  ShieldCheck,
  Calendar,
  Radio,
  Plus,
} from 'lucide-react';
import { Room, Ticket } from '../types';

interface HomeOverviewProps {
  rooms: Room[];
  tickets: Ticket[];
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: string;
  pendingTicketsCount: number;
  onViewRoomsMatrix: () => void;
  onOpenAddResident: () => void;
  onOpenNewTicket?: () => void;
  onSelectTicket: (ticketId: string) => void;
  onNavigateToComplaints: () => void;
  darkMode: boolean;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  rooms,
  tickets,
  totalBeds,
  occupiedBeds,
  occupancyRate,
  pendingTicketsCount,
  onViewRoomsMatrix,
  onOpenAddResident,
  onOpenNewTicket,
  onSelectTicket,
  onNavigateToComplaints,
  darkMode,
}) => {
  // Free beds count
  const freeBeds = totalBeds - occupiedBeds;

  // Compact telemetry logs (capped to 4 recent items)
  const telemetryLogs = [
    {
      time: '14:22',
      type: 'IOT-PUMP',
      text: 'Overhead Tank 02 Refill cycle finished (100% full)',
      badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      time: '13:58',
      type: 'TURNSTILE',
      text: 'Main South Gate batch verification passed for 42 entries',
      badge: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
    {
      time: '12:45',
      type: 'MESS-SYNC',
      text: 'Lunch meal verification closed: 428 diners recorded',
      badge: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    },
    {
      time: '11:10',
      type: 'DISPATCH',
      text: 'Electrician assigned to RP-301 Geyser breaker repair',
      badge: 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div id="home-overview-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions Bar */}
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
            Hostel Operations Center
          </span>
          <h2
            id="home-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Royal Paradise Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenNewTicket && (
            <button
              onClick={onOpenNewTicket}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] bg-[#1a1613] hover:border-[#c8935c] text-[#ede8e1]'
                  : 'border-[#ded4c5] bg-white hover:border-[#824f1c] text-stone-900 shadow-xs'
              }`}
            >
              <Plus size={14} className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'} />
              New Ticket
            </button>
          )}

          <button
            id="allocate-resident-btn"
            onClick={onOpenAddResident}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer transition-all"
          >
            <Plus size={14} />
            Allocate Bed
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Occupancy Index
            </span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3
              className={`text-3xl font-black font-mono tracking-tight ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              {occupancyRate}%
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              High Demand
            </span>
          </div>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            {occupiedBeds} occupied / {totalBeds} total slots
          </p>
        </div>

        {/* Free Capacity */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Vacant Beds
            </span>
            <span className="p-2 rounded-lg bg-[#c8935c]/15 text-[#f2ca50]">
              <Bed size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3
              className={`text-3xl font-black font-mono tracking-tight ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              {freeBeds}
            </h3>
            <span
              className={`text-xs font-mono font-bold ${
                darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
              }`}
            >
              Beds Available
            </span>
          </div>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Ready for instant allocation
          </p>
        </div>

        {/* Open Complaints */}
        <div
          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-amber-500/50 ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
          onClick={onNavigateToComplaints}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Active Tickets
            </span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Inbox size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {pendingTicketsCount}
            </h3>
            <span className="text-xs font-mono text-amber-700 font-bold">
              Pending Action
            </span>
          </div>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Click to open dispatch queue
          </p>
        </div>

        {/* Network & Node Health */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Infrastructure Status
            </span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              100%
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              Nominal
            </span>
          </div>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Water, Power & Wi-Fi operational
          </p>
        </div>
      </div>

      {/* Optimized Live Activity & Pending Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compact Live Telemetry / Activity Log (Optimized height as requested) */}
        <div
          id="home-telemetry-panel"
          className={`lg:col-span-7 rounded-2xl border p-5 space-y-3.5 ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-3 ${
              darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <h3
                className={`text-sm font-bold tracking-wider uppercase font-mono ${
                  darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                }`}
              >
                Live Campus Telemetry
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Royal Paradise Node · LAN Realtime
            </span>
          </div>

          {/* Compact scrollable container with max-height to avoid excessive vertical length */}
          <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {telemetryLogs.map((evt, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'border-[#2d241c] bg-[#120f0d] hover:bg-[#1f1915]'
                    : 'border-stone-200 bg-[#fcfaf7] hover:bg-[#f6ede4]'
                }`}
              >
                <span
                  className={`text-[10px] font-bold shrink-0 ${
                    darkMode ? 'text-[#a39e93]' : 'text-stone-500'
                  }`}
                >
                  {evt.time}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold shrink-0 ${evt.badge}`}
                >
                  {evt.type}
                </span>
                <span
                  className={`leading-relaxed text-xs truncate ${
                    darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                  }`}
                >
                  {evt.text}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-xs font-mono border-t border-dashed border-stone-300 dark:border-stone-800">
            <span className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'}>
              Auto-refreshing every 30s
            </span>
            <button
              onClick={onViewRoomsMatrix}
              className={`hover:underline flex items-center gap-1 cursor-pointer font-bold ${
                darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
              }`}
            >
              Open Rooms Matrix <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Quick Pending Complaints */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-5 space-y-3.5 ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-3 ${
              darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
            }`}
          >
            <h3
              className={`text-sm font-bold tracking-wider uppercase font-mono flex items-center gap-2 ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              <Inbox size={16} className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'} />
              Pending Complaints
            </h3>
            <button
              onClick={onNavigateToComplaints}
              className={`text-xs font-mono hover:underline cursor-pointer font-bold ${
                darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
              }`}
            >
              View All ({tickets.length})
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tickets.filter((t) => t.status !== 'Resolved').length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-stone-400">
                All maintenance tickets resolved and signed off.
              </div>
            ) : (
              tickets
                .filter((t) => t.status !== 'Resolved')
                .map((ticket) => (
                  <div
                    key={ticket.id}
                    id={`home-ticket-${ticket.id}`}
                    onClick={() => onSelectTicket(ticket.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      darkMode
                        ? 'border-[#2d241c] bg-[#120f0d] hover:border-[#c8935c]'
                        : 'border-stone-200 bg-[#fcfaf7] hover:border-[#824f1c]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                          }`}
                        >
                          {ticket.id}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            ticket.status === 'Pending'
                              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                              : ticket.status === 'In-Progress'
                              ? 'bg-cyan-500/15 text-cyan-600 border border-cyan-500/30'
                              : 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] ${
                          darkMode ? 'text-[#a39e93]' : 'text-stone-500'
                        }`}
                      >
                        {ticket.timestamp}
                      </span>
                    </div>
                    <h4
                      className={`text-xs font-medium mt-1 line-clamp-1 ${
                        darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                      }`}
                    >
                      {ticket.subject}
                    </h4>
                    <div
                      className={`flex items-center justify-between mt-1.5 text-[11px] font-mono ${
                        darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                      }`}
                    >
                      <span className="truncate max-w-[170px]">
                        Room {ticket.room} · {ticket.student}
                      </span>
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          ticket.status === 'Awaiting Approval'
                            ? 'text-purple-600 dark:text-purple-300'
                            : darkMode
                            ? 'text-[#f2ca50]'
                            : 'text-[#824f1c]'
                        }`}
                      >
                        {ticket.status === 'Awaiting Approval'
                          ? 'Awaiting Sign-off'
                          : 'Verify'}{' '}
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
