import React, { useState } from 'react';
import { Language, ReminderItem, PersonalBaseline } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Pill, 
  Activity, 
  Utensils, 
  Droplets, 
  Stethoscope, 
  Plus, 
  Check, 
  RotateCcw,
  Sparkles,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onSnoozeReminder: (id: string) => void;
  onAddReminder: (reminder: ReminderItem) => void;
  baseline: PersonalBaseline;
  language: Language;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onSnoozeReminder,
  onAddReminder,
  baseline,
  language
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MEDICATION' | 'GLUCOSE' | 'MEAL' | 'ACTIVITY' | 'APPOINTMENTS'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReminderItem['type']>('MEDICATION');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newRecurring, setNewRecurring] = useState<ReminderItem['recurring']>('DAILY');
  const [newNote, setNewNote] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newClinic, setNewClinic] = useState('');

  const filteredReminders = reminders.filter(r => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'APPOINTMENTS') return r.type === 'DOCTOR_APPOINTMENT';
    return r.type === activeFilter;
  });

  const completedCount = reminders.filter(r => r.isCompleted).length;
  const pendingCount = reminders.length - completedCount;

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRem: ReminderItem = {
      id: `rem-custom-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      time: newTime,
      recurring: newRecurring,
      isCompleted: false,
      note: newNote.trim() || undefined,
      doctorName: newType === 'DOCTOR_APPOINTMENT' ? newDoctor.trim() : undefined,
      clinicAddress: newType === 'DOCTOR_APPOINTMENT' ? newClinic.trim() : undefined
    };

    onAddReminder(newRem);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNote('');
    setNewDoctor('');
    setNewClinic('');
  };

  const getTypeIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'MEDICATION':
        return <Pill className="w-5 h-5 text-indigo-500" />;
      case 'GLUCOSE':
        return <span className="text-lg">🩸</span>;
      case 'MEAL':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'ACTIVITY':
        return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'HYDRATION':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'DOCTOR_APPOINTMENT':
        return <Stethoscope className="w-5 h-5 text-rose-500" />;
    }
  };

  const getTypeBadge = (type: ReminderItem['type']) => {
    switch (type) {
      case 'MEDICATION':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'GLUCOSE':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'MEAL':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'ACTIVITY':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'HYDRATION':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'DOCTOR_APPOINTMENT':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Bell className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'वैयक्तिक आठवणी व वेळापत्रक' : language === 'hi' ? 'व्यक्तिगत रिमाइंडर व समय सारिणी' : 'Personalized Reminders & Schedule'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                {completedCount}/{reminders.length} Done
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-0.5">
              {language === 'mr'
                ? 'औषधे, साखर तपासणी, आहार, पाणी आणि डॉक्टरांच्या भेटींचे अचूक स्मरण.'
                : language === 'hi'
                ? 'दवाएं, शुगर जांच, भोजन, पानी और डॉक्टर की अपॉइंटमेंट का समय पर रिमाइंडर।'
                : 'Smart reminders aligned with senior circadian baseline & clinical prescriptions.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 text-indigo-700" />
          <span>{language === 'mr' ? 'नवीन आठवण जोडा' : language === 'hi' ? 'नया रिमाइंडर जोड़ें' : 'Add Reminder'}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'mr' ? 'पूर्ण झालेल्या आठवणी' : language === 'hi' ? 'पूर्ण किए गए कार्य' : 'Completed Today'}
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {completedCount} <span className="text-xs font-bold text-slate-400">/ {reminders.length}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'mr' ? 'शिल्लक आठवणी' : language === 'hi' ? 'बाकी रिमाइंडर' : 'Pending Action'}
            </p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'mr' ? 'पुढील डॉक्टर भेट' : language === 'hi' ? 'अगली डॉक्टर अपॉइंटमेंट' : 'Next Doctor Visit'}
            </p>
            <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mt-1 truncate max-w-[170px]">
              Friday, 10:30 AM
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { id: 'ALL', label: { en: 'All Reminders', mr: 'सर्व आठवणी', hi: 'सभी रिमाइंडर' } },
          { id: 'MEDICATION', label: { en: '💊 Medicines', mr: '💊 औषधे', hi: '💊 दवाएं' } },
          { id: 'GLUCOSE', label: { en: '🩸 Sugar Checks', mr: '🩸 साखर', hi: '🩸 शुगर जांच' } },
          { id: 'MEAL', label: { en: '🍛 Meals', mr: '🍛 आहार', hi: '🍛 भोजन' } },
          { id: 'ACTIVITY', label: { en: '🚶 Activity', mr: '🚶 फेरफटका', hi: '🚶 चलना' } },
          { id: 'APPOINTMENTS', label: { en: '👨‍⚕️ Doctor Visits', mr: '👨‍⚕️ डॉक्टर भेटी', hi: '👨‍⚕️ डॉक्टर मुलाकात' } }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            {tab.label[language] || tab.label.en}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map((rem) => {
          const isDone = rem.isCompleted;
          const isAppointment = rem.type === 'DOCTOR_APPOINTMENT';

          return (
            <div
              key={rem.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
                isDone
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/60 opacity-80'
                  : isAppointment
                  ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                  >
                    <Check className={`w-5 h-5 ${isDone ? 'stroke-[3]' : 'opacity-0 hover:opacity-50'}`} />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getTypeBadge(rem.type)}`}>
                        {rem.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{rem.time}</span>
                      </span>
                      {rem.recurring && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {rem.recurring}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-bold text-slate-900 dark:text-white ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                      {rem.title}
                    </h3>

                    {rem.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        💡 {rem.note}
                      </p>
                    )}

                    {isAppointment && rem.doctorName && (
                      <div className="text-xs text-purple-800 dark:text-purple-300 space-y-0.5 pt-1">
                        <p className="flex items-center space-x-1 font-semibold">
                          <User className="w-3.5 h-3.5" />
                          <span>{rem.doctorName}</span>
                        </p>
                        {rem.clinicAddress && (
                          <p className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{rem.clinicAddress}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {!isDone && (
                    <button
                      onClick={() => onSnoozeReminder(rem.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1"
                      title="Snooze for 15 minutes"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'mr' ? '१५ मि. पुढे' : language === 'hi' ? '15 मि. बाद' : 'Snooze 15m'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isDone
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isDone 
                      ? (language === 'mr' ? 'पूर्ण झाले' : language === 'hi' ? 'पूर्ण' : 'Completed') 
                      : (language === 'mr' ? 'पूर्ण करा' : language === 'hi' ? 'पूरा करें' : 'Mark Done')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold text-lg">
                  {language === 'mr' ? 'नवीन आठवण जोडा' : language === 'hi' ? 'नया रिमाइंडर जोड़ें' : 'Create Reminder'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Reminder Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'MEDICATION', label: '💊 Medicine' },
                    { id: 'GLUCOSE', label: '🩸 Glucose' },
                    { id: 'MEAL', label: '🍛 Meal' },
                    { id: 'ACTIVITY', label: '🚶 Activity' },
                    { id: 'HYDRATION', label: '💧 Water' },
                    { id: 'DOCTOR_APPOINTMENT', label: '👨‍⚕️ Doctor' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                        newType === t.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Title / Task Description
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Afternoon Glimepiride Tablet, Post-lunch Walk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 08:30 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Frequency
                  </label>
                  <select
                    value={newRecurring}
                    onChange={(e) => setNewRecurring(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="TWICE_DAILY">Twice Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="ONCE">Once (One-time)</option>
                  </select>
                </div>
              </div>

              {newType === 'DOCTOR_APPOINTMENT' && (
                <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div>
                    <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
                      Doctor Name & Speciality
                    </label>
                    <input
                      type="text"
                      value={newDoctor}
                      onChange={(e) => setNewDoctor(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Mehta (Endocrinologist)"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
                      Clinic Location / Address
                    </label>
                    <input
                      type="text"
                      value={newClinic}
                      onChange={(e) => setNewClinic(e.target.value)}
                      placeholder="e.g. Swargate, Pune"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Helpful Note / Instructions
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Take with warm water after eating"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
