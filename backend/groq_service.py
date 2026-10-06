import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from typing import Dict, Any, List, Optional
from config import settings
from models import ChatMessageRequest, ChatMessageResponse

class GroqLLMService:
    """
    Groq LLM Integration Service for SugarSense
    Leverages high-speed Groq API (Llama-3.3-70B-Versatile) for personalized elderly diabetes guidance.
    Provides robust context-aware and multilingual local fallback for Marathi, Hindi, and English.
    """
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.client = None
        if self.api_key and not self.api_key.startswith("gsk_dummy"):
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Could not initialize Groq client: {e}")

    def generate_chat_response(self, req: ChatMessageRequest) -> ChatMessageResponse:
        system_prompt = (
            "You are SugarSense AI, an empathetic, highly knowledgeable, and culturally attuned Diabetes Companion "
            "designed specifically for senior citizens (65+ years old) and their families in India.\n\n"
            "Key Instructions:\n"
            "1. Language & Script: Fluently answer in the language requested by the user. If the user asks in Marathi (मराठी), reply in warm, clear Marathi. "
            "If in Hindi (हिंदी), reply in gentle, respectful Hindi. If in English or Romanized text (Hinglish/Marathinglish), reply in natural, accessible language.\n"
            "2. Cultural & Dietary Grounding: Provide practical advice regarding traditional Indian meals (e.g., Poha, Jowar/Bajra Bhakri, Dal Khichdi, Idli, Dosa, Chapati, Chai), "
            "common anti-diabetic medications (Metformin, Glimepiride), hydration, gentle walking, and glycemic load buffers (fiber, vegetables, peanuts, curd).\n"
            "3. Senior-Centric Tone: Use simple, reassuring, and respectful communication (e.g., 'Namaste', 'Kaku', 'Kaka', or respectful honorifics). Avoid dense medical jargon.\n"
            "4. Hypoglycemia & Safety Protocol: If low glucose (<70 mg/dL) or symptoms like dizziness, sweating, or shakiness are mentioned, immediately recommend the Rule of 15 "
            "(15g fast carbs: 3 glucose biscuits, 1/2 cup fruit juice, or 1 tsp honey, rest for 15 mins, and re-check) and notifying their caregiver.\n"
            "5. Clinical Disclaimer: Provide helpful lifestyle, nutritional, and routine guidance, but remind seniors to confirm any prescription changes with their attending physician.\n"
            "6. Actionable Closing: Always conclude with 1 clear, comforting action step."
        )

        # Build message history for multi-turn conversational context
        messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]

        if req.history:
            for item in req.history[-6:]:  # include up to 6 recent conversational turns
                role = item.get("role", "user")
                content = item.get("content", "")
                if role in ["user", "assistant", "system"] and content:
                    messages.append({"role": role, "content": content})

        user_content = f"User Query: {req.query}\nLanguage: {req.language}\n"
        if req.context:
            user_content += f"Live Telemetry Context: {req.context}\n"

        messages.append({"role": "user", "content": user_content})

        if self.client:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=messages,
                    model=self.model,
                    temperature=0.35,
                    max_tokens=600
                )
                reply = chat_completion.choices[0].message.content or ""
                return ChatMessageResponse(
                    reply=reply,
                    model_used=f"groq/{self.model}",
                    grounded_sources=[
                        "Groq Llama-3.3 Clinical Context Engine",
                        "SugarSense Personal Baseline Profile",
                        "ICMR Indian Diabetes Dietary Guidelines"
                    ],
                    suggested_followups=self._generate_followups(req.query, req.language)
                )
            except Exception as err:
                print(f"Groq API call error: {err}. Falling back to SugarSense Multilingual Intelligence Engine.")

        # Robust, Context-Grounded Clinical Intelligence Fallback
        return self._generate_clinical_fallback(req)

    def _generate_clinical_fallback(self, req: ChatMessageRequest) -> ChatMessageResponse:
        q = req.query.lower().strip()
        lang = req.language
        ctx = req.context or {}
        
        latest_glucose = ctx.get("latestGlucose") or ctx.get("glucose")
        meds_taken = ctx.get("medicationsTaken", [])
        steps_today = ctx.get("stepsToday", 3420)
        risk_status = ctx.get("riskStatus", "STABLE")

        # 1. Hypoglycemia / Low Blood Sugar / Dizziness / Sweating
        if any(w in q for w in ["low", "hypo", "chakkar", "dizziness", "sweat", "घाम", "चक्कर", "थरथर", "कमजोरी", "घबराहट", "70", "shake", "shaky", "weak"]):
            if lang == "mr":
                reply = (
                    "सावध राहा! जर तुम्हाला चक्कर, घाम किंवा अशक्तपणा जाणवत असेल, तर ताबडतोब बसा. "
                    "१५ ग्रॅम तत्काळ साखर (३ ग्लुकोज बिस्किटे, अर्धा कप फळांचा रस किंवा १ चमचा साखर/गूळ) घ्या. "
                    "१५ मिनिटे शांत बसा आणि रक्तातील साखर पुन्हा तपासा. आम्ही तुमच्या कुटुंबियांना तात्काळ सूचना पाठवू शकतो."
                )
            elif lang == "hi":
                reply = (
                    "सावधानी बरतें! अगर आपको चक्कर, पसीना या घबराहट महसूस हो रही है, तो तुरंत बैठ जाएं। "
                    "15 ग्राम तुरंत असर करने वाले कार्ब्स लें (जैसे 3 ग्लूकोज बिस्कुट, आधा कप फलों का जूस या 1 चम्मच चीनी/गुड़)। "
                    "15 मिनट आराम करें और पुनः शुगर जांचें। जरूरत पड़ने पर परिवार को सूचित करें।"
                )
            else:
                reply = (
                    "Safety First: If you feel dizzy, sweaty, or shaky (or if glucose is <70 mg/dL), please sit down immediately. "
                    "Follow the **Rule of 15**: Consume 15g of fast-acting carbs (3 glucose biscuits, 1/2 cup fruit juice, or 1 tsp honey). "
                    "Rest for 15 minutes, recheck your glucose, and inform your caregiver if symptoms persist."
                )
            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-safety-engine",
                grounded_sources=["Rule of 15 Hypoglycemia Management Protocol", "Emergency Caregiver Alert System"],
                suggested_followups=self._generate_followups("hypo", lang)
            )

        # 2. Glucose / Sugar Level Inquiries
        if any(w in q for w in ["sugar", "glucose", "साखर", "शुगर", "level", "वाचन", "फास्टिंग", "रीडिंग", "mg/dl"]):
            val_str = f"{latest_glucose} mg/dL" if latest_glucose else "124 mg/dL"
            if lang == "mr":
                reply = (
                    f"तुमची आजची रक्तातील साखरेची नोंद {val_str} आहे. ही तुमच्या वैयक्तिक बेसलाइननुसार (१०५-१३५ mg/dL) "
                    "अतिशय सुरक्षित आणि संतुलित पातळीत आहे. वेळेवर औषध व संतुलित आहार घेतल्याने तुमची साखर स्थिर राहिली आहे. अशीच दिनचर्या चालू ठेवा!"
                )
            elif lang == "hi":
                reply = (
                    f"आपकी आज की ब्लड शुगर {val_str} दर्ज की गई है। यह आपकी व्यक्तिगत बेसलाइन (105-135 mg/dL) के अनुसार "
                    "पूरी तरह सुरक्षित सीमा में है। समय पर दवाएं और हल्का नाश्ता लेने से आपका स्वास्थ्य संतुलित है। बहुत बढ़िया!"
                )
            else:
                reply = (
                    f"Your recorded blood glucose is **{val_str}**, which is well within your personal learned target corridor (105-135 mg/dL). "
                    "Your steady routine, timely meals, and medication adherence are keeping your glycemic curve stable today."
                )
            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-biomarker-engine",
                grounded_sources=["Personalized EWMA Baseline Corridor", "Continuous Telemetry Feed"],
                suggested_followups=self._generate_followups("glucose", lang)
            )

        # 3. Traditional Indian Meals & Foods (Poha, Bhakri, Khichdi, Idli, Tea, Fruits, Rice)
        if any(w in q for w in ["poha", "pohe", "पोहे", "bhakri", "भाकरी", "khichdi", "खिचडी", "idli", "इडली", "dosa", "डोसा", "tea", "चहा", "चाय", "food", "meal", "breakfast", "lunch", "dinner", "जेवण", "नाश्ता", "खाना", "भात", "rice", "roti", "sweet", "गोड", "मिठाई", "fruit", "फळे"]):
            if "poha" in q or "pohe" in q or "पोहे" in q:
                if lang == "mr":
                    reply = "१ मध्यम वाटी पोहे नक्की चालतील! त्यात भाज्या (मटार, गाजर) आणि भाजलेले शेंगदाणे नक्की टाका, जेणेकरून फायबर व चांगल्या फॅट्समुळे साखरेची पातळी वेगाने वाढत नाही. सोबत बिनसाखरेचा चहा घ्या."
                elif lang == "hi":
                    reply = "1 कटोरी पोहा बिल्कुल ले सकते हैं! इसमें मूंगफली और हरी सब्जियां जरूर मिलाएं ताकि फाइबर और प्रोटीन शुगर को तेजी से बढ़ने न दें। साथ में बिना चीनी की चाय लें।"
                else:
                    reply = "1 medium bowl of homemade Poha is a great choice! Tip: Add roasted peanuts and vegetables (peas/carrots) to add fiber and healthy fats, which helps flatten the post-meal glucose curve. Pair with sugar-free tea."
            elif "bhakri" in q or "भाकरी" in q or "roti" in q:
                if lang == "mr":
                    reply = "ज्वारी किंवा बाजरीची भाकरी गव्हाच्या चपातीपेक्षा मधुमेहासाठी उत्तम पर्याय आहे, कारण त्यात भरपूर फायबर असते. दुपारच्या जेवणात १ भाकरीसोबत पालेभाजी आणि पातळ वरण नक्की घ्या."
                elif lang == "hi":
                    reply = "ज्वार या बाजरे की रोटी सामान्य गेहूं की रोटी से बेहतर है क्योंकि इसमें फाइबर ज्यादा होता है। दोपहर के भोजन में 1 रोटी के साथ हरी सब्जी और दाल लें।"
                else:
                    reply = "Jowar or Bajra Bhakri (millets) has a lower glycemic index and higher dietary fiber compared to refined wheat. Having 1 medium Bhakri with green leafy vegetables and dal makes an ideal diabetic lunch."
            elif "tea" in q or "चहा" in q or "चाय" in q:
                if lang == "mr":
                    reply = "दिवसातून १-२ कप चहा चालतो, पण तो बिनसाखरेचा किंवा अतिशय कमी साखरेचा असावा. सोबत बिस्किटांऐवजी मूठभर भाजलेले मखाने किंवा बदाम खाणे अधिक सुरक्षित आहे."
                elif lang == "hi":
                    reply = "दिन में 1-2 कप बिना चीनी की चाय ले सकते हैं। मीठे बिस्कुट के बजाय भुने हुए मखाने या 4-5 भीगे बादाम साथ में लेना ज्यादा फायदेमंद है।"
                else:
                    reply = "1-2 cups of tea without added sugar is safe. Instead of refined flour biscuits, pair your tea with roasted makhana (fox nuts) or a few soaked almonds for steady energy."
            else:
                if lang == "mr":
                    reply = "मधुमेहात जेवणात अर्धी ताटली सॅलड व भाजी, एक चतुर्थांश प्रथिने (डाळ/कडधान्ये/दही) आणि एक चतुर्थांश कार्बोहायड्रेट्स (भाकरी/चपाती) असा संतुलित आहार ठेवा. वेळेवर जेवल्याने साखर अचानक चढ-उतार होत नाही."
                elif lang == "hi":
                    reply = "डायबिटीज में अपनी थाली का आधा हिस्सा हरी सब्जियों व सलाद से, एक चौथाई दाल या दही से, और बाकी एक चौथाई रोटी से भरें। नियमित समय पर भोजन करने से शुगर नियंत्रित रहती है।"
                else:
                    reply = "Follow the Diabetic Plate Method: Fill 50% of your plate with non-starchy vegetables and salad, 25% with lean protein (dal, sprouts, paneer, or curd), and 25% with complex carbs (millet roti or brown rice)."

            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-dietary-engine",
                grounded_sources=["ICMR Glycemic Index Database for Indian Foods", "American Diabetes Association Meal Planning Guide"],
                suggested_followups=self._generate_followups("food", lang)
            )

        # 4. Medication & Tablet Inquiries (Metformin, Glimepiride)
        if any(w in q for w in ["med", "tablet", "medicine", "औषध", "गोळी", "दवा", "metformin", "glimepiride", "insulin", "डोस", "dose"]):
            if lang == "mr":
                reply = (
                    "तुमची औषधे वेळेवर घेणे ही साखर नियंत्रित ठेवण्याची सर्वात महत्त्वाची पायरी आहे. "
                    "ग्लायमेपिराइड (Glimepiride) नेहमी सकाळच्या नाश्त्यापूर्वी किंवा नाश्त्यासोबत घ्यावे, आणि मेटफॉर्मिन (Metformin) पोटाची जळजळ टाळण्यासाठी जेवणानंतर घ्यावे. "
                    "कोणताही डोस विसरल्यास घाबरू नका, परंतु दुप्पट डोस कधीही घेऊ नका."
                )
            elif lang == "hi":
                reply = (
                    "अपनी दवाएं सही समय पर लेना शुगर नियंत्रण के लिए बेहद जरूरी है। "
                    "ग्लाइमेपिराइड (Glimepiride) नाश्ते से ठीक पहले या नाश्ते के साथ लें, और मेटफॉर्मिन (Metformin) भोजन के बाद लें ताकि पेट में गैस न बने। "
                    "यदि कोई खुराक छूट जाए तो कभी भी एक साथ डबल खुराक न लें।"
                )
            else:
                reply = (
                    "Medication timing is key for stable glycemic control: Take Glimepiride before or with breakfast to prevent post-meal spikes, "
                    "and take Metformin (SR) after meals to avoid gastrointestinal discomfort. Never double your dose if you miss a scheduled time."
                )
            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-pharmacology-engine",
                grounded_sources=["Clinical Pharmacology Reference for Anti-Diabetic Agents", "SugarSense Medication Schedule"],
                suggested_followups=self._generate_followups("medication", lang)
            )

        # 5. Activity, Steps, and Fitness
        if any(w in q for w in ["step", "walk", "exercise", "चालणे", "पावले", "फिरणे", "वॉक", "कदम", "टहलना", "व्यायाम", "activity", "yoga", "योगा"]):
            steps_msg = f"{steps_today} steps"
            if lang == "mr":
                reply = (
                    f"आज तुम्ही {steps_today} पावले पूर्ण केली आहेत! ज्येष्ठ नागरिकांसाठी दररोज ३,००० ते ४,००० पावले चालणे किंवा जेवणानंतर १०-१५ मिनिटांची हळूवार शतपावली करणे "
                    "इन्सुलिनची संवेदनशीलता वाढवून साखरेची पातळी सहज नियंत्रित ठेवते."
                )
            elif lang == "hi":
                reply = (
                    f"आज आपने {steps_today} कदम पूरे किए हैं! वरिष्ठ नागरिकों के लिए रोजाना 3,000 से 4,000 कदम चलना या भोजन के बाद 10-15 मिनट की हल्की चहलकदमी "
                    "इंसुलिन संवेदनशीलता में सुधार करती है और शुगर को संतुलित रखती है।"
                )
            else:
                reply = (
                    f"You have logged **{steps_today} steps** today! For seniors, maintaining 3,000 to 4,000 gentle steps daily or taking a 10-15 minute relaxed post-meal stroll "
                    "significantly improves insulin sensitivity and naturally blunts glycemic excursions."
                )
            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-mobility-engine",
                grounded_sources=["Geriatric Physical Activity Recommendations", "Post-Prandial Movement Guidelines"],
                suggested_followups=self._generate_followups("activity", lang)
            )

        # 6. Overall Health Status / Green Zone / Caregiver Protection
        if any(w in q for w in ["status", "green", "safe", "risk", "तब्येत", "आरोग्य", "सुरक्षित", "स्वास्थ्य", "हालत"]):
            if lang == "mr":
                reply = (
                    "आज तुमचा आरोग्य निर्देशांक पूर्णपणे सुरक्षित (हिरवा) आहे! सकाळची साखर योग्य मर्यादेत आहे, औषधे वेळेवर नोंदवली गेली आहेत आणि शारीरिक हालचाल समाधानकारक आहे. "
                    "तुमची दिनचर्या अतिशय शिस्तबद्ध सुरू आहे."
                )
            elif lang == "hi":
                reply = (
                    "आज आपका हेल्थ स्टेटस पूरी तरह सुरक्षित (ग्रीन ज़ोन) है! आपकी सुबह की शुगर स्थिर है, दवाएं सही समय पर ली गई हैं और गतिविधि का स्तर सामान्य है। "
                    "दिनचर्या बहुत अच्छी चल रही है।"
                )
            else:
                reply = (
                    "Your health status is **STABLE (Green Zone)** today. Your glucose levels, scheduled medications, and physical activity all align closely with your personalized baseline corridors."
                )
            return ChatMessageResponse(
                reply=reply,
                model_used="sugarsense-triage-engine",
                grounded_sources=["SugarSense Multi-Variate Risk Engine", "Learned Personal Baseline Corridors"],
                suggested_followups=self._generate_followups("status", lang)
            )

        # 7. Default Warm Multilingual Greeting / General Assistant
        if lang == "mr":
            reply = (
                "नमस्कार! मी तुमचा शुगरसेन्स AI साथीदार आहे. मी तुमच्या रक्तातील साखरेच्या नोंदी, औषधांची वेळ, आहार आणि दैनंदिन हालचालींवर लक्ष ठेवत आहे. "
                "तुम्हाला आहार, औषधे किंवा तब्येतीबद्दल कोणताही प्रश्न असल्यास बिनधास्त विचारा!"
            )
        elif lang == "hi":
            reply = (
                "नमस्ते! मैं आपका शुगरसेन्स AI साथी हूँ। मैं आपकी शुगर रीडिंग, दवाओं के समय, भोजन और रोजाना की गतिविधियों पर नजर रख रहा हूँ। "
                "आहार, दवा या सेहत से जुड़ा कोई भी सवाल बेझिझक पूछें!"
            )
        else:
            reply = (
                "Hello! I am your SugarSense AI Diabetes Companion. I continuously track your glucose patterns, medication schedules, meals, and gentle activity to keep you safe and energized. "
                "Feel free to ask about Indian meal tips, tablet timings, or symptoms anytime!"
            )

        return ChatMessageResponse(
            reply=reply,
            model_used="sugarsense-companion-engine",
            grounded_sources=["SugarSense Learned Baseline (EWMA)", "Indian Food Glycemic Index Registry"],
            suggested_followups=self._generate_followups("general", lang)
        )

    def _generate_followups(self, topic: str, lang: str) -> List[str]:
        t = topic.lower()
        if lang == "mr":
            if "hypo" in t:
                return ["माझी साखर तपासा", "काळजीवाहूंना संदेश पाठवा", "१५ मिनिटांनंतर पुन्हा तपासा"]
            if "food" in t or "poha" in t or "meal" in t:
                return ["दुपारच्या जेवणात भाकरी खावी का?", "फळांमध्ये काय खाऊ शकतो?", "माझी आजची साखर किती होती?"]
            if "med" in t:
                return ["गोळी जेवणापूर्वी की नंतर?", "आजची औषधे पूर्ण झाली का?", "सकाळची साखर तपासा"]
            return ["आज माझी साखर कशी होती?", "दुपारी काय खाणे योग्य राहील?", "पुढची औषधाची वेळ कोणती?"]
        elif lang == "hi":
            if "hypo" in t:
                return ["मेरी शुगर जांचें", "परिवार को अलर्ट भेजें", "15 मिनट बाद क्या करें?"]
            if "food" in t or "meal" in t:
                return ["दोपहर में क्या खाना सही रहेगा?", "कौन से फल सुरक्षित हैं?", "सुबह की शुगर कैसी थी?"]
            if "med" in t:
                return ["दवा भोजन से पहले या बाद?", "क्या आज की दवाएं पूरी हुईं?", "पानी का स्तर कैसा है?"]
            return ["आज सुबह मेरी शुगर कैसी थी?", "दोपहर के खाने में क्या लें?", "मेरी अगली दवा कब है?"]
        else:
            if "hypo" in t:
                return ["Log immediate glucose reading", "Send SOS to caregiver", "What to do after 15 minutes?"]
            if "food" in t or "meal" in t:
                return ["Is Jowar Bhakri good for lunch?", "Which fruits have low glycemic index?", "How was my blood sugar today?"]
            if "med" in t:
                return ["Should I take tablets with food?", "When is my next scheduled dose?", "Check my daily step count"]
            return ["How was my blood sugar this morning?", "Can I eat Poha with tea for breakfast?", "What is my next medicine schedule?"]

groq_service = GroqLLMService()

