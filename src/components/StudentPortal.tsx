import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sun,
  Moon,
  BedDouble,
  CreditCard,
  Utensils,
  Wrench,
  Bell,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Shield,
  Sparkles,
  ExternalLink,
  ChevronRight,
  School,
  User,
  Building,
  X,
  ChevronDown,
  LogOut,
  Edit3,
  Shirt,
  Languages,
  MoreHorizontal,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Ticket, UserProfile } from '../types';
import { CURRENT_STUDENT, ROOM_SPECS_B004, DEFAULT_USER_PROFILE } from './student/studentData';
import { MyRoomTab } from './student/MyRoomTab';
import { CleaningChecklistView } from './student/CleaningChecklistView';
import { LaundrySection } from './student/LaundrySection';
import { FeePaymentTab } from './student/FeePaymentTab';
import { MessTab } from './student/MessTab';
import { MaintenanceTab } from './student/MaintenanceTab';
import { AnnouncementsTab } from './student/AnnouncementsTab';
import { WardensAndTransportView } from './student/WardensAndTransportView';
import { UserProfileModal } from './student/UserProfileModal';
import { WARDEN_DIRECTORY, TRANSPORT_VEHICLES_DIRECTORY } from './student/studentData';
import { Copy, Check, Bus, Users } from 'lucide-react';

export type StudentNavTab =
  | 'my-room'
  | 'daily-cleaning'
  | 'laundry'
  | 'fee-payment'
  | 'mess'
  | 'maintenance'
  | 'contacts'
  | 'announcements';

