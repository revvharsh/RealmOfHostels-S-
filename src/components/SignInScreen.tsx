import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, KeyRound, Mail, ArrowRight, ShieldCheck, Sun, Moon, Languages } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface SignInScreenProps {
  onSignIn: (email: string) => void;
  defaultProfile: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignIn,
  defaultProfile,
  darkMode,
  setDarkMode,
}) => {
  const [email, setEmail] = useState(defaultProfile.email || 'upadhyayharshpritam@gmail.com');
  const [password, setPassword] = useState('welcome@ROYAL');
  const [error, setError] = useState<string | null>(null);
  const { toggleLanguage, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid student email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your portal password.');
      return;
    }
    onSignIn(email);
  };

  const handleQuickLogin = () => {
    onSignIn(defaultProfile.email);
  };

  return (
    <div
      id="signin-screen-root"
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        darkMode ? 'bg-[#0E0D0B] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#1C1917]'
      }`}
    >
      {/* TOP BRAND HEADER */}
      <header
        className={`px-4 sm:px-8 py-3.5 border-b ${
          darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-[#F6F4EE] border-[#DCD6CA]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white shadow-sm">
              <Crown size={20} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50]">
                STUDENT RESIDENCE · ROYAL PARADISE
              </span>
              <h1 className="text-base font-black font-sans tracking-tight text-[#1C1917] dark:text-[#FAF8F5] leading-none">
                {t.brand}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#F2CA50] hover:bg-[#25221B]'
                  : 'border-[#DCD6CA] bg-white text-[#8C5828] hover:bg-[#EFECE6]'
              }`}
              title={t.langSwitchLabel}
            >
              <Languages size={14} />
              <span>{t.langSwitchBtn}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? 'border-[#2B2720] bg-[#1B1A15] text-[#F2CA50] hover:bg-[#25221B]'
                  : 'border-[#DCD6CA] bg-white text-[#8C5828] hover:bg-[#EFECE6]'
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* LOGIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          id="signin-card"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
            darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]'
          }`}
        >
          {/* Card Header */}
          <div className="text-center pb-5 border-b border-[#DCD6CA] dark:border-[#2B2720]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8C5828]/15 border border-[#8C5828]/30 flex items-center justify-center text-[#8C5828] dark:text-[#F2CA50] shadow-2xs">
              <KeyRound size={26} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sans mt-3 text-[#1C1917] dark:text-white">
              Resident Sign-In
            </h2>
            <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93] mt-1">
              Sign in to manage Room B-004, dining slots & services
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1.5 flex items-center gap-1.5">
                <Mail size={12} />
                <span>Student Email</span>
              </label>
              <input
                id="signin-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] text-sm ${
                  darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                }`}
                placeholder="upadhyayharshpritam@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1.5 flex items-center gap-1.5">
                <KeyRound size={12} />
                <span>Residence Portal Password</span>
              </label>
              <input
                id="signin-password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] text-sm ${
                  darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                }`}
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              id="submit-signin-btn"
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full min-h-[46px] mt-2 px-4 py-2.5 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <span>Sign In to Portal</span>
              <ArrowRight size={15} />
            </motion.button>
          </form>

          {/* Quick Demo Sign In */}
          <div className="mt-5 pt-5 border-t border-[#DCD6CA] dark:border-[#2B2720] text-center font-mono">
            <span className="text-[11px] text-[#78716C] dark:text-[#A39E93] block mb-2">
              Verified resident profile ready:
            </span>
            <motion.button
              id="quick-demo-signin-btn"
              onClick={handleQuickLogin}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                darkMode
                  ? 'border-[#8C5828]/50 bg-[#1B1A15] hover:bg-[#25221B] text-[#FAF8F5]'
                  : 'border-[#8C5828]/40 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1C1917]'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-[#8C5828] text-white flex items-center justify-center text-[10px] font-black">
                H
              </span>
              <span>1-Click Sign In as Harsh (Room B-004)</span>
            </motion.button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1 text-[11px] font-mono text-[#78716C] dark:text-[#A39E93]">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted Campus Residence Auth</span>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer
        className={`px-4 py-3 border-t text-center font-mono text-xs ${
          darkMode ? 'bg-[#141310] border-[#2B2720] text-[#57534E]' : 'bg-[#F6F4EE] border-[#DCD6CA] text-[#78716C]'
        }`}
      >
        <span>Realm of Hostels · Royal Paradise Student Residence</span>
      </footer>
    </div>
  );
};
