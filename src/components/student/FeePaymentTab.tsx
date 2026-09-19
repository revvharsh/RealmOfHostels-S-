import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  History,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { FeeRecord } from '../../types';
import {
  INITIAL_FEE_RECORDS,
  CURRENT_FEE_NOTICE,
} from './studentData';
import { ReceiptModal } from './ReceiptModal';

interface FeePaymentTabProps {
  darkMode: boolean;
}

export const FeePaymentTab: React.FC<FeePaymentTabProps> = ({ darkMode }) => {
  const [records, setRecords] = useState<FeeRecord[]>(INITIAL_FEE_RECORDS);
  const [selectedYear, setSelectedYear] = useState<string>('2026 - 2027');
  const [activeReceipt, setActiveReceipt] = useState<FeeRecord | null>(null);
  const [feeNotice, setFeeNotice] = useState(CURRENT_FEE_NOTICE);

  // Quick Pay Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(45000);
  const [payMode, setPayMode] = useState<'UPI' | 'NetBanking' | 'Debit/Credit Card' | 'NEFT'>('UPI');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const filteredRecords = records.filter((rec) => {
    if (selectedYear === 'All') return true;
    return rec.academicYear === selectedYear;
  });

  // Calculate dynamic total paid
  const totalPaidSum = records.reduce((acc, curr) => acc + curr.amountPaid, 0);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceiptNo = `ROH-REC-${Math.floor(10000 + Math.random() * 90000)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const amt = Number(payAmount);
    const newRecord: FeeRecord = {
      id: `fee-${Date.now()}`,
      academicYear: selectedYear === 'All' ? '2026 - 2027' : selectedYear,
      semester: 'Year 1 · Term 2 Advance',
      description: 'Hostel Term 2 AC Room Advance & Mess Dues Clearance',
      amountPaid: amt,
      paymentDate: todayStr,
      paymentMode: payMode,
      receiptNo: newReceiptNo,
      status: 'Verified & Paid',
      transactionId: `TXN-UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      breakdown: {
        roomRent: Math.round(amt * 0.55),
        acSupplement: Math.round(amt * 0.15),
        messDietetics: Math.round(amt * 0.2),
        securityDeposit: 0,
        amenitiesLaundry: Math.round(amt * 0.1),
      },
    };

    setRecords([newRecord, ...records]);
    setIsPayModalOpen(false);

    // If paying full due amount, dismiss notice
    if (amt >= (feeNotice?.amountDue || 45000)) {
      setFeeNotice(null as any);
    }

    setPaymentSuccessMsg(
      `Payment of ₹${amt.toLocaleString('en-IN')} processed successfully! Receipt #${newReceiptNo} generated.`
    );
    setTimeout(() => {
      setPaymentSuccessMsg(null);
    }, 6000);
  };

  return (
    <div id="fee-payment-tab-content" className="space-y-6">
      {/* Top Banner & Financial Highlights */}
      <div
        id="fee-top-banner"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-[#141310] border-[#2B2720] shadow-md'
            : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white font-mono font-black text-xl shadow-sm shrink-0">
              <CreditCard size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] uppercase tracking-wider">
                  Hostel Accounts & Finance Desk
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Room B-004 Ledger
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] mt-1">
                Fee Payment & Ledger Portal
              </h1>
              <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-1">
                3-Seater AC Room Package · Direct Tax Invoices & Digital Receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
              <ShieldCheck size={14} />
              Accounts Office Verified Ledger
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {paymentSuccessMsg && (
        <div
          id="payment-success-banner"
          className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-mono text-xs flex items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="font-bold">{paymentSuccessMsg}</span>
          </div>
          <button
            onClick={() => setPaymentSuccessMsg(null)}
            className="text-xs text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 STRATEGIC SUMMARY CARDS (Total Fee Paid, Next Due Date, Current Due, Pay Now) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Fee Paid */}
        <div
          id="stat-total-paid"
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all ${
            darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A39E93] truncate">
              Total Fee Paid
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] block">
              ₹{totalPaidSum.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#57534E] dark:text-[#A39E93] block mt-0.5 truncate">
              Accumulated Total
            </span>
          </div>
        </div>

        {/* Card 2: Next Due Date */}
        <div
          id="stat-next-due-date"
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all ${
            darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A39E93] truncate">
              Next Due Date
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8C5828]/10 text-[#8C5828] dark:text-[#F2CA50] flex items-center justify-center shrink-0">
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] block truncate">
              {feeNotice?.dueDate || '15 Oct 2026'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold block mt-0.5 truncate">
              Term 2 Cutoff
            </span>
          </div>
        </div>

        {/* Card 3: Outstanding Due Amount */}
        <div
          id="stat-current-due"
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all ${
            darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A39E93] truncate">
              Pending Due
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-3xl font-black font-sans tracking-tight text-amber-700 dark:text-amber-400 block truncate">
              ₹{feeNotice ? feeNotice.amountDue.toLocaleString('en-IN') : '0'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#57534E] dark:text-[#A39E93] block mt-0.5 truncate">
              {feeNotice ? 'Notice Issued' : 'Zero Balance'}
            </span>
          </div>
        </div>

        {/* Card 4: Quick Pay Action */}
        <div
          id="stat-quick-action"
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border flex flex-col justify-between transition-all ${
            darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
          }`}
        >
          <div>
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A39E93] block truncate">
              Settlement
            </span>
            <p className="text-[11px] sm:text-xs font-mono text-[#44403C] dark:text-[#D6D3CD] mt-0.5 sm:mt-1 truncate">
              UPI / NetBanking
            </p>
          </div>
          <button
            id="open-pay-modal-btn"
            onClick={() => setIsPayModalOpen(true)}
            className="w-full mt-2 sm:mt-3 min-h-[38px] sm:min-h-[44px] py-2 px-2.5 rounded-xl font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CreditCard size={14} />
            <span className="truncate">Pay Fee</span>
          </button>
        </div>
      </div>

      {/* ADMIN FEE DUE NOTICE CARD (PRESENT HERE WHEN ADMIN ISSUES A DUE) */}
      {feeNotice && (
        <div
          id="admin-fee-due-notice-box"
          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            darkMode
              ? 'bg-[#1C1710] border-[#8C5828]/50 shadow-md'
              : 'bg-[#FFFDF7] border-[#8C5828] shadow-xs'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#8C5828] text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    ADMIN FEE DUE NOTICE
                  </span>
                  <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                    Issued on {feeNotice.issuedDate}
                  </span>
                </div>
                <h3 className="text-lg font-black font-sans text-[#1C1917] dark:text-[#FAF8F5] mt-1">
                  {feeNotice.title}
                </h3>
                <p className="text-xs font-mono text-[#44403C] dark:text-[#D6D3CD] mt-1 max-w-3xl leading-relaxed">
                  {feeNotice.note}
                </p>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#57534E] dark:text-[#A39E93] mt-2">
                  <span>
                    Authorized by: <strong className="text-[#1C1917] dark:text-white">{feeNotice.authorizedBy}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Due by: <strong className="text-amber-700 dark:text-amber-400 font-black">{feeNotice.dueDate}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-mono uppercase text-[#57534E] dark:text-[#A39E93] block font-semibold">
                  Notice Due Amount
                </span>
                <span className="text-xl sm:text-2xl font-black font-sans text-amber-700 dark:text-amber-400">
                  ₹{feeNotice.amountDue.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                id="clear-notice-due-btn"
                onClick={() => {
                  setPayAmount(feeNotice.amountDue);
                  setIsPayModalOpen(true);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Clear Due Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEE PAYMENT HISTORY & RECEIPT DOWNLOADS WITH YEAR FILTER */}
      <div
        id="fee-history-card"
        className={`p-5 sm:p-6 rounded-2xl border ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        {/* Header & Year Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
              <h2 className="text-lg font-black font-sans uppercase tracking-tight text-[#1C1917] dark:text-[#FAF8F5]">
                Fee Payment Receipts & Archives
              </h2>
            </div>
            <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-0.5">
              Verified hostel receipts with breakdown (Room Rent, Mess, AC utilities)
            </p>
          </div>

          {/* Academic Year Switcher Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] font-mono text-xs overflow-x-auto no-scrollbar">
            <button
              id="year-tab-2026"
              onClick={() => setSelectedYear('2026 - 2027')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedYear === '2026 - 2027'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917] dark:hover:text-white'
              }`}
            >
              Year 1 (2026 - 2027)
            </button>
            <button
              id="year-tab-2027"
              onClick={() => setSelectedYear('2027 - 2028')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedYear === '2027 - 2028'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917] dark:hover:text-white'
              }`}
            >
              Year 2 (2027 - 2028)
            </button>
            <button
              id="year-tab-all"
              onClick={() => setSelectedYear('All')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedYear === 'All'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917] dark:hover:text-white'
              }`}
            >
              All Years
            </button>
          </div>
        </div>

        {/* MOBILE CARD VIEW (< 768px) FOR FLAWLESS SMALL DEVICE EXPERIENCE */}
        <div className="md:hidden space-y-3 mt-4">
          {filteredRecords.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#57534E] dark:text-[#A39E93]">
              No fee transactions recorded for {selectedYear}.
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={`mobile-${rec.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  darkMode ? 'bg-[#181712] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#DCD6CA] dark:border-[#2B2720]">
                  <div>
                    <span className="font-mono text-xs font-black text-[#1C1917] dark:text-white block">
                      {rec.receiptNo}
                    </span>
                    <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A39E93]">
                      {rec.paymentDate} · {rec.academicYear}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] shrink-0">
                    <CheckCircle2 size={11} />
                    VERIFIED
                  </span>
                </div>

                <div className="mt-2.5">
                  <p className="font-mono text-xs text-[#1C1917] dark:text-[#FAF8F5]">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 font-mono text-xs">
                    <span className="text-[#57534E] dark:text-[#A39E93]">
                      Mode: <strong className="text-[#1C1917] dark:text-white">{rec.paymentMode}</strong>
                    </span>
                    <span className="font-black text-base text-[#8C5828] dark:text-[#F2CA50]">
                      ₹{rec.amountPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  id={`mobile-download-receipt-btn-${rec.receiptNo}`}
                  onClick={() => setActiveReceipt(rec)}
                  className="w-full mt-3 min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer bg-[#8C5828] text-white hover:bg-[#73471F] border-[#8C5828]"
                >
                  <Download size={14} />
                  <span>Download Official Receipt</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP & TABLET TABLE VIEW (>= 768px) */}
        <div className="hidden md:block overflow-x-auto mt-4">
          <table className="w-full font-mono text-xs">
            <thead
              className={`border-b ${
                darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-[#A39E93]' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#57534E]'
              }`}
            >
              <tr>
                <th className="py-3 px-4 text-left font-bold uppercase">Receipt # / Description</th>
                <th className="py-3 px-4 text-left font-bold uppercase">Academic Year</th>
                <th className="py-3 px-4 text-left font-bold uppercase">Payment Date</th>
                <th className="py-3 px-4 text-left font-bold uppercase">Payment Mode</th>
                <th className="py-3 px-4 text-right font-bold uppercase">Amount (₹)</th>
                <th className="py-3 px-4 text-center font-bold uppercase">Status</th>
                <th className="py-3 px-4 text-center font-bold uppercase">Official Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD6CA] dark:divide-[#2B2720]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#57534E] dark:text-[#A39E93]">
                    No fee transactions recorded for {selectedYear}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      darkMode ? 'hover:bg-[#1B1A15]' : 'hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <strong className="text-[#1C1917] dark:text-white block text-sm">{rec.receiptNo}</strong>
                      <span className="text-[11px] text-[#57534E] dark:text-[#A39E93]">{rec.description}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1C1917] dark:text-white">
                      {rec.academicYear}
                    </td>
                    <td className="py-3.5 px-4 text-[#57534E] dark:text-[#A39E93]">
                      {rec.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1C1917] dark:text-[#EDE9E3]">
                      {rec.paymentMode}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-sm text-[#8C5828] dark:text-[#F2CA50]">
                      ₹{rec.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                        <CheckCircle2 size={12} />
                        VERIFIED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        id={`download-receipt-btn-${rec.receiptNo}`}
                        onClick={() => setActiveReceipt(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer hover:bg-[#8C5828] hover:text-white hover:border-[#8C5828] border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-[#1C1917] dark:text-white"
                      >
                        <Download size={13} />
                        <span>Download Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
          darkMode={darkMode}
        />
      )}

      {/* INTERACTIVE PAY DUES / ADVANCE MODAL */}
      {isPayModalOpen && (
        <div
          id="pay-fee-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 overflow-y-auto"
          onClick={() => setIsPayModalOpen(false)}
        >
          <div
            id="pay-fee-modal-container"
            className={`w-full max-w-md rounded-2xl border shadow-2xl p-5 sm:p-6 transition-all max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-[#141310] border-[#2B2720] text-[#EDE9E3]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720]">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <h3 className="font-bold font-sans uppercase text-base text-[#1C1917] dark:text-[#FAF8F5]">
                  Hostel Fee Checkout
                </h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-[#78716C] dark:text-[#A39E93]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold text-[#57534E] dark:text-[#A39E93] mb-1 uppercase">
                  Payment Amount (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-base sm:text-sm font-bold font-mono outline-none ${
                    darkMode
                      ? 'border-[#2B2720] bg-[#1B1A15] text-white focus:border-[#8C5828]'
                      : 'border-[#DCD6CA] bg-[#F6F4EE] text-[#1C1917] focus:border-[#8C5828]'
                  }`}
                />
                <span className="text-[10px] text-[#57534E] dark:text-[#A39E93] mt-1 block">
                  Recommended: Minimum ₹1,000 for partial advance or ₹45,000 for full clearance.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#57534E] dark:text-[#A39E93] mb-1 uppercase">
                  Select Payment Gateway / Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'NetBanking', 'Debit/Credit Card', 'NEFT'] as const).map(
                    (mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPayMode(mode)}
                        className={`min-h-[44px] p-2 rounded-xl border text-left font-mono text-xs font-bold transition-all cursor-pointer ${
                          payMode === mode
                            ? 'border-[#8C5828] bg-[#8C5828] text-white shadow-xs'
                            : darkMode
                            ? 'border-[#2B2720] bg-[#1B1A15] text-[#D6D3CD] hover:border-[#3E3A32]'
                            : 'border-[#DCD6CA] bg-[#F6F4EE] text-[#1C1917] hover:border-[#8C5828]/40'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#57534E] dark:text-[#A39E93]">Resident:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">Harsh (Room B-004)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E] dark:text-[#A39E93]">Fee Head:</span>
                  <span className="font-bold text-[#1C1917] dark:text-white">3-Seater AC Accommodation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E] dark:text-[#A39E93]">Gateway Surcharge:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">₹0 (Waived)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Authorize & Pay ₹{Number(payAmount).toLocaleString('en-IN')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
