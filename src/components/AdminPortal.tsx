import React, { useState, useEffect } from 'react';
import { Search, Grid, X } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavTab } from './Sidebar';
import { RoomInspector } from './RoomInspector';
import { Grid2DView } from './Grid2DView';
import { HomeOverview } from './HomeOverview';
import { ComplaintsView } from './ComplaintsView';
import { PaymentView } from './PaymentView';
import { MessView } from './MessView';
import { TransportView } from './TransportView';
import { NoticesView } from './NoticesView';
import {
  NewTicketModal,
  SendNoticeBatchModal,
  AddRouteModal,
  EditNoticeModal,
  EditMessMealModal,
  AddResidentModal,
} from './Modals';
import {
  INITIAL_ROOMS,
  INITIAL_TICKETS,
  WEEKLY_MESS_MENU,
  INITIAL_NOTICES,
  SHUTTLE_SCHEDULE,
  STUDENT_PAYMENTS,
} from '../data';
import { Room, Ticket, Notice, ShuttleRide, StudentPayment, DayMeals } from '../types';

interface AdminPortalProps {
  onSignOut: () => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSignOut,
  tickets,
  setTickets,
  notices,
  setNotices,
}) => {
  // Navigation & theme
  const [currentView, setCurrentView] = useState<NavTab>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Core data states
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [payments, setPayments] = useState<StudentPayment[]>(STUDENT_PAYMENTS);
  const [shuttleSchedules, setShuttleSchedules] = useState<ShuttleRide[]>(SHUTTLE_SCHEDULE);
  const [messMenu, setMessMenu] = useState<Record<string, DayMeals>>(WEEKLY_MESS_MENU);

  // Rooms & Matrix controls
  const [roomSearch, setRoomSearch] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(INITIAL_ROOMS[0]);
  const [shortlist, setShortlist] = useState<string[]>(['ARV-103', 'NLG-201']);

  // Complaints state
  const [activeTicketId, setActiveTicketId] = useState<string>(
    INITIAL_TICKETS[0]?.id || ''
  );

  // Interactive Sidebar visibility states (hover on desktop, button toggle on mobile/tablet)
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const isSidebarOpen = isSidebarHovered || isMobileSidebarOpen;

  const handleCloseSidebar = () => {
    setIsSidebarHovered(false);
    setIsMobileSidebarOpen(false);
  };

  // Modals state
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState<boolean>(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [isSendNoticeModalOpen, setIsSendNoticeModalOpen] = useState<boolean>(false);
  const [noticeModalPreselected, setNoticeModalPreselected] = useState<string | null>(null);
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState<boolean>(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingMeal, setEditingMeal] = useState<{
    day: string;
    mealType: string;
    items: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Calculations
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const pendingTicketsCount = tickets.filter((t) => t.status === 'Pending').length;

  // Handlers: Shortlist
  const toggleShortlist = (roomNumber: string) => {
    if (shortlist.includes(roomNumber)) {
      setShortlist((prev) => prev.filter((item) => item !== roomNumber));
      showToast(`Removed ${roomNumber} from shortlist`);
    } else {
      setShortlist((prev) => [...prev, roomNumber]);
      showToast(`Added ${roomNumber} to shortlist`);
    }
  };

  // Handlers: Tickets
  const handleCreateTicket = (ticketData: {
    room: string;
    student: string;
    category: string;
    urgency: Ticket['urgency'];
    subject: string;
    desc: string;
  }) => {
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      hostelId: 'HOSTEL-RP',
      email: `${ticketData.student.toLowerCase().replace(/\s+/g, '.')}@royalparadise.edu`,
      status: 'Pending',
      timestamp: 'Just now',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketId(newId);
    showToast(`New Ticket #${newId} logged successfully for Room ${ticketData.room}`);
  };

  const handleSendConfirmation = (ticketId: string, resolutionNote: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let recipientName = 'Resident';
    let recipientEmail = '';
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          recipientName = t.student;
          recipientEmail =
            t.email ||
            `${t.student.toLowerCase().replace(/\s+/g, '.')}@royalparadise.edu`;
          return {
            ...t,
            status: 'Awaiting Approval' as const,
            resolutionNote: resolutionNote.trim(),
            resolutionDispatchedAt: `Today, ${timeStr}`,
          };
        }
        return t;
      })
    );
    showToast(
      `Confirmation email dispatched to ${recipientEmail} (${recipientName}). Awaiting student approval.`
    );
  };

  const handleStudentApprove = (ticketId: string, feedback?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let studentName = 'Resident';
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          studentName = t.student;
          return {
            ...t,
            status: 'Resolved' as const,
            studentApprovedAt: `Today, ${timeStr}`,
            studentFeedback: feedback?.trim() || 'Resident confirmed resolution via student email portal.',
          };
        }
        return t;
      })
    );
    showToast(
      `Resident ${studentName} confirmed repair! Ticket #${ticketId} is now officially Resolved.`
    );
  };

  const handleStudentReject = (ticketId: string, feedback: string) => {
    let studentName = 'Resident';
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          studentName = t.student;
          return {
            ...t,
            status: 'In-Progress' as const,
            desc: `${t.desc}\n\n[RESIDENT RE-OPEN FEEDBACK]: ${feedback.trim()}`,
            studentFeedback: `Issue persisted: "${feedback.trim()}"`,
          };
        }
        return t;
      })
    );
    showToast(
      `Resident ${studentName} reported issue persists. Ticket #${ticketId} set back to In-Progress.`
    );
  };

  const handleSetInProgress = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'In-Progress' as const } : t))
    );
    showToast(`Ticket #${ticketId} status updated to In-Progress`);
  };

  const handleResolveTicket = (ticketId: string, resolutionNote: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Resolved' as const,
              resolutionNote: resolutionNote,
              desc: `${t.desc}\n\n[WARDEN DIRECT RESOLUTION]: ${resolutionNote}`,
              studentApprovedAt: 'Today (Admin Override)',
            }
          : t
      )
    );
    showToast(`Ticket #${ticketId} marked resolved by Admin`);
  };

  // Handlers: Resident Allocation
  const handleAddResident = (studentName: string, roomNumber: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.number === roomNumber && r.free > 0) {
          const newOccupied = r.occupied + 1;
          const newFree = r.capacity - newOccupied;
          const newStatus =
            newFree === 0
              ? 'Fully Occupied'
              : 'Partially Occupied';
          const updated = {
            ...r,
            occupied: newOccupied,
            free: newFree,
            status: newStatus as Room['status'],
            students: [...r.students, studentName],
          };
          if (selectedRoom?.number === roomNumber) {
            setSelectedRoom(updated);
          }
          return updated;
        }
        return r;
      })
    );
    showToast(`Resident ${studentName} allocated to Room ${roomNumber}`);
  };

  // Handlers: Notices
  const handleAddNotice = (newNoticeData: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...newNoticeData,
      id: `NOT-${Math.floor(910 + Math.random() * 80)}`,
      date: 'Just now',
    };
    setNotices((prev) => [newNotice, ...prev]);
    showToast(`Alert "${newNotice.title}" published to live feed`);
  };

  const handleSaveNotice = (updatedNotice: Notice) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === updatedNotice.id ? updatedNotice : n))
    );
    showToast(`Notice #${updatedNotice.id} updated successfully`);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast(`Notice #${id} deleted from feed`);
  };

  // Handlers: Payments & Overdue Notice Modal
  const handleOpenNoticeModal = (studentName?: string) => {
    setNoticeModalPreselected(studentName || null);
    setIsSendNoticeModalOpen(true);
  };

  const handleDispatchNotices = (selectedStudents: string[]) => {
    showToast(
      `Overdue payment notices dispatched to ${selectedStudents.length} student(s) via SMS & Portal`
    );
  };

  const handleMarkPaid = (studentName: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.name === studentName
          ? { ...p, dues: 0, status: 'Paid', lastPaymentDate: 'Today' }
          : p
      )
    );
    showToast(`Dues settled for ${studentName}`);
  };

  // Handlers: Transport Routes
  const handleAddRoute = (newRoute: ShuttleRide) => {
    setShuttleSchedules((prev) => [...prev, newRoute]);
    showToast(`Shuttle route "${newRoute.route}" scheduled`);
  };

  const handleDeleteRoute = (index: number) => {
    setShuttleSchedules((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Shuttle route removed from schedule');
  };

  // Handlers: Mess Meals
  const handleEditMeal = (day: string, mealType: string, currentItems: string) => {
    setEditingMeal({ day, mealType, items: currentItems });
  };

  const handleSaveMeal = (day: string, mealType: string, newItems: string) => {
    setMessMenu((prev) => {
      const existingDay = prev[day] || {
        Breakfast: '',
        Lunch: '',
        'Evening Snack': '',
        Dinner: '',
      };
      return {
        ...prev,
        [day]: {
          ...existingDay,
          [mealType]: newItems,
        },
      };
    });
    showToast(`Mess roster updated for ${day} · ${mealType}`);
  };

  const handleClearMeal = (day: string, mealType: string) => {
    setMessMenu((prev) => {
      const existingDay = prev[day] || {
        Breakfast: '',
        Lunch: '',
        'Evening Snack': '',
        Dinner: '',
      };
      return {
        ...prev,
        [day]: {
          ...existingDay,
          [mealType]: '',
        },
      };
    });
    showToast(`Cleared ${mealType} menu for ${day}`);
  };

  // Filtered rooms for search and floor
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.number.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.students.some((s) => s.toLowerCase().includes(roomSearch.toLowerCase()));
    const matchesFloor = selectedFloor === 'All' || r.floor === selectedFloor;
    return matchesSearch && matchesFloor;
  });

  return (
    <div
      id="app-root"
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-[#13100e] text-[#fbf9f5]' : 'bg-[#f7f4ef] text-[#1c1917]'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="status-toast"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl border border-[#c8935c]/60 bg-[#1e1915] text-[#fbf9f5] font-mono text-xs shadow-2xl flex items-center gap-3 animate-in fade-in duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#a39e93] hover:text-white cursor-pointer ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Persistent Navigation Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeBlock="ROYAL PARADISE"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onSignOut={onSignOut}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Edge Sensor / Indicator for Desktop Cursor Hover */}
        <div
          id="sidebar-hover-sensor"
          onMouseEnter={() => setIsSidebarHovered(true)}
          className={`fixed left-0 top-16 bottom-0 w-3 md:w-4 z-30 flex items-center cursor-pointer transition-opacity duration-200 group ${
            isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          title="Move cursor here to reveal navigation matrix"
          onClick={() => setIsSidebarHovered(true)}
        >
          <div className="h-28 w-1 rounded-r-md group-hover:w-2 transition-all bg-gradient-to-b from-[#d4af37]/40 via-[#c8935c] to-[#9e6932]/40 shadow-[0_0_8px_rgba(200,147,92,0.4)]" />
        </div>

        {/* Mobile / Tablet Backdrop */}
        {isMobileSidebarOpen && (
          <div
            id="sidebar-backdrop"
            className="fixed inset-0 top-16 z-30 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={handleCloseSidebar}
            onTouchStart={handleCloseSidebar}
          />
        )}

        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          totalBeds={totalBeds}
          occupiedBeds={occupiedBeds}
          occupancyRate={occupancyRate}
          pendingTicketsCount={pendingTicketsCount}
          noticesCount={notices.length}
          darkMode={darkMode}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        />

        <main
          id="main-content-scroll"
          onMouseEnter={() => setIsSidebarHovered(false)}
          onClick={handleCloseSidebar}
          className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
            darkMode ? 'bg-[#13100e]' : 'bg-[#f7f4ef]'
          }`}
        >
          {/* VIEW 1: HOME OVERVIEW */}
          {currentView === 'home' && (
            <HomeOverview
              rooms={rooms}
              tickets={tickets}
              totalBeds={totalBeds}
              occupiedBeds={occupiedBeds}
              occupancyRate={occupancyRate.toString()}
              pendingTicketsCount={pendingTicketsCount}
              onViewRoomsMatrix={() => setCurrentView('rooms')}
              onOpenAddResident={() => setIsAddResidentModalOpen(true)}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
              onSelectTicket={(ticketId) => {
                setActiveTicketId(ticketId);
                setCurrentView('complaints');
              }}
              onNavigateToComplaints={() => setCurrentView('complaints')}
              darkMode={darkMode}
            />
          )}

          {/* VIEW 2: ROOMS & MATRIX */}
          {currentView === 'rooms' && (
            <div id="rooms-matrix-layout" className="space-y-6 max-w-7xl mx-auto">
              <div
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${
                  darkMode ? 'border-[#382e25]' : 'border-[#dfd3c3]'
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-mono uppercase tracking-widest ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Hostel Structural Grid / Royal Paradise
                  </span>
                  <h2
                    id="rooms-heading"
                    className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
                      darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                    }`}
                  >
                    Room & Bed Occupancy Matrix
                  </h2>
                </div>

                {/* Search and floor filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono w-full sm:w-64 ${
                      darkMode
                        ? 'border-[#382e25] bg-[#1a1613] text-[#ede8e1]'
                        : 'border-[#dfd3c3] bg-white text-stone-900 shadow-xs'
                    }`}
                  >
                    <Search
                      size={14}
                      className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'}
                    />
                    <input
                      id="room-search-input"
                      type="text"
                      placeholder="Search room (e.g. 301) or resident..."
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                      className="w-full bg-transparent focus:outline-none placeholder:text-stone-400"
                    />
                    {roomSearch && (
                      <button
                        onClick={() => setRoomSearch('')}
                        className="text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-mono ${
                      darkMode
                        ? 'border-[#382e25] bg-[#1a1613]'
                        : 'border-[#dfd3c3] bg-white shadow-xs'
                    }`}
                  >
                    {['All', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'].map((floor) => (
                      <button
                        key={floor}
                        onClick={() => setSelectedFloor(floor)}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                          selectedFloor === floor
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#c8935c] text-white font-bold'
                            : darkMode
                            ? 'text-[#a39e93] hover:text-[#fbf9f5]'
                            : 'text-[#695747] hover:text-stone-950'
                        }`}
                      >
                        {floor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2D Matrix View and Resident Dossier Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <Grid2DView
                    rooms={filteredRooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={setSelectedRoom}
                    darkMode={darkMode}
                  />
                </div>

                <div className="lg:col-span-4">
                  <RoomInspector
                    rooms={filteredRooms}
                    selectedFloor={selectedFloor}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    shortlist={shortlist}
                    toggleShortlist={toggleShortlist}
                    onOpenAddResident={() => setIsAddResidentModalOpen(true)}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: COMPLAINTS & TICKETS */}
          {currentView === 'complaints' && (
            <ComplaintsView
              tickets={tickets}
              activeTicketId={activeTicketId}
              setActiveTicketId={setActiveTicketId}
              onSendConfirmation={handleSendConfirmation}
              onStudentApprove={handleStudentApprove}
              onStudentReject={handleStudentReject}
              onSetInProgress={handleSetInProgress}
              onResolveTicket={handleResolveTicket}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
              darkMode={darkMode}
            />
          )}

          {/* VIEW 4: PAYMENT MANAGEMENT */}
          {currentView === 'payment' && (
            <PaymentView
              payments={payments}
              onOpenNoticeModal={handleOpenNoticeModal}
              onMarkPaid={handleMarkPaid}
              darkMode={darkMode}
            />
          )}

          {/* VIEW 5: MESS SCHEDULE */}
          {currentView === 'mess' && (
            <MessView
              messMenu={messMenu}
              onEditMeal={handleEditMeal}
              onClearMeal={handleClearMeal}
              darkMode={darkMode}
            />
          )}

          {/* VIEW 6: TRANSPORT LOGISTICS */}
          {currentView === 'transport' && (
            <TransportView
              schedules={shuttleSchedules}
              onOpenAddRoute={() => setIsAddRouteModalOpen(true)}
              onDeleteRoute={handleDeleteRoute}
              darkMode={darkMode}
            />
          )}

          {/* VIEW 7: NOTICES & ALERTS */}
          {currentView === 'notices' && (
            <NoticesView
              notices={notices}
              onAddNotice={handleAddNotice}
              onEditNotice={(notice) => setEditingNotice(notice)}
              onDeleteNotice={handleDeleteNotice}
              darkMode={darkMode}
            />
          )}
        </main>
      </div>

      {/* Functional Interactive Modals */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        rooms={rooms}
        onCreateTicket={handleCreateTicket}
        darkMode={darkMode}
      />

      <SendNoticeBatchModal
        isOpen={isSendNoticeModalOpen}
        onClose={() => setIsSendNoticeModalOpen(false)}
        payments={payments}
        onDispatchNotices={handleDispatchNotices}
        preSelectedStudent={noticeModalPreselected}
        darkMode={darkMode}
      />

      <AddRouteModal
        isOpen={isAddRouteModalOpen}
        onClose={() => setIsAddRouteModalOpen(false)}
        onAddRoute={handleAddRoute}
        darkMode={darkMode}
      />

      <EditNoticeModal
        isOpen={!!editingNotice}
        onClose={() => setEditingNotice(null)}
        notice={editingNotice}
        onSaveNotice={handleSaveNotice}
        darkMode={darkMode}
      />

      <EditMessMealModal
        isOpen={!!editingMeal}
        onClose={() => setEditingMeal(null)}
        day={editingMeal?.day || 'Mon'}
        mealType={editingMeal?.mealType || 'Breakfast'}
        initialItems={editingMeal?.items || ''}
        onSaveMeal={handleSaveMeal}
        darkMode={darkMode}
      />

      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
        rooms={rooms}
        onAddResident={handleAddResident}
        darkMode={darkMode}
      />
    </div>
  );
}
