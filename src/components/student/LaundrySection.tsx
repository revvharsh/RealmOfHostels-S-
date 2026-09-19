import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shirt,
  Plus,
  FileText,
  Download,
  Upload,
  Camera,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  Phone,
  User,
  Home,
  AlertCircle,
  Eye,
  Tag,
} from 'lucide-react';
import { LaundryOrder, UserProfile } from '../../types';
import { downloadLaundryReceiptPdf } from '../../utils/laundryPdf';

interface LaundrySectionProps {
  darkMode: boolean;
  userProfile?: UserProfile;
}

const INITIAL_LAUNDRY_HISTORY: LaundryOrder[] = [
  {
    id: 'lnd-order-1',
    receiptNumber: 'LND-2026-09-0842',
    studentName: 'Harsh',
    roomNumber: 'Room B-004',
    mobileNumber: '+91 88099 00560',
    clothCount: 8,
    clothBreakdown: [
      { type: 'Shirts / T-Shirts', count: 4 },
      { type: 'Trousers / Jeans', count: 2 },
      { type: 'Bedspread & Pillow Cover', count: 2 },
    ],
    status: 'Ready for Pickup',
    createdAt: 'Sep 13, 2026 · 09:30 AM',
    expectedDelivery: 'Sep 15, 2026 · 06:00 PM',
    specialInstructions: 'Standard wash & steam iron for cotton shirts.',
    tokenPin: '4819',
    photoUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80',
    photoFileName: 'laundry_bundle_b004.jpg',
  },
  {
    id: 'lnd-order-2',
    receiptNumber: 'LND-2026-09-0791',
    studentName: 'Harsh',
    roomNumber: 'Room B-004',
    mobileNumber: '+91 88099 00560',
    clothCount: 6,
    clothBreakdown: [
      { type: 'Shirts / T-Shirts', count: 3 },
      { type: 'Trousers', count: 2 },
      { type: 'Bath Towel', count: 1 },
    ],
    status: 'Delivered',
    createdAt: 'Sep 10, 2026 · 10:15 AM',
    expectedDelivery: 'Sep 12, 2026 · 05:00 PM',
    tokenPin: '3104',
  },
];

