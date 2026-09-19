import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  QrCode,
  Send,
  X,
  FileText,
  Check,
  AlertTriangle,
  Star,
  MessageSquare,
  ClipboardCheck,
  UserCheck,
  CheckSquare,
  Square,
  RotateCcw,
  Shield,
  HelpCircle,
  Copy,
  Download,
  Zap,
} from 'lucide-react';
import { Ticket, TicketUrgency, TicketUpdate, ResolutionChecklistItem, InspectionReport } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface MaintenanceTabProps {
  tickets: Ticket[];
  onCreateTicket: (data: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => void;
  onUpdateTicket?: (ticketId: string, updatedFields: Partial<Ticket>) => void;
  onApproveTicket?: (ticketId: string, feedback?: string) => void;
  darkMode: boolean;
}

interface LeaveRequest {
  id: string;
  type: 'Day Outing' | 'Overnight';
  contact: string;
  destination: string;
  departure: string;
  expectedReturn: string;
  submittedAt: string;
  status: 'Approved' | 'Pending Warden Approval' | 'Completed';
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  tickets,
  onCreateTicket,
  onUpdateTicket,
  onApproveTicket,
  darkMode,
}) => {
  const { t, language } = useLanguage();
  // Subtab: 'tickets' | 'leave'
  const [subTab, setSubTab] = useState<'tickets' | 'leave'>('tickets');

  // New ticket modal
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [category, setCategory] = useState('Appliance / AC');
  const [urgency, setUrgency] = useState<TicketUrgency>('High');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [ticketNotice, setTicketNotice] = useState<string | null>(null);

  // Active ticket for inspection modal
  const [inspectionModalTicketId, setInspectionModalTicketId] = useState<string | null>(null);
  const [inspectionRating, setInspectionRating] = useState<number>(5);
  const [inspectionReview, setInspectionReview] = useState<string>(
    'Technician arrived, thoroughly inspected the AC drain line with vacuum pump, tested cooling at 22°C, and ensured workspace was clean.'
  );

  // Active ticket for adding resident update
  const [activeUpdateTicketId, setActiveUpdateTicketId] = useState<string | null>(null);
  const [newUpdateText, setNewUpdateText] = useState('');

  // Leave pass state
  const [leaveType, setLeaveType] = useState<'Day Outing' | 'Overnight'>('Day Outing');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 88099 00560');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('Today, 04:30 PM');
  const [returnDate, setReturnDate] = useState('Today, 09:15 PM');
  const [leaveNotice, setLeaveNotice] = useState<string | null>(null);
  const [activePassModal, setActivePassModal] = useState<LeaveRequest | null>(null);
  const [passTokenCopied, setPassTokenCopied] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'LV-8090',
      type: 'Day Outing',
      contact: '+91 88099 00560',
      destination: 'Central University Library & Book Depot',
      departure: 'Yesterday, 03:00 PM',
      expectedReturn: 'Yesterday, 08:00 PM',
      submittedAt: 'Yesterday, 02:45 PM',
      status: 'Completed',
    },
    {
      id: 'LV-8114',
      type: 'Day Outing',
      contact: '+91 88099 00560',
      destination: 'Sector 18 Market (Tech Hardware Procurement)',
      departure: '12 Sep, 05:00 PM',
      expectedReturn: '12 Sep, 08:30 PM',
      submittedAt: '12 Sep, 04:15 PM',
      status: 'Completed',
    },
  ]);

  // Filter tickets for Harsh / Room B-004
  const harshTickets = tickets.filter(
    (t) =>
      t.student.toLowerCase().includes('harsh') ||
      t.room.toLowerCase().includes('b-004') ||
      t.email?.toLowerCase().includes('harsh')
  );

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    onCreateTicket({
      student: 'Harsh',
      room: 'B-004',
      subject,
      category,
      desc: desc || 'Direct report logged from Student Command Portal.',
      urgency,
      email: 'upadhyayharshpritam@gmail.com',
      hostelId: 'RP-BLK',
    });

    setTicketNotice('Maintenance ticket logged successfully! Dispatched with tracking pipeline.');
    setIsNewTicketOpen(false);
    setSubject('');
    setDesc('');

    setTimeout(() => {
      setTicketNotice(null);
    }, 5000);
  };

  const handleToggleChecklistItem = (ticket: Ticket, itemId: string) => {
    const existingChecklist = ticket.resolutionChecklist || [
      { id: 'c1', label: 'Primary fault repaired by technician', verifiedByResident: false },
      { id: 'c2', label: 'Fixture tested and operating normally', verifiedByResident: false },
      { id: 'c3', label: 'Room B-004 study space clean and dry', verifiedByResident: false },
    ];

    const updatedChecklist = existingChecklist.map((item) =>
      item.id === itemId ? { ...item, verifiedByResident: !item.verifiedByResident } : item
    );

    if (onUpdateTicket) {
      onUpdateTicket(ticket.id, { resolutionChecklist: updatedChecklist });
    }
  };

  const handleReportMissedSlot = (ticket: Ticket) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const slotDesc = ticket.assignedSlot || '10:00 AM - 11:30 AM';

    const overdueUpdate: TicketUpdate = {
      id: `up-overdue-${Date.now()}`,
      sender: 'Resident',
      senderName: 'Harsh (Resident · Room B-004)',
      message: `OVERDUE ALERT: Assigned technician did not arrive during designated slot (${slotDesc}). Resident has been waiting in Room B-004. Urgent escalation dispatched to Chief Warden & Maintenance Supervisor.`,
      timestamp: `Today, ${timeStr}`,
      isOverdueAlert: true,
    };

    const adminResponse: TicketUpdate = {
      id: `up-admin-ack-${Date.now() + 1}`,
      sender: 'Admin',
      senderName: 'Facilities Maintenance Supervisor',
      message: `Notice Acknowledged: Senior Supervisor contacted technician Suresh Verma. Tech was delayed at Block A electrical panel and is en route to Room B-004 immediately.`,
      timestamp: `Today, ${timeStr}`,
    };

    const existingUpdates = ticket.updates || [];
    const updated = [overdueUpdate, adminResponse, ...existingUpdates];

    if (onUpdateTicket) {
      onUpdateTicket(ticket.id, {
        updates: updated,
        hasMissedSlotAlert: true,
      });
    }

    setTicketNotice(`Overdue slot alert raised for ${ticket.id}! Supervisor & Warden escalated.`);
    setTimeout(() => setTicketNotice(null), 5000);
  };

  const handleAddResidentUpdate = (ticketId: string) => {
    if (!newUpdateText.trim()) return;
    const ticket = harshTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUpdate: TicketUpdate = {
      id: `up-${Date.now()}`,
      sender: 'Resident',
      senderName: 'Harsh (Resident)',
      message: newUpdateText.trim(),
      timestamp: `Today, ${timeStr}`,
    };

    const existingUpdates = ticket.updates || [];
    if (onUpdateTicket) {
      onUpdateTicket(ticketId, { updates: [newUpdate, ...existingUpdates] });
    }

    setNewUpdateText('');
    setActiveUpdateTicketId(null);
    setTicketNotice(`Update posted to ticket #${ticketId}!`);
    setTimeout(() => setTicketNotice(null), 4000);
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionModalTicketId) return;

    const ticket = harshTickets.find((t) => t.id === inspectionModalTicketId);
    if (!ticket) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const inspectionData: InspectionReport = {
      isDone: true,
      inspectedAt: `Today, ${timeStr}`,
      inspectorName: ticket.assignedTechnician || 'Suresh Verma (Sr. HVAC Tech)',
      residentRating: inspectionRating,
      residentReview: inspectionReview,
      submittedForAdminPortal: true,
    };

    const inspectionUpdate: TicketUpdate = {
      id: `up-insp-${Date.now()}`,
      sender: 'Resident',
      senderName: 'Harsh (Inspection Reviewer)',
      message: `Inspection Completed & Rated (${inspectionRating}/5 ★): "${inspectionReview}". Report transmitted to Admin Quality Assurance Portal.`,
      timestamp: `Today, ${timeStr}`,
    };

    const existingUpdates = ticket.updates || [];

    if (onUpdateTicket) {
      onUpdateTicket(ticket.id, {
        inspection: inspectionData,
        updates: [inspectionUpdate, ...existingUpdates],
        status: ticket.status === 'Pending' ? 'In-Progress' : ticket.status,
      });
    }

    setInspectionModalTicketId(null);
    setTicketNotice(`Inspection status updated & review sent to Admin Portal for #${ticket.id}!`);
    setTimeout(() => setTicketNotice(null), 5000);
  };

  const handleResolveTicket = (ticket: Ticket) => {
    const checklist = ticket.resolutionChecklist || [];
    const allChecked = checklist.length > 0 && checklist.every((c) => c.verifiedByResident);

    if (!allChecked && checklist.length > 0) {
      setTicketNotice('Cannot resolve yet: Please verify and select all items in the Admin Resolution Checklist first.');
      setTimeout(() => setTicketNotice(null), 5000);
      return;
    }

    if (onApproveTicket) {
      onApproveTicket(ticket.id, 'Resident Harsh signed off all resolution checklist items. Work verified clean & functional.');
    } else if (onUpdateTicket) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      onUpdateTicket(ticket.id, {
        status: 'Resolved',
        studentApprovedAt: `Today, ${timeStr}`,
        studentFeedback: 'Resident Harsh signed off all resolution checklist items. Work verified clean & functional.',
      });
    }

    setTicketNotice(`Complaint #${ticket.id} officially Resolved & Signed-Off!`);
    setTimeout(() => setTicketNotice(null), 5000);
  };

  const handleCreateLeaveSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalDest = destination.trim() || (language === 'hi' ? 'मार्केट व लोकल काम' : 'Market & Local Errand');

    const newPass: LeaveRequest = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      type: leaveType,
      contact: emergencyPhone,
      destination: finalDest,
      departure: departureDate || 'Today, 04:30 PM',
      expectedReturn: returnDate || 'Today, 09:30 PM',
      submittedAt: 'Just now',
      status: 'Approved',
    };

    setLeaveRequests([newPass, ...leaveRequests]);
    setLeaveNotice(`Gate Pass #${newPass.id} Generated! Validated for main security turnstile.`);
    setDestination('');
    setActivePassModal(newPass); // Immediately open turnstile QR modal!

    setTimeout(() => {
      setLeaveNotice(null);
    }, 5000);
  };

  const handleQuickOutingPass = () => {
    const newPass: LeaveRequest = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Day Outing',
      contact: emergencyPhone,
      destination: language === 'hi' ? 'मार्केट व डिनर (कर्फ्यू से पहले)' : 'Market & Dinner (Pre-curfew)',
      departure: language === 'hi' ? 'तत्काल प्रस्थान' : 'Immediate Exit',
      expectedReturn: language === 'hi' ? 'आज रात 10:00 बजे तक' : 'Today, 10:00 PM',
      submittedAt: 'Just now',
      status: 'Approved',
    };

    setLeaveRequests([newPass, ...leaveRequests]);
    setLeaveNotice(`Gate Pass #${newPass.id} Generated!`);
    setActivePassModal(newPass); // Open QR pass right away!
    setTimeout(() => setLeaveNotice(null), 5000);
  };

  return (
    <div id="maintenance-tab-content" className="space-y-6">
      {/* Toast notifications */}
      {ticketNotice && (
        <div className="p-3.5 rounded-xl border border-[#CEEAD6] bg-[#E6F4EA] text-[#137333] font-mono text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{ticketNotice}</span>
          </div>
          <button onClick={() => setTicketNotice(null)} className="p-1 hover:bg-black/5 rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {leaveNotice && (
        <div className="p-3.5 rounded-xl border border-[#CEEAD6] bg-[#E6F4EA] text-[#137333] font-mono text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <QrCode size={16} />
            <span>{leaveNotice}</span>
          </div>
          <button onClick={() => setLeaveNotice(null)} className="p-1 hover:bg-black/5 rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner & Subtab Selector */}
      <div
        id="maintenance-top-banner"
        className={`p-3.5 sm:p-5 rounded-xl border transition-all ${
          darkMode
            ? 'bg-[#141310] border-[#2B2720] shadow-md'
            : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C5828] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wrench size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#8C5828] dark:text-[#F2CA50] uppercase tracking-wider">
                  {t.navComplaints}
                </span>
                <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                  Room B-004 · Harsh
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5]">
                {t.complaintHeading}
              </h2>
            </div>
          </div>

          {/* Subtab Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] font-mono text-xs">
              <button
                onClick={() => setSubTab('tickets')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  subTab === 'tickets'
                    ? 'bg-[#8C5828] text-white shadow-xs'
                    : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
              >
                {t.complaintsSubTab} ({harshTickets.length})
              </button>
              <button
                onClick={() => setSubTab('leave')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  subTab === 'leave'
                    ? 'bg-[#8C5828] text-white shadow-xs'
                    : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
              >
                {t.gatePassSubTab} ({leaveRequests.length})
              </button>
            </div>

            {subTab === 'tickets' && (
              <button
                id="log-ticket-btn"
                onClick={() => setIsNewTicketOpen(true)}
                className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>{t.lodgeComplaintBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUBTAB 1: COMPLAINTS & TRACKING PIPELINE */}
      {subTab === 'tickets' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
              Active & Historic Complaints for Room B-004
            </h2>
            <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
              Resolution Gate: Admin Checklist Required for Sign-Off
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {harshTickets.map((ticket) => {
              const isResolved = ticket.status === 'Resolved';
              const isInspectionDone = ticket.inspection?.isDone ?? false;
              const hasMissedSlot = ticket.hasMissedSlotAlert ?? false;
              const checklist = ticket.resolutionChecklist || [
                { id: 'c1', label: 'Primary fault diagnosed and repaired by assigned technician', verifiedByResident: false },
                { id: 'c2', label: 'Hardware/appliance tested in operation and functional', verifiedByResident: false },
                { id: 'c3', label: 'Room B-004 work area left clean and hazard-free', verifiedByResident: false },
              ];
              const checkedCount = checklist.filter((c) => c.verifiedByResident).length;
              const allChecklistVerified = checklist.length > 0 && checkedCount === checklist.length;

              return (
                <div
                  key={ticket.id}
                  id={`ticket-card-${ticket.id}`}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isResolved
                      ? darkMode
                        ? 'bg-[#12110F] border-emerald-900/40 shadow-xs'
                        : 'bg-[#FAFCFA] border-emerald-300 shadow-xs'
                      : hasMissedSlot
                      ? darkMode
                        ? 'bg-[#1A1412] border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-[#FFFDF7] border-amber-400 ring-1 ring-amber-400/30'
                      : darkMode
                      ? 'bg-[#141310] border-[#2B2720]'
                      : 'bg-white border-[#DCD6CA] shadow-xs'
                  }`}
                >
                  {/* Top Metadata Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#8C5828] dark:text-[#F2CA50]">
                        {ticket.id}
                      </span>
                      <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                      <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                        {ticket.category}
                      </span>
                      <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                      <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                        {ticket.timestamp}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {hasMissedSlot && (
                        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={11} />
                          MISSED TIME SLOT
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase ${
                          ticket.urgency === 'High'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        Urgency: {ticket.urgency}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase border ${
                          isResolved
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3.5">
                    <h3 className="text-base sm:text-lg font-black font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs font-mono text-[#44403C] dark:text-[#D6D3CD] mt-1">
                      {ticket.desc}
                    </p>
                  </div>

                  {/* VISUAL APPROVAL & PROGRESS PIPELINE TRACKER */}
                  <div
                    id={`pipeline-tracker-${ticket.id}`}
                    className={`mt-4 p-4 rounded-xl border transition-all ${
                      darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50]">
                        Complaint Approval & Resolution Pipeline Tracker
                      </span>
                      <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                        {isResolved ? 'Status: 100% Completed' : 'Status: In Resolution Progress'}
                      </span>
                    </div>

                    {/* Step Tracker Bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                      {/* Step 1: Lodged */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                          darkMode ? 'bg-[#13110E] border-emerald-800/40 text-emerald-400' : 'bg-white border-emerald-300 text-emerald-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase">1. Lodged</span>
                          <Check size={13} className="text-emerald-500" />
                        </div>
                        <span className="text-[10px] text-[#57534E] dark:text-[#A39E93] mt-1">Received & Tagged</span>
                      </div>

                      {/* Step 2: Warden Approval */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                          ticket.wardenApproved !== false
                            ? darkMode ? 'bg-[#13110E] border-emerald-800/40 text-emerald-400' : 'bg-white border-emerald-300 text-emerald-700'
                            : 'bg-black/5 dark:bg-white/5 border-[#DCD6CA] dark:border-[#2B2720] text-[#57534E] opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase">2. Warden Approved</span>
                          {ticket.wardenApproved !== false ? <Check size={13} className="text-emerald-500" /> : <Clock size={13} />}
                        </div>
                        <span className="text-[10px] text-[#57534E] dark:text-[#A39E93] mt-1">Chief Warden Cleared</span>
                      </div>

                      {/* Step 3: Technician Inspection */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                          isInspectionDone
                            ? darkMode ? 'bg-[#13110E] border-emerald-800/40 text-emerald-400' : 'bg-white border-emerald-300 text-emerald-700'
                            : hasMissedSlot
                            ? 'bg-amber-500/15 border-amber-400 text-amber-700 dark:text-amber-300 animate-pulse'
                            : 'bg-black/5 dark:bg-white/5 border-[#DCD6CA] dark:border-[#2B2720] text-[#57534E]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase">3. Inspection</span>
                          {isInspectionDone ? (
                            <Check size={13} className="text-emerald-500" />
                          ) : hasMissedSlot ? (
                            <AlertTriangle size={13} className="text-amber-500" />
                          ) : (
                            <Clock size={13} />
                          )}
                        </div>
                        <span className="text-[10px] text-[#57534E] dark:text-[#A39E93] mt-1">
                          {isInspectionDone ? 'Inspected & Rated' : hasMissedSlot ? 'Overdue Alert' : 'Pending Visit'}
                        </span>
                      </div>

                      {/* Step 4: Resident Resolution Gate */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                          isResolved
                            ? darkMode ? 'bg-[#13110E] border-emerald-800/40 text-emerald-400' : 'bg-white border-emerald-300 text-emerald-700'
                            : allChecklistVerified
                            ? 'bg-blue-500/10 border-blue-400 text-blue-700 dark:text-blue-300'
                            : 'bg-black/5 dark:bg-white/5 border-[#DCD6CA] dark:border-[#2B2720] text-[#57534E]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase">4. Resident Sign-off</span>
                          {isResolved ? <Check size={13} className="text-emerald-500" /> : <ClipboardCheck size={13} />}
                        </div>
                        <span className="text-[10px] text-[#57534E] dark:text-[#A39E93] mt-1">
                          {isResolved ? 'Resolved & Closed' : `${checkedCount}/${checklist.length} Verified`}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Technician & Allocated Slot Details */}
                    <div className="mt-3 pt-2.5 border-t border-[#DCD6CA]/70 dark:border-[#2B2720]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <span>Technician: <strong className="text-[#1C1917] dark:text-white">{ticket.assignedTechnician || 'Suresh Verma (Sr. HVAC)'}</strong></span>
                        <span>•</span>
                        <span>Assigned Slot: <strong className="text-[#8C5828] dark:text-[#F2CA50]">{ticket.assignedSlot || 'Today, 10:00 AM - 11:30 AM'}</strong></span>
                      </div>

                      {/* Missed Slot Escalation Trigger Button */}
                      {!isResolved && !hasMissedSlot && (
                        <button
                          id={`report-missed-slot-btn-${ticket.id}`}
                          onClick={() => handleReportMissedSlot(ticket)}
                          className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <AlertTriangle size={12} />
                          <span>No one came in assigned time?</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OVERDUE MISSED SLOT ALERT BANNER */}
                  {hasMissedSlot && !isResolved && (
                    <div className="mt-3.5 p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Missed Visit Alert Active</strong>
                          <span>Technician failed to attend during scheduled slot. Facilities Supervisor has been alerted for priority attendance.</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-[10px] uppercase shrink-0">
                        Escalated to Supervisor
                      </span>
                    </div>
                  )}

                  {/* SECTION: INSPECTION STATUS & REVIEWS (Presented to Admin Portal) */}
                  <div
                    id={`inspection-section-${ticket.id}`}
                    className={`mt-4 p-4 rounded-xl border transition-all ${
                      darkMode ? 'bg-[#151310] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#DCD6CA]/70 dark:border-[#2B2720]/70">
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-[#8C5828] dark:text-[#F2CA50]" />
                        <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                          Technician Inspection Status & Admin Review
                        </h4>
                      </div>

                      {!isInspectionDone ? (
                        <button
                          id={`update-inspection-btn-${ticket.id}`}
                          onClick={() => setInspectionModalTicketId(ticket.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Star size={13} />
                          <span>Update Inspection & Write Review</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                          <Check size={12} />
                          Inspection Logged
                        </span>
                      )}
                    </div>

                    {isInspectionDone && ticket.inspection ? (
                      <div className="mt-3 p-3.5 rounded-xl border border-dashed border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.01] dark:bg-white/[0.01] font-mono text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1C1917] dark:text-white">
                              Inspected by: {ticket.inspection.inspectorName || 'Suresh Verma'}
                            </span>
                            <span className="text-[#57534E] dark:text-[#A39E93]">({ticket.inspection.inspectedAt})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-amber-500 font-bold flex items-center gap-0.5">
                              {Array.from({ length: ticket.inspection.residentRating || 5 }).map((_, i) => (
                                <Star key={i} size={13} fill="currentColor" />
                              ))}
                            </span>
                            <span className="text-[#57534E] dark:text-[#A39E93] text-[11px]">
                              ({ticket.inspection.residentRating || 5}/5)
                            </span>
                          </div>
                        </div>

                        <p className="mt-2 text-[#44403C] dark:text-[#D6D3CD]">
                          "{ticket.inspection.residentReview}"
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#DCD6CA]/60 dark:border-[#2B2720]/60 flex items-center justify-between text-[11px] text-[#8C5828] dark:text-[#F2CA50]">
                          <span className="font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Transmitted to Admin Quality Assurance & Chief Warden Portal
                          </span>
                          <button
                            onClick={() => setInspectionModalTicketId(ticket.id)}
                            className="text-[#57534E] dark:text-[#A39E93] hover:underline cursor-pointer"
                          >
                            Edit Review
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs font-mono text-[#57534E] dark:text-[#A39E93] flex items-center justify-between">
                        <span>Technician arrival inspection is currently pending. Click the button above once the technician visits Room B-004.</span>
                      </div>
                    )}
                  </div>

                  {/* SECTION: ADMIN RESOLUTION CHECKLIST (GATE TO RESOLUTION) */}
                  <div
                    id={`resolution-checklist-box-${ticket.id}`}
                    className={`mt-4 p-4 rounded-xl border transition-all ${
                      darkMode ? 'bg-[#151310] border-[#8C5828]/40' : 'bg-[#FFFDF9] border-[#8C5828]/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#DCD6CA]/70 dark:border-[#2B2720]/70 gap-2">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck size={16} className="text-[#8C5828] dark:text-[#F2CA50]" />
                        <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                          Admin Resolution Checklist (Required for Sign-off)
                        </h4>
                      </div>
                      <span
                        className={`font-mono text-xs font-black px-2 py-0.5 rounded-full ${
                          allChecklistVerified
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50]'
                        }`}
                      >
                        {checkedCount} of {checklist.length} Checks Verified by Resident
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-[#57534E] dark:text-[#A39E93] mt-2">
                      Official Admin Policy: The resident must inspect and check every item below before the complaint can be officially resolved.
                    </p>

                    {/* Interactive Checklist Items */}
                    <div className="mt-3 space-y-2 font-mono text-xs">
                      {checklist.map((item) => (
                        <button
                          key={item.id}
                          id={`checklist-item-${item.id}`}
                          onClick={() => !isResolved && handleToggleChecklistItem(ticket, item.id)}
                          disabled={isResolved}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                            isResolved
                              ? 'opacity-80 cursor-default bg-black/[0.01] dark:bg-white/[0.01] border-[#DCD6CA] dark:border-[#2B2720]'
                              : item.verifiedByResident
                              ? darkMode
                                ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                                : 'bg-[#E6F4EA]/60 border-[#CEEAD6] text-[#137333]'
                              : darkMode
                              ? 'bg-[#181613] border-[#2B2720] hover:border-[#8C5828]/60 text-white'
                              : 'bg-white border-[#DCD6CA] hover:border-[#8C5828]/60 text-[#1C1917]'
                          } cursor-pointer`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {item.verifiedByResident ? (
                              <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square size={16} className="text-[#78716C] dark:text-[#A39E93]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={item.verifiedByResident ? 'line-through opacity-80' : 'font-medium'}>
                              {item.label}
                            </span>
                            {item.verifiedByResident && (
                              <span className="text-[10px] block font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                ✓ Verified by Harsh
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Final Resolution Action Bar */}
                    <div className="mt-4 pt-3 border-t border-[#DCD6CA]/70 dark:border-[#2B2720]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {isResolved ? (
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={15} />
                            Officially Resolved & Verified by Harsh ({ticket.studentApprovedAt || 'Today'})
                          </span>
                        ) : allChecklistVerified ? (
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={15} />
                            All checklist items verified! Ready for final sign-off.
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                            <AlertCircle size={14} />
                            Select all {checklist.length} checklist items above to enable resolution.
                          </span>
                        )}
                      </div>

                      {!isResolved && (
                        <button
                          id={`resolve-complaint-btn-${ticket.id}`}
                          onClick={() => handleResolveTicket(ticket)}
                          disabled={!allChecklistVerified}
                          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                            allChecklistVerified
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Check size={15} />
                          <span>Confirm & Resolve Complaint</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SECTION: TICKET UPDATES & ADMIN RESPONSES THREAD */}
                  <div
                    id={`updates-thread-${ticket.id}`}
                    className="mt-4 pt-4 border-t border-[#DCD6CA] dark:border-[#2B2720]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-[#8C5828] dark:text-[#F2CA50]" />
                        <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                          Updates, Admin Responses & Activity Log
                        </h4>
                      </div>

                      <button
                        onClick={() => setActiveUpdateTicketId(activeUpdateTicketId === ticket.id ? null : ticket.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] hover:border-[#8C5828] font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] cursor-pointer"
                      >
                        {activeUpdateTicketId === ticket.id ? 'Cancel' : '+ Give Update'}
                      </button>
                    </div>

                    {/* Give Update Input Form */}
                    {activeUpdateTicketId === ticket.id && (
                      <div className="mb-4 p-3.5 rounded-xl border border-[#8C5828]/50 bg-[#FAF6F0] dark:bg-[#181512] animate-in fade-in">
                        <label className="block font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] mb-1">
                          Post New Update / Follow-up Note:
                        </label>
                        <textarea
                          rows={2}
                          value={newUpdateText}
                          onChange={(e) => setNewUpdateText(e.target.value)}
                          placeholder="e.g., Technician arrived in room, checking AC pipe..."
                          className={`w-full p-2.5 rounded-lg border font-mono text-xs outline-none ${
                            darkMode ? 'bg-[#12100E] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA]'
                          }`}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => setActiveUpdateTicketId(null)}
                            className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold border border-[#DCD6CA] dark:border-[#2B2720] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddResidentUpdate(ticket.id)}
                            className="px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold bg-[#8C5828] text-white cursor-pointer"
                          >
                            Post Update
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Updates List */}
                    <div className="space-y-2.5 font-mono text-xs">
                      {ticket.updates && ticket.updates.length > 0 ? (
                        ticket.updates.map((up) => (
                          <div
                            key={up.id}
                            className={`p-3 rounded-xl border ${
                              up.isOverdueAlert
                                ? 'bg-red-500/10 border-red-400 text-red-900 dark:text-red-200'
                                : up.sender === 'Admin'
                                ? darkMode
                                  ? 'bg-[#1C1814] border-[#8C5828]/40'
                                  : 'bg-[#FFFDF7] border-[#8C5828]/30'
                                : up.sender === 'Warden'
                                ? 'bg-[#E6F4EA]/50 dark:bg-[#121D15] border-[#CEEAD6] dark:border-emerald-800'
                                : darkMode
                                ? 'bg-[#151310] border-[#2B2720]'
                                : 'bg-[#FAF8F5] border-[#DCD6CA]'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1 border-b border-black/5 dark:border-white/5 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                    up.sender === 'Admin'
                                      ? 'bg-[#8C5828] text-white'
                                      : up.sender === 'Warden'
                                      ? 'bg-emerald-600 text-white'
                                      : up.isOverdueAlert
                                      ? 'bg-red-600 text-white'
                                      : 'bg-black/10 dark:bg-white/10 text-[#1C1917] dark:text-white'
                                  }`}
                                >
                                  {up.sender}
                                </span>
                                <strong className="text-[#1C1917] dark:text-white">{up.senderName}</strong>
                              </div>
                              <span className="text-[10px] text-[#57534E] dark:text-[#A39E93]">{up.timestamp}</span>
                            </div>
                            <p className="text-[#44403C] dark:text-[#D6D3CD] leading-relaxed">{up.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#57534E] dark:text-[#A39E93] italic">
                          Ticket logged. Awaiting technician assignment and initial inspection dispatch.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: OUTPASS / GATE PASS */}
      {subTab === 'leave' && (
        <div className="space-y-4">
          {/* Quick 1-Click Outpass Callout */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              darkMode ? 'bg-[#181611] border-[#8C5828]/50' : 'bg-[#FFFDF9] border-[#8C5828]/40 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#8C5828] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black font-sans text-[#1C1917] dark:text-white">
                  {language === 'hi' ? 'तत्काल 1-क्लिक आउटपास' : 'Instant 1-Click Outpass'}
                </h3>
                <p className="text-[11px] font-mono text-[#57534E] dark:text-[#A39E93]">
                  {language === 'hi'
                    ? 'मार्केट, लाइब्रेरी या डिनर के लिए तुरंत गेट पास बनाएं (रात 10:00 बजे तक वैध)'
                    : 'Auto-generates verified Day Outing QR pass valid until 10:00 PM curfew'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickOutingPass}
              className="whitespace-nowrap px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap size={14} />
              <span>{language === 'hi' ? 'तुरंत आउटपास बनाएं' : 'Generate Instant Pass'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Form: Apply for Outpass */}
            <div
              className={`p-4 sm:p-5 rounded-xl border lg:col-span-5 ${
                darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                <QrCode size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <h3 className="font-bold font-sans uppercase text-sm sm:text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  {t.gatePassHeading}
                </h3>
              </div>

              <form onSubmit={handleCreateLeaveSubmit} className="mt-3 space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Resident</label>
                    <input
                      type="text"
                      readOnly
                      value="Harsh"
                      className={`w-full p-2 rounded-lg border opacity-70 cursor-not-allowed ${
                        darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Room</label>
                    <input
                      type="text"
                      readOnly
                      value="B-004"
                      className={`w-full p-2 rounded-lg border opacity-70 cursor-not-allowed ${
                        darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Pass Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Day Outing', 'Overnight'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLeaveType(cat)}
                        className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          leaveType === cat
                            ? 'border-[#8C5828] bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50]'
                            : 'border-[#DCD6CA] dark:border-[#2B2720] opacity-70'
                        }`}
                      >
                        {cat === 'Day Outing' ? (language === 'hi' ? 'डे आउटिंग' : 'Day Outing') : (language === 'hi' ? 'नाइट आउटपास' : 'Overnight')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Destination / Purpose</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. मार्केट, लाइब्रेरी, डिनर...' : 'e.g., Market, Library, Dinner...'}
                    className={`w-full p-2 rounded-lg border outline-none ${
                      darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                    }`}
                  />
                  {/* Quick destination suggestion chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {[
                      { en: 'Market & Dinner', hi: 'मार्केट व डिनर' },
                      { en: 'Central Library', hi: 'लाइब्रेरी' },
                      { en: 'Medical Clinic', hi: 'क्लीनिक / दवा' },
                      { en: 'Home Visit', hi: 'घर जाना' },
                    ].map((chip) => (
                      <button
                        key={chip.en}
                        type="button"
                        onClick={() => setDestination(language === 'hi' ? chip.hi : chip.en)}
                        className="px-2 py-0.5 rounded-md text-[10px] border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-[#78716C] dark:text-[#A39E93] hover:border-[#8C5828] hover:text-[#8C5828] cursor-pointer transition-colors"
                      >
                        + {language === 'hi' ? chip.hi : chip.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Exit Time</label>
                    <input
                      type="text"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none ${
                        darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase text-[10px]">Expected In</label>
                    <input
                      type="text"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none ${
                        darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  <QrCode size={15} />
                  <span>{t.generateTurnstilePassBtn}</span>
                </button>
              </form>
            </div>

            {/* List: Generated Gate Passes */}
            <div
              className={`p-4 sm:p-5 rounded-xl border lg:col-span-7 ${
                darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                <h3 className="font-bold font-sans uppercase text-sm sm:text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  {language === 'hi' ? 'हाल के आउटपास व क्यूआर टोकन' : 'Recent Outpasses & QR Tokens'}
                </h3>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  {leaveRequests.length} {language === 'hi' ? 'पास रिकॉर्डेड' : 'Passes'}
                </span>
              </div>

              <div className="mt-3 space-y-2.5 font-mono text-xs">
                {leaveRequests.map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => setActivePassModal(pass)}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] ${
                      darkMode
                        ? 'bg-[#181613] border-[#2B2720] hover:border-[#8C5828]'
                        : 'bg-[#FAF8F5] border-[#DCD6CA] hover:border-[#8C5828]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#8C5828] dark:text-[#F2CA50]">{pass.id}</span>
                        <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                        <span className="font-bold text-[#1C1917] dark:text-white">{pass.type}</span>
                        <span className="px-2 py-0.5 rounded-full font-bold text-[9px] uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                          {pass.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] dark:text-[#A39E93]">
                        {language === 'hi' ? 'गंतव्य' : 'Destination'}: <strong className="text-[#1C1917] dark:text-white">{pass.destination}</strong>
                      </p>
                      <p className="text-[11px] text-[#57534E] dark:text-[#A39E93]">
                        {pass.departure} → {pass.expectedReturn}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#8C5828] dark:text-[#F2CA50] flex items-center gap-1">
                        <QrCode size={16} />
                        <span>{language === 'hi' ? 'क्यूआर देखें' : 'View Pass'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {isNewTicketOpen && (
        <div
          id="new-ticket-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setIsNewTicketOpen(false)}
        >
          <div
            id="new-ticket-modal-container"
            className={`w-full max-w-md rounded-2xl border p-6 transition-all ${
              darkMode ? 'bg-[#141310] border-[#2B2720] text-[#EDE9E3]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <h3 className="font-bold font-sans uppercase text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  Lodge Maintenance Complaint
                </h3>
              </div>
              <button onClick={() => setIsNewTicketOpen(false)} className="p-1 hover:bg-black/5 rounded cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="mt-4 space-y-3.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Resident</label>
                  <input
                    type="text"
                    readOnly
                    value="Harsh"
                    className={`w-full p-2 rounded-xl border opacity-70 cursor-not-allowed ${
                      darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Room</label>
                  <input
                    type="text"
                    readOnly
                    value="B-004 (3-Seater AC)"
                    className={`w-full p-2 rounded-xl border opacity-70 cursor-not-allowed ${
                      darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                  }`}
                >
                  <option value="Appliance / AC">Appliance / AC</option>
                  <option value="Electrical / Lighting">Electrical / Lighting</option>
                  <option value="Plumbing / Washroom">Plumbing / Washroom</option>
                  <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                  <option value="Carpentry / Furniture">Carpentry / Furniture</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as TicketUrgency[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                        urgency === lvl
                          ? 'border-[#8C5828] bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50]'
                          : 'border-[#DCD6CA] dark:border-[#2B2720] opacity-70'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Subject / Issue</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., AC thermostat dripping water on desk"
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">Diagnostic Details</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe location, symptoms, and best timing for technician visit..."
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer"
              >
                Dispatch Complaint & Generate Tracker
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION STATUS & ADMIN REVIEW MODAL */}
      {inspectionModalTicketId && (
        <div
          id="inspection-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setInspectionModalTicketId(null)}
        >
          <div
            id="inspection-modal-card"
            className={`w-full max-w-lg rounded-2xl border p-6 transition-all ${
              darkMode ? 'bg-[#141310] border-[#2B2720] text-[#FAF8F5]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <h3 className="font-bold font-sans uppercase text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  Update Inspection & Submit Review for Admin Portal
                </h3>
              </div>
              <button onClick={() => setInspectionModalTicketId(null)} className="p-1 hover:bg-black/5 rounded cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} className="mt-4 space-y-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#8C5828]/10 border border-[#8C5828]/30">
                <span className="font-bold text-[#8C5828] dark:text-[#F2CA50] block text-[11px] uppercase">
                  Quality Assurance Notice:
                </span>
                <p className="text-[#57534E] dark:text-[#A39E93] text-[11px] mt-0.5">
                  Your inspection status and rating will be directly presented to the Chief Warden and Admin Management Portal to audit technician work standards.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">
                  Service & Punctuality Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setInspectionRating(star)}
                      className={`p-2 rounded-xl border flex items-center gap-1 cursor-pointer transition-all ${
                        inspectionRating >= star
                          ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                          : 'border-[#DCD6CA] dark:border-[#2B2720] text-[#57534E]'
                      }`}
                    >
                      <Star size={16} fill={inspectionRating >= star ? 'currentColor' : 'none'} />
                      <span className="font-bold">{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] dark:text-[#A39E93] mb-1 uppercase">
                  Written Inspection Review (Admin Record):
                </label>
                <textarea
                  rows={3}
                  required
                  value={inspectionReview}
                  onChange={(e) => setInspectionReview(e.target.value)}
                  placeholder="Describe technician conduct, whether issue was fully diagnosed, tools used, and cleanliness..."
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-white' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#1C1917]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCD6CA] dark:border-[#2B2720]">
                <button
                  type="button"
                  onClick={() => setInspectionModalTicketId(null)}
                  className="px-4 py-2 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs cursor-pointer"
                >
                  Submit Inspection to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL SECURITY TURNSTILE PASS MODAL */}
      {activePassModal && (
        <div
          id="turnstile-pass-modal"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActivePassModal(null)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 sm:p-6 transition-all shadow-2xl relative ${
              darkMode ? 'bg-[#151411] border-[#8C5828]/60 text-white' : 'bg-white border-[#8C5828]/40 text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePassModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-center pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === 'hi' ? 'गेट 1 व 2 टर्नस्टाइल एक्टिव' : 'TURNSTILE ACCESS GRANTED'}
              </span>
              <h3 className="text-lg font-black font-sans mt-1.5 tracking-tight text-[#1C1917] dark:text-white">
                {language === 'hi' ? 'डिजिटल टर्नस्टाइल गेट पास' : 'Security Turnstile Pass'}
              </h3>
              <p className="font-mono text-xs text-[#8C5828] dark:text-[#F2CA50] font-bold">
                Pass Token: #{activePassModal.id}
              </p>
            </div>

            {/* Live QR Matrix Display */}
            <div className="my-4 flex flex-col items-center">
              <div className="p-3.5 bg-white rounded-2xl border border-[#DCD6CA] shadow-sm relative overflow-hidden">
                {/* SVG QR Code Pattern */}
                <svg width="170" height="170" viewBox="0 0 100 100" className="w-40 h-40">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Top-Left Finder */}
                  <rect x="6" y="6" width="24" height="24" fill="#1C1917" rx="3" />
                  <rect x="10" y="10" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="14" y="14" width="8" height="8" fill="#1C1917" rx="1" />

                  {/* Top-Right Finder */}
                  <rect x="70" y="6" width="24" height="24" fill="#1C1917" rx="3" />
                  <rect x="74" y="10" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="78" y="14" width="8" height="8" fill="#1C1917" rx="1" />

                  {/* Bottom-Left Finder */}
                  <rect x="6" y="70" width="24" height="24" fill="#1C1917" rx="3" />
                  <rect x="10" y="74" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="14" y="78" width="8" height="8" fill="#1C1917" rx="1" />

                  {/* Timing Tracks */}
                  <line x1="33" y1="18" x2="67" y2="18" stroke="#1C1917" strokeWidth="2" strokeDasharray="3,3" />
                  <line x1="18" y1="33" x2="18" y2="67" stroke="#1C1917" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Matrix blocks */}
                  <rect x="34" y="24" width="5" height="5" fill="#1C1917" />
                  <rect x="42" y="24" width="5" height="5" fill="#8C5828" />
                  <rect x="52" y="24" width="5" height="5" fill="#1C1917" />
                  <rect x="60" y="24" width="5" height="5" fill="#1C1917" />
                  <rect x="34" y="34" width="5" height="5" fill="#1C1917" />
                  <rect x="44" y="34" width="5" height="5" fill="#1C1917" />
                  <rect x="54" y="34" width="5" height="5" fill="#8C5828" />
                  <rect x="62" y="34" width="5" height="5" fill="#1C1917" />
                  <rect x="25" y="44" width="5" height="5" fill="#1C1917" />
                  <rect x="35" y="44" width="5" height="5" fill="#8C5828" />
                  <rect x="45" y="44" width="10" height="10" fill="#8C5828" rx="2" />
                  <rect x="60" y="44" width="5" height="5" fill="#1C1917" />
                  <rect x="70" y="44" width="5" height="5" fill="#1C1917" />
                  <rect x="25" y="55" width="5" height="5" fill="#1C1917" />
                  <rect x="35" y="55" width="5" height="5" fill="#1C1917" />
                  <rect x="55" y="55" width="5" height="5" fill="#1C1917" />
                  <rect x="65" y="55" width="5" height="5" fill="#8C5828" />
                  <rect x="75" y="55" width="5" height="5" fill="#1C1917" />
                  <rect x="34" y="68" width="5" height="5" fill="#1C1917" />
                  <rect x="44" y="68" width="5" height="5" fill="#1C1917" />
                  <rect x="54" y="68" width="5" height="5" fill="#1C1917" />
                  <rect x="64" y="68" width="5" height="5" fill="#1C1917" />
                  <rect x="74" y="68" width="5" height="5" fill="#1C1917" />
                  <rect x="34" y="78" width="5" height="5" fill="#1C1917" />
                  <rect x="44" y="78" width="5" height="5" fill="#8C5828" />
                  <rect x="54" y="78" width="5" height="5" fill="#1C1917" />
                  <rect x="64" y="78" width="5" height="5" fill="#1C1917" />
                  <rect x="74" y="78" width="5" height="5" fill="#1C1917" />
                  <rect x="84" y="78" width="5" height="5" fill="#1C1917" />

                  {/* Core Emblem */}
                  <circle cx="50" cy="49" r="6" fill="#8C5828" />
                  <path d="M48 46 L53 49 L48 52 Z" fill="#ffffff" />
                </svg>

                {/* Animated Scanner line */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-sm animate-pulse top-1/2" />
              </div>

              <span className="font-mono text-[10px] text-[#78716C] dark:text-[#A39E93] mt-2 flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                {language === 'hi' ? 'होस्टल वार्डन अप्रूवल वेरीफाइड' : 'Warden-Verified Security Clearance'}
              </span>
            </div>

            {/* Pass Metadata details */}
            <div className="space-y-2 p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] dark:text-[#A39E93] uppercase text-[10px]">{t.profileResident}:</span>
                <strong className="text-[#1C1917] dark:text-white">Harsh (Room B-004 · Bed C)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] dark:text-[#A39E93] uppercase text-[10px]">{t.profileOutpassType}:</span>
                <strong className="text-[#8C5828] dark:text-[#F2CA50]">{activePassModal.type}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] dark:text-[#A39E93] uppercase text-[10px]">{t.profileDestination}:</span>
                <strong className="text-[#1C1917] dark:text-white truncate max-w-[170px]">{activePassModal.destination}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] dark:text-[#A39E93] uppercase text-[10px]">{t.profileExitWindow}:</span>
                <strong className="text-[#1C1917] dark:text-white">{activePassModal.departure}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] dark:text-[#A39E93] uppercase text-[10px]">{t.profileReturnCurfew}:</span>
                <strong className="text-amber-700 dark:text-amber-400">{activePassModal.expectedReturn}</strong>
              </div>
            </div>

            {/* Instruction footnote */}
            <p className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93] text-center mt-3 leading-relaxed">
              {language === 'hi'
                ? 'गेट 1 या गेट 2 टर्नस्टाइल स्कैनर के सामने यह क्यूआर कोड 6 इंच की दूरी पर रखें या गार्ड को दिखाएं।'
                : 'Present this QR code to the turnstile optical scanner at Gate 1 or 2, or show to on-duty security guard.'}
            </p>

            {/* Action buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`PASS-TOKEN: ${activePassModal.id} | Harsh | Room B-004`);
                  setPassTokenCopied(true);
                  setTimeout(() => setPassTokenCopied(false), 2000);
                }}
                className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 font-bold"
              >
                {passTokenCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{passTokenCopied ? t.copied : t.copyToken}</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePassModal(null)}
                className="p-2.5 rounded-xl bg-[#8C5828] hover:bg-[#73471F] text-white font-bold cursor-pointer shadow-xs"
              >
                {t.doneBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
