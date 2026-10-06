-- ==============================================================================
-- SugarSense AI — Database Initial Calibration & Seed Data
-- ==============================================================================

-- Seed Sample Medications for Senior Patient
insert into public.medications (patient_id, name, dosage, scheduled_time, taken, criticality, instructions)
values 
  (
    'patient-senior-101',
    'Glimepiride',
    '1mg (Before Breakfast)',
    '08:30',
    true,
    'CRITICAL',
    '{"en": "Take 15 mins before breakfast with warm water", "hi": "नाश्ते से 15 मिनट पहले गुनगुने पानी के साथ लें", "mr": "नाश्त्याच्या १५ मिनिटे आधी कोमट पाण्यासोबत घ्या"}'::jsonb
  ),
  (
    'patient-senior-101',
    'Metformin SR',
    '500mg (After Lunch)',
    '13:30',
    true,
    'STANDARD',
    '{"en": "Take immediately after lunch to avoid stomach irritation", "hi": "भोजन के तुरंत बाद लें ताकि पेट में गैस न बने", "mr": "दुपारच्या जेवणानंतर लगेच घ्या"}'::jsonb
  ),
  (
    'patient-senior-101',
    'Metformin SR',
    '500mg (After Dinner)',
    '20:30',
    false,
    'STANDARD',
    '{"en": "Take post-dinner before bedtime", "hi": "रात के भोजन के बाद लें", "mr": "रात्रीच्या जेवणानंतर घ्या"}'::jsonb
  )
on conflict do nothing;

-- Seed Sample Glucose History
insert into public.glucose_readings (patient_id, value, meal_tag, is_fasting, timestamp, trend)
values 
  ('patient-senior-101', 114, 'FASTING', true, timezone('utc'::text, now() - interval '24 hours'), 'STABLE'),
  ('patient-senior-101', 142, 'POST_BREAKFAST', false, timezone('utc'::text, now() - interval '20 hours'), 'RISING'),
  ('patient-senior-101', 125, 'POST_LUNCH', false, timezone('utc'::text, now() - interval '16 hours'), 'STABLE'),
  ('patient-senior-101', 118, 'FASTING', true, timezone('utc'::text, now() - interval '4 hours'), 'STABLE'),
  ('patient-senior-101', 124, 'POST_BREAKFAST', false, timezone('utc'::text, now() - interval '1 hour'), 'STABLE')
on conflict do nothing;

-- Seed Sample Meals
insert into public.meals (patient_id, name, carbs_g, calories, glycemic_index, items)
values 
  ('patient-senior-101', 'Kande Pohe with Roasted Peanuts', 28, 210, 'MEDIUM', '["Kande Pohe", "Peanuts", "Green Tea"]'::jsonb),
  ('patient-senior-101', 'Jowar Bhakri with Methi Bhaji & Dal', 32, 280, 'LOW', '["Jowar Bhakri", "Methi Sabzi", "Moong Dal", "Cucumber Salad"]'::jsonb)
on conflict do nothing;

-- Seed Sample Emergency Broadcast
insert into public.system_broadcasts (title, message, target_role, urgency, active)
values 
  ('Hydration Advisory', 'High temperature recorded today. Senior patients are reminded to drink at least 8 glasses of water.', 'ALL', 'INFO', true)
on conflict do nothing;
