import React, { useState } from 'react';
import { Bus, MapPin, Phone, Clock, Plus, Trash2, CheckCircle } from 'lucide-react';
import { ShuttleRide } from '../types';

interface TransportViewProps {
  schedules: ShuttleRide[];
  onOpenAddRoute: () => void;
  onDeleteRoute?: (index: number) => void;
  darkMode: boolean;
}

export const TransportView: React.FC<TransportViewProps> = ({
  schedules,
  onOpenAddRoute,
  onDeleteRoute,
  darkMode,
}) => {
  return (
    <div id="transport-view-container" className="space-y-6 max-w-7xl mx-auto">
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
            Fleet Operations / Campus Connect
          </span>
          <h2
            id="transport-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Transport & Shuttle Logistics
          </h2>
        </div>

        {/* Action: Add Route */}
        <button
          id="add-route-btn"
          onClick={onOpenAddRoute}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer transition-all"
        >
          <Plus size={15} />
          Add Route
        </button>
      </div>

      {/* Timetable Table */}
      <div
        id="shuttle-schedule-table"
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? 'border-[#382e25] bg-[#1a1613]'
            : 'border-[#ded4c5] bg-white shadow-xs'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            darkMode ? 'border-[#382e25] bg-[#14110e]' : 'border-[#ded4c5] bg-[#fcfaf7]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bus
              size={16}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            <h3
              className={`text-sm font-bold font-mono uppercase ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              Royal Paradise Shuttle Line ({schedules.length} Active Timings)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/40">
            GPS Tracker Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead
              className={`border-b uppercase text-[10px] ${
                darkMode
                  ? 'border-[#382e25] bg-[#120f0d] text-[#a39e93]'
                  : 'border-[#ded4c5] bg-[#f8ede3] text-[#695747]'
              }`}
            >
              <tr>
                <th className="p-3.5">Route Course</th>
                <th className="p-3.5">Departure</th>
                <th className="p-3.5">Arrival</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Driver Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? 'divide-[#382e25]' : 'divide-[#ded4c5]'
              }`}
            >
              {schedules.map((bus, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-[#201b17]' : 'hover:bg-[#fbf9f5]'
                  }`}
                >
                  <td
                    className={`p-3.5 font-semibold flex items-center gap-1.5 ${
                      darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                    }`}
                  >
                    <MapPin
                      size={13}
                      className={`shrink-0 ${
                        darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                      }`}
                    />
                    <span>{bus.route}</span>
                  </td>
                  <td
                    className={`p-3.5 font-bold ${
                      darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                    }`}
                  >
                    {bus.departure}
                  </td>
                  <td
                    className={`p-3.5 ${
                      darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                    }`}
                  >
                    {bus.arrival}
                  </td>
                  <td
                    className={`p-3.5 ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    {bus.busNo}
                  </td>
                  <td
                    className={`p-3.5 ${
                      darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-stone-400" />
                      {bus.driver}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                        bus.status === 'On Time'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : bus.status === 'Delayed'
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                          : 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-[#f2ca50]'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {onDeleteRoute && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove route "${bus.route}" departing at ${bus.departure}?`
                            )
                          ) {
                            onDeleteRoute(idx);
                          }
                        }}
                        title="Delete this shuttle route"
                        className="p-1 rounded text-stone-400 hover:text-rose-500 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
