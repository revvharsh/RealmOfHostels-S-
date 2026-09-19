import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Crown } from 'lucide-react';
import { FeeRecord } from '../../types';

interface ReceiptModalProps {
  receipt: FeeRecord | null;
  onClose: () => void;
  darkMode: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose, darkMode }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const numberToWords = (num: number): string => {
    if (num === 185000) return 'One Lakh Eighty Five Thousand Rupees Only';
    if (num === 140000) return 'One Lakh Forty Thousand Rupees Only';
    if (num === 45000) return 'Forty Five Thousand Rupees Only';
    if (num === 25000) return 'Twenty Five Thousand Rupees Only';
    return `Rupees ${num.toLocaleString('en-IN')} Only`;
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="receipt-modal-container"
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto transition-all ${
          darkMode ? 'bg-[#141310] border-[#2B2720] text-[#EDE9E3]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between print:hidden ${
            darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50]">
            <Crown size={15} />
            <span>OFFICIAL TRANSACTION RECEIPT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-receipt-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              id="close-receipt-btn"
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#141310] text-[#A39E93] hover:text-white'
                  : 'border-[#DCD6CA] bg-white text-[#78716C] hover:text-black'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Receipt Printable Canvas */}
        <div id="printable-receipt-canvas" className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b pb-5 border-[#DCD6CA] dark:border-[#2B2720]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white shadow-sm shrink-0">
                <Crown size={24} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black font-sans tracking-tight uppercase">
                  REALM OF HOSTELS
                </h1>
                <p className="text-xs font-mono text-[#78716C] dark:text-[#A39E93]">
                  Royal Paradise Student Hostel · Knowledge Park
                </p>
                <p className="text-[11px] font-mono text-[#78716C] dark:text-[#A39E93]">
                  Greater Noida, Uttar Pradesh
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                <CheckCircle2 size={13} />
                PAID & VERIFIED
              </span>
              <p className="text-xs font-mono text-[#78716C] dark:text-[#A39E93] mt-2">
                Receipt No: <strong className="text-[#1C1917] dark:text-white">{receipt.receiptNo}</strong>
              </p>
              <p className="text-xs font-mono text-[#78716C] dark:text-[#A39E93]">
                Date: <strong>{receipt.paymentDate}</strong>
              </p>
            </div>
          </div>

          {/* Resident & Accommodation Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">Resident Name</span>
              <strong className="text-sm text-[#1C1917] dark:text-white">Harsh</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">Room & Category</span>
              <strong className="text-sm text-[#8C5828] dark:text-[#F2CA50]">B-004 (3-Seater AC)</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">Academic Year</span>
              <strong className="text-sm text-[#1C1917] dark:text-white">{receipt.academicYear}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">Payment Mode</span>
              <strong className="text-sm text-[#1C1917] dark:text-white">{receipt.paymentMode}</strong>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead
                className={`border-b ${
                  darkMode ? 'bg-[#1B1A15] border-[#2B2720] text-[#A39E93]' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#78716C]'
                }`}
              >
                <tr>
                  <th className="py-2.5 px-4 text-left font-bold uppercase">Description / Fee Head</th>
                  <th className="py-2.5 px-4 text-center font-bold uppercase">Period</th>
                  <th className="py-2.5 px-4 text-right font-bold uppercase">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD6CA] dark:divide-[#2B2720]">
                {receipt.breakdown.roomRent > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <strong>Hostel Room Accommodation</strong>
                      <div className="text-[11px] text-[#78716C] dark:text-[#A39E93]">Standard 3-Seater Occupancy</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">{receipt.semester}</td>
                    <td className="py-2.5 px-4 text-right font-bold">₹{receipt.breakdown.roomRent.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {receipt.breakdown.acSupplement > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <strong>Air Conditioning & Inverter Supplement</strong>
                      <div className="text-[11px] text-[#78716C] dark:text-[#A39E93]">High-efficiency split climate control</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">{receipt.semester}</td>
                    <td className="py-2.5 px-4 text-right font-bold">₹{receipt.breakdown.acSupplement.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {receipt.breakdown.messDietetics > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <strong>Mess & Dining Subscription</strong>
                      <div className="text-[11px] text-[#78716C] dark:text-[#A39E93]">4 meals/day (Breakfast, Lunch, Snacks, Dinner)</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">{receipt.semester}</td>
                    <td className="py-2.5 px-4 text-right font-bold">₹{receipt.breakdown.messDietetics.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {receipt.breakdown.securityDeposit > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <strong>Security & Caution Deposit</strong>
                      <div className="text-[11px] text-[#78716C] dark:text-[#A39E93]">Refundable room asset warranty</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">Annual</td>
                    <td className="py-2.5 px-4 text-right font-bold">₹{receipt.breakdown.securityDeposit.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {receipt.breakdown.amenitiesLaundry > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <strong>Wi-Fi High-Speed & Laundry Facilities</strong>
                      <div className="text-[11px] text-[#78716C] dark:text-[#A39E93]">1 Gbps Corridors + Bi-weekly mechanized wash</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">{receipt.semester}</td>
                    <td className="py-2.5 px-4 text-right font-bold">₹{receipt.breakdown.amenitiesLaundry.toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
              <tfoot
                className={`border-t ${
                  darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
                }`}
              >
                <tr>
                  <td colSpan={2} className="py-3 px-4 font-bold text-sm uppercase">Total Amount Paid</td>
                  <td className="py-3 px-4 text-right font-black text-base text-[#8C5828] dark:text-[#F2CA50]">
                    ₹{receipt.amountPaid.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in words */}
          <div className="p-3 rounded-lg border border-dashed border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
            <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">Amount in Words</span>
            <strong className="text-xs text-[#1C1917] dark:text-white">{numberToWords(receipt.amountPaid)}</strong>
          </div>

          {/* Transaction Metadata & Official Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720] font-mono text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck size={16} />
                <span>Bank Gateway Ref: {receipt.transactionId}</span>
              </div>
              <p className="text-[11px] text-[#78716C] dark:text-[#A39E93] mt-0.5">
                Computer generated e-receipt. Does not require physical signature.
              </p>
            </div>

            <div className="text-center sm:text-right border p-2.5 rounded-lg border-dashed border-[#8C5828]/50 bg-[#8C5828]/5">
              <span className="text-[10px] font-bold text-[#8C5828] uppercase block tracking-wider">
                Authorized Digital Seal
              </span>
              <strong className="text-xs text-[#1C1917] dark:text-[#EDE9E3]">Hostel Accounts Directorate</strong>
              <div className="text-[10px] text-[#78716C] dark:text-[#A39E93]">Royal Paradise Student Hostel, Greater Noida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
