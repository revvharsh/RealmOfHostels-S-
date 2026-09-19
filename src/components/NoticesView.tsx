import React, { useState } from 'react';
import {
  Megaphone,
  Radio,
  Calendar,
  User,
  Send,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Notice } from '../types';

interface NoticesViewProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  onEditNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  darkMode: boolean;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  onAddNotice,
  onEditNotice,
  onDeleteNotice,
  darkMode,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<Notice['priority']>('High');
  const [target, setTarget] = useState('All Residents');
  const [publishSuccessToast, setPublishSuccessToast] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onAddNotice({
      title: title.trim(),
      body: body.trim(),
      priority,
      target,
      author: 'Warden Desk',
    });

    const publishedTitle = title;
    setTitle('');
    setBody('');

    setPublishSuccessToast(`Alert published: "${publishedTitle.slice(0, 32)}..."`);
    setTimeout(() => setPublishSuccessToast(null), 4000);
  };

  const filteredNotices = notices.filter((n) => {
    if (filterPriority === 'All') return true;
    return n.priority === filterPriority;
  });

  return (
    <div id="notices-view-container" className="space-y-6 max-w-7xl mx-auto">
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
            Public Address & Campus Broadcasting
          </span>
          <h2
            id="notices-heading"
            className={`text-2xl font-black tracking-tight uppercase font-sans mt-0.5 ${
              darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
            }`}
          >
            Notices & Official Bulletins
          </h2>
        </div>

        {/* Priority Filter */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border font-mono text-xs ${
            darkMode ? 'border-[#382e25] bg-[#1a1613]' : 'border-[#ded4c5] bg-white'
          }`}
        >
          {['All', 'High', 'Medium', 'Normal'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterPriority === p
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c8935c] text-white font-bold'
                  : darkMode
                  ? 'text-[#a39e93] hover:text-white'
                  : 'text-[#695747] hover:text-stone-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {publishSuccessToast && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {publishSuccessToast}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notices Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className={darkMode ? 'text-[#a39e93]' : 'text-[#695747]'}>
              Live Broadcast Feed ({filteredNotices.length} Bulletins)
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              ● Active Feed
            </span>
          </div>

          {filteredNotices.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center font-mono text-xs ${
                darkMode
                  ? 'border-[#382e25] bg-[#1a1613] text-[#a39e93]'
                  : 'border-[#ded4c5] bg-white text-[#695747]'
              }`}
            >
              No bulletins match this filter. Publish a new alert to notify residents.
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                id={`notice-card-${notice.id}`}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${
                  darkMode
                    ? 'border-[#382e25] bg-[#1a1613] hover:border-[#c8935c]/60'
                    : 'border-[#ded4c5] bg-white shadow-xs hover:border-[#824f1c]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono flex items-center gap-1.5 ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    <Calendar size={12} /> {notice.date} · {notice.author}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold ${
                        notice.priority === 'High'
                          ? 'border-rose-500/40 bg-rose-500/15 text-rose-500'
                          : notice.priority === 'Medium'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-[#f2ca50]'
                          : 'border-stone-500/40 bg-stone-500/10 text-stone-600 dark:text-[#ede8e1]'
                      }`}
                    >
                      {notice.priority} Priority
                    </span>

                    {/* Edit & Delete Buttons */}
                    <button
                      onClick={() => onEditNotice(notice)}
                      title="Edit this notice"
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        darkMode
                          ? 'text-[#a39e93] hover:text-[#f2ca50]'
                          : 'text-stone-500 hover:text-[#824f1c]'
                      }`}
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete notice bulletin "${notice.title}"? This cannot be undone.`
                          )
                        ) {
                          onDeleteNotice(notice.id);
                        }
                      }}
                      title="Delete this notice"
                      className="p-1 rounded text-stone-400 hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3
                  className={`text-base font-bold ${
                    darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                  }`}
                >
                  {notice.title}
                </h3>

                <p
                  className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                    darkMode ? 'text-[#ede8e1]' : 'text-stone-800'
                  }`}
                >
                  {notice.body}
                </p>

                <div
                  className={`pt-2.5 border-t text-[11px] font-mono flex justify-between items-center ${
                    darkMode ? 'border-[#382e25] text-[#a39e93]' : 'border-[#dfd3c3] text-[#695747]'
                  }`}
                >
                  <span>
                    Target Group:{' '}
                    <strong className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}>
                      {notice.target}
                    </strong>
                  </span>
                  <span
                    className={`text-[10px] ${
                      darkMode ? 'text-[#877d70]' : 'text-stone-400'
                    }`}
                  >
                    ID: {notice.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Broadcast Form */}
        <div className="lg:col-span-5">
          <div
            className={`p-6 rounded-2xl border sticky top-20 space-y-4 ${
              darkMode
                ? 'border-[#382e25] bg-[#1a1613]'
                : 'border-[#ded4c5] bg-white shadow-xs'
            }`}
          >
            <div
              className={`border-b pb-3 flex items-center gap-2 ${
                darkMode ? 'border-[#382e25]' : 'border-[#ded4c5]'
              }`}
            >
              <Megaphone
                size={18}
                className={darkMode ? 'text-[#f2ca50]' : 'text-[#824f1c]'}
              />
              <div>
                <h3
                  className={`text-sm font-bold uppercase font-mono ${
                    darkMode ? 'text-[#fbf9f5]' : 'text-[#1c1917]'
                  }`}
                >
                  Publish Public Alert
                </h3>
                <p
                  className={`text-[10px] font-mono ${
                    darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                  }`}
                >
                  Pushes immediately to the hostel resident feed
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
              <div>
                <label
                  className={`text-[10px] uppercase block mb-1 font-bold ${
                    darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                  }`}
                >
                  Notice Headline / Subject
                </label>
                <input
                  id="notice-title-input"
                  type="text"
                  required
                  placeholder="e.g. Mandatory Fire Alarm Drill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    darkMode
                      ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                      : 'bg-[#fcfaf7] border-[#ded4c5] text-stone-900 focus:border-[#824f1c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`text-[10px] uppercase block mb-1 font-bold ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Priority
                  </label>
                  <select
                    id="notice-priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Notice['priority'])}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                      darkMode
                        ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                        : 'bg-[#fcfaf7] border-[#ded4c5] text-stone-900 focus:border-[#824f1c]'
                    }`}
                  >
                    <option value="High">High (Urgent)</option>
                    <option value="Medium">Medium (General)</option>
                    <option value="Normal">Normal (Routine)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-[10px] uppercase block mb-1 font-bold ${
                      darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                    }`}
                  >
                    Target Audience
                  </label>
                  <select
                    id="notice-target-select"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                      darkMode
                        ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                        : 'bg-[#fcfaf7] border-[#ded4c5] text-stone-900 focus:border-[#824f1c]'
                    }`}
                  >
                    <option value="All Residents">All Residents</option>
                    <option value="Royal Paradise All">Royal Paradise All</option>
                    <option value="Floor 1 Residents">Floor 1 Residents</option>
                    <option value="Floor 2 Residents">Floor 2 Residents</option>
                    <option value="Floor 3 Residents">Floor 3 Residents</option>
                    <option value="Floor 4 Residents">Floor 4 Residents</option>
                    <option value="Hostel Mess Diners">Hostel Mess Diners</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`text-[10px] uppercase block mb-1 font-bold ${
                    darkMode ? 'text-[#a39e93]' : 'text-[#695747]'
                  }`}
                >
                  Notice Body Narrative
                </label>
                <textarea
                  id="notice-body-input"
                  required
                  rows={4}
                  placeholder="Type clear instructions, schedule, or policy updates..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    darkMode
                      ? 'bg-[#120f0d] border-[#382e25] text-[#ede8e1] focus:border-[#c8935c]'
                      : 'bg-[#fcfaf7] border-[#ded4c5] text-stone-900 focus:border-[#824f1c]'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  id="publish-notice-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#c8935c] to-[#9e6932] text-white shadow-md hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send size={14} />
                  Publish Alert to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
