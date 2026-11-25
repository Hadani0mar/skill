# مهارات المتمكن — تحفة وتصميم الفيديو

حزمة موحدة لـClaude Code وCodex والوكلاء الداعمة لـAgent Skills. ابدأ بـ**تحفة**؛ تختار مهاراتنا
الحالية والتقنيات الإضافية حسب المشهد، وتحافظ على هوية «تقني» وطريقة الفيديوهات المعتمدة.

## ذاكرة القناة وتوثيق الإنتاج — 18 نوفمبر 2026

ابدأ من [ذاكرة العمل](MEMORY.md) و[فهرس التوثيق](docs/channel/README.md) قبل أي فيديو جديد.
يوثّق [سجل الملاحظات](docs/channel/feedback-ledger.md) ما أعجب صاحب القناة وما طلب تغييره، مع
نطاق كل طلب وحالة تنفيذه. راجع [سجل المشاريع](docs/channel/project-log.md) و[طريقة الإنتاج والتسليم](docs/channel/workflow.md).
فيلما [شفائي للمستثمرين](docs/projects/shifai/README.md) موثقان بنسختيهما، وروابط تنزيل الفيديوهات
وحزم الفيديو والكود وبصماتها في [بيان الملفات](docs/projects/shifai/artifacts.json).

| المجموعة | ما تحتويه |
|---|---|
| [تحفة](skills/tuhfa/SKILL.md) | التوجيه، هوية القناة، اختيار المحرك، توقيت الكلمات وفحص الصوت والتصدير. |
| [تقني](skills/techno-ly/SKILL.md) | الخلفية البيضاء، Kufam، Gemini Voice، الشاشات الحقيقية وزر المتابعة. |
| [Studio Script — الهوكات](skills/studio-script/SKILL.md) | صياغة 3 هوكات مختلفة وتقييمها وكتابة سيناريو قصير مع Re-hook؛ [قواعد الدمج مع القناة](skills/studio-script/INTEGRATION.md). |
| [السرد الحركي](skills/motion-storytelling/SKILL.md) | تسعة أساليب عربية وRemotion وReact Bits. |
| [مقدّم قناة تقني الأساسي](skills/teqani-presenter/SKILL.md) | الشخصية المعتمدة كمقدّم أساسي (26 نوفمبر 2026): تحريك LivePortrait، وClawd يتحول لشاشة، وصوت ليبي، ومؤثرات. |
| [Motion Reel](skills/motion-reel/SKILL.md) و[الشخصية](skills/mascot-explainer-video/SKILL.md) و[Stageshow](skills/stageshow/SKILL.md) | أفلام المنتجات والشخصيات والهاتف والواجهات. |
| [Shotcraft](skills/video-shotcraft/SKILL.md) | وصفات اللقطات وحركة الكاميرا ومصادر تنفيذها. |
| [HyperFrames](skills/hyperframes/SKILL.md) | تسع مهارات للمحرك وCLI والمكونات والوسائط، وخمس تقنيات للانتقالات والمؤشر والكابشن. |
| [GSAP](skills/gsap-core/SKILL.md) | ثماني مهارات رسمية: أساسيات، timeline، SVG/plugins، React، أداء، أدوات وأطر وScrollTrigger. |
| [Motion Design](skills/motion-design/SKILL.md) و[مبادئ الحركة](skills/design-motion-principles/SKILL.md) | إخراج الحركة والتسارع والتتابع ومراجعة الواجهات. |
| [HTML Explainer](skills/html-explainer-video/SKILL.md) و[Anatomy](skills/anatomy/SKILL.md) | شرح متزامن مع الصوت ورسومات تقنية SVG/WebGL. |

**المجموع: 6 مهاراتنا الأساسية + 28 وحدة مستوردة، وأداة فحص صوت مستقلة.**
توجد كذلك مسارات إلى مهارات Remotion الرسمية المثبتة أو مصدرها عند الحاجة.
اقرأ [دليل الاختيار](skills/tuhfa/references/toolkit-routing.md) و[متطلبات التشغيل](skills/tuhfa/references/runtime-adapters.md).

## الاستخدام والتثبيت

```text
استخدم تحفة لتصميم فيديو لقناة تقني بنفس أسلوبنا المعتمد، واختر المهارات المناسبة لكل مشهد.
```

في Claude Code:

```text
/plugin marketplace add Hadani0mar/skill
/plugin install almutamakkin-skills@almutamakkin
```

أو انسخ مجلدات `skills/` معاً إلى `.claude/skills/` داخل مشروعك أو `~/.claude/skills/`؛ احتفظ
بالمجلدات الشقيقة لأن «تحفة» تربط بينها. ويمكن استخدام `npx skills add Hadani0mar/skill` وتحديد
المهارات المطلوبة. اقرأ [AGENTS.md](AGENTS.md) لأي وكيل يستخدم المستودع مباشرة.
المستودع خاص ويتطلب صلاحية GitHub الحالية؛ لا تضع مفاتيح دخول في ملفات الفيديو أو المحادثة.

المهارات ملفات إرشاد ومصدر؛ إضافتها لا تثبت جميع المحركات ولا تشغل نماذج أو خدمات مدفوعة.
احتفظ بإصدارات المشروع المعتمدة وثبت ما يحتاجه المحرك المختار فقط. أمثلة المصدر لا تعني أن
الفيديو النهائي صُيّر أو أن خدمة تجريبية نُشرت على خادم.

## المصادر والرخص والتحقق

راجع [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) و[toolkit-lock.json](toolkit-lock.json):
إصدارات محددة، مسارات الملفات، بصمات SHA-256، الرخص والوسائط التجريبية غير المرفقة.
ملفات المصادر المستوردة محفوظة مع رخصها؛ التكييف لهوية القناة موثق في تحفة وINTEGRATION.md.
لم ننسخ الحزم التي تمنع إعادة التوزيع أو تقصر الاستخدام على غير التجاري.
مهارات Remotion الرسمية مسار خارجي لأن مستودعها المستقل لا يعلن رخصة في الإصدار المسجل.

المكتبات التنفيذية والأصول لها رخصها الخاصة. شعارات وأيقونات m0usasvg ومكونات React Bits
وanimdiagram تُجلب انتقائياً من مصادرها عند الحاجة. بعض عروض Shotcraft والصور والأصوات والخطوط
التجريبية غير مرفقة؛ عوّضها بأصول المشروع. حزمة مؤثرات HTML Explainer المرخصة MIT مرفقة.

```bash
python3 -m pip install -r requirements-toolkit.txt
python3 scripts/validate_toolkit.py
python3 -m unittest discover -s tests
python3 scripts/smoke_toolkit.py
```

