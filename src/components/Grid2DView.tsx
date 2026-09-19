import React, { useState } from 'react';
import {
  User,
  ChevronRight,
  Phone,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Room } from '../types';
import { getStudentDetails } from '../data';

interface Grid2DViewProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  darkMode: boolean;
}

export const Grid2DView: React.FC<Grid2DViewProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  darkMode,
}) => {
  const [hoveredBed, setHoveredBed] = useState<{
    roomNumber: string;
    studentName: string;
    index: number;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [wingFilter, setWingFilter] = useState<string>('All');

  const filteredRooms = rooms.filter((r) => {
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Available'
        ? r.free > 0
        : statusFilter === 'Full'
        ? r.occupied === r.capacity
        : r.status === statusFilter;
    const matchesWing = wingFilter === 'All' ? true : r.wing === wingFilter;
    return matchesStatus && matchesWing;
  });

  const getStatusBadge = (status: Room['status']) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          text: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500',
        };
      case 'Partially Occupied':
        return {
          bg: darkMode ? 'bg-[#c8935c]/15' : 'bg-amber-100',
          border: darkMode ? 'border-[#c8935c]/40' : 'border-amber-400',
          text: darkMode ? 'text-[#f2ca50]' : 'text-amber-900',
          dot: 'bg-[#f2ca50]',
        };
      case 'Fully Occupied':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          text: 'text-rose-600 dark:text-rose-400',
          dot: 'bg-rose-500',
        };
      case 'Reserved':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/40',
          text: 'text-cyan-700 dark:text-cyan-400',
          dot: 'bg-cyan-500',
        };
      case 'Under Maintenance':
      default:
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/40',
          text: 'text-purple-700 dark:text-purple-400',
          dot: 'bg-purple-500',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Interactive Controls Bar */}
      <div
        className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
          darkMode
            ? 'border-[#2d241c] bg-[#161311]'
            : 'border-[#dfd1c0] bg-white shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider ${
              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
            }`}
          >
            Occupancy Filter:
          </span>
          {['All', 'Available', 'Partially Occupied', 'Full'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                statusFilter === filter
                  ? darkMode
                    ? 'bg-[#c8935c] text-[#0c0b0a] font-bold shadow-xs'
                    : 'bg-[#824f1c] text-white font-bold shadow-xs'
                  : darkMode
                  ? 'bg-[#100e0c] text-[#a39e93] hover:text-[#fbf9f5] border border-[#2d241c]'
                  : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider ${
              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
            }`}
          >
            Wing:
          </span>
          <select
            value={wingFilter}
            onChange={(e) => setWingFilter(e.target.value)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono cursor-pointer focus:outline-none border ${
              darkMode
                ? 'bg-[#100e0c] border-[#2d241c] text-[#ede8e1]'
                : 'bg-stone-50 border-stone-300 text-stone-900'
            }`}
          >
            <option value="All">All Wings</option>
            <option value="North">North Wing</option>
            <option value="South">South Wing</option>
            <option value="East">East Wing</option>
            <option value="West">West Wing</option>
          </select>
          <span
            className={`text-[11px] font-bold ${
              darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
            }`}
          >
            {filteredRooms.length} units
          </span>
        </div>
      </div>

      {/* 2D Room Grid Matrix */}
      <div
        id="grid-2d-matrix"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredRooms.map((room) => {
          const isSel = selectedRoom?.number === room.number;
          const badge = getStatusBadge(room.status);

          return (
            <div
              key={room.number}
              id={`grid-room-card-${room.number}`}
              onClick={() => onSelectRoom(room)}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer relative group ${
                isSel
                  ? darkMode
                    ? 'border-[#c8935c] bg-[#1c1815] shadow-lg shadow-black/50 ring-2 ring-[#c8935c]'
                    : 'border-[#9e6932] bg-[#fbf7f2] shadow-md ring-2 ring-[#9e6932]'
                  : darkMode
                  ? 'border-[#2d241c] bg-[#161311] hover:border-[#c8935c]/60 hover:bg-[#1a1613]'
                  : 'border-[#dfd1c0] bg-white shadow-xs hover:border-[#b57a42] hover:bg-[#faf7f2]'
              }`}
            >
              <div>
                {/* Card Header */}
                <div
                  className={`flex items-start justify-between border-b pb-2.5 ${
                    darkMode ? 'border-[#2d241c]' : 'border-stone-200'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-mono uppercase ${
                        darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
                      }`}
                    >
                      {room.floor} · {room.wing} Wing
                    </span>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xl font-black font-mono ${
                          isSel
                            ? darkMode
                              ? 'text-[#f2ca50]'
                              : 'text-[#824f1c]'
                            : darkMode
                            ? 'text-[#fbf9f5]'
                            : 'text-[#1c1917]'
                        }`}
                      >
                        {room.number}
                      </h3>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${
                          room.type === 'AC'
                            ? darkMode
                              ? 'border-[#c8935c]/40 bg-[#c8935c]/10 text-[#f2ca50]'
                              : 'border-amber-300 bg-amber-50 text-amber-900'
                            : darkMode
                            ? 'border-[#2d241c] bg-black/40 text-[#8c7e70]'
                            : 'border-stone-200 bg-stone-100 text-stone-700'
                        }`}
                      >
                        {room.type}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold flex items-center gap-1 ${badge.bg} ${badge.border} ${badge.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                    {room.status}
                  </span>
                </div>

                {/* Bunk / Bed Slot Interactive Visualizer */}
                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={`uppercase font-semibold ${
                        darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
                      }`}
                    >
                      Bed Matrix ({room.occupied}/{room.capacity})
                    </span>
                    <span
                      className={`font-bold ${
                        room.free > 0
                          ? 'text-emerald-500'
                          : darkMode
                          ? 'text-[#8c7e70]'
                          : 'text-stone-500'
                      }`}
                    >
                      {room.free > 0 ? `${room.free} Vacant Slot` : 'Fully Booked'}
                    </span>
                  </div>

                  {/* Bed grid slots */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {Array.from({ length: room.capacity }).map((_, slotIdx) => {
                      const studentName = room.students[slotIdx];
                      const isOccupied = Boolean(studentName);
                      const student = isOccupied
                        ? getStudentDetails(studentName, room.number, slotIdx)
                        : null;

                      return (
                        <div
                          key={slotIdx}
                          onMouseEnter={() => {
                            if (isOccupied && student) {
                              setHoveredBed({
                                roomNumber: room.number,
                                studentName: student.name,
                                index: slotIdx,
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredBed(null)}
                          className={`p-2 rounded-lg border text-[10px] font-mono transition-all flex flex-col justify-between ${
                            isOccupied
                              ? darkMode
                                ? 'border-[#382d24] bg-[#191512] text-[#ede8e1] hover:border-[#c8935c]'
                                : 'border-[#e0d4c3] bg-[#fbf9f5] text-stone-900 hover:border-[#9e6932]'
                              : darkMode
                              ? 'border-dashed border-[#2d241c] bg-black/20 text-[#8c7e70]'
                              : 'border-dashed border-stone-300 bg-stone-50/50 text-stone-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold opacity-75">
                              Bed #{slotIdx + 1}
                            </span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOccupied ? 'bg-emerald-500' : 'bg-stone-400 opacity-40'
                              }`}
                            ></span>
                          </div>
                          <div className="mt-1">
                            {isOccupied ? (
                              <>
                                <strong className="block truncate font-sans text-xs">
                                  {studentName}
                                </strong>
                                <span className={`block text-[9px] truncate ${darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}`}>
                                  {student?.department ? student.department.split(' ')[0] : 'Resident'}
                                </span>
                              </>
                            ) : (
                              <span className="italic text-[9px] opacity-75">
                                Available Bed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Student Details Preview */}
                {room.students.length > 0 && (
                  <div
                    className={`mt-3.5 p-2 rounded-lg border text-[11px] font-mono space-y-1 ${
                      darkMode
                        ? 'border-[#2d241c] bg-[#100e0c]'
                        : 'border-stone-200 bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] uppercase font-bold ${
                          darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
                        }`}
                      >
                        Lead Resident:
                      </span>
                      <span className={`text-[10px] font-bold ${darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}`}>
                        {getStudentDetails(room.students[0], room.number, 0).rollNo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="truncate max-w-[170px] font-medium">
                        {room.students[0]}
                      </span>
                      <span className="flex items-center gap-1 opacity-80">
                        <Phone size={10} />
                        {getStudentDetails(room.students[0], room.number, 0).phone.split(' ')[2] || 'Call'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div
                className={`mt-4 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                  darkMode ? 'border-[#2d241c]' : 'border-stone-200'
                }`}
              >
                <span
                  className={darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}
                >
                  Sanitized: {room.lastCleaned}
                </span>
                <span
                  className={`uppercase font-bold flex items-center gap-0.5 ${
                    isSel
                      ? darkMode
                        ? 'text-[#f2ca50]'
                        : 'text-[#824f1c]'
                      : darkMode
                      ? 'text-[#c8935c] group-hover:text-[#f2ca50]'
                      : 'text-[#9e6932] group-hover:text-[#824f1c]'
                  }`}
                >
                  {isSel ? 'Selected' : 'Open Dossier'} <ChevronRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
