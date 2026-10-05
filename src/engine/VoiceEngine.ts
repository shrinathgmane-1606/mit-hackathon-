import { Language, NavigationTab } from '../types';

export interface VoiceIntentResult {
  intent: 'LOG_MEDICATION' | 'LOG_GLUCOSE' | 'LOG_MEAL' | 'REPORT_SYMPTOM' | 'NAVIGATE' | 'ASK_STATUS' | 'UNKNOWN';
  extractedValue?: string | number;
  targetTab?: NavigationTab;
  speechResponse: {
    en: string;
    hi: string;
    mr: string;
  };
  confidence: number;
}

export class VoiceEngine {
  /**
   * Speak a message using the native browser Web Speech API
   */
  public static speak(text: string, lang: Language): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported on this browser.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any previous speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.90;
      utterance.pitch = 1.02;

      const langMap: Record<Language, string> = {
        mr: 'mr-IN',
        hi: 'hi-IN',
        en: 'en-IN'
      };

      utterance.lang = langMap[lang] || 'en-IN';

      const voices = window.speechSynthesis.getVoices();
      const targetLang = langMap[lang];
      const matchedVoice = voices.find(v => v.lang.replace('_', '-') === targetLang || v.lang.startsWith(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Natural Language Intent parsing for Voice commands in Marathi, Hindi & English
   */
  public static parseVoiceCommand(transcript: string, currentLanguage: Language): VoiceIntentResult {
    const raw = transcript.toLowerCase().trim();

    // 1. Navigation Voice + Visual Sync Intent
    if (raw.includes('insight') || raw.includes('माहिती') || raw.includes('विश्लेषण')) {
      return {
        intent: 'NAVIGATE',
        targetTab: 'insights',
        speechResponse: {
          mr: 'AI माहिती व दिनचर्या स्क्रीन उघडत आहे.',
          hi: 'AI इनसाइट्स स्क्रीन खोली जा रही है।',
          en: 'Opening AI Routine Insights for you.'
        },
        confidence: 0.96
      };
    }

    if (raw.includes('history') || raw.includes('log') || raw.includes('नोंदी') || raw.includes('इतिहास')) {
      return {
        intent: 'NAVIGATE',
        targetTab: 'history',
        speechResponse: {
          mr: 'सर्व नोंदी व इतिहास स्क्रीन उघडत आहे.',
          hi: 'लॉग्स और इतिहास स्क्रीन खोली जा रही है।',
          en: 'Opening Telemetry Logs and History.'
        },
        confidence: 0.96
      };
    }

    if (raw.includes('doctor') || raw.includes('डॉक्टर') || raw.includes('report') || raw.includes('व्हिजिट')) {
      return {
        intent: 'NAVIGATE',
        targetTab: 'doctor',
        speechResponse: {
          mr: 'डॉक्टर व्हिजिट रिपोर्ट उघडत आहे.',
          hi: 'डॉक्टर विजिट रिपोर्ट खोली जा रही है।',
          en: 'Opening Doctor Clinical Visit Report.'
        },
        confidence: 0.96
      };
    }

    if (raw.includes('caregiver') || raw.includes('family') || raw.includes('काळजीवाहू') || raw.includes('मुलगी') || raw.includes('मुलगा')) {
      return {
        intent: 'NAVIGATE',
        targetTab: 'caregiver',
        speechResponse: {
          mr: 'काळजीवाहू सुरक्षा पोर्टल उघडत आहे.',
          hi: 'देखभालकर्ता सुरक्षा पोर्टल खोला जा रहा है।',
          en: 'Opening Caregiver Safety Net portal.'
        },
        confidence: 0.96
      };
    }

    if (raw.includes('dashboard') || raw.includes('home') || raw.includes('मुख्य') || raw.includes('घर')) {
      return {
        intent: 'NAVIGATE',
        targetTab: 'dashboard',
        speechResponse: {
          mr: 'मुख्य डॅशबोर्डवर परत जात आहे.',
          hi: 'मुख्य डैशबोर्ड पर वापस जा रहे हैं।',
          en: 'Returning to Senior Dashboard.'
        },
        confidence: 0.96
      };
    }

    // 2. Medication taken intent
    if (
      raw.includes('औषध') || raw.includes('गोळी') || raw.includes('दवा') || raw.includes('medicine') ||
      raw.includes('tablet') || raw.includes('pill') || raw.includes('घेतली') || raw.includes('ले ली') ||
      raw.includes('took')
    ) {
      return {
        intent: 'LOG_MEDICATION',
        speechResponse: {
          mr: 'छान! तुमची सकाळची औषधे वेळेवर नोंदवली आहेत.',
          hi: 'बहुत बढ़िया! आपकी निर्धारित दवा समय पर दर्ज कर ली गई है।',
          en: 'Great job! Your scheduled morning medicine has been recorded as taken.'
        },
        confidence: 0.95
      };
    }

    // 3. Glucose Reading intent
    const glucoseMatch = raw.match(/(\d{2,3})/);
    if (raw.includes('sugar') || raw.includes('शुगर') || raw.includes('साखर') || (glucoseMatch && (raw.includes('reading') || raw.includes('आहे') || raw.includes('है')))) {
      const val = glucoseMatch ? parseInt(glucoseMatch[1], 10) : 140;
      
      let speechMr = `तुमची आजची साखरेची पातळी ${val} नोंदवली आहे.`;
      let speechHi = `आपकी आज की शुगर रीडिंग ${val} दर्ज कर ली गई है।`;
      let speechEn = `Your glucose reading of ${val} mg/dL has been recorded.`;

      if (val > 170) {
        speechMr = `तुमचं आजचं reading ${val} हे तुमच्या नेहमीच्या पातळीपेक्षा जास्त आहे. काळजी करू नका, हलका आहार घ्या व थोडे चाला.`;
        speechHi = `आपकी आज की रीडिंग ${val} सामान्य से थोड़ी अधिक है। चिंता न करें, हल्का आहार लें और थोड़ा टहलें।`;
        speechEn = `Your reading of ${val} is higher than your usual baseline. Stay calm, drink water, and have a light meal.`;
      }

      return {
        intent: 'LOG_GLUCOSE',
        extractedValue: val,
        speechResponse: {
          mr: speechMr,
          hi: speechHi,
          en: speechEn
        },
        confidence: 0.92
      };
    }

    // 4. Meal intent
    if (
      raw.includes('पोहे') || raw.includes('poha') || raw.includes('भाकरी') || raw.includes('खिचडी') ||
      raw.includes('जेवण') || raw.includes('खाल्ल') || raw.includes('खाया') || raw.includes('ate') ||
      raw.includes('breakfast') || raw.includes('lunch') || raw.includes('dinner') || raw.includes('उपमा')
    ) {
      return {
        intent: 'LOG_MEAL',
        extractedValue: raw,
        speechResponse: {
          mr: 'तुमचा आहार नोंदवला आहे! सोबत काकडी किंवा ताक घेतल्यास साखर नियंत्रणात राहील.',
          hi: 'आपका भोजन दर्ज कर लिया गया है! साथ में सलाद या छाछ लेने से शुगर नियंत्रित रहेगी।',
          en: 'Meal recorded! Having a side of salad or curd helps keep your blood sugar balanced.'
        },
        confidence: 0.90
      };
    }

    // 5. Symptoms / Distress
    if (
      raw.includes('चक्कर') || raw.includes('थकवा') || raw.includes('घाम') || raw.includes('कमजोरी') ||
      raw.includes('dizzy') || raw.includes('weak') || raw.includes('sweating') || raw.includes('shivering')
    ) {
      return {
        intent: 'REPORT_SYMPTOM',
        extractedValue: raw,
        speechResponse: {
          mr: 'कृपया एका जागी शांत बसा आणि पाणी प्या. आम्ही तुमच्या काळजीवाहूला माहिती देत आहोत.',
          hi: 'कृपया आराम से बैठें और पानी पिएं। हम आपके देखभालकर्ता को सूचित कर रहे हैं।',
          en: 'Please sit down comfortably and drink water. We are notifying your caregiver to check on you.'
        },
        confidence: 0.94
      };
    }

    // 6. Ask status default
    return {
      intent: 'ASK_STATUS',
      speechResponse: {
        mr: 'आज तुमची तब्येत उत्तम दिसत आहे. सर्व औषधे वेळेवर घ्या.',
        hi: 'आज आपका स्वास्थ्य सामान्य लग रहा है। सभी दवाएं समय पर लें।',
        en: 'Everything looks stable today. Please take all medicines on time.'
      },
      confidence: 0.85
    };
  }
}
