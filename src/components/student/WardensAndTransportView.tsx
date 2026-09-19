import React, { useState } from 'react';
import {
  Phone,
  Copy,
  Check,
  Mail,
  MapPin,
  Clock,
  Bus,
  Shield,
  UserCheck,
  AlertCircle,
  Car,
  Headphones,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  WARDEN_DIRECTORY,
  TRANSPORT_VEHICLES_DIRECTORY,
  WardenContact,
  TransportVehicle,
} from './studentData';

interface WardensAndTransportViewProps {
  darkMode: boolean;
}

export const WardensAndTransportView: React.FC<WardensAndTransportViewProps> = ({ darkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'wardens' | 'transport'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2200);
  };

  return (
    <div id="wardens-transport-view" className="space-y-6">
      {/* Top Banner */}
      <div
        id="contacts-banner"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-[#141310] border-[#2B2720] shadow-md'
            : 'bg-white border-[#DCD6CA] shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white font-mono font-black text-xl shadow-sm shrink-0">
              <Headphones size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8C5828] dark:text-[#F2CA50] uppercase tracking-wider">
                  Hostel Administration & Transit Fleet
                </span>
                <span className="text-[#A8A29E] dark:text-[#57534E]">•</span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Royal Paradise Block
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] mt-1">
                Wardens & Campus Transport Directory
              </h1>
              <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-1">
                Official contact numbers, verified vehicle drivers, and emergency escalation desks with 1-click copying.
              </p>
            </div>
          </div>

          {/* Subtab Filter */}
          <div className="flex items-center p-1 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] font-mono text-xs">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              All Directory
            </button>
            <button
              onClick={() => setActiveSubTab('wardens')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubTab === 'wardens'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              Hostel Wardens ({WARDEN_DIRECTORY.length})
            </button>
            <button
              onClick={() => setActiveSubTab('transport')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubTab === 'transport'
                  ? 'bg-[#8C5828] text-white shadow-xs'
                  : 'text-[#57534E] dark:text-[#A39E93] hover:text-[#1C1917]'
              }`}
            >
              Transport Drivers ({TRANSPORT_VEHICLES_DIRECTORY.length})
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: HOSTEL WARDENS DIRECTORY */}
      {(activeSubTab === 'all' || activeSubTab === 'wardens') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#DCD6CA]/80 dark:border-[#2B2720]/80">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
              <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                Hostel Wardens Contact Details
              </h2>
            </div>
            <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
              Disciplinary, Pastoral & Residential Care
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {WARDEN_DIRECTORY.map((warden) => {
              const isCopied = copiedId === warden.id;
              return (
                <div
                  key={warden.id}
                  id={`warden-card-${warden.id}`}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    darkMode
                      ? 'bg-[#141310] border-[#2B2720] hover:border-[#8C5828]/60 shadow-xs'
                      : 'bg-white border-[#DCD6CA] hover:border-[#8C5828]/60 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header: Avatar, Name & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#8C5828]/15 border border-[#8C5828]/30 flex items-center justify-center font-mono font-black text-sm text-[#8C5828] dark:text-[#F2CA50] shrink-0">
                          {warden.avatarInitials}
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase bg-[#8C5828]/10 text-[#8C5828] dark:text-[#F2CA50] border border-[#8C5828]/20">
                            {warden.badge}
                          </span>
                          <h3 className="text-base font-bold font-sans text-[#1C1917] dark:text-[#FAF8F5] leading-snug mt-0.5">
                            {warden.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="font-mono text-xs text-[#57534E] dark:text-[#A39E93] mt-2 font-medium">
                      {warden.role}
                    </p>

                    {/* Office and Availability Meta */}
                    <div className="mt-3.5 space-y-2 font-mono text-xs pt-3 border-t border-[#DCD6CA]/70 dark:border-[#2B2720]/70">
                      <div className="flex items-start gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-[#8C5828] dark:text-[#F2CA50]" />
                        <span>{warden.office}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <Clock size={14} className="shrink-0 text-[#8C5828] dark:text-[#F2CA50]" />
                        <span>{warden.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <Mail size={14} className="shrink-0 text-[#8C5828] dark:text-[#F2CA50]" />
                        <span className="truncate">{warden.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Action Bar (Phone + Copy Button) */}
                  <div className="mt-5 pt-3 border-t border-[#DCD6CA]/80 dark:border-[#2B2720]/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] font-bold">
                        Direct Phone & Intercom:
                      </span>
                      <span className="text-[10px] font-mono text-[#8C5828] dark:text-[#F2CA50] font-black">
                        {warden.intercom}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl border flex items-center justify-between font-mono text-xs font-bold ${
                          darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                        }`}
                      >
                        <span className="text-[#1C1917] dark:text-white truncate">{warden.phone}</span>
                        <button
                          id={`copy-warden-${warden.id}`}
                          onClick={() => handleCopy(warden.phone, warden.id)}
                          title="Copy Warden Phone Number"
                          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#57534E] dark:text-[#A39E93] hover:text-[#8C5828] dark:hover:text-[#F2CA50] cursor-pointer"
                        >
                          {isCopied ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>

                      <a
                        href={`tel:${warden.phone.replace(/\s+/g, '')}`}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    </div>
                    {isCopied && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-1 text-right">
                        ✓ Phone number copied to clipboard!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: CAMPUS TRANSPORT & DRIVERS DIRECTORY */}
      {(activeSubTab === 'all' || activeSubTab === 'transport') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#DCD6CA]/80 dark:border-[#2B2720]/80">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-[#8C5828] dark:text-[#F2CA50]" />
              <h2 className="text-base font-bold font-sans uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                Transport Vehicles & Driver Contact Details
              </h2>
            </div>
            <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
              Fleet Tracking & Direct Driver Helplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRANSPORT_VEHICLES_DIRECTORY.map((transport) => {
              const isCopied = copiedId === transport.id;
              return (
                <div
                  key={transport.id}
                  id={`transport-card-${transport.id}`}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    darkMode
                      ? 'bg-[#141310] border-[#2B2720] hover:border-[#8C5828]/60 shadow-xs'
                      : 'bg-white border-[#DCD6CA] hover:border-[#8C5828]/60 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Service Name & Vehicle Number */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50]">
                          {transport.serviceName}
                        </span>
                        <h3 className="text-base font-bold font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                          Driver: {transport.driverName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-black uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-[#DCD6CA] dark:border-[#2B2720] text-[#1C1917] dark:text-white">
                          {transport.vehicleNo}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase border ${
                            transport.status === 'Standby 24/7'
                              ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {transport.status}
                        </span>
                      </div>
                    </div>

                    <p className="font-mono text-xs text-[#57534E] dark:text-[#A39E93] mt-1.5">
                      Vehicle: <strong>{transport.vehicleType}</strong>
                    </p>

                    {/* Route & Timings */}
                    <div className="mt-3.5 space-y-2 font-mono text-xs pt-3 border-t border-[#DCD6CA]/70 dark:border-[#2B2720]/70">
                      <div className="flex items-start gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-[#8C5828] dark:text-[#F2CA50]" />
                        <span>Route: <strong className="text-[#1C1917] dark:text-white">{transport.route}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-[#57534E] dark:text-[#A39E93]">
                        <Clock size={14} className="shrink-0 text-[#8C5828] dark:text-[#F2CA50]" />
                        <span>Schedule: <strong>{transport.timings}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Contact & One-Click Copy Number */}
                  <div className="mt-5 pt-3 border-t border-[#DCD6CA]/80 dark:border-[#2B2720]/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] font-bold">
                        Driver Mobile (Direct):
                      </span>
                      <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A39E93]">
                        Authorized Campus Transit
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl border flex items-center justify-between font-mono text-xs font-bold ${
                          darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                        }`}
                      >
                        <span className="text-[#1C1917] dark:text-white font-mono">{transport.phone}</span>
                        <button
                          id={`copy-driver-${transport.id}`}
                          onClick={() => handleCopy(transport.phone, transport.id)}
                          title="Copy Driver Phone Number"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono font-bold bg-black/5 dark:bg-white/5 hover:bg-[#8C5828]/10 text-[#57534E] dark:text-[#A39E93] hover:text-[#8C5828] dark:hover:text-[#F2CA50] cursor-pointer transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check size={13} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Number</span>
                            </>
                          )}
                        </button>
                      </div>

                      <a
                        href={`tel:${transport.phone.replace(/\s+/g, '')}`}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#8C5828] hover:bg-[#73471F] text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: EMERGENCY ESCALATION HELPLINES */}
      <div
        id="emergency-escalation-box"
        className={`p-5 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-[#191512] border-[#8C5828]/40 shadow-xs'
            : 'bg-[#FFFDF7] border-[#8C5828]/30 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={17} className="text-red-600 dark:text-red-400" />
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
              Campus 24/7 Rapid Emergency & Facility Hotlines
            </h3>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#8C5828] dark:text-[#F2CA50]">
            Direct Intercom / Landline Integration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div
            className={`p-3 rounded-xl border ${
              darkMode ? 'bg-[#12100E] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-600 dark:text-red-400">Campus Ambulance / Medical</span>
              <a
                href="tel:108"
                className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-black"
              >
                108
              </a>
            </div>
            <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-1">Medical Center Gate 1 · 24/7 Doctor</p>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              darkMode ? 'bg-[#12100E] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C1917] dark:text-white">Main Security Gate 1</span>
              <button
                onClick={() => handleCopy('+91 98100 99999', 'sec-1')}
                className="text-xs text-[#8C5828] dark:text-[#F2CA50] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedId === 'sec-1' ? 'Copied!' : 'Copy: +91 98100 99999'}
              </button>
            </div>
            <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-1">Intercom: Ext 100 · Turnstile Security</p>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              darkMode ? 'bg-[#12100E] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C1917] dark:text-white">Electrical & AC Maintenance</span>
              <button
                onClick={() => handleCopy('+91 98100 54321', 'ac-hotline')}
                className="text-xs text-[#8C5828] dark:text-[#F2CA50] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedId === 'ac-hotline' ? 'Copied!' : 'Copy: +91 98100 54321'}
              </button>
            </div>
            <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-1">Substation & HVAC Control Room</p>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              darkMode ? 'bg-[#12100E] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C1917] dark:text-white">Accounts & Finance Clearance</span>
              <button
                onClick={() => handleCopy('+91 98100 87654', 'acc-hotline')}
                className="text-xs text-[#8C5828] dark:text-[#F2CA50] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedId === 'acc-hotline' ? 'Copied!' : 'Copy: +91 98100 87654'}
              </button>
            </div>
            <p className="text-[11px] text-[#57534E] dark:text-[#A39E93] mt-1">Room B-004 Student Ledger Clearance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
