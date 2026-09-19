import React, { useState } from 'react';
import {
  Star,
  User,
  Plus,
  Check,
  Phone,
  Mail,
  GraduationCap,
  Building,
  ShieldAlert,
  Copy,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { Room } from '../types';
import { getStudentDetails } from '../data';

interface RoomInspectorProps {
  rooms: Room[];
  selectedFloor: string;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room) => void;
  shortlist: string[];
  toggleShortlist: (roomNumber: string) => void;
  onOpenAddResident: () => void;
  darkMode: boolean;
}

export const RoomInspector: React.FC<RoomInspectorProps> = ({
  rooms,
  selectedFloor,
  selectedRoom,
  setSelectedRoom,
  shortlist,
  toggleShortlist,
  onOpenAddResident,
  darkMode,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

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

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor === 'All') return true;
    return r.floor === selectedFloor;
  });

  return (
    <div id="room-inspector-column" className="space-y-4 font-mono text-xs">
      {/* 1. Selected Room Comprehensive Dossier */}
      {selectedRoom ? (
        <div
          id="selected-inspector-card"
          className={`p-4 rounded-xl border space-y-4 transition-all ${
            darkMode
              ? 'border-[#c8935c]/50 bg-gradient-to-b from-[#1c1815] via-[#161311] to-[#120f0d] shadow-lg shadow-black/40'
              : 'border-[#dfd1c0] bg-gradient-to-b from-[#fbf8f5] to-[#f4ede4] shadow-md shadow-stone-200/50'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-start justify-between border-b pb-3 ${
              darkMode ? 'border-[#342a22]' : 'border-[#e0d4c3]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                    darkMode
                      ? 'border-[#c8935c]/40 bg-[#c8935c]/15 text-[#f2ca50]'
                      : 'border-[#b57a42]/40 bg-[#f7efe5] text-[#824f1c]'
                  }`}
                >
                  ROOM DOSSIER
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    selectedRoom.occupied === selectedRoom.capacity
                      ? 'text-rose-500'
                      : selectedRoom.occupied > 0
                      ? darkMode ? 'text-[#f2ca50]' : 'text-amber-800'
                      : 'text-emerald-500'
                  }`}
                >
                  {selectedRoom.occupied}/{selectedRoom.capacity} Beds Active
                </span>
              </div>
              <h3
                className={`text-xl font-black mt-1 font-sans tracking-tight ${
                  darkMode ? 'text-[#fbf9f5]' : 'text-[#231a14]'
                }`}
              >
                Room {selectedRoom.number}
              </h3>
              <p
                className={`text-[11px] ${
                  darkMode ? 'text-[#b5a89b]' : 'text-[#695747]'
                }`}
              >
                {selectedRoom.floor} · {selectedRoom.wing} Wing · {selectedRoom.type} Specification
              </p>
            </div>

            <button
              id="shortlist-toggle-btn"
              onClick={() => toggleShortlist(selectedRoom.number)}
              className={`px-3 py-1.5 rounded-lg text-xs border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                shortlist.includes(selectedRoom.number)
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c8935c] text-[#0c0b0a] border-[#f2ca50] shadow-sm'
                  : darkMode
                  ? 'border-[#c8935c]/50 text-[#f2ca50] hover:bg-[#c8935c]/15'
                  : 'border-[#9e6932] text-[#824f1c] hover:bg-[#ebdccb]'
              }`}
            >
              {shortlist.includes(selectedRoom.number) ? (
                <>
                  <Check size={13} /> Saved
                </>
              ) : (
                <>
                  <Plus size={13} /> Shortlist
                </>
              )}
            </button>
          </div>

          {/* Quick Specs Pill Row */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div
              className={`p-2 rounded-lg border ${
                darkMode
                  ? 'border-[#2d241c] bg-[#120f0d]'
                  : 'border-[#e5dcd1] bg-white'
              }`}
            >
              <span className={`block text-[9px] uppercase ${darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}`}>
                Capacity
              </span>
              <strong className={darkMode ? 'text-[#ede8e1]' : 'text-stone-900'}>
                {selectedRoom.capacity} Beds
              </strong>
            </div>
            <div
              className={`p-2 rounded-lg border ${
                darkMode
                  ? 'border-[#2d241c] bg-[#120f0d]'
                  : 'border-[#e5dcd1] bg-white'
              }`}
            >
              <span className={`block text-[9px] uppercase ${darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}`}>
                Free Slots
              </span>
              <strong className={selectedRoom.free > 0 ? 'text-emerald-500 font-bold' : (darkMode ? 'text-[#8c7e70]' : 'text-stone-500')}>
                {selectedRoom.free} Available
              </strong>
            </div>
            <div
              className={`p-2 rounded-lg border ${
                darkMode
                  ? 'border-[#2d241c] bg-[#120f0d]'
                  : 'border-[#e5dcd1] bg-white'
              }`}
            >
              <span className={`block text-[9px] uppercase ${darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}`}>
                Sanitation
              </span>
              <strong className={darkMode ? 'text-[#ede8e1]' : 'text-stone-900'}>
                {selectedRoom.lastCleaned}
              </strong>
            </div>
          </div>

          {/* OCCUPANTS DETAIL SECTION */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  darkMode ? 'text-[#e5d4c0]' : 'text-[#3d2b1f]'
                }`}
              >
                <User size={13} className={darkMode ? 'text-[#f2ca50]' : 'text-[#9e6932]'} />
                Resident Dossiers ({selectedRoom.students.length})
              </span>
              {selectedRoom.free > 0 && (
                <button
                  onClick={onOpenAddResident}
                  className={`text-[10px] font-bold hover:underline cursor-pointer flex items-center gap-1 ${
                    darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                  }`}
                >
                  <Plus size={11} /> Allocate Vacant Bed
                </button>
              )}
            </div>

            {selectedRoom.students.length > 0 ? (
              <div className="space-y-3">
                {selectedRoom.students.map((studentName, idx) => {
                  const student = getStudentDetails(studentName, selectedRoom.number, idx);
                  const isCopied = copiedPhone === student.phone;

                  return (
                    <div
                      key={student.name + idx}
                      id={`occupant-card-${idx}`}
                      className={`p-3.5 rounded-xl border space-y-2.5 transition-all ${
                        darkMode
                          ? 'border-[#382d24] bg-[#191512] hover:border-[#c8935c]/60'
                          : 'border-[#dfd1c0] bg-white hover:border-[#b57a42] shadow-xs'
                      }`}
                    >
                      {/* Top row: Name & Bed */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-bold text-sm font-sans ${
                                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                              }`}
                            >
                              {student.name}
                            </h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                              Active Resident
                            </span>
                          </div>
                          <span
                            className={`text-[10px] ${
                              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
                            }`}
                          >
                            Roll No: <strong className={darkMode ? 'text-[#ede8e1]' : 'text-stone-900'}>{student.rollNo}</strong> · {student.year}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            darkMode
                              ? 'border-[#c8935c]/30 bg-[#c8935c]/10 text-[#f2ca50]'
                              : 'border-amber-300 bg-amber-50 text-amber-900'
                          }`}
                        >
                          {student.bed}
                        </span>
                      </div>

                      {/* College & Department Details */}
                      <div
                        className={`p-2 rounded-lg border text-[11px] space-y-1 ${
                          darkMode
                            ? 'border-[#2d241c] bg-[#100e0c]'
                            : 'border-stone-200 bg-[#faf7f2]'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <GraduationCap
                            size={13}
                            className={`shrink-0 mt-0.5 ${
                              darkMode ? 'text-[#c8935c]' : 'text-[#9e6932]'
                            }`}
                          />
                          <div>
                            <span className={darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}>
                              College:{' '}
                            </span>
                            <strong className={darkMode ? 'text-[#ede8e1]' : 'text-stone-900'}>
                              {student.college}
                            </strong>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Building
                            size={13}
                            className={`shrink-0 mt-0.5 ${
                              darkMode ? 'text-[#c8935c]' : 'text-[#9e6932]'
                            }`}
                          />
                          <div>
                            <span className={darkMode ? 'text-[#8c7e70]' : 'text-stone-500'}>
                              Dept/Major:{' '}
                            </span>
                            <span className={darkMode ? 'text-[#ede8e1]' : 'text-stone-900'}>
                              {student.department}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Phone & Contact Row */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`flex items-center gap-1.5 font-semibold ${
                              darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                            }`}
                          >
                            <Phone size={12} />
                            <a
                              href={`tel:${student.phone.replace(/\s+/g, '')}`}
                              className="hover:underline"
                              title="Click to call student"
                            >
                              {student.phone}
                            </a>
                          </span>
                          <button
                            onClick={() => handleCopy(student.phone)}
                            className={`p-1 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                              isCopied
                                ? 'text-emerald-500'
                                : darkMode
                                ? 'text-[#a39e93] hover:text-[#fbf9f5]'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                            title="Copy phone number"
                          >
                            {isCopied ? (
                              <>
                                <CheckCheck size={11} /> Copied
                              </>
                            ) : (
                              <>
                                <Copy size={11} /> Copy
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className={`flex items-center gap-1.5 ${
                              darkMode ? 'text-[#b5a89b]' : 'text-stone-600'
                            }`}
                          >
                            <Mail size={11} />
                            <a
                              href={`mailto:${student.email}`}
                              className="hover:underline truncate max-w-[200px]"
                            >
                              {student.email}
                            </a>
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                              darkMode
                                ? 'border-[#382d24] bg-[#120f0d] text-[#c8935c]'
                                : 'border-stone-200 bg-stone-100 text-stone-700'
                            }`}
                          >
                            Blood: {student.bloodGroup}
                          </span>
                        </div>

                        {/* Guardian Info */}
                        <div
                          className={`pt-1.5 border-t text-[10px] flex justify-between items-center ${
                            darkMode
                              ? 'border-[#2d241c] text-[#8c7e70]'
                              : 'border-stone-200 text-stone-500'
                          }`}
                        >
                          <span>
                            Guardian: {student.guardian}
                          </span>
                          <a
                            href={`tel:${student.guardianPhone.replace(/\s+/g, '')}`}
                            className={`hover:underline font-bold ${
                              darkMode ? 'text-[#c8935c]' : 'text-[#824f1c]'
                            }`}
                          >
                            {student.guardianPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className={`p-4 text-center rounded-xl border space-y-2 ${
                  darkMode
                    ? 'border-[#2d241c] bg-[#141210] text-[#8c7e70]'
                    : 'border-[#e0d4c3] bg-white text-stone-500'
                }`}
              >
                <p className="text-xs">No active occupants assigned to this room yet.</p>
                <button
                  onClick={onOpenAddResident}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-bold uppercase cursor-pointer ${
                    darkMode
                      ? 'border-[#c8935c]/50 bg-[#c8935c]/15 text-[#f2ca50]'
                      : 'border-[#9e6932] bg-[#f7efe5] text-[#824f1c]'
                  }`}
                >
                  + Assign Student to Room
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State when no room is selected */
        <div
          className={`p-6 rounded-xl border text-center space-y-2 ${
            darkMode
              ? 'border-[#2d241c] bg-[#141210] text-[#8c7e70]'
              : 'border-[#e5dcd1] bg-white text-stone-500 shadow-xs'
          }`}
        >
          <Building size={24} className="mx-auto text-[#c8935c] opacity-80" />
          <h4
            className={`font-bold text-sm ${
              darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
            }`}
          >
            Select Any Room from Grid
          </h4>
          <p className="text-xs leading-relaxed max-w-xs mx-auto">
            Click any room on the 2D matrix or the quick list below to view complete student names, college details, phone numbers, and emergency contacts.
          </p>
        </div>
      )}

      {/* 2. Room Directory Breakdown List */}
      <div
        id="room-list-card"
        className={`p-4 rounded-xl border space-y-3 ${
          darkMode
            ? 'border-[#2d241c] bg-[#161311]'
            : 'border-[#dfd1c0] bg-white shadow-xs'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-2 ${
            darkMode ? 'border-[#2d241c]' : 'border-stone-200'
          }`}
        >
          <h4
            className={`font-bold uppercase text-xs ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            {selectedFloor === 'All' ? 'ALL FLOORS' : selectedFloor.toUpperCase()}{' '}
            · {filteredRooms.length} ROOMS
          </h4>
          <span
            className={`text-[10px] ${
              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
            }`}
          >
            Click to Inspect
          </span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredRooms.map((room) => {
            const isSel = selectedRoom?.number === room.number;
            const badge = getStatusBadge(room.status);
            const isSaved = shortlist.includes(room.number);

            return (
              <div
                key={room.number}
                id={`room-list-item-${room.number}`}
                onClick={() => setSelectedRoom(room)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  isSel
                    ? darkMode
                      ? 'border-[#c8935c] bg-[#c8935c]/20 shadow-sm'
                      : 'border-[#9e6932] bg-[#fbf5ee] shadow-sm'
                    : darkMode
                    ? 'border-[#2d241c] bg-[#100e0c] hover:border-[#c8935c]/50'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isSel
                          ? darkMode
                            ? 'text-[#f2ca50]'
                            : 'text-[#824f1c]'
                          : darkMode
                          ? 'text-[#fbf9f5]'
                          : 'text-stone-900'
                      }`}
                    >
                      {room.number}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-bold flex items-center gap-1 ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                      {room.status}
                    </span>
                  </div>
                  <div
                    className={`text-[10px] mt-1 ${
                      darkMode ? 'text-[#8c7e70]' : 'text-stone-600'
                    }`}
                  >
                    {room.type} · {room.capacity}-bed · {room.occupied} resident{room.occupied !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold ${
                      darkMode ? 'text-[#ede8e1]' : 'text-stone-900'
                    }`}
                  >
                    {room.free} free
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShortlist(room.number);
                    }}
                    className={`block text-[10px] mt-0.5 transition-colors cursor-pointer ${
                      isSaved
                        ? darkMode
                          ? 'text-[#f2ca50] font-bold'
                          : 'text-[#824f1c] font-bold'
                        : darkMode
                        ? 'text-[#877d70] hover:text-[#f2ca50]'
                        : 'text-stone-500 hover:text-amber-800'
                    }`}
                  >
                    {isSaved ? '★ Saved' : '☆ Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Shortlist Drawer */}
      <div
        id="shortlist-drawer"
        className={`p-4 rounded-xl border ${
          darkMode
            ? 'border-[#2d241c] bg-[#161311]'
            : 'border-[#dfd1c0] bg-white shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold flex items-center gap-1.5 ${
              darkMode ? 'text-[#ede8e1]' : 'text-stone-900'
            }`}
          >
            <Star size={13} className="text-[#f2ca50] fill-[#f2ca50]" />
            My Shortlist ({shortlist.length})
          </span>
          <span
            className={`text-[10px] ${
              darkMode ? 'text-[#8c7e70]' : 'text-stone-500'
            }`}
          >
            Quick Access
          </span>
        </div>

        {shortlist.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {shortlist.map((r) => (
              <span
                key={r}
                onClick={() => {
                  const found = rooms.find(rm => rm.number === r);
                  if (found) setSelectedRoom(found);
                }}
                className={`px-2.5 py-1 rounded-md border font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  darkMode
                    ? 'border-[#c8935c]/50 bg-[#c8935c]/15 text-[#f2ca50]'
                    : 'border-amber-400 bg-amber-50 text-amber-900'
                }`}
              >
                {r}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShortlist(r);
                  }}
                  className="hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                  title="Remove from shortlist"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p
            className={`text-[11px] italic ${
              darkMode ? 'text-[#877d70]' : 'text-stone-500'
            }`}
          >
            No rooms pinned. Click "+ Shortlist" or "☆ Save" to pin rooms here.
          </p>
        )}
      </div>
    </div>
  );
};
