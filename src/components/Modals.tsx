import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Ticket as TicketIcon,
  Send,
  Bus,
  Edit3,
  Utensils,
  Check,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { Room, Ticket, Notice, ShuttleRide, StudentPayment, DayMeals } from '../types';

/* 1. NEW TICKET MODAL */
interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onCreateTicket: (ticket: {
    room: string;
    student: string;
    category: string;
    urgency: Ticket['urgency'];
    subject: string;
    desc: string;
  }) => void;
  darkMode?: boolean;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onCreateTicket,
  darkMode = false,
}) => {
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(rooms[0]?.number || 'ARV-301');
  const [studentName, setStudentName] = useState('');
  const [category, setCategory] = useState('Appliance');
  const [urgency, setUrgency] = useState<Ticket['urgency']>('Medium');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  // Auto-populate student if room changes
  useEffect(() => {
    const rm = rooms.find((r) => r.number === selectedRoomNumber);
    if (rm && rm.students.length > 0) {
      setStudentName(rm.students[0]);
    } else {
      setStudentName('');
    }
  }, [selectedRoomNumber, rooms]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !desc.trim() || !selectedRoomNumber) return;

    onCreateTicket({
      room: selectedRoomNumber,
      student: studentName.trim() || 'Room Resident',
      category,
      urgency,
      subject: subject.trim(),
      desc: desc.trim(),
    });

    setSubject('');
    setDesc('');
    onClose();
  };

  const selectedRoomObj = rooms.find((r) => r.number === selectedRoomNumber);

  return (
    <div
      id="new-ticket-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="new-ticket-modal-card"
        className={`max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <h3
            className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            <TicketIcon
              size={16}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            Log New Maintenance Ticket
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Room Number
              </label>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                {rooms.map((r) => (
                  <option key={r.number} value={r.number}>
                    {r.number} ({r.floor} · {r.wing} Wing)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Resident Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name"
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              />
              {selectedRoomObj && selectedRoomObj.students.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {selectedRoomObj.students.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setStudentName(s)}
                      className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer ${
                        studentName === s
                          ? 'bg-[#c8935c] text-white font-bold'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                <option value="Appliance">Appliance / AC</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry / Furniture</option>
                <option value="Network">WiFi & Network</option>
                <option value="Sanitation">Sanitation / Cleaning</option>
                <option value="Security">Security & Locks</option>
              </select>
            </div>

            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Ticket['urgency'])}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                <option value="High">High (Immediate)</option>
                <option value="Medium">Medium (Within 24 hrs)</option>
                <option value="Normal">Normal (Routine)</option>
                <option value="Low">Low (Minor)</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Issue Headline / Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Geyser tripping circuit breaker in washroom"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Diagnostic Narrative / Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact details of the issue..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                  : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 2. SEND OVERDUE NOTICE BATCH MODAL (WITH SELECT ALL & SELECTION) */
interface SendNoticeBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: StudentPayment[];
  onDispatchNotices: (selectedStudents: string[]) => void;
  preSelectedStudent?: string | null;
  darkMode?: boolean;
}

export const SendNoticeBatchModal: React.FC<SendNoticeBatchModalProps> = ({
  isOpen,
  onClose,
  payments,
  onDispatchNotices,
  preSelectedStudent = null,
  darkMode = false,
}) => {
  const overdueStudents = payments.filter((p) => p.dues > 0);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState(
    'Please settle outstanding hostel room and mess charges before the upcoming semester clearance deadline to prevent access restriction.'
  );

  useEffect(() => {
    if (preSelectedStudent) {
      setSelectedNames([preSelectedStudent]);
    } else {
      setSelectedNames(overdueStudents.map((s) => s.name));
    }
  }, [isOpen, preSelectedStudent]);

  if (!isOpen) return null;

  const toggleStudent = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleToggleAll = () => {
    if (selectedNames.length === overdueStudents.length) {
      setSelectedNames([]);
    } else {
      setSelectedNames(overdueStudents.map((s) => s.name));
    }
  };

  const totalSelectedDues = overdueStudents
    .filter((s) => selectedNames.includes(s.name))
    .reduce((acc, curr) => acc + curr.dues, 0);

  const handleSend = () => {
    if (selectedNames.length === 0) return;
    onDispatchNotices(selectedNames);
    onClose();
  };

  return (
    <div
      id="send-overdue-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="send-overdue-modal-card"
        className={`max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
                darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
              }`}
            >
              <Send
                size={16}
                className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
              />
              Dispatch Overdue Payment Notice
            </h3>
            <p
              className={`text-[10px] mt-0.5 ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Select specific delinquent students or dispatch in batch
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Selection Bar & Select All */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            darkMode
              ? 'border-[#2d241c] bg-[#120f0d]'
              : 'border-[#e0d4c3] bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border cursor-pointer transition-colors ${
                selectedNames.length === overdueStudents.length
                  ? 'bg-[#c8935c] text-white border-[#c8935c]'
                  : darkMode
                  ? 'border-[#382e25] text-[#f2ca50] hover:bg-[#241e1a]'
                  : 'border-[#ded4c5] text-[#824f1c] hover:bg-stone-100'
              }`}
            >
              {selectedNames.length === overdueStudents.length
                ? 'Deselect All'
                : 'Select All (' + overdueStudents.length + ')'}
            </button>
            <span
              className={`text-[11px] ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              <strong>{selectedNames.length}</strong> selected
            </span>
          </div>

          <span
            className={`font-bold text-xs ${
              darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
            }`}
          >
            ₹{totalSelectedDues.toLocaleString()} Pending
          </span>
        </div>

        {/* Overdue Student Roster List with Checkboxes */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {overdueStudents.map((s) => {
            const isChecked = selectedNames.includes(s.name);
            return (
              <div
                key={s.name}
                onClick={() => toggleStudent(s.name)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? darkMode
                      ? 'border-[#c8935c] bg-[#c8935c]/15 text-[#fbf9f5]'
                      : 'border-[#824f1c] bg-[#fbf5ee] text-stone-950'
                    : darkMode
                    ? 'border-[#2d241c] bg-[#100e0c] text-[#8c7e70] hover:border-[#382e25]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by parent div
                    className="cursor-pointer accent-[#c8935c]"
                  />
                  <div>
                    <h4 className="font-bold text-xs">{s.name}</h4>
                    <span className="text-[10px] opacity-75">
                      Room {s.room} · Last activity: {s.lastPaymentDate || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-rose-500">
                    ₹{s.dues.toLocaleString()}
                  </span>
                  <span className="block text-[9px] uppercase font-bold text-amber-600">
                    Overdue
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Broadcast Note */}
        <div>
          <label
            className={`text-[10px] uppercase block mb-1 font-bold ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Notice Message Text
          </label>
          <textarea
            rows={2}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
              darkMode
                ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
            }`}
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
              darkMode
                ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={selectedNames.length === 0}
            className={`px-5 py-2 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedNames.length > 0
                ? 'bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110'
                : 'bg-stone-400 text-stone-700 cursor-not-allowed opacity-50'
            }`}
          >
            Dispatch ({selectedNames.length}) Notices
          </button>
        </div>
      </div>
    </div>
  );
};

/* 3. ADD SHUTTLE ROUTE MODAL */
interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoute: (route: ShuttleRide) => void;
  darkMode?: boolean;
}

export const AddRouteModal: React.FC<AddRouteModalProps> = ({
  isOpen,
  onClose,
  onAddRoute,
  darkMode = false,
}) => {
  const [routeCourse, setRouteCourse] = useState('');
  const [departure, setDeparture] = useState('08:45 AM');
  const [arrival, setArrival] = useState('09:10 AM');
  const [busNo, setBusNo] = useState('BUS-05 (Tata Ultra Electric)');
  const [driver, setDriver] = useState('Kuldeep Singh (+91 94112 00210)');
  const [status, setStatus] = useState<ShuttleRide['status']>('Scheduled');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeCourse.trim()) return;

    onAddRoute({
      route: routeCourse.trim(),
      departure: departure.trim(),
      arrival: arrival.trim(),
      busNo: busNo.trim(),
      driver: driver.trim(),
      status,
    });

    setRouteCourse('');
    onClose();
  };

  return (
    <div
      id="add-route-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="add-route-modal-card"
        className={`max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <h3
            className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            <Bus
              size={16}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            Schedule New Shuttle Route
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Route Course (Origin to Destination)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Paradise -> Sports Complex & Stadium"
              value={routeCourse}
              onChange={(e) => setRouteCourse(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Departure Time
              </label>
              <input
                type="text"
                required
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              />
            </div>

            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Arrival Time
              </label>
              <input
                type="text"
                required
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Vehicle Identification
            </label>
            <input
              type="text"
              required
              value={busNo}
              onChange={(e) => setBusNo(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Driver Contact
            </label>
            <input
              type="text"
              required
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShuttleRide['status'])}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="On Time">On Time</option>
              <option value="Standby">Standby</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                  : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer"
            >
              Add Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 4. EDIT NOTICE BULLETIN MODAL */
interface EditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  onSaveNotice: (updatedNotice: Notice) => void;
  darkMode?: boolean;
}

export const EditNoticeModal: React.FC<EditNoticeModalProps> = ({
  isOpen,
  onClose,
  notice,
  onSaveNotice,
  darkMode = false,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<Notice['priority']>('High');
  const [target, setTarget] = useState('All Residents');

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setBody(notice.body);
      setPriority(notice.priority);
      setTarget(notice.target);
    }
  }, [notice]);

  if (!isOpen || !notice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onSaveNotice({
      ...notice,
      title: title.trim(),
      body: body.trim(),
      priority,
      target,
    });
    onClose();
  };

  return (
    <div
      id="edit-notice-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="edit-notice-modal-card"
        className={`max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <h3
            className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            <Edit3
              size={16}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            Edit Notice #{notice.id}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Bulletin Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Notice['priority'])}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                className={`text-[10px] uppercase block mb-1 font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Target Audience
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                <option value="All Residents">All Residents</option>
                <option value="Wing North & South">Wing North & South</option>
                <option value="Wing East & West">Wing East & West</option>
                <option value="Floor 3 Residents">Floor 3 Residents</option>
                <option value="Delinquent Accounts">Delinquent Accounts</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Notice Body Content
            </label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                  : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 5. EDIT MESS MEAL MODAL */
interface EditMessMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string;
  mealType: string;
  initialItems: string;
  onSaveMeal: (day: string, mealType: string, newItems: string) => void;
  darkMode?: boolean;
}

export const EditMessMealModal: React.FC<EditMessMealModalProps> = ({
  isOpen,
  onClose,
  day,
  mealType,
  initialItems,
  onSaveMeal,
  darkMode = false,
}) => {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMeal(day, mealType, items.trim());
    onClose();
  };

  return (
    <div
      id="edit-meal-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="edit-meal-modal-card"
        className={`max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <h3
            className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            <Utensils
              size={16}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            Update {day} · {mealType}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Menu Items & Offerings
            </label>
            <textarea
              required
              rows={4}
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g. Aloo Paratha, Curd, Pickle, Seasonal Fruit, Tea/Coffee"
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                  : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer"
            >
              Update Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 6. ADD RESIDENT MODAL */
interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onAddResident: (studentName: string, roomNumber: string) => void;
  darkMode?: boolean;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onAddResident,
  darkMode = false,
}) => {
  const availableRooms = rooms.filter((r) => r.free > 0);
  const [studentName, setStudentName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(
    availableRooms[0]?.number || ''
  );

  useEffect(() => {
    if (availableRooms.length > 0 && !selectedRoomNumber) {
      setSelectedRoomNumber(availableRooms[0].number);
    }
  }, [availableRooms, selectedRoomNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !selectedRoomNumber) return;
    onAddResident(studentName.trim(), selectedRoomNumber);
    setStudentName('');
    onClose();
  };

  return (
    <div
      id="add-resident-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="add-resident-modal-card"
        className={`max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs border ${
          darkMode
            ? 'bg-[#181411] border-[#c8935c]/50 text-[#ede8e1] shadow-black/80'
            : 'bg-[#fbf9f5] border-[#ded4c5] text-stone-900 shadow-stone-400/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center border-b pb-3 ${
            darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
          }`}
        >
          <h3
            className={`text-sm font-bold uppercase flex items-center gap-2 font-sans tracking-wide ${
              darkMode ? 'text-[#fbf9f5]' : 'text-stone-900'
            }`}
          >
            <UserPlus
              size={15}
              className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
            />
            Register & Allocate Resident
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              darkMode
                ? 'text-[#a39e93] hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Student Full Name
            </label>
            <input
              id="new-student-name"
              type="text"
              required
              placeholder="e.g. Yashvardhan Singh"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                  : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
              }`}
            />
          </div>

          <div>
            <label
              className={`text-[10px] uppercase block mb-1 font-bold ${
                darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
              }`}
            >
              Available Target Room
            </label>
            {availableRooms.length > 0 ? (
              <select
                id="select-target-room"
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${
                  darkMode
                    ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                    : 'bg-white border-[#dfd3c3] text-stone-900 focus:border-[#824f1c]'
                }`}
              >
                {availableRooms.map((r) => (
                  <option key={r.number} value={r.number}>
                    Room {r.number} · {r.floor} ({r.free} Free Bed Slots)
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-500 font-bold">
                Hostel is fully booked. No available beds.
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border font-bold cursor-pointer ${
                darkMode
                  ? 'border-[#382e25] text-[#a39e93] hover:text-white'
                  : 'border-[#dfd3c3] text-stone-700 hover:text-stone-900'
              }`}
            >
              Cancel
            </button>
            <button
              id="confirm-allocation-btn"
              type="submit"
              disabled={availableRooms.length === 0}
              className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer"
            >
              Confirm Bed Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
