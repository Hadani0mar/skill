# مهارات المتمكن — Agent Skills

مهارات جاهزة لأي وكيل ذكاء اصطناعي (Claude Code، Codex، Cursor، Gemini CLI، وغيرها) بصيغة **Agent Skills** المفتوحة:
كل مهارة مجلد فيه `SKILL.md` (اسم + وصف في الأعلى، ثم التعليمات) وملفاتها المساعدة.

> **إلزامي لكل وكيل:** اقرأ `SKILL.md` كاملاً حتى سطر `END OF SKILL` وافتح المصادر والأمثلة قبل أي تصميم، واكتب «إيصال القراءة» بكلمة التحقق (الخطوة 0 في المهارة).

| المهارة | ماذا تفعل |
|---|---|
| [`motion-storytelling`](skills/motion-storytelling/SKILL.md) | **موشن السرد القصصي**: فيديوهات موشن عربية عمودية بـRemotion بتسعة أساليب (منشور الورق، نبض العلامة، ختم الشعار، الكاتب الجريء، أرشيف القصة، واجهة حية، حكاية مصوّرة، عالم المنتج، عرض الهاتف)، بمكونات وخلفيات وأصوات React Bits ورسومات unDraw وعوالم three.js ثلاثية الأبعاد وشعارات حقيقية لأي شركة أو أداة تُذكر (Brandbase ثم svgl ثم Simple Icons — رابط فقط، بدون نسخ)، وخلفية بيضاء افتراضياً. يسأل عن الأسلوب كل مرة. معها قالب مشروع جاهز في `template/`، وأمثلة كاملة من فيديوهات سابقة في [`examples/`](examples/). |
| [`mascot-explainer-video`](skills/mascot-explainer-video/SKILL.md) | فيديو شرح بشخصية تقدّم (A-roll) ثم تنتقل لشاشات التطبيق مبنية كمكونات متحركة (B-roll)، مع كابشن حركي وكلمة ملونة في كل سطر، متزامن مع تعليق صوتي. |

## التثبيت

**Claude Code — كإضافة (plugin):**
```
/plugin marketplace add Hadani0mar/skill
/plugin install almutamakkin-skills@almutamakkin
```

**Claude Code — نسخ مباشر:**
```bash
git clone https://github.com/Hadani0mar/skill
cp -r skill/skills/* ~/.claude/skills/        # لكل المشاريع
# أو: cp -r skill/skills/* <project>/.claude/skills/
```

**أي وكيل يدعم Agent Skills (عبر skills CLI):**
```bash
npx skills add Hadani0mar/skill
```

**وكلاء بدون دعم للمهارات (Codex، Cursor، Aider…):** انسخ المستودع داخل مشروعك (أو كـ git submodule)؛
ملف [`AGENTS.md`](AGENTS.md) يخبر الوكيل متى يقرأ أي `SKILL.md`.

> المستودع خاص: الوكيل يحتاج صلاحية قراءة عليه (حساب GitHub أو توكن).

## المتطلبات (لمهارات الفيديو)
Node 18+، Python 3 مع `numpy` و`playwright` (Chromium)، و`ffmpeg`. لو كان npm محجوباً، المهارة تشرح البناء من مصدر Remotion على GitHub (القسم 10).

## الرخص
- خطوط IBM Plex Sans Arabic في القالب: SIL OFL (`template/public/fonts/OFL.txt`).
- أيقونات Fluent UI System Icons: MIT.
- مكونات وأصوات React Bits **غير مضمّنة** هنا (رخصتها MIT + Commons Clause تمنع إعادة توزيعها)؛ المهارة تشرح جلبها من مستودعها الرسمي وتحويلها.
- الشخصية `character.png` وشعار `brand-mark.png` ملك لصاحب المستودع.
