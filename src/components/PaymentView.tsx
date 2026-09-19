import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Users,
} from 'lucide-react';
import { StudentPayment } from '../types';

interface PaymentViewProps {
  payments: StudentPayment[];
  onOpenNoticeModal: (studentName?: string) => void;
  onMarkPaid: (studentName: string) => void;
  darkMode: boolean;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  payments,
  onOpenNoticeModal,
  onMarkPaid,
  darkMode,
}) => {
  const [filter, setFilter] = useState<'All' | 'Overdue' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filtered = payments
    .filter((p) => {
      if (filter === 'All') return true;
      return p.status === filter;
    })
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    });

  const totalDues = payments.reduce((acc, p) => acc + p.dues, 0);
  const totalSettled = 1960000 - totalDues;
  const overdueCount = payments.filter((p) => p.status === 'Overdue').length;

  /* Export Ledger as CSV */
  const handleExportLedger = () => {
    const headers = ['Student Name', 'Room', 'Dues (INR)', 'Status', 'Last Payment Date'];
    const rows = payments.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.room}"`,
      p.dues,
      `"${p.status}"`,
      `"${p.lastPaymentDate || 'N/A'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Hostel_Royal_Paradise_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Ledger CSV exported successfully to downloads folder.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div id="payment-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
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
            Financial Ledger / Royal Paradise Node
          </span>
          <h2
            id="payment-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Payment & Dues Management
          </h2>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="export-ledger-btn"
            onClick={handleExportLedger}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613] hover:border-[#c8935c] text-[#ede8e1]'
                : 'border-[#ded4c5] bg-white hover:border-[#824f1c] text-stone-900 shadow-xs'
            }`}
          >
            <Download size={14} className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'} />
            Export Ledger (.CSV)
          </button>

          <button
            id="batch-overdue-notice-btn"
            onClick={() => onOpenNoticeModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 cursor-pointer transition-all"
          >
            <Mail size={14} />
            Send Overdue Notice ({overdueCount})
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center justify-between">
          <span>{exportNotice}</span>
          <CheckCircle2 size={16} />
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <span
            className={`text-xs font-mono uppercase font-semibold ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Total Expected Fees
          </span>
          <h4
            className={`text-2xl font-black font-mono mt-2 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            ₹1,960,000
          </h4>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Semester Q4 (Hostel + Mess + Utilities)
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <span
            className={`text-xs font-mono uppercase font-semibold ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Settled to Date
          </span>
          <h4 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{totalSettled.toLocaleString()}
          </h4>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            98.2% clearance index across hostel
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode
              ? 'border-[#382e25] bg-[#1a1613]'
              : 'border-[#ded4c5] bg-white shadow-xs'
          }`}
        >
          <span
            className={`text-xs font-mono uppercase font-semibold ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            Overdue Amount
          </span>
          <h4
            className={`text-2xl font-black font-mono mt-2 ${
              darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
            }`}
          >
            ₹{totalDues.toLocaleString()}
          </h4>
          <p
            className={`text-[11px] font-mono mt-1 ${
              darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
            }`}
          >
            {overdueCount} delinquent student folios
          </p>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div
        id="payments-ledger-table"
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? 'border-[#382e25] bg-[#1a1613]'
            : 'border-[#ded4c5] bg-white shadow-xs'
        }`}
      >
        <div
          className={`p-4 border-b flex flex-wrap justify-between items-center gap-3 ${
            darkMode ? 'border-[#382e25] bg-[#14110e]' : 'border-[#ded4c5] bg-[#fcfaf7]'
          }`}
        >
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-bold font-mono uppercase ${
                darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
              }`}
            >
              Student Fee Records ({filtered.length})
            </h3>
            <div
              className={`flex items-center gap-1 p-0.5 rounded-lg border text-[11px] font-mono ${
                darkMode
                  ? 'border-[#382e25] bg-[#1a1613]'
                  : 'border-[#ded4c5] bg-white'
              }`}
            >
              {(['All', 'Overdue', 'Paid'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filter === t
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#c8935c] text-white font-bold'
                      : darkMode
                      ? 'text-[#a39e93] hover:text-white'
                      : 'text-[#695747] hover:text-stone-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono w-full sm:w-64 ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613] text-[#ede8e1]'
                : 'border-[#dfd3c3] bg-white text-stone-900'
            }`}
          >
            <Search size={14} className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'} />
            <input
              type="text"
              placeholder="Filter by name or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead
              className={`border-b uppercase text-[10px] ${
                darkMode
                  ? 'border-[#382e25] bg-[#120f0d] text-[#a39e93]'
                  : 'border-[#ded4c5] bg-[#f8ede3] text-[#695747]'
              }`}
            >
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Room #</th>
                <th className="p-3.5">Due Amount</th>
                <th className="p-3.5">Last Activity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? 'divide-[#382e25]' : 'divide-[#ded4c5]'
              }`}
            >
              {filtered.map((s, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-[#201b17]' : 'hover:bg-[#fbf9f5]'
                  }`}
                >
                  <td
                    className={`p-3.5 font-semibold ${
                      darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                    }`}
                  >
                    {s.name}
                  </td>
                  <td
                    className={`p-3.5 ${
                      darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                    }`}
                  >
                    {s.room}
                  </td>
                  <td
                    className={`p-3.5 font-bold ${
                      darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                    }`}
                  >
                    ₹{s.dues.toLocaleString()}
                  </td>
                  <td
                    className={`p-3.5 ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    {s.lastPaymentDate || 'N/A'}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                        s.status === 'Paid'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2.5">
                    {s.dues > 0 ? (
                      <>
                        <button
                          onClick={() => onOpenNoticeModal(s.name)}
                          className={`hover:underline cursor-pointer font-bold ${
                            darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'
                          }`}
                        >
                          Send Notice →
                        </button>
                        <button
                          onClick={() => onMarkPaid(s.name)}
                          className={`hover:underline ml-2 cursor-pointer font-bold ${
                            darkMode ? 'text-emerald-400' : 'text-emerald-700'
                          }`}
                        >
                          Mark Paid
                        </button>
                      </>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 ${
                          darkMode ? 'text-[#877d70]' : 'text-[#695747]'
                        }`}
                      >
                        <CheckCircle2
                          size={13}
                          className="text-emerald-600 dark:text-emerald-400"
                        />{' '}
                        Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
