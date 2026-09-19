import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wifi, Copy, Check, Lock, ShieldCheck } from 'lucide-react';

interface SimpleWifiBlockProps {
  darkMode: boolean;
}

export const SimpleWifiBlock: React.FC<SimpleWifiBlockProps> = ({ darkMode }) => {
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

  const wifiName = 'Royal g5';
  const wifiPassword = 'welcome@ROYAL';

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2200);
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(wifiName);
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 2200);
  };

  return (
    <div
      id="simple-wifi-block"
      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA] shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCD6CA] dark:border-[#2B2720]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8C5828]/15 border border-[#8C5828]/30 flex items-center justify-center text-[#8C5828] dark:text-[#F2CA50] shrink-0">
            <Wifi size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black font-sans text-[#1C1917] dark:text-[#FAF8F5]">
                Hostel Wi-Fi
              </h3>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-0.5">
              Dedicated Room B-004 Access Point (5 GHz)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>WPA3 Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono">
        {/* Wi-Fi Name */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#57534E] dark:text-[#A39E93]">
            <span className="font-bold uppercase tracking-wider text-[11px]">Wi-Fi Name (SSID)</span>
            <motion.button
              id="copy-wifi-name-btn"
              onClick={handleCopyName}
              whileTap={{ scale: 0.94 }}
              title="Copy Wi-Fi Name"
              className="text-[#8C5828] dark:text-[#F2CA50] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              {copiedName ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-black text-[#1C1917] dark:text-white tracking-wide">
              {wifiName}
            </span>
            <span className="text-[11px] text-[#78716C] dark:text-[#A39E93]">5 GHz</span>
          </div>
        </div>

        {/* Wi-Fi Password */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#1B1A15] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#57534E] dark:text-[#A39E93]">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Lock size={12} />
              Password
            </span>
            <motion.button
              id="copy-wifi-password-btn"
              onClick={handleCopyPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              title="Copy Wi-Fi Password"
              className="px-2.5 py-1 rounded-md bg-[#8C5828] text-white font-bold hover:bg-[#72451E] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              {copiedPassword ? (
                <>
                  <Check size={12} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Password</span>
                </>
              )}
            </motion.button>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black text-[#8C5828] dark:text-[#F2CA50] tracking-wider selection:bg-[#8C5828] selection:text-white">
              {wifiPassword}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
