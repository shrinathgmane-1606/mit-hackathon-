import { IndianFoodItem } from '../types';

export const INDIAN_FOOD_DATABASE: IndianFoodItem[] = [
  {
    id: 'poha',
    nameEn: 'Poha (Flattened Rice)',
    nameHi: 'पोहा (Poha)',
    nameMr: 'पोहे (Kande Pohe)',
    category: 'BREAKFAST',
    glycemicIndex: 'MEDIUM',
    portionRecommendation: {
      en: '1 medium bowl (150g). Prefer adding more peanuts, carrots, and peas for fiber.',
      hi: '1 मध्यम कटोरी (150 ग्राम)। मूंगफली और हरी सब्जियां अधिक मिलाएं।',
      mr: '१ मध्यम वाटी (१५० ग्रॅम). शेंगदाणे, मटार व भरपूर कोथिंबीर घालावी.'
    },
    smartTip: {
      en: 'Pairing Poha with a small bowl of curd or boiled sprouts blunts the post-meal glucose spike by ~28%.',
      hi: 'पोहे के साथ थोड़ा दही या अंकुरित मूंग लेने से शुगर अचानक नहीं बढ़ती।',
      mr: 'पोह्यांसोबत थोडे ताक किंवा मोड आलेले मूग घेतल्यास रक्तातील साखर पटकन वाढत नाही.'
    }
  },
  {
    id: 'bhakri',
    nameEn: 'Jowar / Bajra Bhakri with Pithla',
    nameHi: 'ज्वार/बाजरा भाकरी और पिठला',
    nameMr: 'ज्वारी/बाजरीची भाकरी आणि पिठलं',
    category: 'MEAL',
    glycemicIndex: 'LOW',
    portionRecommendation: {
      en: '1 medium Jowar Bhakri with a bowl of Pithla and raw onion/cucumber.',
      hi: '1 मध्यम ज्वार की रोटी, पिठला और कच्चा प्याज या खीरा।',
      mr: '१ मध्यम ज्वारीची भाकरी, १ वाटी पिठलं आणि काकडी/कांदा.'
    },
    smartTip: {
      en: 'Jowar is rich in complex fiber with a low glycemic index—excellent choice for steady sugar levels.',
      hi: 'ज्वार में भरपूर फाइबर होता है जो शुगर को स्थिर रखने में बहुत मदद करता है।',
      mr: 'ज्वारीत फायबर भरपूर असल्याने साखर नियंत्रित राहण्यास उत्तम मदत होते.'
    }
  },
  {
    id: 'dal_khichdi',
    nameEn: 'Moong Dal Khichdi with Kadhi',
    nameHi: 'मूंग दाल खिचड़ी और कढ़ी',
    nameMr: 'मूग डाळ खिचडी आणि कढी',
    category: 'MEAL',
    glycemicIndex: 'LOW',
    portionRecommendation: {
      en: '1 plate (Moong dal to rice ratio 2:1) with a small spoon of cow ghee.',
      hi: '1 प्लेट (दाल की मात्रा चावल से दोगुनी) और थोड़ा देसी घी।',
      mr: '१ वाटी मूग डाळ खिचडी (डाळीचे प्रमाण तांदळापेक्षा जास्त) आणि कढी.'
    },
    smartTip: {
      en: 'Moong dal provides clean protein and digests gently for elderly seniors with steady glucose absorption.',
      hi: 'मूंग दाल पचने में हल्की होती है और शुगर को धीरे-धीरे रिलीज करती है।',
      mr: 'मुगाची डाळ पचनास हलकी असून साखरेची पातळी संतुलित ठेवते.'
    }
  },
  {
    id: 'roti_sabzi',
    nameEn: 'Multigrain Roti with Methi/Palak Sabzi',
    nameHi: 'रोटी और मेथी/पालक की सब्जी',
    nameMr: 'चपाती/फुलका आणि मेथीची भाजी',
    category: 'MEAL',
    glycemicIndex: 'LOW',
    portionRecommendation: {
      en: '1-2 Phulkas with 1 large katori green leafy vegetable and salad.',
      hi: '1-2 पतली रोटी, 1 बड़ी कटोरी हरी पत्तेदार सब्जी और सलाद।',
      mr: '१-२ फुलके, १ मोठी वाटी हिरव्या पालेभाज्या आणि सॅलड.'
    },
    smartTip: {
      en: 'Eat the leafy vegetable/salad 10 minutes before the roti (food sequencing) to reduce glycemic spike by 30%.',
      hi: 'रोटी खाने से 10 मिनट पहले सब्जी या सलाद खाएं, इससे शुगर स्पाइक कम होता है।',
      mr: 'चपाती खाण्यापूर्वी भाजी किंवा सॅलड खाल्ल्याने साखरेची पातळी अचानक वाढत नाही.'
    }
  },
  {
    id: 'upma',
    nameEn: 'Vegetable Upma',
    nameHi: 'वेजिटेबल उपमा',
    nameMr: 'रवा उपमा (भाज्या घातलेला)',
    category: 'BREAKFAST',
    glycemicIndex: 'MEDIUM',
    portionRecommendation: {
      en: '1 medium bowl with plenty of beans, peas, and mustard tadka.',
      hi: '1 मध्यम कटोरी उपमा, हरी सब्जियों के साथ।',
      mr: '१ मध्यम वाटी उपमा, भरपूर भाज्या घालून.'
    },
    smartTip: {
      en: 'Adding roasted peanuts or chana dal adds healthy fats and slows gastric emptying.',
      hi: 'मूंगफली या चने की दाल मिलाने से पाचन धीमा होता है और शुगर कंट्रोल रहता है।',
      mr: 'शेंगदाणे किंवा चणा डाळ घातल्याने पोषण वाढते व साखर नियंत्रित राहते.'
    }
  },
  {
    id: 'idli_sambar',
    nameEn: 'Idli Sambar with Coconut Chutney',
    nameHi: 'इडली सांभर और नारियल चटनी',
    nameMr: 'इडली सांबार आणि चटणी',
    category: 'BREAKFAST',
    glycemicIndex: 'MEDIUM',
    portionRecommendation: {
      en: '2 steamed idlis with 1 large bowl of vegetable-rich sambar.',
      hi: '2 इडली और 1 बड़ी कटोरी सब्जियों से भरपूर सांभर।',
      mr: '२ इडल्या आणि १ मोठी वाटी भाज्यांचे सांबार.'
    },
    smartTip: {
      en: 'Fermented foods support gut microbiome health; emphasize more sambar dal than white idli.',
      hi: 'सांभर में दाल और सब्जियां अधिक लें ताकि प्रोटीन की मात्रा अच्छी मिले।',
      mr: 'सांबारमधील डाळ आणि भाज्या जास्त प्रमाणात घेतल्यास उत्तम प्रथिने मिळतात.'
    }
  },
  {
    id: 'chai_with_sugar',
    nameEn: 'Masala Chai with Sugar',
    nameHi: 'मसाला चाय (चीनी वाली)',
    nameMr: 'मसाला चहा (साखर घातलेला)',
    category: 'BEVERAGE',
    glycemicIndex: 'HIGH',
    portionRecommendation: {
      en: 'Small cutting cup (100ml). Prefer unsweetened or with cardamom/ginger.',
      hi: 'छोटा कप (100ml)। चीनी की जगह अदरक-इलायची का स्वाद बढ़ाएं।',
      mr: 'लहान कप (१०० मिली). साखरेऐवजी सुंठ-वेलचीचा वापर करावा.'
    },
    smartTip: {
      en: 'Drinking sweetened tea on an empty stomach creates an immediate glucose spike. Prefer after a small snack.',
      hi: 'खाली पेट मीठी चाय पीने से शुगर तेजी से बढ़ती है। कुछ खाने के बाद पिएं।',
      mr: 'रिकाम्या पोटी गोड चहा प्यायल्यास साखर अचानक वाढते. नाश्त्यानंतर घेणे योग्य.'
    }
  },
  {
    id: 'mithai',
    nameEn: 'Indian Sweet (Gulab Jamun / Jalebi / Peda)',
    nameHi: 'मिठाई (गुलाब जामुन / जलेबी / पेड़ा)',
    nameMr: 'मिठाई (गुलाबजाम / जिलेबी / पेढा)',
    category: 'SWEET',
    glycemicIndex: 'HIGH',
    portionRecommendation: {
      en: '1 small piece on festive days; take a 15-minute gentle stroll afterwards.',
      hi: 'त्योहारों पर 1 छोटा टुकड़ा; खाने के बाद 15 मिनट हल्का टहलें।',
      mr: 'सणासुदीला १ लहान तुकडा; खाल्ल्यानंतर १५ मिनिटे सावकाश फिरावे.'
    },
    smartTip: {
      en: 'Never consume sweets on an empty stomach. A light 10-min post-meal walk significantly lowers peak glucose.',
      hi: 'खाली पेट मिठाई न खाएं। भोजन के बाद टहलने से शुगर नियंत्रित रहती है।',
      mr: 'रिकाम्या पोटी गोड पदार्थ खाऊ नका. खाल्ल्यानंतर थोडे चालल्याने साखर आटोक्यात राहते.'
    }
  }
];

