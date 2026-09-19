import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  Check,
  Wifi,
  Copy,
  Lock,
  Radio,
  FileText,
} from 'lucide-react';
import { ANNOUNCEMENTS_LIST } from './studentData';
import { useLanguage } from '../../i18n/LanguageContext';

interface AnnouncementsTabProps {
  darkMode: boolean;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ darkMode }) => {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copiedWifiName, setCopiedWifiName] = useState(false);
  const [copiedWifiPass, setCopiedWifiPass] = useState(false);

  const handleCopyName = () => {
    navigator.clipboard.writeText('Royal g5');
    setCopiedWifiName(true);
    setTimeout(() => setCopiedWifiName(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText('welcome@ROYAL');
    setCopiedWifiPass(true);
    setTimeout(() => setCopiedWifiPass(false), 2000);
  };

  const handleAcknowledge = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, acknowledged: true } : item))
    );
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const categories = [
    { key: 'All', label: language === 'hi' ? 'सभी सूचनाएं' : 'All' },
    { key: 'Facility Maintenance', label: language === 'hi' ? 'सफाई व मरम्मत' : 'Maintenance' },
    { key: 'IT & Infrastructure', label: language === 'hi' ? 'वाई-फाई व इंटरनेट' : 'Wi-Fi / IT' },
    { key: 'Security Notice', label: language === 'hi' ? 'गेट व सुरक्षा' : 'Curfew & Security' },
  ];

  return (
    <div id="announcements-tab-content" className="space-y-4">
      {/* STRUCTURED HOSTEL WI-FI NOTICE (COMPACT & CLEAN) */}
      <div
        id="hostel-wifi-notice-card"
        className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
          darkMode
            ? 'bg-[#181611] border-[#8C5828]/50 shadow-xs'
            : 'bg-[#FFFDF9] border-[#8C5828]/40 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8C5828] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wifi size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black uppercase text-[#8C5828] dark:text-[#F2CA50]">
                  {t.wifiTitle}
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                  ONLINE · 1 GBPS
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#57534E] dark:text-[#A39E93]">
                {t.wifiSub}
              </p>
            </div>
          </div>

          {/* Wi-Fi Credentials Pill Box */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* SSID */}
            <div className="p-1.5 px-2.5 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase">SSID:</span>
              <strong className="text-[#1C1917] dark:text-white">Royal g5</strong>
              <button
                onClick={handleCopyName}
                className="text-[#8C5828] dark:text-[#F2CA50] hover:underline cursor-pointer flex items-center gap-1 font-bold ml-1"
                title="Copy SSID"
              >
                {copiedWifiName ? <Check size={11} /> : <Copy size={11} />}
                <span className="text-[10px]">{copiedWifiName ? t.copied : 'Copy'}</span>
              </button>
            </div>

            {/* Password */}
            <div className="p-1.5 px-2.5 rounded-lg border border-[#8C5828]/40 bg-[#8C5828]/5 dark:bg-[#8C5828]/15 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A39E93] uppercase flex items-center gap-0.5">
                <Lock size={10} /> Pass:
              </span>
              <strong className="text-[#8C5828] dark:text-[#F2CA50] font-bold">welcome@ROYAL</strong>
              <button
                onClick={handleCopyPass}
                className="px-2 py-0.5 rounded-md bg-[#8C5828] text-white text-[10px] font-bold hover:bg-[#72451E] cursor-pointer flex items-center gap-1"
                title="Copy Wi-Fi Password"
              >
                {copiedWifiPass ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedWifiPass ? t.copied : t.copyWifiPass}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div
        className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'नोटिस, वाई-फाई या सर्कुलर खोजें...' : 'Search circulars, maintenance, Wi-Fi...'}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg border font-mono text-xs outline-none ${
              darkMode
                ? 'border-[#2B2720] bg-[#1B1A15] text-white focus:border-[#8C5828]'
                : 'border-[#DCD6CA] bg-[#F6F4EE] text-[#1C1917] focus:border-[#8C5828]'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat.key
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#78716C] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((item) => {
          const isUrgent = item.priority === 'Urgent';

          return (
            <div
              key={item.id}
              id={`announcement-card-${item.id}`}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isUrgent
                  ? darkMode
                    ? 'bg-[#1D1610] border-amber-800/60 ring-1 ring-amber-600/30'
                    : 'bg-[#FFFDF7] border-[#8C5828] ring-1 ring-[#8C5828]/30 shadow-xs'
                  : darkMode
                  ? 'bg-[#141310] border-[#2B2720]'
                  : 'bg-white border-[#DCD6CA] shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50]">
                    {item.id}
                  </span>
                  <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                  <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
                    {item.category}
                  </span>
                  <span className="text-[#DCD6CA] dark:text-[#2B2720]">•</span>
                  <span className="font-mono text-xs text-[#78716C] dark:text-[#A39E93]">
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase ${
                      isUrgent
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-black/5 dark:bg-white/5 text-[#78716C] dark:text-[#A39E93]'
                    }`}
                  >
                    {item.priority}
                  </span>
                  {item.acknowledged ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#137333]">
                      <CheckCircle2 size={13} />
                      {t.acknowledged}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase bg-[#8C5828] hover:bg-[#73471F] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check size={12} />
                      <span>{t.acknowledgeBtn}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-sm sm:text-base font-black font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-[#44403C] dark:text-[#D6D3CD] mt-1.5 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
