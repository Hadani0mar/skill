# إيصال القراءة — motion-storytelling

قرأت المهارة كاملة حتى `END OF SKILL — motion-storytelling` ✅ — كلمة التحقق: **سنبلة-9**.

- **الأسلوب:** #7 — حكاية مصوّرة. أُعيدت قراءة أقسام 3، 3b، 7، 8، 9، 10، 11، 13، وقواعد الأسلوب 7.
- **مصدر المنتج:** فرع `arena/ae396c96-skill`، commit `fc263b10f250a7ab3da85c73ce81e7c53e73145b`. هذا المستودع يحتوي كتالوج مهارات وقوالب، ولا يحتوي كود Arena.ai أو واجهتها؛ لذلك لا توجد tokens أو لقطات شاشة أصلية، والمقترح هنا تصوّر لا وصف لميزة مؤكدة.
- **المثال الأقرب:** `examples/06-roles-illustrated-tale/` — قُرئ `src/Video.tsx` ومصادر `render/` ذات الصلة (build, player entry, server, stills, render, sound mix) مع `examples/README.md`.
- **القالب والخط:** `skills/motion-storytelling/template/` — قُرئت README، theme، Video، المشاهد، مكونات Frame/Icon/Text/Ui/ShaderLayer، وملفات render. كما فُتح مصدر خط Readex Pro في `google/fonts/ofl/readexpro` عند `6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec`؛ استُخدم في المعاينة مع OFL محفوظة في `assets/fonts/READEx-PRO-OFL.txt`.
- **React Bits:** استُنْسخ مؤقتاً وقرئ `public/llms.txt` ومصادر BlurText وCountUp وNoise وSilk، إضافة إلى وصفة الصوت ومحرك `renderSound`. النسخة التي جرى فحصها: `DavidHDev/react-bits` عند `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4`. لم تُضمَّن مكونات أو WAV في هذا التصوّر الثابت.
- **unDraw:** استُنْسخت أسماء المشاهد ثم عُرضت أربع رسومات للمقارنة؛ اختير `svgs/connecting-teams.svg` كما هو. النسخة `balazser/undraw-svg-collection` عند `9c02f9893198f7bce6e514be2de2b6c544775ab1`؛ الترخيص MIT محفوظ في `assets/UNDRAW-LICENSE.txt`.
- **m0usasvg:** فُتحت سجلات العلامات والرموز ونسخة duotone: `src/data/icons.json`، `src/data/ui-icons.json`، `src/data/ui/looks/duotone.json`؛ النسخة `Hadani0mar/m0usasvg` عند `a64d705b74e6b5db7eeca5896c375cf76ba42f35`. الرموز المستخدمة: `chat-thread`, `multi-agent`, `agent-handshake`, `brain-circuit` — كلها `duotone`؛ الأجسام المستخدمة فقط في هذا التصوّر محفوظة في `assets/icons-duotone.json`.
- **الشعارات:** بحث سجل العلامات لم يجد شعار Arena.ai؛ النتائج المتشابهة تخص ArenaNet وGSMArena وليست المنتج المقصود. لذلك يظهر اسم Arena كتابةً فقط، بلا رمز مخترع أو إيحاء اعتماد.
- **مكونات React Bits المقترحة للفيديو:** `BlurText` للعناوين والكابشن (كلمات لا حروف عربية منفصلة)، `Noise` لحبيبات خفيفة، `Silk` لفصل التحوّل، و`CountUp` لرقم الفصل/التقدم لا كادعاء إحصائي. تُحوّل كلها إلى حركة تعتمد إطار Remotion قبل إخراج MP4. انتقال «ارتفاع الصفحة» يأتي من قواعد الأسلوب 7؛ لا أقدمه على أنه مكوّن React Bits.
- **الأصوات المقترحة:** `calm` سرير هادئ؛ `unfold` + `swish` لقلب الصفحات؛ `glimmer` لظهور الرسم؛ `stamp` لانتقال الفكرة؛ و`emblem` للنهاية. جميعها وصفات من React Bits، ويجب تصديرها WAV من محرك المكتبة في مرحلة الفيديو. رخصة React Bits محفوظة في `public/sfx/REACT-BITS-LICENSE.md`.
- **animdiagram:** غير مطلوب؛ لا يوجد هنا تدفق تقني موثّق أو تسلسل backend.
- **قواعد هذا التصوّر:** أرضية عاجية فاتحة `#FAF9F5` ضمن لوحة الأسلوب 7؛ بنفسجي/ليلكي كألوان مفاهيمية لا كألوان رسمية لـArena؛ نسخ بلهجة ليبية، بلا ادعاءات بقدرات غير موثقة؛ كل أيقونات المفهوم من m0usasvg، والرسم من unDraw. الصورة معاينة ثابتة وليست MP4 أو اختباراً للحركة.