export class IndianFoodAI {
  /**
   * Identifies Indian food from voice speech transcripts or text inputs in Marathi, Hindi, or English.
   */
  public static analyzeMealTranscript(transcript: string): IndianFoodItem | null {
    const text = transcript.toLowerCase();

    if (text.includes('पोह') || text.includes('poha') || text.includes('pohe')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'poha') || null;
    }
    if (text.includes('भाकरी') || text.includes('पिठल') || text.includes('bhakri') || text.includes('pithla') || text.includes('jowar') || text.includes('bajra')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'bhakri') || null;
    }
    if (text.includes('खिचडी') || text.includes('khichdi') || text.includes('dal rice') || text.includes('वरण भात') || text.includes('दाल चावल')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'dal_khichdi') || null;
    }
    if (text.includes('चपाती') || text.includes('रोटी') || text.includes('भाजी') || text.includes('मेथी') || text.includes('roti') || text.includes('chapati') || text.includes('sabzi')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'roti_sabzi') || null;
    }
    if (text.includes('उपमा') || text.includes('upma') || text.includes('रवा')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'upma') || null;
    }
    if (text.includes('इडली') || text.includes('सांबार') || text.includes('idli') || text.includes('dosa') || text.includes('डोसा')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'idli_sambar') || null;
    }
    if (text.includes('चहा') || text.includes('चाय') || text.includes('tea') || text.includes('chai')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'chai_with_sugar') || null;
    }
    if (text.includes('गोड') || text.includes('गुलाबजाम') || text.includes('जिलेबी') || text.includes('पेढा') || text.includes('sweet') || text.includes('mithai') || text.includes('jalebi')) {
      return INDIAN_FOOD_DATABASE.find(f => f.id === 'mithai') || null;
    }

    return null;
  }
}
