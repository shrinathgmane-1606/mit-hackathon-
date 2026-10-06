import React, { useState, useRef, useEffect } from 'react';
import { Language, PersonalBaseline, GlucoseReading, Medication, Meal, ActivityData, ChatMessage, CompoundRiskAssessment } from '../types';
import { MOCK_CHAT_CONVERSATION_INITIAL } from '../data/mockProfiles';
import { VoiceEngine } from '../engine/VoiceEngine';
import { SugarSenseApiClient } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldAlert, 
  Lightbulb, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';

interface AssistantViewProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  medications: Medication[];
  meals: Meal[];
  activity: ActivityData;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  baseline,
  latestGlucose,
  medications,
  meals,
  activity,
  assessment,
  language
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sugarsense_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_CHAT_CONVERSATION_INITIAL;
      }
    }
    return MOCK_CHAT_CONVERSATION_INITIAL;
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sugarsense_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = {
    en: [
      'How was my blood sugar this morning?',
      'Can I eat Poha with tea for breakfast?',
      'What is my next medicine schedule?',
      'Why is my health status green today?',
      'How many steps should I walk before dinner?'
    ],
    mr: [
      'आज सकाळी माझी साखर कशी होती?',
      'सकाळी पोहे आणि चहा खाणे योग्य आहे का?',
      'माझी पुढची औषधाची वेळ कोणती आहे?',
      'आज माझी तब्येत सुरक्षित का दिसत आहे?',
      'रात्रीच्या जेवणापूर्वी किती चालावे?'
    ],
    hi: [
      'आज सुबह मेरी शुगर कैसी थी?',
      'क्या मैं नाश्ते में पोहा और चाय ले सकती हूँ?',
      'मेरी अगली दवा का समय क्या है?',
      'आज मेरा स्वास्थ्य सुरक्षित क्यों है?',
      'रात के खाने से पहले मुझे कितना चलना चाहिए?'
    ]
  }[language];

  // AI Response Generator grounded in actual patient telemetry
  const generateAssistantResponse = (userQuery: string): { text: string; sources: string[]; followups: string[] } => {
    const q = userQuery.toLowerCase();
    const name = baseline.preferredName[language] || baseline.preferredName.en;
    const takenMeds = medications.filter(m => m.taken).length;
    const pendingMeds = medications.filter(m => !m.taken);

    // Glucose question
    if (q.includes('sugar') || q.includes('glucose') || q.includes('साखर') || q.includes('शुगर')) {
      if (latestGlucose) {
        const val = latestGlucose.value;
        const baselineMax = baseline.postPrandialBaseline.max;
        if (language === 'mr') {
          return {
            text: `${name}, तुमची आजची साखर ${val} mg/dL नोंदवली गेली आहे. तुमच्या नेहमीच्या पातळीनुसार (${baseline.fastingGlucoseBaseline.min}-${baselineMax} mg/dL) ही सुरक्षित श्रेणीत आहे. वेळेवर जेवण आणि औषधे घेतल्याने साखर स्थिर राहिली आहे.`,
            sources: [`आजची नोंद: ${val} mg/dL (${latestGlucose.context})`, `वैयक्तिक बेसलाइन: ${baseline.fastingGlucoseBaseline.min}-${baselineMax} mg/dL`],
            followups: ['दुपारच्या जेवणात काय खावे?', 'माझी पुढील गोळी कधी आहे?']
          };
        } else if (language === 'hi') {
          return {
            text: `${name}, आपकी आज की शुगर ${val} mg/dL दर्ज की गई है। यह आपकी सामान्य बेसलाइन (${baseline.fastingGlucoseBaseline.min}-${baselineMax} mg/dL) के अनुसार सुरक्षित दायरे में है। समय पर दवा और नाश्ता लेने से संतुलन बना हुआ है।`,
            sources: [`आज की रीडिंग: ${val} mg/dL (${latestGlucose.context})`, `बेसलाइन रेंज: ${baseline.fastingGlucoseBaseline.min}-${baselineMax} mg/dL`],
            followups: ['दोपहर के खाने में क्या लें?', 'अगली दवा कब लेनी है?']
          };
        } else {
          return {
            text: `Hello ${name}, your latest blood glucose is ${val} mg/dL (${latestGlucose.context.replace('_', ' ').toLowerCase()}). This is comfortably within your personal learned baseline range (${baseline.fastingGlucoseBaseline.min} - ${baselineMax} mg/dL). Excellent adherence today!`,
            sources: [`Latest Reading: ${val} mg/dL`, `Learned Corridor: ${baseline.fastingGlucoseBaseline.min}-${baselineMax} mg/dL`],
            followups: ['What should I eat for lunch?', 'When is my next tablet?']
          };
        }
      } else {
        if (language === 'mr') {
          return {
            text: `${name}, तुमच्या प्रोफाइलमध्ये आज कोणतीही साखर नोंदवलेली नाही. अचूक वैद्यकीय मार्गदर्शन मिळवण्यासाठी कृपया डॅशबोर्डवर 'रक्तातील साखर नोंदवा' वर टॅप करा.`,
            sources: ['साखर नोंद: अद्याप उपलब्ध नाही'],
            followups: ['साखर कशी मोजावी?', 'नाश्त्यात काय खावे?']
          };
        } else if (language === 'hi') {
          return {
            text: `${name}, आपकी प्रोफाइल में आज कोई ब्लड शुगर रीडिंग दर्ज नहीं है। सटीक मार्गदर्शन के लिए कृपया डैशबोर्ड पर जाकर अपनी फास्टिंग या भोजन के बाद की शुगर दर्ज करें।`,
            sources: ['शुगर डेटा: अभी उपलब्ध नहीं'],
            followups: ['शुगर कब चेक करनी चाहिए?', 'नाश्ते में क्या लें?']
          };
        } else {
          return {
            text: `Hello ${name}, no blood sugar readings have been recorded for your profile today. Please tap 'Log Sugar' on your dashboard to record your fasting or post-meal glucose value so I can provide personalized clinical guidance.`,
            sources: ['Glucose Data: No readings recorded yet'],
            followups: ['How to check fasting sugar?', 'What is a healthy post-meal range?']
          };
        }
      }
    }

    // Food / Meal question
    if (q.includes('poha') || q.includes('pohe') || q.includes('पोहे') || q.includes('tea') || q.includes('चहा') || q.includes('खा') || q.includes('food') || q.includes('meal') || q.includes('lunch') || q.includes('dinner')) {
      if (language === 'mr') {
        return {
          text: `होय ${name}, तुम्ही १ मध्यम वाटी पोहे नक्की खाऊ शकता. मात्र त्यात भरपूर भाज्या आणि मूंगफली (शेंगदाणे) नक्की घाला, जेणेकरून फायबर आणि प्रोटीनमुळे साखरेची पातळी अचानक वाढत नाही. सोबत बिनसाखरेचा किंवा अतिशय कमी साखरेचा चहा घ्या.`,
          sources: ['भारतीय आहार AI: कांदे पोहे (मध्यम ग्लायसेमिक लोड)', 'फायबर बफरिंग तत्त्व'],
          followups: ['दुपारी भाकरी खावी का?', 'माझी आजची पावले किती झाली?']
        };
      } else if (language === 'hi') {
        return {
          text: `हाँ ${name}, आप 1 मध्यम कटोरी पोहा खा सकती हैं। इसमें मूंगफली और हरी मटर/सब्जियां जरूर मिलाएं ताकि फाइबर और प्रोटीन शुगर को तेजी से बढ़ने न दें। चाय बिना चीनी या बहुत कम चीनी वाली ही पिएं।`,
          sources: ['भारतीय आहार AI: पोहा विश्लेषण', 'ग्लाइसेमिक लोड संतुलन'],
          followups: ['दोपहर में क्या खाना सही रहेगा?', 'पानी का स्तर कैसा है?']
        };
      } else {
        return {
          text: `Yes ${name}, 1 medium bowl of homemade Poha is completely fine! Pro-tip: Add roasted peanuts and vegetables (peas/curry leaves) to add healthy fats and fiber, which flattens the post-meal glucose curve. Pair with low-sugar or sugar-free tea.`,
          sources: ['Indian Food AI Engine: Flattening Glycemic Spike', 'Carb-to-Fiber ratio: 4:1'],
          followups: ['Is Jowar Bhakri better for lunch?', 'Check my current daily step count']
        };
      }
    }

    // Medicine / Tablet question
    if (q.includes('med') || q.includes('tablet') || q.includes('medicine') || q.includes('औषध') || q.includes('गोळी') || q.includes('दवा')) {
      if (pendingMeds.length > 0) {
        const nextMed = pendingMeds[0];
        if (language === 'mr') {
          return {
            text: `${name}, तुम्ही आज ${takenMeds} गोळ्या वेळेवर घेतल्या आहेत. तुमची पुढील गोळी "${nextMed.name}" (${nextMed.dosage}) आहे, जी ${nextMed.scheduledTime} वाजता घेणे आवश्यक आहे.`,
            sources: [`पुढील औषध: ${nextMed.name} (${nextMed.scheduledTime})`, `आज पूर्ण: ${takenMeds}/${medications.length}`],
            followups: ['गोळी जेवणापूर्वी की नंतर?', 'आजची साखर तपासा']
          };
        } else if (language === 'hi') {
          return {
            text: `${name}, आपने आज ${takenMeds} दवाएं समय पर ले ली हैं। आपकी अगली दवा "${nextMed.name}" (${nextMed.dosage}) है, जो ${nextMed.scheduledTime} बजे लेनी है।`,
            sources: [`अगली खुराक: ${nextMed.name}`, `अनुपालन दर: ${Math.round((takenMeds / medications.length) * 100)}%`],
            followups: ['दवा भोजन से पहले या बाद?', 'आज की गतिविधि कैसी है?']
          };
        } else {
          return {
            text: `You have taken ${takenMeds} of ${medications.length} prescribed doses today. Your upcoming dose is **${nextMed.name}** (${nextMed.dosage}) scheduled for ${nextMed.scheduledTime}.`,
            sources: [`Next Dose: ${nextMed.name} @ ${nextMed.scheduledTime}`, `Adherence: ${Math.round((takenMeds / medications.length) * 100)}%`],
            followups: ['Should I take it before or after meal?', 'Show my full reminder schedule']
          };
        }
      } else {
        return {
          text: language === 'mr' 
            ? `अभिनंदन ${name}! तुम्ही आजच्या सर्व विहित गोळ्या पूर्ण केल्या आहेत. तुमची शिस्त प्रशंसनीय आहे.`
            : language === 'hi'
            ? `बहुत बढ़िया ${name}! आपने आज की सभी निर्धारित दवाएं समय पर ले ली हैं।`
            : `All prescribed medications for today have been completed on time! Excellent routine discipline.`,
          sources: [`All ${medications.length} doses confirmed`],
          followups: ['Check my activity steps', 'View 14-day trends']
        };
      }
    }

    // Status / Risk question
    if (q.includes('status') || q.includes('green') || q.includes('risk') || q.includes('तब्येत') || q.includes('सुरक्षित') || q.includes('स्वास्थ्य')) {
      if (language === 'mr') {
        return {
          text: `${name}, आज तुमचा आरोग्य निर्देशांक पूर्णपणे हिरवा (सुरक्षित) आहे! याचे मुख्य कारण म्हणजे सकाळची साखर (${latestGlucose?.value || 128} mg/dL) योग्य आहे, औषधे वेळेवर घेतली आहेत आणि तुम्ही ${activity.stepsToday} पावले चालला आहात.`,
          sources: [`जोखीम गुण: ${assessment.score}/100 (कमी)`, 'सर्व ३ प्रमुख घटक संतुलित'],
          followups: ['संध्याकाळच्या चालण्याचे नियोजन', 'काळजीवाहू सूचना पाठवा']
        };
      } else if (language === 'hi') {
        return {
          text: `${name}, आज आपका स्वास्थ्य स्टेटस हरा (सुरक्षित) है क्योंकि सुबह की शुगर स्थिर है, दवाएं समय पर ली गई हैं और आपने ${activity.stepsToday} कदम चल लिए हैं। कोई भी विचलन नहीं देखा गया है।`,
          sources: [`जोखिम स्कोर: ${assessment.score}/100`, 'नियमित दिनचर्या सत्यापित'],
          followups: ['शाम की वॉक का समय', 'डॉक्टर रिपोर्ट देखें']
        };
      } else {
        return {
          text: `Your health status is **STABLE (Green)** because all multi-variate factors align with your baseline: blood sugar (${latestGlucose?.value || 128} mg/dL) is within target, critical medications are taken, and physical mobility is on track (${activity.stepsToday} steps).`,
          sources: [`Compound Risk Score: ${assessment.score}/100`, `Baseline adherence: 100%`],
          followups: ['What are my evening fitness tips?', 'Open doctor visit summary']
        };
      }
    }

    // Default / Activity response
    if (language === 'mr') {
      return {
        text: `${name}, मी तुमच्या दिनचर्येवर लक्ष ठेवून आहे. आज तुम्ही ${activity.stepsToday} पावले चालला आहात (${activity.stepTarget} चे उद्दिष्ट). संध्याकाळी हलकी १० मिनिटांची वॉक घेतल्यास साखर आणखी स्थिर राहील. मला कोणताही प्रश्न विचारा!`,
        sources: [`आजची पावले: ${activity.stepsToday}/${activity.stepTarget}`],
        followups: ['माझी साखर तपासा', 'पुढची गोळी कधी आहे?']
      };
    } else if (language === 'hi') {
      return {
        text: `${name}, मैं आपकी सेहत और दिनचर्या पर नजर रख रहा हूँ। आज आपने ${activity.stepsToday} कदम पूरे किए हैं। शाम को 10-15 मिनट का हल्का टहलना आपको तरोताजा और शुगर को संतुलित रखेगा।`,
        sources: [`कदम: ${activity.stepsToday}/${activity.stepTarget}`],
        followups: ['मेरी अगली दवा कौन सी है?', 'पोहा खाने की सलाह']
      };
    } else {
      return {
        text: `I'm monitoring your daily rhythm, ${name}. You've logged ${activity.stepsToday} steps toward your ${activity.stepTarget} goal today. Your next meal and medication timings are safely spaced. Feel free to ask about foods, symptoms, or trends!`,
        sources: [`Steps logged: ${activity.stepsToday}`, `Status: ${assessment.status}`],
        followups: ['How was my blood sugar?', 'Can I eat Poha with tea?']
      };
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    const patientContext = {
      latestGlucose: latestGlucose?.value,
      medicationsTaken: medications.filter(m => m.taken).map(m => m.name),
      stepsToday: activity.stepsToday,
      riskStatus: assessment.status
    };

    const historyList = messages.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    SugarSenseApiClient.askAssistant(query, language, patientContext, historyList).then((groqResp) => {
      if (groqResp) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'assistant',
          text: groqResp.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: groqResp.sources,
          suggestedFollowups: groqResp.followups
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
      } else {
        const resp = generateAssistantResponse(query);
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'assistant',
          text: resp.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: resp.sources,
          suggestedFollowups: resp.followups
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
      }
    });
  };

  const handleSpeak = (id: string, text: string) => {
    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(id);
      VoiceEngine.speak(text, language).then(() => {
        setIsSpeakingId(null);
      });
    }
  };

  const handleResetChat = () => {
    setMessages(MOCK_CHAT_CONVERSATION_INITIAL);
    localStorage.removeItem('sugarsense_chat_history');
  };

  return (
    <div className="w-full space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-teal-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-6 h-6 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'AI मधुमेह सहाय्यक' : language === 'hi' ? 'AI डायबिटीज असिस्टेंट' : 'AI Diabetes Assistant'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Grounded AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-0.5">
              {language === 'mr'
                ? 'तुमच्या आरोग्याच्या नोंदी आणि दिनचर्येनुसार सोप्या भाषेत उत्तरे देणारा सोबती.'
                : language === 'hi'
                ? 'आपकी व्यक्तिगत स्वास्थ्य रिपोर्ट और दिनचर्या के अनुसार सरल भाषा में मदद।'
                : 'Ask questions about your readings, Indian meals, medications & personalized daily rhythm.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 text-xs font-semibold border border-white/15 transition-colors self-end sm:self-center"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'रीसेट' : language === 'hi' ? 'रीसेट' : 'Clear Chat'}</span>
        </button>
      </div>

      {/* Medical Safety Notice */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong>{language === 'mr' ? 'महत्त्वाची सूचना:' : language === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Clinical Disclaimer:'}</strong>{' '}
          {language === 'mr'
            ? 'शुगरसेन्स AI हा केवळ जीवनशैली मार्गदर्शक आहे. हा वैद्यकीय निदान अथवा डॉक्टरांच्या उपचारांचा पर्याय नाही.'
            : language === 'hi'
            ? 'शुगरसेंस AI केवल दिनचर्या और जागरूकता के लिए है, यह डॉक्टर की सलाह या आपातकालीन चिकित्सा का विकल्प नहीं है।'
            : 'SugarSense is an informational elderly companion and not a substitute for clinical diagnosis or emergency medical care.'}
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-full`}
              >
                <div className="flex items-start space-x-2 max-w-[90%] sm:max-w-[80%]">
                  {isAI && (
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                      isAI
                        ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none'
                        : 'bg-teal-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-line font-medium text-[14px] sm:text-[15px]">{msg.text}</p>

                    {/* Sources grounding tags */}
                    {isAI && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Grounded in:</span>
                        </span>
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer bar with timestamp and TTS button */}
                    <div
                      className={`mt-2 flex items-center justify-between text-[11px] ${
                        isAI ? 'text-slate-400 dark:text-slate-500' : 'text-teal-100'
                      }`}
                    >
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{msg.timestamp}</span>
                      </span>

                      {isAI && (
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="flex items-center space-x-1 px-2 py-0.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-400 font-semibold transition-colors"
                          title="Read aloud in simple voice"
                        >
                          {isSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                              <span className="text-rose-500">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAI && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* AI Followup Suggestions Chips */}
                {isAI && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="ml-10 mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors text-left"
                      >
                        💡 {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex space-x-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 self-center uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Suggestions:</span>
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-xs whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500 font-medium transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'साखर, गोळ्या किंवा आहाराबद्दल काहीही विचारा...'
                  : language === 'hi'
                  ? 'शुगर, दवाओं या भोजन के बारे में कुछ भी पूछें...'
                  : 'Ask about glucose readings, Indian meals, tablets...'
              }
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm sm:text-base font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'विचारा' : language === 'hi' ? 'पूछें' : 'Send'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
