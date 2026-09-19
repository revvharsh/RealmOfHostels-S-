import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  MessageSquare,
  Copy,
  Check,
  User,
  GraduationCap,
  MapPin,
  Heart,
  Mail,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { Roommate } from '../../types';

interface BedDetailModalProps {
  roommate: Roommate | null;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const BedDetailModal: React.FC<BedDetailModalProps> = ({
  roommate,
  isOpen,
  onClose,
  darkMode,
}) => {
  const [showContactAction, setShowContactAction] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!roommate) return null;

  const cleanPhone = roommate.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
    roommate.name
  )}%2C%20reaching%20out%20from%20Room%20B-004%20Portal.`;
  const telUrl = `tel:${roommate.phone}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(roommate.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initial = roommate.name.charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="bed-detail-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="bed-detail-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-5 sm:p-7 relative transition-colors ${
              darkMode ? 'bg-[#141310] border-[#2B2720] text-[#FAF8F5]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-bed-detail-btn"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header / Identity */}
            <div className="flex items-center gap-4 pb-4 sm:pb-5 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-black text-2xl font-mono shadow-md shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase text-[#8C5828] dark:text-[#F2CA50]">
                    {roommate.bed}
                  </span>
                  {roommate.isSelf && (
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-[#8C5828] text-white">
                      You
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-sans text-[#1C1917] dark:text-white truncate mt-0.5">
                  {roommate.name}
                </h2>
                <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] truncate">
                  Room B-004 · Royal Paradise Block
                </p>
              </div>
            </div>

            {/* Structured Details Grid */}
            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
                  <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block flex items-center gap-1">
                    <GraduationCap size={12} className="text-[#8C5828] dark:text-[#F2CA50]" />
                    College
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5 leading-snug">
                    {roommate.college || 'University Student'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
                  <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block">
                    Current Year
                  </span>
                  <strong className="text-[#8C5828] dark:text-[#F2CA50] block mt-0.5 font-bold">
                    {roommate.year || '1st Year'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
                  <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block flex items-center gap-1">
                    <Heart size={12} className="text-rose-500" />
                    Blood Group
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5">
                    {roommate.bloodGroup}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
                  <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-500" />
                    Hometown / City
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5 truncate">
                    {roommate.homeCity}
                  </strong>
                </div>
              </div>

              {/* Email */}
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block flex items-center gap-1">
                    <Mail size={12} className="text-[#8C5828] dark:text-[#F2CA50]" />
                    Official Email
                  </span>
                  <span className="text-[#1C1917] dark:text-white font-semibold text-xs truncate block mt-0.5">
                    {roommate.email}
                  </span>
                </div>
                <a
                  href={`mailto:${roommate.email}`}
                  className="p-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] text-[#8C5828] dark:text-[#F2CA50] hover:bg-black/5 dark:hover:bg-white/5"
                  title="Send Email"
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Mobile Number - Clickable to open action sheet */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase block mb-1.5">
                  Mobile Number (Click for Options)
                </span>
                <button
                  id="roommate-mobile-click-btn"
                  onClick={() => setShowContactAction(true)}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                    darkMode
                      ? 'border-[#8C5828]/50 bg-[#1B1A15] hover:bg-[#25221B]'
                      : 'border-[#8C5828]/40 bg-[#FAF8F5] hover:bg-[#F3EDE2]'
                  }`}
                  title="Click to WhatsApp, Call, or Copy Number"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#8C5828] text-white flex items-center justify-center shrink-0">
                      <Phone size={15} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black tracking-wider text-[#1C1917] dark:text-white block font-mono">
                        {roommate.phone}
                      </span>
                      <span className="text-[10px] text-[#8C5828] dark:text-[#F2CA50] font-bold block">
                        Tap for WhatsApp, Call or Copy
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#8C5828] text-white group-hover:bg-[#72451E]">
                    Options
                  </span>
                </button>
              </div>
            </div>

            {/* Action Dialog / Floating Choice Overlay */}
            <AnimatePresence>
              {showContactAction && (
                <motion.div
                  id="contact-options-overlay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className={`mt-4 p-4 rounded-2xl border shadow-lg ${
                    darkMode ? 'bg-[#1E1C16] border-[#3E3A32]' : 'bg-[#F9F7F2] border-[#DCD6CA]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                    <span className="font-mono text-xs font-bold text-[#1C1917] dark:text-white">
                      Choose Contact Method
                    </span>
                    <button
                      onClick={() => setShowContactAction(false)}
                      className="text-[#78716C] hover:text-[#1C1917] dark:hover:text-white text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                    {/* Option 1: WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <MessageSquare size={15} />
                      <span>WhatsApp</span>
                    </a>

                    {/* Option 2: Call */}
                    <a
                      href={telUrl}
                      className={`min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        darkMode
                          ? 'border-[#2B2720] bg-[#141310] text-white hover:border-[#8C5828]'
                          : 'border-[#DCD6CA] bg-white text-[#1C1917] hover:border-[#8C5828]'
                      }`}
                    >
                      <Phone size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                      <span>Call Now</span>
                    </a>

                    {/* Option 3: Copy Number */}
                    <button
                      onClick={handleCopyNumber}
                      className={`min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : darkMode
                          ? 'border-[#2B2720] bg-[#141310] text-white hover:border-[#8C5828]'
                          : 'border-[#DCD6CA] bg-white text-[#1C1917] hover:border-[#8C5828]'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={15} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                          <span>Copy No.</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
