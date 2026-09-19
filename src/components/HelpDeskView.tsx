import React, { useState } from 'react';
import { ArrowLeft, Check, Crown, Paperclip, Send } from 'lucide-react';

interface HelpDeskViewProps {
  onBack: () => void;
  darkMode: boolean;
}

export const HelpDeskView: React.FC<HelpDeskViewProps> = ({ onBack, darkMode }) => {
  const [email, setEmail] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const surface = darkMode ? 'bg-[#141310] border-[#2B2720]' : 'bg-white border-[#DCD6CA]';
  const input = darkMode
    ? 'bg-[#181613] border-[#2B2720] text-white placeholder:text-[#78716C]'
    : 'bg-white border-[#DCD6CA] text-[#1C1917] placeholder:text-[#A8A29E]';

  const reset = () => {
    setEmail('');
    setHostelId('');
    setDescription('');
    setSubmitted(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0E0D0B] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#1C1917]'}`}>
      <header className={`px-4 sm:px-8 py-3.5 border-b ${surface}`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] flex items-center justify-center text-white">
              <Crown size={20} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#8C5828] dark:text-[#F2CA50]">REALM OF HOSTELS</span>
              <h1 className="text-base font-black tracking-tight">Help Desk</h1>
            </div>
          </div>
          <button type="button" onClick={onBack} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-bold cursor-pointer ${darkMode ? 'border-[#2B2720] text-[#F2CA50]' : 'border-[#DCD6CA] text-[#8C5828]'}`}>
            <ArrowLeft size={14} /> Back to login
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <section className={`w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-xl ${surface}`}>
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#8C5828] text-white"><Check size={28} /></div>
              <h2 className="text-xl font-black">Support request submitted</h2>
              <p className="mt-2 text-sm text-[#78716C] dark:text-[#A39E93]">The hostel admin will respond to the email address you provided.</p>
              <button type="button" onClick={reset} className="mt-7 rounded-xl border border-[#8C5828]/50 px-4 py-2.5 text-sm font-bold text-[#8C5828] dark:text-[#F2CA50] cursor-pointer">Submit another request</button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8C5828] dark:text-[#F2CA50]">Campus support</p>
                <h2 className="mt-1 text-2xl font-black">Submit a support request</h2>
                <p className="mt-2 text-sm text-[#78716C] dark:text-[#A39E93]">Tell the hostel admin what needs attention. A response will be sent by email.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-bold">Email ID<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={`w-full rounded-xl border px-3.5 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#8C5828]/30 ${input}`} /></label>
                <label className="space-y-2 text-sm font-bold">Hostel ID<input required value={hostelId} onChange={(event) => setHostelId(event.target.value)} placeholder="H-204-B" className={`w-full rounded-xl border px-3.5 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#8C5828]/30 ${input}`} /></label>
              </div>
              <label className="block space-y-2 text-sm font-bold">Issue description<textarea required rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe your issue in detail..." className={`w-full resize-y rounded-xl border px-3.5 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#8C5828]/30 ${input}`} /></label>
              <div className="flex flex-col gap-3 border-t border-[#DCD6CA] pt-5 dark:border-[#2B2720] sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A39E93]"><Paperclip size={14} /> Attachments can be shared in the admin reply.</p>
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8C5828] px-5 text-sm font-bold text-white cursor-pointer hover:bg-[#72451E]"><Send size={16} /> Send request</button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};