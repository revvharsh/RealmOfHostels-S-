import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Building,
  GraduationCap,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSignOut: () => void;
  darkMode: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onSignOut,
  darkMode,
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleCancelEdit = () => {
    setFormData(userProfile);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const userInitial = (formData.name || 'U').charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="user-profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="user-profile-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border shadow-2xl transition-colors ${
              darkMode ? 'bg-[#141310] border-[#2B2720] text-[#FAF8F5]' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#DCD6CA] dark:border-[#2B2720]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C5828]/15 border border-[#8C5828]/30 flex items-center justify-center text-[#8C5828] dark:text-[#F2CA50] font-black text-lg">
              {userInitial}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-sans uppercase text-[#1C1917] dark:text-white">
                {isEditing ? 'Edit Resident Profile' : 'Resident Account & Details'}
              </h2>
              <p className="text-xs font-mono text-[#57534E] dark:text-[#A39E93]">
                Room B-004 · Royal Paradise Residence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                id="edit-profile-top-btn"
                onClick={() => setIsEditing(true)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] hover:border-[#8C5828] text-[#FAF8F5]'
                    : 'border-[#DCD6CA] bg-[#FAF8F5] hover:border-[#8C5828] text-[#1C1917]'
                }`}
              >
                <Edit3 size={13} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <span>Edit Details</span>
              </button>
            )}

            <button
              id="close-profile-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-[#57534E] hover:text-[#1C1917] dark:hover:text-white cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS / STATUS */}
        {saveSuccess && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span className="font-bold">Resident details updated successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="font-bold">{errorMessage}</span>
          </div>
        )}

        {/* CONTENT BODY */}
        {!isEditing ? (
          /* VIEW MODE */
          <div className="p-5 sm:p-6 space-y-6">
            {/* Identity Summary Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                darkMode ? 'bg-[#181712] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8C5828] to-[#5C3818] text-white flex items-center justify-center font-mono font-black text-2xl shadow-sm shrink-0">
                  {userInitial}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black font-sans text-[#1C1917] dark:text-white">
                      {formData.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase bg-[#8C5828] text-white">
                      {formData.enrollmentStatus}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-[#8C5828] dark:text-[#F2CA50] mt-1">
                    {formData.room} ({formData.roomType}) · {formData.bed}
                  </p>
                  <p className="text-[11px] font-mono text-[#57534E] dark:text-[#A39E93]">
                    {formData.block} · {formData.floor}
                  </p>
                </div>
              </div>

              <div className="font-mono text-xs sm:text-right shrink-0">
                <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-bold">
                  University / College
                </span>
                <span className="font-bold text-[#1C1917] dark:text-white">
                  {formData.college}
                </span>
              </div>
            </div>

            {/* Detailed User Information Grid */}
            <div>
              <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#8C5828] dark:text-[#F2CA50] pb-2 border-b border-[#DCD6CA] dark:border-[#2B2720] flex items-center gap-2">
                <UserCheck size={14} />
                <span>Personal & Academic Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 font-mono text-xs">
                {/* Official Email */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <Mail size={11} />
                    Registered Email
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5 text-sm break-all">
                    {formData.email}
                  </strong>
                </div>

                {/* Mobile Number */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <Phone size={11} />
                    Mobile Phone
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5 text-sm">
                    {formData.phone}
                  </strong>
                </div>

                {/* College / Institution */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <Building size={11} />
                    {t.collegeLabel}
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5">
                    {formData.college || 'Enrolled University'}
                  </strong>
                </div>

                {/* Academic Year */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <GraduationCap size={11} />
                    {t.yearLabel}
                  </span>
                  <strong className="text-[#8C5828] dark:text-[#F2CA50] block mt-0.5 font-bold">
                    {formData.year || '1st Year'}
                  </strong>
                </div>

                {/* Hometown */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <MapPin size={11} />
                    Hometown / Permanent City
                  </span>
                  <strong className="text-[#1C1917] dark:text-white block mt-0.5">
                    {formData.homeCity}
                  </strong>
                </div>

                {/* Blood Group */}
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                  }`}
                >
                  <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block font-semibold flex items-center gap-1">
                    <Heart size={11} />
                    Blood Group
                  </span>
                  <strong className="text-[#8C5828] dark:text-[#F2CA50] block mt-0.5 text-sm font-black">
                    {formData.bloodGroup}
                  </strong>
                </div>
              </div>
            </div>

            {/* Emergency & Guardian Contact */}
            <div>
              <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#8C5828] dark:text-[#F2CA50] pb-2 border-b border-[#DCD6CA] dark:border-[#2B2720] flex items-center gap-2">
                <ShieldCheck size={14} />
                <span>Emergency Guardian Contact</span>
              </h4>

              <div
                className={`mt-3 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs ${
                  darkMode ? 'bg-[#181613] border-[#2B2720]' : 'bg-[#FAF8F5] border-[#DCD6CA]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#1C1917] dark:text-white text-sm">
                      {formData.guardianName}
                    </strong>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/5 dark:bg-white/5 font-bold uppercase">
                      {formData.guardianRelation}
                    </span>
                  </div>
                  <span className="text-[#57534E] dark:text-[#A39E93] text-xs block mt-0.5">
                    Phone: {formData.guardianPhone}
                  </span>
                </div>

                <a
                  href={`tel:${formData.guardianPhone.replace(/\s+/g, '')}`}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#8C5828] text-white font-bold flex items-center justify-center gap-1.5 hover:bg-[#72451E] cursor-pointer transition-all self-start sm:self-auto"
                >
                  <Phone size={13} />
                  <span>Call Guardian</span>
                </a>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-4 border-t border-[#DCD6CA] dark:border-[#2B2720] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditing(true)}
                className={`w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] hover:border-[#8C5828] text-[#FAF8F5]'
                    : 'border-[#DCD6CA] bg-[#FAF8F5] hover:border-[#8C5828] text-[#1C1917]'
                }`}
              >
                <Edit3 size={15} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <span>Edit Profile Details</span>
              </button>

              <button
                id="modal-signout-btn"
                onClick={onSignOut}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <LogOut size={15} />
                <span>Sign Out of Portal</span>
              </button>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
            <div className="p-3 rounded-xl bg-[#8C5828]/10 border border-[#8C5828]/30 font-mono text-xs text-[#8C5828] dark:text-[#F2CA50]">
              Note: Academic degree program, semester enrollment, and hostel room assignments are locked by Warden Office. You may update your contact information, hometown, blood group, and emergency details.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="upadhyayharshpritam@gmail.com"
                  required
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="+91 88099 00560"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Hometown */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Hometown / City
                </label>
                <input
                  type="text"
                  value={formData.homeCity}
                  onChange={(e) => handleInputChange('homeCity', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="Bokaro, Jharkhand"
                />
              </div>

              {/* Guardian Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Emergency Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange('guardianName', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="XYZ"
                />
              </div>

              {/* Guardian Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Guardian Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="+91 94310 12345"
                />
              </div>

              {/* Guardian Relationship */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#57534E] dark:text-[#A39E93] mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.guardianRelation}
                  onChange={(e) => handleInputChange('guardianRelation', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#8C5828] ${
                    darkMode ? 'bg-[#181613] border-[#2B2720] text-white' : 'bg-white border-[#DCD6CA] text-[#1C1917]'
                  }`}
                  placeholder="Father / Mother / Guardian"
                />
              </div>
            </div>

            {/* FORM BUTTONS */}
            <div className="pt-4 border-t border-[#DCD6CA] dark:border-[#2B2720] flex items-center justify-end gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`min-h-[42px] px-4 py-2 rounded-xl border font-bold cursor-pointer transition-all ${
                  darkMode
                    ? 'border-[#2B2720] bg-[#1B1A15] hover:border-[#8C5828] text-[#FAF8F5]'
                    : 'border-[#DCD6CA] bg-white hover:border-[#8C5828] text-[#1C1917]'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                id="save-profile-btn"
                className="min-h-[42px] px-5 py-2 rounded-xl bg-[#8C5828] hover:bg-[#72451E] text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