export const LaundrySection: React.FC<LaundrySectionProps> = ({ darkMode, userProfile }) => {
  const [orders, setOrders] = useState<LaundryOrder[]>(INITIAL_LAUNDRY_HISTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<LaundryOrder | null>(null);

  // Form State for New Laundry
  const [studentName, setStudentName] = useState(userProfile?.name || 'Harsh');
  const [roomNumber, setRoomNumber] = useState(userProfile?.room || 'Room B-004');
  const [mobileNumber, setMobileNumber] = useState(userProfile?.phone || '+91 88099 00560');
  const [clothCount, setClothCount] = useState(5);
  const [shirtsCount, setShirtsCount] = useState(3);
  const [pantsCount, setPantsCount] = useState(2);
  const [linenCount, setLinenCount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setFormError('Please enter student name.');
      return;
    }
    if (!roomNumber.trim()) {
      setFormError('Please enter room number.');
      return;
    }
    if (!mobileNumber.trim()) {
      setFormError('Please enter mobile number.');
      return;
    }
    if (clothCount < 1) {
      setFormError('Please enter at least 1 piece of clothing.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const deliveryFormatted = deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' · 06:00 PM';

    const newOrder: LaundryOrder = {
      id: `lnd-${Date.now()}`,
      receiptNumber: `LND-2026-09-${randomSuffix}`,
      studentName: studentName.trim(),
      roomNumber: roomNumber.trim(),
      mobileNumber: mobileNumber.trim(),
      clothCount: Number(clothCount),
      clothBreakdown: [
        { type: 'Shirts / Tops', count: shirtsCount },
        { type: 'Trousers / Bottoms', count: pantsCount },
        ...(linenCount > 0 ? [{ type: 'Linens / Towels', count: linenCount }] : []),
      ],
      photoUrl: photoPreview || undefined,
      photoFileName: photoFileName || undefined,
      status: 'Received',
      createdAt: `${dateFormatted} · ${timeFormatted}`,
      expectedDelivery: deliveryFormatted,
      specialInstructions: specialInstructions.trim() || undefined,
      tokenPin: pin,
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setSelectedReceipt(newOrder); // Open receipt directly
    setFormError(null);
  };

  return (
    <div id="laundry-section" className="space-y-6">
      {/* Top Banner */}
      <div
        className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-xs transition-colors ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-mono shrink-0 shadow-xs">
              <Shirt size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase text-[#8C5828] dark:text-[#F2CA50]">
                  Campus Resident Laundry Depot
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Royal Paradise Block
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-sans text-[#1C1917] dark:text-[#FAF8F5] mt-0.5">
                Daily Laundry & Dry-Clean Management
              </h1>
              <p className="text-xs font-mono text-[#78716C] dark:text-[#A39E93] mt-1">
                Drop clothes, capture bundle photo, get instant receipt voucher and track washing progress
              </p>
            </div>
          </div>

          {/* New Laundry Action Button */}
          <motion.button
            id="add-new-laundry-btn"
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Plus size={16} />
            <span>Drop Laundry & Generate Receipt</span>
          </motion.button>
        </div>

        {/* Quick Laundry Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
            <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block">
              Free Quota
            </span>
            <strong className="text-sm font-black text-[#1C1917] dark:text-white">
              30 Pcs / Month
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
            <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block">
              Active Drops
            </span>
            <strong className="text-sm font-black text-[#8C5828] dark:text-[#F2CA50]">
              {orders.filter((o) => o.status !== 'Delivered').length} Orders
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
            <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block">
              Ready for Pickup
            </span>
            <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {orders.filter((o) => o.status === 'Ready for Pickup').length} Ready
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCD6CA]/70 dark:border-[#2B2720]">
            <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block">
              Depot Timings
            </span>
            <strong className="text-sm font-black text-[#1C1917] dark:text-white">
              08:00 AM - 08:00 PM
            </strong>
          </div>
        </div>
      </div>

      {/* STUDENT LAUNDRY HISTORY SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
            <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
              Student Laundry History & Receipts
            </h2>
          </div>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
            {orders.length} Logged Deposits
          </span>
        </div>

        {/* History Cards */}
        <div className="space-y-3.5">
          {orders.map((order) => (
            <div
              key={order.id}
              id={`laundry-card-${order.id}`}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Photo Thumbnail or Icon */}
                {order.photoUrl ? (
                  <img
                    src={order.photoUrl}
                    alt="Laundry bundle"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#DCD6CA] dark:border-[#2B2720] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#8C5828] dark:text-[#F2CA50] shrink-0 font-mono">
                    <Shirt size={24} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#8C5828] dark:text-[#F2CA50]">
                      {order.receiptNumber}
                    </span>
                    <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                    <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
                      PIN: <strong>{order.tokenPin}</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase ${
                        order.status === 'Ready for Pickup'
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                          : order.status === 'In Wash' || order.status === 'Received'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-black/5 dark:bg-white/5 text-[#78716C] dark:text-[#A39E93]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-sans text-[#1C1917] dark:text-white mt-1">
                    {order.clothCount} Pieces of Laundry
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                    <span>Deposited: {order.createdAt}</span>
                    <span>•</span>
                    <span>Expected: {order.expectedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Actions: View Receipt Modal & Download PDF */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
                <button
                  id={`view-receipt-btn-${order.id}`}
                  onClick={() => setSelectedReceipt(order)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    darkMode
                      ? 'border-[#2B2720] bg-[#1B1A15] hover:bg-[#25221B] text-[#FAF8F5]'
                      : 'border-[#DCD6CA] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1C1917]'
                  }`}
                >
                  <Eye size={14} className="text-[#8C5828] dark:text-[#F2CA50]" />
                  <span>View Receipt</span>
                </button>

                <button
                  id={`download-pdf-btn-${order.id}`}
                  onClick={() => downloadLaundryReceiptPdf(order)}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Download receipt as PDF"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING OVERVIEW / POPUP: ADD NEW LAUNDRY (RECEIPT THEME) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            id="new-laundry-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              id="new-laundry-receipt-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-5 sm:p-7 relative transition-colors max-h-[92vh] overflow-y-auto ${
                darkMode
                  ? 'bg-[#181611] border-[#3E3A32] text-[#FAF8F5]'
                  : 'bg-[#FFFDF9] border-[#DCD6CA] text-[#1C1917]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Perforated Receipt Header Style */}
              <div className="text-center pb-4 border-b border-dashed border-[#DCD6CA] dark:border-[#3E3A32]">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50]">
                  REALM OF HOSTELS · LAUNDRY DEPOT
                </span>
                <h2 className="text-xl font-black font-sans tracking-tight text-[#1C1917] dark:text-white mt-0.5">
                  Drop Laundry & Generate Receipt
                </h2>
                <p className="text-[11px] font-mono text-[#78716C] dark:text-[#A39E93] mt-1">
                  Fill details below to generate your official printable receipt voucher
                </p>
              </div>

              {/* Close Button */}
              <button
                id="close-new-laundry-btn"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {formError && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Receipt Input Form */}
              <form onSubmit={handleCreateOrder} className="mt-4 space-y-4 font-mono text-xs">
                {/* 1. Student Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      id="laundry-student-name-input"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Harsh"
                      className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                        darkMode
                          ? 'border-[#2B2720] bg-[#141310] text-white focus:border-[#8C5828]'
                          : 'border-[#DCD6CA] bg-white text-[#1C1917] focus:border-[#8C5828]'
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Room Number & 3. Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                      Room Number
                    </label>
                    <div className="relative">
                      <Home size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                      <input
                        id="laundry-room-number-input"
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Room B-004"
                        className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                          darkMode
                            ? 'border-[#2B2720] bg-[#141310] text-white focus:border-[#8C5828]'
                            : 'border-[#DCD6CA] bg-white text-[#1C1917] focus:border-[#8C5828]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                      <input
                        id="laundry-mobile-number-input"
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. +91 88099 00560"
                        className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                          darkMode
                            ? 'border-[#2B2720] bg-[#141310] text-white focus:border-[#8C5828]'
                            : 'border-[#DCD6CA] bg-white text-[#1C1917] focus:border-[#8C5828]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Number of Clothes */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93]">
                      Number of Clothes (Total Pieces)
                    </label>
                    <span className="font-bold text-[#8C5828] dark:text-[#F2CA50]">
                      {clothCount} Clothes
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setClothCount(Math.max(1, clothCount - 1))}
                      className="w-11 h-11 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] flex items-center justify-center font-bold text-base cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      -
                    </button>
                    <input
                      id="laundry-cloth-count-input"
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={clothCount}
                      onChange={(e) => setClothCount(Number(e.target.value) || 1)}
                      className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border text-center text-base font-mono font-black outline-none ${
                        darkMode
                          ? 'border-[#2B2720] bg-[#141310] text-white focus:border-[#8C5828]'
                          : 'border-[#DCD6CA] bg-white text-[#1C1917] focus:border-[#8C5828]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setClothCount(clothCount + 1)}
                      className="w-11 h-11 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] flex items-center justify-center font-bold text-base cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick Breakdown Sub-inputs */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#DCD6CA]/60 dark:border-[#2B2720] text-[10px]">
                    <div>
                      <span className="text-[#78716C] dark:text-[#A39E93] block font-bold">Shirts/Tops</span>
                      <input
                        type="number"
                        min="0"
                        value={shirtsCount}
                        onChange={(e) => setShirtsCount(Number(e.target.value) || 0)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[#78716C] dark:text-[#A39E93] block font-bold">Pants/Jeans</span>
                      <input
                        type="number"
                        min="0"
                        value={pantsCount}
                        onChange={(e) => setPantsCount(Number(e.target.value) || 0)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[#78716C] dark:text-[#A39E93] block font-bold">Linen/Towels</span>
                      <input
                        type="number"
                        min="0"
                        value={linenCount}
                        onChange={(e) => setLinenCount(Number(e.target.value) || 0)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Option to Upload Photo of Given Laundry */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                    Upload Photo of Given Laundry (Bundle Verification)
                  </label>

                  {photoPreview ? (
                    <div className="relative rounded-2xl border border-[#DCD6CA] dark:border-[#2B2720] overflow-hidden p-2 bg-black/[0.02] dark:bg-white/[0.02]">
                      <img
                        src={photoPreview}
                        alt="Uploaded laundry preview"
                        className="w-full h-36 object-cover rounded-xl"
                      />
                      <div className="mt-2 flex items-center justify-between text-xs px-1">
                        <span className="truncate text-[#57534E] dark:text-[#A39E93] font-bold">
                          ✓ {photoFileName || 'Laundry Bundle Photo Attached'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoFileName(null);
                          }}
                          className="text-red-500 hover:underline font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      id="upload-laundry-photo-label"
                      className={`min-h-[100px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors ${
                        darkMode
                          ? 'border-[#3E3A32] hover:border-[#8C5828] bg-[#141310]'
                          : 'border-[#DCD6CA] hover:border-[#8C5828] bg-white'
                      }`}
                    >
                      <input
                        id="upload-laundry-photo-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-[#8C5828]/10 text-[#8C5828] dark:text-[#F2CA50] flex items-center justify-center mb-1.5">
                        <Camera size={18} />
                      </div>
                      <span className="text-xs font-bold text-[#1C1917] dark:text-white block">
                        Tap to Take Photo or Upload Image
                      </span>
                      <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block mt-0.5">
                        Supports bundle photo for item verification & proof
                      </span>
                    </label>
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                    Fabric Notes / Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Gentle cycle for woolen sweater, steam press shirts"
                    className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-mono outline-none ${
                      darkMode
                        ? 'border-[#2B2720] bg-[#141310] text-white focus:border-[#8C5828]'
                        : 'border-[#DCD6CA] bg-white text-[#1C1917] focus:border-[#8C5828]'
                    }`}
                  />
                </div>

                {/* Submit & Generate Button */}
                <div className="pt-2">
                  <motion.button
                    id="submit-laundry-receipt-btn"
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <Receipt size={16} />
                    <span>Generate Laundry Receipt Voucher</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GENERATED RECEIPT FLOATING OVERVIEW MODAL (WITH PDF DOWNLOAD) */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            id="receipt-overview-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              id="printable-receipt-card"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 relative transition-colors max-h-[92vh] overflow-y-auto ${
                darkMode
                  ? 'bg-[#181611] border-[#3E3A32] text-[#FAF8F5]'
                  : 'bg-[#FFFDF9] border-[#DCD6CA] text-[#1C1917]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-[#DCD6CA] dark:border-[#3E3A32]">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#8C5828] text-white flex items-center justify-center shadow-xs">
                  <Receipt size={24} />
                </div>
                <h2 className="text-lg font-black font-sans tracking-tight text-[#1C1917] dark:text-white">
                  REALM OF HOSTELS
                </h2>
                <span className="font-mono text-[10px] uppercase font-bold text-[#8C5828] dark:text-[#F2CA50] block">
                  Official Campus Laundry Depot Receipt
                </span>
                <span className="text-[10px] font-mono text-[#78716C] dark:text-[#A39E93]">
                  Royal Paradise Student Hostel · Knowledge Park
                </span>
              </div>

              {/* Voucher Number & PIN Banner */}
              <div className="my-4 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-[#DCD6CA] dark:border-[#2B2720] text-center font-mono">
                <span className="text-[10px] font-bold uppercase text-[#78716C] dark:text-[#A39E93] block">
                  Receipt Voucher Number
                </span>
                <strong className="text-base font-black text-[#8C5828] dark:text-[#F2CA50] tracking-wider block">
                  {selectedReceipt.receiptNumber}
                </strong>
                <div className="mt-1 flex items-center justify-center gap-2 text-xs">
                  <span className="text-[#57534E] dark:text-[#A39E93]">Pickup Token PIN:</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#8C5828] text-white font-black">
                    {selectedReceipt.tokenPin}
                  </span>
                </div>
              </div>

              {/* Itemized Receipt Details */}
              <div className="space-y-2 py-2 border-b border-dashed border-[#DCD6CA] dark:border-[#3E3A32] font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Date & Time:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">{selectedReceipt.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Student Name:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">{selectedReceipt.studentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Room Number:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">{selectedReceipt.roomNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Mobile Number:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">{selectedReceipt.mobileNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Total Pieces:</span>
                  <strong className="font-black text-[#8C5828] dark:text-[#F2CA50]">
                    {selectedReceipt.clothCount} Clothes
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Status:</span>
                  <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    {selectedReceipt.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] dark:text-[#A39E93]">Expected Delivery:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">{selectedReceipt.expectedDelivery}</span>
                </div>

                {selectedReceipt.clothBreakdown && selectedReceipt.clothBreakdown.length > 0 && (
                  <div className="pt-2 border-t border-[#DCD6CA]/60 dark:border-[#2B2720]">
                    <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block mb-1">
                      Piece Breakdown:
                    </span>
                    {selectedReceipt.clothBreakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-[#57534E] dark:text-[#A39E93]">• {item.type}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReceipt.photoUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-[#78716C] dark:text-[#A39E93] block mb-1">
                      Laundry Photo Verification:
                    </span>
                    <img
                      src={selectedReceipt.photoUrl}
                      alt="Uploaded laundry proof"
                      className="w-full h-32 object-cover rounded-xl border border-[#DCD6CA] dark:border-[#2B2720]"
                    />
                  </div>
                )}
              </div>

              {/* Barcode & Download PDF Button */}
              <div className="pt-4 space-y-3 font-mono text-center">
                <div className="text-[11px] font-black tracking-widest text-[#78716C] dark:text-[#A39E93]">
                  |||||| ||||| |||| |||||| |||||
                </div>
                <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block">
                  Show this receipt & token PIN at laundry counter for pickup
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <motion.button
                    id="download-receipt-pdf-primary-btn"
                    onClick={() => downloadLaundryReceiptPdf(selectedReceipt)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Download size={15} />
                    <span>Download PDF</span>
                  </motion.button>

                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917] dark:hover:text-white font-bold text-xs cursor-pointer"
                  >
                    Close Voucher
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
