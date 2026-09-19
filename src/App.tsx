import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { SignInScreen } from './components/SignInScreen';
import { HelpDeskView } from './components/HelpDeskView';
import { INITIAL_NOTICES, INITIAL_TICKETS } from './data';
import { DEFAULT_USER_PROFILE } from './components/student/studentData';
import { Notice, Ticket, UserProfile } from './types';
import { LanguageProvider } from './i18n/LanguageContext';

export default function App() {
  type PortalRole = 'student' | 'admin';
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);

  // User Profile state with persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('realm_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // Authentication state is persisted only as a role, with login required on a new install.
  const [portalRole, setPortalRole] = useState<PortalRole | null>(() => {
    try {
      const savedRole = localStorage.getItem('realm_portal_role');
      return savedRole === 'student' || savedRole === 'admin' ? savedRole : null;
    } catch {
      return null;
    }
  });

  // Sync dark class with document.documentElement for complete font and theme visibility
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem('realm_user_profile', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist user profile', e);
    }
    showToast(`Profile updated for ${updated.name} (Room B-004)`);
  };

  const handleSignOut = () => {
    setPortalRole(null);
    setDarkMode(false);
    setIsHelpDeskOpen(false);
    try {
      localStorage.setItem('realm_is_authenticated', 'false');
      localStorage.removeItem('realm_portal_role');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of Realm of Hostels portal.');
  };

  const handleSignIn = (username: string, password: string): boolean => {
    const normalizedUsername = username.trim().toLowerCase();
    const isAdmin = normalizedUsername === 'realmofhostels' && password === 'codersrealm';
    const isStudent = normalizedUsername.includes('@') && password === 'codersrealm';
    const role = isAdmin ? 'admin' : isStudent ? 'student' : null;

    if (!role) {
      return false;
    }

    setPortalRole(role);
    setDarkMode(false);
    setIsHelpDeskOpen(false);
    try {
      localStorage.setItem('realm_is_authenticated', 'true');
      localStorage.setItem('realm_portal_role', role);
    } catch (e) {
      console.error(e);
    }
    showToast(role === 'admin' ? 'Welcome to the admin command center.' : `Welcome back, ${userProfile.name}!`);
    return true;
  };

  const handleCreateTicket = (ticketData: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => {
    const newId = `TCK-${Math.floor(4000 + Math.random() * 5000)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      timestamp: `Today, ${timeStr}`,
      status: 'Pending',
      wardenApproved: true,
      wardenApprovedAt: `Today, ${timeStr} (Auto-cleared by Hostel Warden)`,
      assignedTechnician: 'Duty Maintenance Engineer (Block B)',
      assignedSlot: 'Today, Next Available Slot (within 2 hours)',
      updates: [
        {
          id: `up-${Date.now()}`,
          sender: 'Resident',
          senderName: 'Harsh (Room B-004)',
          message: ticketData.desc || 'New maintenance ticket registered.',
          timestamp: `Today, ${timeStr}`,
        },
        {
          id: `up-${Date.now() + 1}`,
          sender: 'Admin',
          senderName: 'Facilities Maintenance Desk',
          message: `Ticket received and registered with ${ticketData.urgency} urgency. Technician dispatched for Room B-004.`,
          timestamp: `Today, ${timeStr}`,
        },
      ],
      inspection: {
        isDone: false,
      },
      resolutionChecklist: [
        { id: `chk-${Date.now()}-1`, label: 'Primary fault inspected & repaired by technician', verifiedByResident: false },
        { id: `chk-${Date.now()}-2`, label: 'Hardware / fixture tested in operation and confirmed functional', verifiedByResident: false },
        { id: `chk-${Date.now()}-3`, label: 'Room B-004 workspace left clean, dry, and safe', verifiedByResident: false },
      ],
    };
    setTickets((previousTickets) => [newTicket, ...previousTickets]);
    showToast(`Maintenance request #${newId} logged for Room B-004. Priority: ${ticketData.urgency}`);
  };

  const handleUpdateTicket = (ticketId: string, updatedFields: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            ...updatedFields,
          };
        }
        return t;
      })
    );
  };

  const handleStudentApprove = (ticketId: string, feedback?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Resolved' as const,
            studentApprovedAt: `Today, ${timeStr}`,
            studentFeedback: feedback || 'Resident confirmed resolution via student portal.',
          };
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} confirmed and marked as officially Resolved!`);
  };

  return (
    <LanguageProvider>
      <div
        id="app-root"
        className={`min-h-screen flex flex-col transition-colors duration-200 ${
          darkMode ? 'bg-[#0E0D0B] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#1C1917]'
        }`}
      >
        {/* Toast Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              id="status-toast"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl border border-[#8C5828]/60 bg-[#1E1915] text-[#FAF8F5] font-mono text-xs shadow-2xl flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-[#A39E93] hover:text-white cursor-pointer ml-1 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditional Auth Routing: Sign In Screen vs Student Residence Console */}
        <AnimatePresence mode="wait">
          {!portalRole ? (
            <motion.div
              key="sign-in-screen"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              {isHelpDeskOpen ? (
                <HelpDeskView onBack={() => setIsHelpDeskOpen(false)} darkMode={darkMode} />
              ) : (
                <SignInScreen
                  onSignIn={handleSignIn}
                  defaultProfile={userProfile}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onOpenHelpDesk={() => setIsHelpDeskOpen(true)}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="portal-screen"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              {portalRole === 'admin' ? (
                <AdminPortal
                  tickets={tickets}
                  setTickets={setTickets}
                  notices={notices}
                  setNotices={setNotices}
                  onSignOut={handleSignOut}
                />
              ) : (
                <StudentPortal
                  tickets={tickets}
                  onCreateTicket={handleCreateTicket}
                  onUpdateTicket={handleUpdateTicket}
                  onApproveTicket={handleStudentApprove}
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onSignOut={handleSignOut}
                  notices={notices}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}
