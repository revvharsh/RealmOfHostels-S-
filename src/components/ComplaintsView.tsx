import React, { useState } from 'react';
import {
  Send,
  CheckCircle,
  Clock,
  Plus,
  Search,
  AlertCircle,
  Mail,
  MailCheck,
  Check,
  X,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  FileText,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

interface ComplaintsViewProps {
  tickets: Ticket[];
  activeTicketId: string;
  setActiveTicketId: (id: string) => void;
  onSendConfirmation: (ticketId: string, resolutionNote: string) => void;
  onStudentApprove: (ticketId: string, feedback?: string) => void;
  onStudentReject: (ticketId: string, feedback: string) => void;
  onSetInProgress?: (ticketId: string) => void;
  onResolveTicket?: (ticketId: string, resolutionNote: string) => void;
  onOpenNewTicket?: () => void;
  darkMode: boolean;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  tickets,
  activeTicketId,
  setActiveTicketId,
  onSendConfirmation,
  onStudentApprove,
  onStudentReject,
  onSetInProgress,
  onResolveTicket,
  onOpenNewTicket,
  darkMode,
}) => {
  const [ticketTab, setTicketTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resolutionText, setResolutionText] = useState<string>('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [studentComment, setStudentComment] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  const filteredTickets = tickets
    .filter((t) => (ticketTab === 'All' ? true : t.status === ticketTab))
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.student.toLowerCase().includes(q) ||
        t.room.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });

  const activeTicket =
    filteredTickets.find((t) => t.id === activeTicketId) ||
    tickets.find((t) => t.id === activeTicketId) ||
    filteredTickets[0] ||
    tickets[0];

  const studentEmail =
    activeTicket?.email ||
    `${activeTicket?.student?.toLowerCase().replace(/\s+/g, '.') || 'student'}@royalparadise.edu`;

  // Dispatches email to student for confirmation
  const handleDispatchConfirmation = () => {
    if (!activeTicket) return;
    const note =
      resolutionText.trim() ||
      activeTicket.resolutionNote ||
      'Maintenance technician has inspected and serviced the reported issue. Equipment tested and operational.';

    setIsDispatching(true);
    setTimeout(() => {
      onSendConfirmation(activeTicket.id, note);
      setIsDispatching(false);
      setResolutionText('');
      // Automatically open the resident email simulation modal so user can immediately test approval
      setIsEmailModalOpen(true);
    }, 450);
  };

  const handleApproveAsStudent = () => {
    if (!activeTicket) return;
    onStudentApprove(
      activeTicket.id,
      studentComment.trim() || 'Work verified and approved by resident.'
    );
    setStudentComment('');
    setIsEmailModalOpen(false);
  };

  const handleRejectAsStudent = () => {
    if (!activeTicket) return;
    onStudentReject(
      activeTicket.id,
      studentComment.trim() || 'Issue still persists upon room inspection.'
    );
    setStudentComment('');
    setIsEmailModalOpen(false);
  };

  const setTemplateNote = (note: string) => {
    setResolutionText(note);
  };

  return (
    <div id="complaints-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
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
            Helpdesk Operations · Verification Workflow
          </span>
          <h2
            id="complaints-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Complaints & Maintenance Desk
          </h2>
        </div>

        {/* Action button: Log New Ticket */}
        <div className="flex items-center gap-3">
          {onOpenNewTicket && (
            <button
              id="new-ticket-btn"
              onClick={onOpenNewTicket}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer transition-all"
            >
              <Plus size={15} />
              New Ticket
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status filter tabs */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border font-mono text-xs overflow-x-auto ${
            darkMode ? 'border-[#382e25] bg-[#14110e]' : 'border-[#dfd3c3] bg-white'
          }`}
        >
          {(
            [
              'All',
              'Pending',
              'In-Progress',
              'Awaiting Approval',
              'Resolved',
            ] as const
          ).map((tab) => {
            const count =
              tab === 'All'
                ? tickets.length
                : tickets.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                id={`ticket-filter-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setTicketTab(tab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  ticketTab === tab
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#c8935c] text-white font-bold shadow-xs'
                    : darkMode
                    ? 'text-[#a39e93] hover:text-[#fbf9f5]'
                    : 'text-[#695747] hover:text-stone-900'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-full md:w-72 text-xs font-mono ${
            darkMode
              ? 'border-[#382e25] bg-[#14110e] text-[#ede8e1]'
              : 'border-[#dfd3c3] bg-white text-stone-900'
          }`}
        >
          <Search
            size={14}
            className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'}
          />
          <input
            type="text"
            placeholder="Search tickets, rooms, residents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder:text-stone-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket Drawer / List */}
        <div
          id="tickets-drawer"
          className={`lg:col-span-5 rounded-2xl border overflow-hidden flex flex-col ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <div
            className={`p-3.5 border-b flex justify-between items-center text-xs font-mono ${
              darkMode ? 'border-[#382e25] bg-[#14110e]' : 'border-[#ded4c5] bg-[#fcfaf7]'
            }`}
          >
            <span
              className={`font-bold ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              Tickets Queue ({filteredTickets.length})
            </span>
            <span className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'}>
              Verification Ledger
            </span>
          </div>

          <div
            className={`divide-y max-h-[620px] overflow-y-auto ${
              darkMode ? 'divide-[#382e25]' : 'divide-[#ded4c5]'
            }`}
          >
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-stone-400">
                No tickets match current filters.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSel = t.id === activeTicket?.id;
                return (
                  <div
                    key={t.id}
                    id={`ticket-item-${t.id}`}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSel
                        ? darkMode
                          ? 'bg-[#c8935c]/15 border-l-4 border-[#f2ca50]'
                          : 'bg-[#f8ede3] border-l-4 border-[#824f1c]'
                        : darkMode
                        ? 'hover:bg-[#201b17] border-l-4 border-transparent'
                        : 'hover:bg-[#fbf9f5] border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span
                        className={`font-bold ${
                          darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                        }`}
                      >
                        {t.id}
                      </span>
                      <span
                        className={`text-[10px] flex items-center gap-1 ${
                          darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                        }`}
                      >
                        <Clock size={11} /> {t.timestamp}
                      </span>
                    </div>

                    <h4
                      className={`text-xs font-semibold mt-1 line-clamp-1 ${
                        darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                      }`}
                    >
                      {t.subject}
                    </h4>

                    <div
                      className={`mt-2 flex items-center justify-between text-[11px] font-mono ${
                        darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                      }`}
                    >
                      <span className="truncate max-w-[180px]">
                        Room {t.room} · {t.student}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold flex items-center gap-1 ${
                          t.status === 'Pending'
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                            : t.status === 'In-Progress'
                            ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600'
                            : t.status === 'Awaiting Approval'
                            ? 'border-purple-500/40 bg-purple-500/15 text-purple-600 dark:text-purple-400 animate-pulse'
                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {t.status === 'Awaiting Approval' && <Mail size={10} />}
                        {t.status === 'Resolved' && <CheckCircle size={10} />}
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Ticket Detail & Resolution Console */}
        {activeTicket ? (
          <div
            id="ticket-detail-panel"
            className={`lg:col-span-7 rounded-2xl border p-6 space-y-6 ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613]'
                : 'border-[#ded4c5] bg-white shadow-xs'
            }`}
          >
            {/* Header info */}
            <div
              className={`border-b pb-4 ${
                darkMode ? 'border-[#382e25]' : 'border-[#ded4c5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-[#c8935c] text-white px-2.5 py-0.5 rounded font-black">
                    {activeTicket.id}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                    }`}
                  >
                    Room: <strong>{activeTicket.room}</strong>
                  </span>
                </div>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded border uppercase font-bold flex items-center gap-1.5 ${
                    activeTicket.status === 'Pending'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                      : activeTicket.status === 'In-Progress'
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600'
                      : activeTicket.status === 'Awaiting Approval'
                      ? 'border-purple-500/40 bg-purple-500/15 text-purple-600 dark:text-purple-400'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {activeTicket.status === 'Awaiting Approval' && <Mail size={12} />}
                  {activeTicket.status === 'Resolved' && <CheckCircle size={12} />}
                  {activeTicket.status}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mt-3 ${
                  darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                }`}
              >
                {activeTicket.subject}
              </h3>

              <div
                className={`flex flex-wrap gap-4 text-xs font-mono mt-2.5 ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                <div>
                  Resident:{' '}
                  <strong
                    className={darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'}
                  >
                    {activeTicket.student}
                  </strong>
                </div>
                <div>
                  Email:{' '}
                  <span className="text-[#c8935c] font-semibold underline underline-offset-2">
                    {studentEmail}
                  </span>
                </div>
                <div>
                  Category:{' '}
                  <strong
                    className={darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'}
                  >
                    {activeTicket.category}
                  </strong>
                </div>
                <div>
                  Urgency:{' '}
                  <span
                    className={`font-bold ${
                      activeTicket.urgency === 'High'
                        ? 'text-rose-500'
                        : activeTicket.urgency === 'Medium'
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {activeTicket.urgency}
                  </span>
                </div>
              </div>
            </div>

            {/* Lifecycle Stepper */}
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono ${
                darkMode
                  ? 'border-[#382e25] bg-[#120f0d]'
                  : 'border-[#ded4c5] bg-[#fcfaf7]'
              }`}
            >
              <div className="text-[10px] uppercase tracking-widest font-bold mb-2.5 text-[#a39e93]">
                Four-Stage Resolution Protocol
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                  className={`p-2 rounded-lg border flex flex-col gap-1 ${
                    darkMode
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-500/30 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  <span className="text-[10px] font-bold flex items-center gap-1">
                    <Check size={12} /> 1. Logged
                  </span>
                  <span className="text-[11px] truncate opacity-90">
                    {activeTicket.student}
                  </span>
                </div>

                <div
                  className={`p-2 rounded-lg border flex flex-col gap-1 ${
                    activeTicket.status === 'Pending'
                      ? darkMode
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                        : 'border-amber-500/40 bg-amber-50 text-amber-800'
                      : darkMode
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-500/30 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  <span className="text-[10px] font-bold flex items-center gap-1">
                    {activeTicket.status === 'Pending' ? (
                      <Clock size={12} />
                    ) : (
                      <Check size={12} />
                    )}{' '}
                    2. Technician
                  </span>
                  <span className="text-[11px] truncate opacity-90">
                    {activeTicket.status === 'Pending' ? 'Pending' : 'Completed'}
                  </span>
                </div>

                <div
                  className={`p-2 rounded-lg border flex flex-col gap-1 ${
                    activeTicket.status === 'Pending'
                      ? 'opacity-40 border-stone-300 dark:border-stone-800'
                      : activeTicket.status === 'In-Progress'
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : activeTicket.status === 'Awaiting Approval'
                      ? 'border-purple-500/50 bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  <span className="text-[10px] font-bold flex items-center gap-1">
                    {activeTicket.status === 'Resolved' ? (
                      <Check size={12} />
                    ) : (
                      <Mail size={12} />
                    )}{' '}
                    3. Student Mail
                  </span>
                  <span className="text-[11px] truncate opacity-90">
                    {activeTicket.status === 'Awaiting Approval'
                      ? 'Dispatched'
                      : activeTicket.status === 'Resolved'
                      ? 'Sent'
                      : 'Queued'}
                  </span>
                </div>

                <div
                  className={`p-2 rounded-lg border flex flex-col gap-1 ${
                    activeTicket.status === 'Resolved'
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold'
                      : 'opacity-40 border-stone-300 dark:border-stone-800'
                  }`}
                >
                  <span className="text-[10px] font-bold flex items-center gap-1">
                    {activeTicket.status === 'Resolved' ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}{' '}
                    4. Resident Sign-off
                  </span>
                  <span className="text-[11px] truncate opacity-90">
                    {activeTicket.status === 'Resolved' ? 'Verified' : 'Required'}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-2">
              <label
                className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                  darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                }`}
              >
                Resident Incident Description
              </label>
              <div
                className={`p-4 rounded-xl border font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                  darkMode
                    ? 'border-[#382e25] bg-[#120f0d] text-[#ede8e1]'
                    : 'border-[#dfd3c3] bg-[#fcfaf7] text-stone-900'
                }`}
              >
                {activeTicket.desc}
              </div>
            </div>

            {/* INTERACTIVE WORKFLOW SECTION */}

            {/* STATE 1 & 2: PENDING OR IN-PROGRESS */}
            {(activeTicket.status === 'Pending' ||
              activeTicket.status === 'In-Progress') && (
              <div
                className={`border-t pt-4 space-y-4 ${
                  darkMode ? 'border-[#382e25]' : 'border-[#ded4c5]'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4
                      className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                        darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                      }`}
                    >
                      <Wrench
                        size={14}
                        className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
                      />
                      Technician Resolution & Student Notification
                    </h4>
                    <p
                      className={`text-[11px] font-mono mt-0.5 ${
                        darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                      }`}
                    >
                      Document the repair. A confirmation email will be sent to{' '}
                      <strong>{studentEmail}</strong> for resident verification.
                    </p>
                  </div>

                  {activeTicket.status === 'Pending' && onSetInProgress && (
                    <button
                      onClick={() => onSetInProgress(activeTicket.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all ${
                        darkMode
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                          : 'border-cyan-500/40 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                      }`}
                    >
                      Assign / Mark In-Progress
                    </button>
                  )}
                </div>

                {/* Quick resolution template pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Quick logs:
                  </span>
                  {[
                    'Tested wiring and replaced capacitor; verified operating current.',
                    'Intake valve descaled and re-gasketed; water flow nominal at 2.5 bar.',
                    'Hydraulic piston lubricated & calibrated; level tested.',
                    'Wi-Fi channel tuned to 5GHz & antenna re-seated.',
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTemplateNote(tpl)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer truncate max-w-[200px] ${
                        darkMode
                          ? 'border-[#382e25] bg-[#120f0d] text-[#ede8e1] hover:border-[#c8935c]'
                          : 'border-[#dfd3c3] bg-white text-[#695747] hover:border-[#824f1c]'
                      }`}
                      title={tpl}
                    >
                      + {tpl}
                    </button>
                  ))}
                </div>

                <textarea
                  id="ticket-resolution-input"
                  rows={3}
                  placeholder={`Document technician resolution details to be sent to ${activeTicket.student}...`}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className={`w-full p-3 text-xs font-mono rounded-xl focus:outline-none ${
                    darkMode
                      ? 'bg-[#120f0d] border border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                      : 'bg-[#fcfaf7] border border-[#ded4c5] text-stone-900 focus:border-[#824f1c]'
                  }`}
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span
                    className={`text-[11px] font-mono flex items-center gap-1.5 ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    <Mail size={13} className="text-[#c8935c]" />
                    Recipient: <strong>{studentEmail}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {onResolveTicket && (
                      <button
                        id="admin-override-resolve-btn"
                        onClick={() =>
                          onResolveTicket(
                            activeTicket.id,
                            resolutionText || 'Direct admin resolution'
                          )
                        }
                        title="Admin direct resolve without student sign-off"
                        className={`text-[11px] font-mono px-3 py-2 rounded-xl border hover:underline cursor-pointer ${
                          darkMode
                            ? 'border-stone-800 text-stone-400 hover:text-stone-200'
                            : 'border-stone-300 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Admin Force Close
                      </button>
                    )}

                    <button
                      id="submit-resolution-btn"
                      disabled={isDispatching}
                      onClick={handleDispatchConfirmation}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white font-bold text-xs font-mono rounded-xl hover:brightness-110 uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isDispatching ? (
                        <>
                          <Clock size={14} className="animate-spin" />
                          Sending Email...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Send Confirmation to Student Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: AWAITING APPROVAL */}
            {activeTicket.status === 'Awaiting Approval' && (
              <div
                className={`p-5 rounded-xl border space-y-4 ${
                  darkMode
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : 'border-purple-300 bg-purple-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 shrink-0">
                      <MailCheck size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                          Confirmation Email Dispatched
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                          Awaiting Student Sign-off
                        </span>
                      </div>
                      <p
                        className={`text-xs font-mono mt-1 ${
                          darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                        }`}
                      >
                        Resolution notice sent to <strong>{studentEmail}</strong>{' '}
                        ({activeTicket.resolutionDispatchedAt || 'Today'}).
                      </p>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                        As per hostel accountability protocol, the ticket will
                        only show as <strong>RESOLVED</strong> once{' '}
                        <strong>{activeTicket.student}</strong> verifies the fix.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technician resolution log quote */}
                {activeTicket.resolutionNote && (
                  <div
                    className={`p-3 rounded-lg border font-mono text-xs ${
                      darkMode
                        ? 'border-purple-500/30 bg-[#120f0d] text-[#ede8e1]'
                        : 'border-purple-200 bg-white text-[#1c1917]'
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase font-bold mb-1 ${
                        darkMode ? 'text-purple-300' : 'text-purple-800'
                      }`}
                    >
                      Dispatched Technician Work Log:
                    </div>
                    {activeTicket.resolutionNote}
                  </div>
                )}

                {/* Interactive buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-purple-500/20">
                  <span
                    className={`text-[11px] font-mono font-semibold flex items-center gap-1.5 ${
                      darkMode ? 'text-purple-300' : 'text-purple-800'
                    }`}
                  >
                    <Sparkles size={13} />
                    Resident can verify via webmail or mobile portal
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      id="open-student-email-btn"
                      onClick={() => setIsEmailModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer transition-all"
                    >
                      <ExternalLink size={14} />
                      Open Student Email Sign-off
                    </button>

                    <button
                      id="quick-approve-btn"
                      onClick={handleApproveAsStudent}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                        darkMode
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title="Simulate student 1-click confirmation"
                    >
                      <CheckCircle size={14} />
                      Approve as Student
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 4: RESOLVED */}
            {activeTicket.status === 'Resolved' && (
              <div
                className={`p-5 rounded-xl border space-y-4 font-mono text-xs ${
                  darkMode
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-emerald-300 bg-emerald-50/70'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-sm ${
                          darkMode ? 'text-emerald-400' : 'text-emerald-800'
                        }`}
                      >
                        Officially Verified & Resolved
                      </h4>
                      <p
                        className={`text-[11px] ${
                          darkMode ? 'text-[#ede8e1]' : 'text-[#1c1917]'
                        }`}
                      >
                        Signed off by resident{' '}
                        <strong>{activeTicket.student}</strong> (
                        {activeTicket.studentApprovedAt || 'Recorded'})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                      darkMode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    Verification Seal #RP-V{activeTicket.id.slice(4)}
                  </span>
                </div>

                {/* Resolution and feedback history */}
                <div
                  className={`p-3.5 rounded-lg border space-y-2 ${
                    darkMode
                      ? 'border-emerald-500/30 bg-[#120f0d] text-[#ede8e1]'
                      : 'border-emerald-200 bg-white text-[#1c1917]'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                      }`}
                    >
                      Technician Work:
                    </span>
                    <p className="mt-0.5 font-medium">
                      {activeTicket.resolutionNote ||
                        'Serviced by Warden Desk technician.'}
                    </p>
                  </div>

                  {activeTicket.studentFeedback && (
                    <div
                      className={`pt-2 border-t border-dashed ${
                        darkMode ? 'border-[#2d241c]' : 'border-stone-200'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          darkMode ? 'text-emerald-400' : 'text-emerald-800'
                        }`}
                      >
                        Resident Feedback / Sign-off Remark:
                      </span>
                      <p
                        className={`mt-0.5 italic font-medium ${
                          darkMode ? 'text-[#ede8e1]' : 'text-[#1c1917]'
                        }`}
                      >
                        "{activeTicket.studentFeedback}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Reopen option if issue recurs */}
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[10px] ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Audit stamp: verified via student email authentication
                  </span>
                  <button
                    onClick={() => {
                      onStudentReject(
                        activeTicket.id,
                        'Issue recurred after inspection.'
                      );
                    }}
                    className={`text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border hover:underline cursor-pointer ${
                      darkMode
                        ? 'border-[#382e25] text-stone-400 hover:text-stone-200'
                        : 'border-[#dfd3c3] text-stone-700 hover:text-stone-950 font-medium'
                    }`}
                  >
                    <RotateCcw size={12} />
                    Re-open if Recurred
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`lg:col-span-7 rounded-2xl border p-12 text-center text-sm font-mono ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613] text-[#a39e93]'
                : 'border-[#ded4c5] bg-white text-[#695747]'
            }`}
          >
            Select a ticket from the queue to view diagnostics or dispatch
            student resolution confirmation.
          </div>
        )}
      </div>

      {/* STUDENT EMAIL CONFIRMATION MODAL (INTERACTIVE RESIDENT SIMULATOR) */}
      {isEmailModalOpen && activeTicket && (
        <div
          id="student-email-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col font-mono animate-in fade-in zoom-in-95 duration-150 ${
              darkMode
                ? 'border-[#382e25] bg-[#16120f] text-[#fbf9f5]'
                : 'border-[#dfd3c3] bg-white text-[#1c1917]'
            }`}
          >
            {/* Email Client Top Bar */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between ${
                darkMode
                  ? 'border-[#382e25] bg-[#120f0d]'
                  : 'border-[#dfd3c3] bg-[#f7f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span
                  className={`text-xs font-bold ml-2 ${
                    darkMode ? 'text-[#c8935c]' : 'text-[#824f1c]'
                  }`}
                >
                  Royal Paradise Student Webmail
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    darkMode
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Simulated Resident Inbox
                </span>
              </div>

              <button
                onClick={() => setIsEmailModalOpen(false)}
                className={`p-1 rounded-lg cursor-pointer ${
                  darkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Email Meta Envelope Header */}
            <div
              className={`p-4 border-b space-y-1.5 text-xs ${
                darkMode
                  ? 'border-[#382e25] bg-[#1a1613]'
                  : 'border-[#ded4c5] bg-[#faf8f5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    darkMode
                      ? 'text-stone-400 text-[11px]'
                      : 'text-stone-600 text-[11px] font-bold'
                  }
                >
                  From:
                </span>
                <span
                  className={`font-semibold truncate ${
                    darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                  }`}
                >
                  Warden Office &lt;warden.office@royalparadise.edu&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={
                    darkMode
                      ? 'text-stone-400 text-[11px]'
                      : 'text-stone-600 text-[11px] font-bold'
                  }
                >
                  To:
                </span>
                <span
                  className={`font-semibold truncate ${
                    darkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  {activeTicket.student} &lt;{studentEmail}&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={
                    darkMode
                      ? 'text-stone-400 text-[11px]'
                      : 'text-stone-600 text-[11px] font-bold'
                  }
                >
                  Subject:
                </span>
                <span
                  className={`font-bold truncate ${
                    darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                  }`}
                >
                  Action Required: Confirm Maintenance for Ticket #{activeTicket.id}{' '}
                  (Room {activeTicket.room})
                </span>
              </div>
              <div
                className={`flex items-center justify-between text-[11px] pt-1 ${
                  darkMode ? 'text-stone-400' : 'text-stone-600 font-medium'
                }`}
              >
                <span>
                  Date:{' '}
                  {activeTicket.resolutionDispatchedAt || 'Today, Just now'}
                </span>
                <span
                  className={
                    darkMode
                      ? 'text-amber-400 font-bold'
                      : 'text-amber-800 font-bold'
                  }
                >
                  Priority: High (Action Pending)
                </span>
              </div>
            </div>

            {/* Email Letter Body */}
            <div
              className={`p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs leading-relaxed ${
                darkMode ? 'text-[#ede8e1]' : 'text-[#1c1917]'
              }`}
            >
              <p>
                Dear{' '}
                <strong
                  className={darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'}
                >
                  {activeTicket.student}
                </strong>
                ,
              </p>

              <p
                className={
                  darkMode ? 'text-[#ede8e1]' : 'text-[#292524] font-medium'
                }
              >
                Our maintenance technician has completed repair work for the
                complaint you logged for <strong>Room {activeTicket.room}</strong>.
              </p>

              {/* Maintenance Summary Box */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  darkMode
                    ? 'border-[#382e25] bg-[#120f0d]'
                    : 'border-[#ded4c5] bg-[#fcfaf7]'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-[11px] font-bold pb-2 border-b ${
                    darkMode ? 'border-[#2d241c]' : 'border-[#ded4c5]'
                  }`}
                >
                  <span
                    className={
                      darkMode
                        ? 'text-[#f2ca50]'
                        : 'text-[#824f1c] font-black text-xs'
                    }
                  >
                    Ticket #{activeTicket.id}
                  </span>
                  <span
                    className={
                      darkMode
                        ? 'text-[#ede8e1]'
                        : 'text-stone-900 font-bold text-xs'
                    }
                  >
                    Category: {activeTicket.category}
                  </span>
                </div>
                <div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Your Reported Issue:
                  </span>
                  <p
                    className={`font-bold mt-0.5 text-xs ${
                      darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                    }`}
                  >
                    {activeTicket.subject}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider ${
                      darkMode
                        ? 'text-[#f2ca50]'
                        : 'text-[#824f1c] font-black text-[11px]'
                    }`}
                  >
                    Technician Resolution Report:
                  </span>
                  <p
                    className={`mt-1 whitespace-pre-wrap p-3.5 rounded-xl border text-xs font-mono font-semibold leading-relaxed ${
                      darkMode
                        ? 'bg-[#120f0d] border-[#382e25] text-[#fbf9f5]'
                        : 'bg-white border-[#ded4c5] text-[#1c1917] shadow-xs'
                    }`}
                  >
                    {activeTicket.resolutionNote ||
                      'Work has been completed and verified by duty supervisor.'}
                  </p>
                </div>
              </div>

              {/* Verification Notice */}
              <div
                className={`p-3.5 rounded-xl border text-[11px] flex items-start gap-2.5 leading-relaxed ${
                  darkMode
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                    : 'border-amber-600/40 bg-amber-50/90 text-amber-950 font-medium'
                }`}
              >
                <AlertCircle
                  size={16}
                  className={`shrink-0 mt-0.5 ${
                    darkMode ? 'text-amber-400' : 'text-amber-700'
                  }`}
                />
                <span>
                  Please inspect your room before approving. If you click{' '}
                  <strong>Approve Resolution</strong>, this ticket will be
                  officially closed as <strong>Resolved</strong> on the hostel
                  dashboard. If the issue is not resolved, please click{' '}
                  <strong>Reject</strong>.
                </span>
              </div>

              {/* Student Comment Field */}
              <div className="space-y-1.5 pt-2">
                <label
                  className={`text-[11px] font-bold ${
                    darkMode ? 'text-[#ede8e1]' : 'text-stone-900'
                  }`}
                >
                  Your Remarks / Room Feedback (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g., Checked and tested, working smoothly now! Thanks."
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-mono border focus:outline-none ${
                    darkMode
                      ? 'border-[#382e25] bg-[#120f0d] text-white placeholder:text-stone-500 focus:border-[#c8935c]'
                      : 'border-[#ded4c5] bg-white text-[#1c1917] placeholder:text-stone-400 focus:border-[#824f1c]'
                  }`}
                />
              </div>
            </div>

            {/* Email Action Decision Footer */}
            <div
              className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                darkMode ? 'border-[#382e25] bg-[#120f0d]' : 'border-[#dfd3c3] bg-[#f7f4ef]'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className={`text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer`}
              >
                Close simulation window
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  id="student-reject-btn"
                  onClick={handleRejectAsStudent}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  <AlertTriangle size={14} />
                  Reject · Issue Persists
                </button>

                <button
                  type="button"
                  id="student-approve-btn"
                  onClick={handleApproveAsStudent}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
                >
                  <CheckCircle size={14} />
                  Approve Resolution & Sign Off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
