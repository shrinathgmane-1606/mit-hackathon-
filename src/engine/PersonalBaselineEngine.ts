import { 
  PersonalBaseline, 
  GlucoseReading, 
  Medication, 
  Meal, 
  ActivityData, 
  CompoundRiskAssessment, 
  SeniorStatus,
  Language 
} from '../types';

export class PersonalBaselineEngine {
  /**
   * Evaluates the multi-factor risk for the senior citizen by comparing current daily telemetry
   * with their personalized learned baseline rather than a one-size-fits-all generic threshold.
   */
  public static evaluateRisk(
    baseline: PersonalBaseline,
    latestGlucose: GlucoseReading | null,
    medications: Medication[],
    meals: Meal[],
    activity: ActivityData,
    reportedSymptoms: string[] = []
  ): CompoundRiskAssessment {
    let glucoseRisk = 0;
    let medicationRisk = 0;
    let mealRisk = 0;
    let activityRisk = 0;
    let symptomRisk = 0;

    const whyBulletsEn: string[] = [];
    const whyBulletsHi: string[] = [];
    const whyBulletsMr: string[] = [];

    const actionsEn: string[] = [];
    const actionsHi: string[] = [];
    const actionsMr: string[] = [];

    // 1. Evaluate Glucose against Personalized Baseline
    if (latestGlucose) {
      const isFasting = latestGlucose.context === 'FASTING';
      const expectedRange = isFasting ? baseline.fastingGlucoseBaseline : baseline.postPrandialBaseline;
      const val = latestGlucose.value;

      if (val < 70) {
        // Hypo risk
        glucoseRisk = 90;
        whyBulletsEn.push(`Glucose reading (${val} mg/dL) is below your safe personal range (${expectedRange.min}-${expectedRange.max} mg/dL).`);
        whyBulletsHi.push(`शुगर स्तर (${val} mg/dL) आपके सुरक्षित व्यक्तिगत स्तर (${expectedRange.min}-${expectedRange.max} mg/dL) से काफी कम है।`);
        whyBulletsMr.push(`साखरेची पातळी (${val} mg/dL) तुमच्या वैयक्तिक सुरक्षित पातळीपेक्षा (${expectedRange.min}-${expectedRange.max} mg/dL) कमी आहे.`);
        
        actionsEn.push("Have 15 grams of fast-acting glucose (half cup fruit juice or 3 glucose biscuits). Check again in 15 mins.");
        actionsHi.push("तुरंत 15 ग्राम ग्लूकोज या आधा कप फलों का रस या 3 ग्लूकोज बिस्कुट लें। 15 मिनट बाद दोबारा जांचें।");
        actionsMr.push("तात्काळ १५ ग्रॅम ग्लुकोज, अर्धा कप फळांचा रस किंवा ३ ग्लुकोज बिस्किटे घ्या. १५ मिनिटांनी पुन्हा तपासा.");
      } else if (val > expectedRange.max) {
        const delta = val - expectedRange.max;
        if (delta > 50) {
          glucoseRisk = 80;
          whyBulletsEn.push(`Glucose (${val} mg/dL) is ${delta} mg/dL above your usual post-meal pattern (usual max: ${expectedRange.max} mg/dL).`);
          whyBulletsHi.push(`शुगर (${val} mg/dL) आपके सामान्य स्तर से ${delta} mg/dL अधिक है (सामान्य अधिकतम: ${expectedRange.max} mg/dL)।`);
          whyBulletsMr.push(`रक्तातील साखर (${val} mg/dL) तुमच्या नियमित पातळीपेक्षा ${delta} mg/dL जास्त आहे (नियमित कमाल: ${expectedRange.max} mg/dL).`);
        } else {
          glucoseRisk = 45;
          whyBulletsEn.push(`Glucose is mildly higher than your recent 14-day baseline (${val} vs usual ${expectedRange.avg} mg/dL).`);
          whyBulletsHi.push(`शुगर आपके पिछले 14 दिनों के औसत (${expectedRange.avg} mg/dL) से थोड़ी अधिक है।`);
          whyBulletsMr.push(`साखर तुमच्या गेल्या १४ दिवसांच्या सरासरीपेक्षा (${expectedRange.avg} mg/dL) थोडी जास्त आहे.`);
        }
      } else {
        glucoseRisk = 10;
      }
    }

    // 2. Evaluate Medication Adherence & Timing Deviation
    const missedMedications = medications.filter(m => !m.taken);
    const criticalMissed = missedMedications.filter(m => m.criticality === 'CRITICAL');

    if (criticalMissed.length > 0) {
      medicationRisk = 85;
      const medNames = criticalMissed.map(m => m.name).join(', ');
      whyBulletsEn.push(`Key prescribed diabetes medication (${medNames}) was missed or significantly delayed.`);
      whyBulletsHi.push(`मुख्य निर्धारित डायबिटीज की दवा (${medNames}) समय पर नहीं ली गई है।`);
      whyBulletsMr.push(`महत्त्वाची मधुमेहाची औषधे (${medNames}) वेळेवर घेतलेली नाहीत.`);

      actionsEn.push(`Please take your prescribed ${medNames} as per your doctor's dosage instruction.`);
      actionsHi.push(`कृपया डॉक्टर के निर्देशानुसार अपनी दवा (${medNames}) लें।`);
      actionsMr.push(`कृपया डॉक्टरांच्या सल्ल्यानुसार तुमची औषधे (${medNames}) घ्या.`);
    } else if (missedMedications.length > 0) {
      medicationRisk = 40;
      whyBulletsEn.push("One regular dose is pending past the scheduled window.");
      whyBulletsHi.push("एक नियमित दवा का समय निकल चुका है।");
      whyBulletsMr.push("एका नियमित औषधाची वेळ टळून गेली आहे.");
    } else {
      medicationRisk = 5;
    }

    // 3. Evaluate Meal Timing & Irregularity
    const missedMeals = meals.filter(m => m.status === 'MISSED');
    const highCarbLogged = meals.filter(m => m.status === 'LOGGED' && m.estimatedCarbs === 'HIGH');

    if (missedMeals.length > 0) {
      mealRisk = 60;
      whyBulletsEn.push("A scheduled meal was skipped or delayed by over 90 minutes from your usual routine.");
      whyBulletsHi.push("भोजन का समय आपकी सामान्य दिनचर्या से 90 मिनट से अधिक लेट हो गया है या छूट गया है।");
      whyBulletsMr.push("नेहमीच्या वेळेपेक्षा जेवणाला दीड तासाहून अधिक उशीर झाला आहे किंवा जेवण चुकले आहे.");

      actionsEn.push("Have a light, protein-rich snack or diabetic-friendly meal to stabilize energy.");
      actionsHi.push("ऊर्जा स्थिर रखने के लिए हल्का, प्रोटीन युक्त आहार लें।");
      actionsMr.push("साखर संतुलित ठेवण्यासाठी हलका, पौष्टिक आहार किंवा फळ खा.");
    } else if (highCarbLogged.length > 0) {
      mealRisk = 40;
      whyBulletsEn.push("Recent meal had a higher carbohydrate load than your typical balanced baseline.");
      whyBulletsHi.push("हालिया भोजन में सामान्य से अधिक कार्बोहाइड्रेट की मात्रा थी।");
      whyBulletsMr.push("अलीकडील आहारात नेहमीपेक्षा जास्त कर्बोदके (Carbs) होती.");
    }

    // 4. Evaluate Activity & Mobility
    const stepCompletionRatio = activity.stepsToday / (activity.stepTarget || 1);
    if (stepCompletionRatio < 0.25 && activity.mobilityStatus === 'NORMAL') {
      activityRisk = 50;
      whyBulletsEn.push(`Physical movement is notably low today (${activity.stepsToday} steps vs your usual ${activity.stepTarget} target).`);
      whyBulletsHi.push(`आज शारीरिक गतिविधि कम रही है (${activity.stepsToday} कदम बनाम आपका लक्ष्य ${activity.stepTarget})।`);
      whyBulletsMr.push(`आज नेहमीपेक्षा खूप कमी हालचाल झाली आहे (${activity.stepsToday} पावले, तुमचे नेहमीचे उद्दिष्ट ${activity.stepTarget} आहे).`);

      actionsEn.push("Try a gentle 10-minute indoor walk or gentle leg stretches if feeling comfortable.");
      actionsHi.push("यदि सहज महसूस हो तो 10 मिनट घर के अंदर टहलें या हल्के व्यायाम करें।");
      actionsMr.push("सगळं ठीक वाटत असल्यास घरातच १० मिनिटे सावकाश फिरा.");
    }

    // 5. Evaluate Symptoms
    if (reportedSymptoms.length > 0) {
      symptomRisk = 75;
      const symptomsStr = reportedSymptoms.join(', ');
      whyBulletsEn.push(`Reported symptoms of note: ${symptomsStr}.`);
      whyBulletsHi.push(`दर्ज किए गए लक्षण: ${symptomsStr}।`);
      whyBulletsMr.push(`नोंदवलेली शारीरिक लक्षणे: ${symptomsStr}.`);

      actionsEn.push("Sit down comfortably in a well-ventilated space, drink a glass of water, and rest.");
      actionsHi.push("आराम से बैठें, एक गिलास पानी पिएं और विश्राम करें।");
      actionsMr.push("शांतपणे एका जागी बसा, पाणी प्या आणि विश्रांती घ्या.");
    }

    // Multi-factor Non-linear Interaction (Compounding Effect)
    // E.g. Missed medication + High glucose + Low activity compounds risk exponentially
    let rawCompoundScore = (
      glucoseRisk * 0.35 +
      medicationRisk * 0.30 +
      mealRisk * 0.15 +
      activityRisk * 0.10 +
      symptomRisk * 0.10
    );

    // Multiplier for compounded interaction
    if (criticalMissed.length > 0 && latestGlucose && latestGlucose.value > baseline.postPrandialBaseline.max) {
      rawCompoundScore *= 1.35;
    }
    if (reportedSymptoms.length > 0 && (glucoseRisk > 50 || medicationRisk > 50)) {
      rawCompoundScore *= 1.25;
    }

    const finalScore = Math.min(100, Math.round(rawCompoundScore));

    let status: SeniorStatus = 'STABLE';
    let caregiverAlertRecommended = false;

    if (finalScore >= 68 || (latestGlucose && latestGlucose.value < 70) || (reportedSymptoms.length > 0 && finalScore >= 55)) {
      status = 'HIGH_RISK';
      caregiverAlertRecommended = true;
    } else if (finalScore >= 35) {
      status = 'ATTENTION';
      caregiverAlertRecommended = false; // Prevents alert fatigue for mild deviations
    } else {
      status = 'STABLE';
      caregiverAlertRecommended = false;
    }

    // Default reassure actions if stable
    if (status === 'STABLE') {
      whyBulletsEn.push("All routines (glucose, medicines, meal cadence, and activity) are closely aligned with your personal baseline.");
      whyBulletsHi.push("आपकी सभी दिनचर्या (शुगर, दवाएं, भोजन और गतिविधि) आपके व्यक्तिगत सामान्य स्तर के अनुसार बिल्कुल सही हैं।");
      whyBulletsMr.push("तुमची सर्व दिनचर्या (साखर, औषधे, जेवणाची वेळ आणि हालचाल) तुमच्या वैयक्तिक नियमित पातळीनुसार उत्तम आहे.");

      actionsEn.push("Keep doing what you're doing! Maintain steady hydration and enjoy your day.");
      actionsHi.push("बहुत बढ़िया! नियमित रूप से पानी पीते रहें और अपनी अच्छी दिनचर्या जारी रखें।");
      actionsMr.push("छान! असेच चालू ठेवा, पुरेसे पाणी प्या आणि आनंदी रहा.");
    }

    const title = {
      en: status === 'STABLE' ? 'Everything Looks Stable' : status === 'ATTENTION' ? 'Pay Gentle Attention Today' : 'Attention Recommended',
      hi: status === 'STABLE' ? 'आज सब कुछ सामान्य है' : status === 'ATTENTION' ? 'आज थोड़ा ध्यान देने की जरूरत है' : 'देखभालकर्ता से संपर्क की सलाह',
      mr: status === 'STABLE' ? 'आज सर्व काही व्यवस्थित आहे' : status === 'ATTENTION' ? 'आज थोडे लक्ष देणे आवश्यक आहे' : 'काळजीवाहूशी संपर्क साधण्याचा सल्ला'
    };

    const summary = {
      en: status === 'STABLE' 
        ? `Your readings and routine match your healthy baseline. Good job!`
        : status === 'ATTENTION'
        ? `A few routine deviations were noticed today. Follow your doctor's daily plan.`
        : `Multiple routine deviations detected today. We recommend checking in with your family/caregiver.`,
      hi: status === 'STABLE'
        ? `आपकी रीडिंग और दिनचर्या आपके स्वस्थ स्तर के अनुकूल है।`
        : status === 'ATTENTION'
        ? `आज दिनचर्या में कुछ अंतर देखा गया है। अपनी नियमित देखभाल योजना का पालन करें।`
        : `आज दिनचर्या में कई बदलाव देखे गए हैं। परिवार या डॉक्टर से संपर्क करने की सलाह है।`,
      mr: status === 'STABLE'
        ? `तुमची दिनचर्या आणि साखरेची पातळी नेहमीप्रमाणे उत्तम आहे.`
        : status === 'ATTENTION'
        ? `आज तुमच्या दिनचर्येत काही बदल जाणवले आहेत. डॉक्टरांच्या सल्ल्यानुसार काळजी घ्या.`
        : `आज दिनचर्येत एकापेक्षा जास्त बदल आढळले आहेत. कृपया कुटुंबीयांशी संपर्क साधा.`
    };

    const caregiverAlertReason = caregiverAlertRecommended ? {
      en: `Multi-factor pattern detected: ${whyBulletsEn.slice(0, 2).join(' ')}`,
      hi: `संयुक्त पैटर्न का पता चला: ${whyBulletsHi.slice(0, 2).join(' ')}`,
      mr: `संयुक्त बदल आढळला: ${whyBulletsMr.slice(0, 2).join(' ')}`
    } : undefined;

    return {
      status,
      score: finalScore,
      title,
      summary,
      whyExplanation: {
        en: whyBulletsEn,
        hi: whyBulletsHi,
        mr: whyBulletsMr
      },
      recommendedActions: {
        en: actionsEn,
        hi: actionsHi,
        mr: actionsMr
      },
      caregiverAlertRecommended,
      caregiverAlertReason,
      factors: {
        glucoseRisk,
        medicationRisk,
        mealRisk,
        activityRisk,
        symptomRisk
      },
      doctorSummaryNote: `Telemetry analysis shows compound risk score of ${finalScore}/100 with status ${status}. Key contributors: Glucose delta (${glucoseRisk}%), Med adherence (${medicationRisk}%), Meal cadence (${mealRisk}%).`
    };
  }
}