interface StudentPortalProps {
  tickets: Ticket[];
  onCreateTicket: (ticketData: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => void;
  onUpdateTicket?: (ticketId: string, updatedFields: Partial<Ticket>) => void;
  onApproveTicket?: (ticketId: string, feedback?: string) => void;
  userProfile?: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onSignOut?: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  tickets,
  onCreateTicket,
  onUpdateTicket,
  onApproveTicket,
  userProfile,
  onUpdateProfile,
  onSignOut,
  darkMode,
  setDarkMode,
}) => {
  const { t, language, setLanguage, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudentNavTab>('my-room');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const profile = userProfile || DEFAULT_USER_PROFILE;
  const userInitial = (profile.name || 'H').charAt(0).toUpperCase();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2200);
  };

  return (
    <div
      id="student-portal-root"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0E0D0B] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#1C1917]'
      }`}
    >
      {/* PERSISTENT TOP TACTICAL HEADER */}
      <header
        id="student-portal-header"
        className={`sticky top-0 z-40 px-3 sm:px-8 py-3 sm:py-3.5 border-b transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Portal Identity (Mobile: Clean and untruncated) */}
          <div className="flex md:hidden items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white shadow-2xs shrink-0">
              <Crown size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] leading-tight block whitespace-nowrap">
                Real Residence
              </span>
              <span className="text-[9px] font-mono font-bold text-[#8C5828] dark:text-[#F2CA50] tracking-wider uppercase block leading-none">
                Student Portal
              </span>
            </div>
          </div>

          {/* Brand & Portal Identity (Desktop / Laptop: Preserved exactly as before) */}
          <div className="hidden md:flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white shadow-sm shrink-0">
              <Crown size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#8C5828] dark:text-[#F2CA50]">
                  STUDENT RESIDENCE
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-[11px] font-bold text-[#57534E] dark:text-[#A39E93]">
                  ROYAL PARADISE BLOCK
                </span>
              </div>
              <h1 className="text-xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] leading-tight">
                {t.brand}
              </h1>
            </div>
          </div>

          {/* Right Utilities: Language Switch, Emergency Desk, Theme Toggle & Resident Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Language Toggle Button (Segmented Pill: ENG | हिंदी on desktop, EN | हि on mobile) */}
            <div
              id="header-lang-toggle-pill"
              className={`flex items-center p-0.5 rounded-lg sm:rounded-xl border font-mono text-xs transition-all ${
                darkMode ? 'border-[#2B2720] bg-[#1B1A15]' : 'border-[#DCD6CA] bg-[#F6F4EE]'
              }`}
              title={t.langSwitchLabel}
            >
              <button
                type="button"
                id="header-lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#8C5828] text-white shadow-2xs'
                    : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
                aria-label="Switch to English"
              >
                <span className="md:hidden">EN</span>
                <span className="hidden md:inline">ENG</span>
              </button>
              <button
                type="button"
                id="header-lang-btn-hi"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#8C5828] text-white shadow-2xs'
                    : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
                }`}
                aria-label="Switch to Hindi"
              >
                <span className="md:hidden">हि</span>
                <span className="hidden md:inline">हिंदी</span>
              </button>
            </div>

            {/* Quick Emergency Desk Button (Desktop) */}
            <button
              id="emergency-desk-btn"
              onClick={() => setIsContactModalOpen(true)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#FAF8F5] hover:border-[#8C5828]'
                  : 'border-[#DCD6CA] bg-white text-[#1C1917] hover:border-[#8C5828]'
              }`}
            >
              <Phone size={13} className="text-[#8C5828] dark:text-[#F2CA50]" />
              <span>{t.hostelHelpdesk}</span>
            </button>

            {/* Quick Emergency Desk Button (Mobile icon) */}
            <button
              id="emergency-desk-mobile-btn"
              onClick={() => setIsContactModalOpen(true)}
              className={`md:hidden p-1.5 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#F2CA50]'
                  : 'border-[#DCD6CA] bg-white text-[#8C5828]'
              }`}
              title="Hostel Emergency Helpdesk"
              aria-label="Hostel Helpdesk"
            >
              <Phone size={15} />
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#F2CA50] hover:bg-[#25221B]'
                  : 'border-[#DCD6CA] bg-white text-[#8C5828] hover:bg-[#EFECE6]'
              }`}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun size={15} className="sm:w-[17px] sm:h-[17px]" /> : <Moon size={15} className="sm:w-[17px] sm:h-[17px]" />}
            </button>

            {/* Top Right Symbol & Resident Account Menu Trigger (DESKTOP ONLY - On mobile, hero card & bottom bar manage profile) */}
            <div className="hidden md:block relative">
              <button
                id="top-right-user-symbol-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 pl-2 sm:pl-3 border-l py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
                  darkMode
                    ? 'border-[#2B2720] hover:bg-[#1B1A15]'
                    : 'border-[#DCD6CA] hover:bg-[#FAF8F5]'
                }`}
                title="Resident Profile: Click for User Details, Edit Option & Sign Out"
                aria-label="Resident Account Menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#8C5828] text-white flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                  {userInitial}
                </div>
                <div className="hidden lg:block text-left font-mono">
                  <span className="text-xs font-bold block text-[#1C1917] dark:text-[#FAF8F5] leading-none">
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-[#8C5828] dark:text-[#F2CA50] font-bold">
                    {profile.room} · {profile.roomType}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[#78716C] dark:text-[#A39E93] transition-transform duration-150 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Quick Profile Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <motion.div
                      id="user-profile-dropdown-menu"
                      initial={{ opacity: 0, scale: 0.94, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl z-50 p-2 font-mono text-xs ${
                        darkMode ? 'bg-[#141310] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                      }`}
                    >
                      {/* User Identity Header */}
                      <div className="p-3 pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-black text-base shrink-0">
                            {userInitial}
                          </div>
                          <div className="min-w-0">
                            <strong className="block text-sm truncate font-sans text-[#1C1917] dark:text-white">
                              {profile.name}
                            </strong>
                            <span className="text-[10px] text-[#8C5828] dark:text-[#F2CA50] font-bold block truncate">
                              {profile.email}
                            </span>
                            <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block truncate">
                              {profile.room} ({profile.roomType})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Actions */}
                      <div className="p-1 space-y-1">
                        <button
                          id="dropdown-user-details-btn"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-bold cursor-pointer transition-colors ${
                            darkMode ? 'hover:bg-[#1B1A15]' : 'hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <User size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                          <div className="flex-1">
                            <span>{t.userDetails}</span>
                            <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block font-normal">
                              {t.viewRoomBed}
                            </span>
                          </div>
                        </button>

                        <button
                          id="dropdown-edit-profile-btn"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-bold cursor-pointer transition-colors ${
                            darkMode ? 'hover:bg-[#1B1A15]' : 'hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <Edit3 size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                          <div className="flex-1">
                            <span>{t.editDetails}</span>
                            <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block font-normal">
                              {t.updateContact}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Sign Out Action */}
                      <div className="pt-1 mt-1 border-t border-[#DCD6CA] dark:border-[#2B2720]">
                        <button
                          id="dropdown-signout-btn"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            if (onSignOut) onSignOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-500/10 font-bold cursor-pointer transition-colors"
                        >
                          <LogOut size={15} />
                          <span>{t.signOutPortal}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* STUDENT CONTEXT & PROFILE HERO */}
      <section
        id="student-hero-strip"
        className={`px-3 sm:px-8 py-2.5 md:py-4 border-b ${
          darkMode ? 'bg-[#12110E] border-[#2B2720]' : 'bg-[#EAE6DE] border-[#DCD6CA]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
          {/* Student Info Card (Clickable to open user details modal) */}
          <div
            id="student-hero-profile-card"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 md:gap-3 cursor-pointer group"
            title="Click to view full user details or edit profile"
          >
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl border border-[#8C5828]/40 bg-[#8C5828]/10 flex items-center justify-center text-[#8C5828] dark:text-[#F2CA50] font-black text-sm md:text-lg shrink-0 group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-sm md:text-lg font-black font-sans text-[#1C1917] dark:text-[#FAF8F5] group-hover:text-[#8C5828] dark:group-hover:text-[#F2CA50] transition-colors truncate">
                  {profile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50] border border-[#8C5828]/30">
                  {profile.room}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 mt-0.5 font-mono text-[11px] md:text-xs text-[#57534E] dark:text-[#A39E93]">
                <span className="font-bold text-[#1C1917] dark:text-white">
                  {profile.roomType}
                </span>
                <span>•</span>
                <span>{profile.block}</span>
                {profile.college && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-[#8C5828] dark:text-[#F2CA50] font-semibold">{profile.college}</span>
                  </>
                )}
                {profile.year && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-[#1C1917] dark:text-white">{profile.year}</span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile chevron indicator */}
            <div className="md:hidden ml-auto pl-2 flex items-center text-[#78716C] dark:text-[#A39E93] group-hover:text-[#8C5828] dark:group-hover:text-[#F2CA50] transition-colors shrink-0">
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Quick Contacts Bar (Desktop full button) */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs w-auto">
            <a
              href={`mailto:${profile.email}`}
              title="Official Student Email"
              className={`min-h-[38px] flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all ${
                darkMode
                  ? 'border-[#2B2720] bg-[#141310] text-[#FAF8F5] hover:border-[#8C5828]'
                  : 'border-[#DCD6CA] bg-white text-[#1C1917] hover:border-[#8C5828]'
              }`}
            >
              <Mail size={13} className="text-[#8C5828] dark:text-[#F2CA50]" />
              <span className="font-bold">{profile.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* PRIMARY NAVIGATION TABS WITH SMOOTH SPRING GLIDE (DESKTOP & LAPTOP ONLY - PRESERVES LAPTOP VIEW EXACTLY) */}
      <nav
        id="student-main-navigation"
        className={`hidden md:block px-3 sm:px-8 border-b sticky top-[61px] z-30 transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'my-room' as const, label: t.tabRoom, icon: <BedDouble size={16} /> },
            { id: 'daily-cleaning' as const, label: t.tabCleaning, icon: <Sparkles size={16} /> },
            { id: 'laundry' as const, label: t.tabLaundry, icon: <Shirt size={16} /> },
            { id: 'fee-payment' as const, label: t.tabFees, icon: <CreditCard size={16} /> },
            { id: 'mess' as const, label: t.tabMess, icon: <Utensils size={16} /> },
            { id: 'maintenance' as const, label: t.tabComplaints, icon: <Wrench size={16} /> },
            { id: 'contacts' as const, label: t.tabContacts, icon: <Users size={16} /> },
            { id: 'announcements' as const, label: t.tabNotices, icon: <Bell size={16} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.96 }}
                className={`relative min-h-[44px] flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : darkMode
                    ? 'text-[#A39E93] hover:text-white hover:bg-[#1F1D17]'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#EAE6DE]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeStudentPortalTab"
                    className="absolute inset-0 bg-[#8C5828] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* MAIN VIEW CONTAINER WITH SMOOTH ANIMATED TRANSITIONS */}
      <main id="student-portal-main-area" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-8 py-5 sm:py-6 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'my-room' && (
              <MyRoomTab
                darkMode={darkMode}
                userProfile={profile}
                onNavigateToCleaning={() => setActiveTab('daily-cleaning')}
                onNavigateToLaundry={() => setActiveTab('laundry')}
              />
            )}

            {activeTab === 'daily-cleaning' && (
              <CleaningChecklistView darkMode={darkMode} currentUserName={profile.name} />
            )}

            {activeTab === 'laundry' && (
              <LaundrySection darkMode={darkMode} userProfile={profile} />
            )}

            {activeTab === 'fee-payment' && <FeePaymentTab darkMode={darkMode} />}

            {activeTab === 'mess' && <MessTab darkMode={darkMode} />}

            {activeTab === 'maintenance' && (
              <MaintenanceTab
                tickets={tickets}
                onCreateTicket={onCreateTicket}
                onUpdateTicket={onUpdateTicket}
                onApproveTicket={onApproveTicket}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'contacts' && <WardensAndTransportView darkMode={darkMode} />}

            {activeTab === 'announcements' && <AnnouncementsTab darkMode={darkMode} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HOSTEL HELPDESK & WARDEN / TRANSPORT MODAL WITH COPY BUTTONS */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            id="helpdesk-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              id="helpdesk-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 shadow-2xl transition-colors ${
                darkMode ? 'bg-[#141310] border-[#2B2720] text-[#FAF8F5]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <h3 className="font-bold font-sans uppercase text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  Hostel Wardens, Transport & Emergency Contacts
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917] dark:hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#8C5828]/10 border border-[#8C5828]/30 flex items-center justify-between font-mono text-xs">
              <span className="text-[#8C5828] dark:text-[#F2CA50] font-bold">
                Tap 'Copy Number' beside any contact to copy immediately to clipboard.
              </span>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  setActiveTab('contacts');
                }}
                className="text-[#8C5828] dark:text-[#F2CA50] hover:underline font-black flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Page</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* WARDENS DIRECTORY IN MODAL */}
            <div className="mt-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#DCD6CA]/70 dark:border-[#2B2720]/70">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#8C5828] dark:text-[#F2CA50] flex items-center gap-1.5">
                  <Shield size={14} />
                  Hostel Wardens Directory
                </span>
                <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                  Royal Paradise Block B
                </span>
              </div>

              <div className="divide-y divide-[#DCD6CA] dark:divide-[#2B2720] font-mono text-xs">
                {WARDEN_DIRECTORY.map((warden) => {
                  const isCopied = copiedId === `modal-w-${warden.id}`;
                  return (
                    <div key={warden.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#1C1917] dark:text-white text-sm">{warden.name}</strong>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50]">
                            {warden.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-0.5">
                          {warden.role} · {warden.office} ({warden.intercom})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(warden.phone, `modal-w-${warden.id}`)}
                          className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] hover:border-[#8C5828] bg-black/[0.02] dark:bg-white/[0.02] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy: {warden.phone}</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`tel:${warden.phone.replace(/\s+/g, '')}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#8C5828] text-white font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRANSPORT DRIVERS IN MODAL */}
            <div className="mt-5">
              <div className="flex items-center justify-between pb-1 border-b border-[#DCD6CA]/70 dark:border-[#2B2720]/70">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#8C5828] dark:text-[#F2CA50] flex items-center gap-1.5">
                  <Bus size={14} />
                  Campus Transport & Drivers
                </span>
                <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                  Authorized University Fleet
                </span>
              </div>

              <div className="divide-y divide-[#DCD6CA] dark:divide-[#2B2720] font-mono text-xs">
                {TRANSPORT_VEHICLES_DIRECTORY.map((transport) => {
                  const isCopied = copiedId === `modal-t-${transport.id}`;
                  return (
                    <div key={transport.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#1C1917] dark:text-white text-sm">{transport.serviceName}</strong>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-black/5 dark:bg-white/5 border border-[#DCD6CA] dark:border-[#2B2720]">
                            {transport.vehicleNo}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-0.5">
                          Driver: {transport.driverName} · {transport.route} ({transport.timings})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(transport.phone, `modal-t-${transport.id}`)}
                          className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] hover:border-[#8C5828] bg-black/[0.02] dark:bg-white/[0.02] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy: {transport.phone}</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`tel:${transport.phone.replace(/\s+/g, '')}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#8C5828] text-white font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EMERGENCY & FINANCE DESKS */}
            <div className="mt-5 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720]">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#8C5828] dark:text-[#F2CA50] block mb-2">
                Rapid Emergency & Finance Clearance
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'}`}>
                  <div className="flex items-center justify-between">
                    <strong className="text-red-600 dark:text-red-400">Medical Ambulance</strong>
                    <a href="tel:108" className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[11px]">108</a>
                  </div>
                  <span className="text-[10px] text-[#57534E] dark:text-[#A39E93]">Gate 1 Medical Center</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'}`}>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1C1917] dark:text-white">Accounts & Finance Desk</strong>
                    <button
                      onClick={() => handleCopy('+91 98100 87654', 'modal-acc')}
                      className="text-[11px] text-[#8C5828] dark:text-[#F2CA50] font-bold hover:underline cursor-pointer"
                    >
                      {copiedId === 'modal-acc' ? 'Copied!' : 'Copy: +91 98100 87654'}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#57534E] dark:text-[#A39E93]">Room B-004 Student Ledger</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* RESIDENT USER DETAILS & EDIT PROFILE MODAL */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={profile}
        onUpdateProfile={(updated) => {
          if (onUpdateProfile) {
            onUpdateProfile(updated);
          }
        }}
        onSignOut={() => {
          setIsProfileModalOpen(false);
          if (onSignOut) {
            onSignOut();
          }
        }}
        darkMode={darkMode}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR (OPTIMIZED FOR MOBILE TOUCH & SMOOTH PERFORMANCE) */}
      <div
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-colors ${
          darkMode ? 'bg-[#141310]/95 border-[#2B2720]' : 'bg-[#FFFDF9]/95 border-[#DCD6CA]'
        }`}
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-5 h-14 max-w-lg mx-auto px-1">
          {[
            { id: 'my-room' as const, label: t.tabRoom, icon: <BedDouble size={20} /> },
            { id: 'daily-cleaning' as const, label: t.tabCleaning, icon: <Sparkles size={20} /> },
            { id: 'laundry' as const, label: t.tabLaundry, icon: <Shirt size={20} /> },
            { id: 'mess' as const, label: t.tabMess, icon: <Utensils size={20} /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMoreOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-92 transition-all relative select-none ${
                  isActive
                    ? 'text-[#8C5828] dark:text-[#F2CA50] font-bold'
                    : darkMode
                    ? 'text-[#78716C] hover:text-[#D6D3CD]'
                    : 'text-[#A8A29E] hover:text-[#1C1917]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeMobileTabIndicator"
                    className="absolute top-0 w-8 h-0.5 bg-[#8C5828] dark:bg-[#F2CA50] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {item.icon}
                <span className="text-[10px] font-bold font-sans tracking-tight truncate max-w-[58px]">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Sheet Trigger Button */}
          {(() => {
            const isMoreActive = ['fee-payment', 'maintenance', 'contacts', 'announcements'].includes(activeTab);
            return (
              <button
                id="mobile-tab-more"
                onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-92 transition-all relative select-none ${
                  isMobileMoreOpen || isMoreActive
                    ? 'text-[#8C5828] dark:text-[#F2CA50] font-bold'
                    : darkMode
                    ? 'text-[#78716C] hover:text-[#D6D3CD]'
                    : 'text-[#A8A29E] hover:text-[#1C1917]'
                }`}
              >
                {isMoreActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-[#8C5828] dark:bg-[#F2CA50] rounded-full" />
                )}
                <div className="relative">
                  <MoreHorizontal size={20} />
                  {isMoreActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#8C5828] dark:bg-[#F2CA50]" />
                  )}
                </div>
                <span className="text-[10px] font-bold font-sans tracking-tight truncate max-w-[58px]">
                  {t.tabMore}
                </span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* MOBILE MORE MENU BOTTOM SHEET */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed inset-0 z-45 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileMoreOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t shadow-2xl p-4 sm:p-5 transition-colors ${
                darkMode ? 'bg-[#181611] border-[#3E3A32] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
              }`}
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
            >
              <div className="w-10 h-1 rounded-full bg-[#78716C]/40 mx-auto mb-3" />
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                <strong className="font-sans text-sm font-bold">{t.tabMore}</strong>
                <button
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-1 text-[#78716C] hover:text-black dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {[
                  { id: 'fee-payment' as const, label: t.tabFees, icon: <CreditCard size={17} /> },
                  { id: 'maintenance' as const, label: t.tabComplaints, icon: <Wrench size={17} /> },
                  { id: 'contacts' as const, label: t.tabContacts, icon: <Users size={17} /> },
                  { id: 'announcements' as const, label: t.tabNotices, icon: <Bell size={17} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMoreOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] p-2.5 rounded-xl border flex items-center gap-2.5 text-left font-bold transition-colors cursor-pointer active:scale-95 ${
                      activeTab === item.id
                        ? 'bg-[#8C5828] text-white border-[#8C5828]'
                        : darkMode
                        ? 'bg-[#141310] border-[#2B2720] text-[#EDE9E3] hover:border-[#8C5828]'
                        : 'bg-[#FAF8F5] border-[#DCD6CA] text-[#1C1917] hover:border-[#8C5828]'
                    }`}
                  >
                    <span className={activeTab === item.id ? 'text-white' : 'text-[#8C5828] dark:text-[#F2CA50]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Profile & Signout in More sheet */}
              <div className="mt-3 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720] flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className={`flex-1 min-h-[42px] rounded-xl border font-bold flex items-center justify-center gap-2 text-xs font-mono transition-colors active:scale-95 ${
                    darkMode ? 'border-[#2B2720] bg-[#141310]' : 'border-[#DCD6CA] bg-[#FAF8F5]'
                  }`}
                >
                  <User size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                  <span>{t.profileBtn}</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setIsMobileMoreOpen(false);
                      onSignOut();
                    }}
                    className="min-h-[42px] px-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 text-xs font-mono active:scale-95"
                  >
                    <LogOut size={15} />
                    <span>{t.signOutBtn}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TACTICAL FOOTER */}
      <footer
        id="student-footer"
        className={`mt-auto px-4 sm:px-8 py-5 border-t font-mono text-xs ${
          darkMode ? 'bg-[#12110E] border-[#2B2720] text-[#A39E93]' : 'bg-[#EAE6DE] border-[#DCD6CA] text-[#57534E]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Crown size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
            <span className="font-bold text-[#1C1917] dark:text-white">REALM OF HOSTELS · ROYAL PARADISE RESIDENCE</span>
            <span>•</span>
            <span>Room B-004 (3-Seater AC)</span>
          </div>
          <div className="text-[11px] text-[#57534E] dark:text-[#A39E93]">
            Royal Paradise Student Hostel · Knowledge Park, Greater Noida
          </div>
        </div>
      </footer>
    </div>
  );
};
