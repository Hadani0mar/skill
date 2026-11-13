# 06 — Supabase Edge Functions | تقني

مرجع الأسلوب الذي اعتمده المستخدم في **13 نوفمبر 2026** لقناة **@teqani.ly**.
فيديو **53.5 ثانية، 1080×1920، 60fps**: كود TAQNI20 يخفض السعر من 100 إلى 80 د.ل.
التعديل المعتمد: حذف التنويهات من الصورة، وإضافة زر متابعة بسيط في خاتمة هوية القناة.

اقرأ [مواصفات الأسلوب](../../references/approved-edge-functions-style.md) قبل إعادة استخدام المشروع.
الصورة مبنية بالكود: خلفية بيضاء، Kufam، واجهة Supabase مستندة للمصدر، وهاتف يظهر بعد تعريف الأداة.

## المعاينة

راجع `shots.jpg`، ثم شغّل المشروع أو صدّره لمشاهدة الحركة كاملة. الفيديو الناتج لا يُخزَّن مع المصدر.

## تشغيل المشروع

يتطلب Node.js وnpm. ملفات الصوت الجاهزة مضمنة بصيغة FLAC دون فقد.

```bash
npm ci
npm run studio
```

التصدير إلى `out/taqni-edge-functions-1080x1920-60fps.mp4`:

```bash
npm run render
```

يستخدم Remotion متصفح Chrome Headless Shell. يمكن تحديد مساره عبر `REMOTION_BROWSER_EXECUTABLE`،
أو سيستخدم Remotion آلية تنزيل المتصفح المعتادة. `network-shim.cjs` يعالج فشل قراءة عناوين الشبكة
في بعض البيئات المقيدة، ويستخدم واجهة loopback فقط؛ ليس مطلوبًا عادة على جهاز المستخدم.

## المشاهد والتوقيت

| الثواني | المشهد | الهدف |
|---|---|---|
| 0–6.7 | Opening | نتيجة 100→80 وسؤال من يحسب الخصم |
| 6.7–14.2 | Definition | تعريف Edge Functions ودور الخادم |
| 14.2–26.9 | Dashboard | إنشاء apply-coupon وإبراز الثوابت ثم النشر داخل المحاكاة |
| 26.9–32.7 | PhoneDemo | إدخال TAQNI20 والضغط |
| 32.7–40.2 | RequestFlow | الطلب والحساب وعودة 80 ثم تكبير الهاتف |
| 40.2–44.65 | InvalidCoupon | TEST يُرفض ويظل السعر 100 |
| 44.65–53.5 | Closing | خلاصة الشرح ثم الشعار والحساب وزر المتابعة |

زر المتابعة: دخول عند 50.5 تقريبًا، ضغطة عند **51.95**، ثم حالة «تمت المتابعة».
حافظ على التوقيت مقابل ملف التعليق المقبول. لا تعِد توليد الصوت عند تعديل الخاتمة فقط.

## الملفات

- `src/index.tsx`: تركيب الفيلم ومشاهد مستقلة مسجلة في Studio.
- `src/scenes/`: مشهد مستقل لكل مرحلة.
- `src/ui.tsx`: عناصر الواجهة والحركة وحساب الزمن.
- `src/style.css`: الخطوط والهوية والهاتف والخاتمة.
- `kit/`: أجزاء Stageshow المستخدمة للهاتف والنافذة والأزرار، مع رخصة MIT.
- `public/fonts/`: Kufam وInter وJetBrains Mono وتراخيص OFL.
- `public/logos/`: ملفات العلامات الأصلية من m0usasvg؛ TikTok light على الأبيض.
- `public/sfx/`: مؤثرات المكتبة الموجودة في المستودع.
- `public/voice.flac`: تعليق Gemini Voice، Orus، فصحى.
- `public/mix.flac`: التعليق و47 مؤثرًا مرتبطة بالفعل، دون موسيقى.
- `sound-events.json` و`mix.py`: أحداث الصوت وإعادة المزج.
- `example/taqni-coupon-demo.html`: تجربة واجهة محلية، مع خط نسبي من public/fonts.
- `example/supabase/functions/apply-coupon/index.ts`: دالة كاملة مع CORS والتحقق من الطلب.

لإعادة مزج الصوت فقط، ثبت Python وffmpeg ثم:

```bash
python3 -m pip install -r requirements-audio.txt
npm run mix
```

لا يحتوي المشروع على مفاتيح API أو أسرار أو عنوان مشروع Supabase حي.
ملفات `node_modules` والمتصفح وملفات التصدير وWAV الوسيطة مستبعدة من Git.

## حدود المثال والتحقق

واجهات الفيديو متحركة ومحاكية للتدفق؛ لم يُنشر شيء إلى حساب Supabase الخاص بالمستخدم.
السعر والمنتج بيانات تعليمية، والتجربة المحلية لا تجري شراءً أو تحصيلًا.
التوثيق هنا يحمل هذه التفاصيل؛ الصورة نفسها تكتفي بالشرح وهوية القناة.

```bash
npm test
```

الاختبارات تتحقق من الكود الصحيح والخاطئ، تطبيع الإدخال، تجاهل السعر المُرسل من العميل، OPTIONS،
الطرق غير المدعومة وJSON غير الصحيح. عند بناء تطبيق حقيقي، اضبط مصادقة الدالة وفق توثيق Supabase
الحالي، واجعل الهاتف يرسل code فقط ويعرض النتيجة الواردة من الخادم.

تم فحص المشاهد والانتقالات وزر المتابعة، ونسخة هاتف 360 بكسل، وتدفق TAQNI20/TEST في واجهة 390×844.

## المصادر

- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/functions/quickstart-dashboard
- https://github.com/supabase/supabase/blob/master/apps/studio/pages/project/%5Bref%5D/functions/new.tsx
- https://github.com/supabase/supabase/blob/master/apps/studio/components/interfaces/EdgeFunctions/DeployEdgeFunctionButton.tsx
- https://github.com/supabase/supabase/blob/master/apps/studio/components/interfaces/Functions/FunctionsEmptyState.tsx
- العلامات والأيقونات: https://github.com/Hadani0mar/m0usasvg
- إطارات الهاتف والنافذة: Stageshow / benjitaylor، MIT المرفقة.
- حركة الكلمات: نسخة تعتمد على الإطار من BlurText في مرجع القناة؛ لا تُنسخ مصادر React Bits أو WAV المولدة منها.
