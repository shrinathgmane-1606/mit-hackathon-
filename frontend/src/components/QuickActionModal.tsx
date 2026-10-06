import React, { useState } from 'react';
import { Language, IndianFoodItem, Medication } from '../types';
import { INDIAN_FOOD_DATABASE } from '../engine/IndianFoodAI';
import { 
  X, 
  Droplet, 
  Pill, 
  Utensils, 
  Footprints, 
  AlertTriangle, 
  Check, 
  Plus, 
  Search 
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  medications: Medication[];
  onLogGlucose: (val: number, ctx: any) => void;
  onToggleMedication: (id: string) => void;
  onLogMeal: (food: IndianFoodItem) => void;
  onLogActivity: (steps: number) => void;
  onReportSymptoms: (symptoms: string[]) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  language,
  medications,
  onLogGlucose,
  onToggleMedication,
  onLogMeal,
  onLogActivity,
  onReportSymptoms,
}) => {
  const [activeTab, setActiveTab] = useState<'glucose' | 'meds' | 'meals' | 'activity' | 'symptoms'>('glucose');

  // Local form states
  const [glucoseVal, setGlucoseVal] = useState<number>(130);
  const [glucoseCtx, setGlucoseCtx] = useState<any>('POST_BREAKFAST');
  const [foodSearch, setFoodSearch] = useState<string>('');
  const [stepInput, setStepInput] = useState<number>(1000);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSaveGlucose = () => {
    onLogGlucose(glucoseVal, glucoseCtx);
    onClose();
  };

  const handleSaveActivity = () => {
    onLogActivity(stepInput);
    onClose();
  };

  const handleSaveSymptoms = () => {
    if (selectedSymptoms.length > 0) {
      onReportSymptoms(selectedSymptoms);
    }
    onClose();
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const filteredFoods = INDIAN_FOOD_DATABASE.filter(f => 
    f.nameEn.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.nameMr.includes(foodSearch) ||
    f.nameHi.includes(foodSearch)
  );

  const availableSymptoms = [
    { id: 'dizziness', labelEn: 'Dizziness / Lightheadedness', labelMr: 'चक्कर येणे', labelHi: 'चक्कर आना' },
    { id: 'sweats', labelEn: 'Cold Sweats', labelMr: 'थंड घाम फुटणे', labelHi: 'पसीना आना' },
    { id: 'trembling', labelEn: 'Shakiness / Trembling', labelMr: 'हात थरथरणे', labelHi: 'हाथ कांपना' },
    { id: 'fatigue', labelEn: 'Extreme Fatigue / Weakness', labelMr: 'अतिशय थकवा', labelHi: 'थकान व कमजोरी' },
    { id: 'thirst', labelEn: 'Excessive Thirst', labelMr: 'वारंवार तहान लागणे', labelHi: 'ज्यादा प्यास लगना' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Quick Telemetry Logger
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto py-3 border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveTab('glucose')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'glucose' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🩸 Glucose</span>
          </button>
          <button
            onClick={() => setActiveTab('meds')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'meds' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>💊 Meds</span>
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'meals' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🍛 Indian Food</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'activity' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🚶 Steps</span>
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'symptoms' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>⚠️ Symptoms</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Tab 1: Glucose */}
          {activeTab === 'glucose' && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Reading (mg/dL)</p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <input
                    type="number"
                    value={glucoseVal}
                    onChange={(e) => setGlucoseVal(Number(e.target.value))}
                    className="text-4xl font-black text-center text-slate-900 w-32 py-1 bg-white border-2 border-teal-500 rounded-2xl shadow-inner focus:outline-none"
                  />
                  <span className="text-sm font-bold text-slate-500">mg/dL</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="350"
                  value={glucoseVal}
                  onChange={(e) => setGlucoseVal(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 mb-2">Context</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {['FASTING', 'POST_BREAKFAST', 'POST_LUNCH', 'POST_DINNER'].map((ctx) => (
                    <button
                      key={ctx}
                      type="button"
                      onClick={() => setGlucoseCtx(ctx)}
                      className={`p-2.5 rounded-xl border transition ${glucoseCtx === ctx ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700'}`}
                    >
                      {ctx.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveGlucose}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition"
              >
                Save Glucose Reading
              </button>
            </div>
          )}

          {/* Tab 2: Medicines */}
          {activeTab === 'meds' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">Tap any medication to mark as taken or due:</p>
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => onToggleMedication(med.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    med.taken ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold">{med.name}</h4>
                    <p className="text-xs text-slate-500">{med.dosage} • Scheduled {med.scheduledTime}</p>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    med.taken ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {med.taken ? 'Taken ✅' : 'Tap to Mark'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Meals & Indian Food */}
          {activeTab === 'meals' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Search Indian foods (Poha, Bhakri, Khichdi)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      onLogMeal(food);
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-amber-50 rounded-2xl border border-slate-200 hover:border-amber-300 text-left transition"
                  >
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {language === 'mr' ? food.nameMr : food.nameEn}
                    </p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1.5 inline-block ${
                      food.glycemicIndex === 'LOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      GI: {food.glycemicIndex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Add Steps Walked</p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <input
                    type="number"
                    value={stepInput}
                    onChange={(e) => setStepInput(Number(e.target.value))}
                    className="text-3xl font-black text-center text-slate-900 w-32 py-1 bg-white border border-slate-300 rounded-xl"
                  />
                  <span className="text-sm font-bold text-slate-500">steps</span>
                </div>
              </div>

              <button
                onClick={handleSaveActivity}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition"
              >
                Log Steps
              </button>
            </div>
          )}

          {/* Tab 5: Symptoms */}
          {activeTab === 'symptoms' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">Select any symptoms experienced right now:</p>
              {availableSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.labelEn);
                return (
                  <div
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.labelEn)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold">{sym.labelEn}</h4>
                      <p className="text-[11px] text-slate-500">{sym.labelMr} • {sym.labelHi}</p>
                    </div>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                      isSelected ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}

              <button
                onClick={handleSaveSymptoms}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition mt-3"
              >
                Record Symptoms
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
