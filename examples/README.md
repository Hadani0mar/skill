# أمثلة — فيديوهات صُممت بالمهارة

كود المصدر لكل فيديو صممناه (Remotion + سكربتات الرندر). مرجع للوكلاء: افتح المثال الأقرب للأسلوب المطلوب قبل البناء.

| المجلد | الأسلوب | الموضوع | الناتج الأصلي |
|---|---|---|---|
| [`01-paper-post-explainer`](01-paper-post-explainer/) | 1 منشور الورق | شرح المتمكن بالراوي والفقاعة | almutamakkin-explainer.mp4 |
| [`02-smart-purchase`](02-smart-purchase/) | 4 الكاتب الجريء | الشراء الذكي | almutamakkin-smart-purchase.mp4 |
| [`03-expiry-pulse`](03-expiry-pulse/) | 2 نبض العلامة | تنبيهات الصلاحية | almutamakkin-expiry-pulse.mp4 |
| [`04-supabase-story-archive`](04-supabase-story-archive/) | 5 أرشيف القصة | قصة Supabase | supabase-story-archive.mp4 |
| [`05-supabase-newspaper`](05-supabase-newspaper/) | 5 أرشيف القصة (صحيفة) | Supabase بشكل جريدة + Silk | supabase-newspaper.mp4 |
| [`06-roles-illustrated-tale`](06-roles-illustrated-tale/) | 7 حكاية مصوّرة | ميزة الأدوار برسومات unDraw | almutamakkin-roles-tale.mp4 |
| [`07-anthropic-ipo-article`](07-anthropic-ipo-article/) | 5 مقال حرفي | مقال طرح Anthropic كما هو + Aurora | anthropic-ipo-article.mp4 |
| [`08-claude-freestyle`](08-claude-freestyle/) | فري ستايل | Claude يعرّف بنفسه + LightRays | claude-freestyle.mp4 |
| [`09-almutamakkin-ad`](09-almutamakkin-ad/) | فري ستايل إعلان | إعلان المتمكن | almutamakkin-ad.mp4 |
| [`10-almutamakkin-live-ui`](10-almutamakkin-live-ui/) | 6 واجهة حية | فيلم إطلاق: هاتف ثلاثي الأبعاد + بنتو | almutamakkin-live-ui.mp4 |
| [`11-threejs-city-test`](11-threejs-city-test/) | 8 (اختبار) | اختبار مدينة three.js + شاحنة Kenney | صورة ثابتة فقط |
| [`12-presto-product-world`](12-presto-product-world/) | 8 عالم المنتج — ⚠️ مثال مرفوض | بريستو: قلّد المرجع 100٪، لا تكرره (اقرأ قاعدة الأصالة في Style 8) | لم يكتمل |
| [`13-remote-barcode`](13-remote-barcode/) | 9 عرض الهاتف | طباعة الباركود عن بعد على موك آب iPhone 17 Pro | almutamakkin-remote-barcode.mp4 |
| [`14-logo-m`](14-logo-m/) | شعار | شعار «m» للمتمكن (اتجاهات، أيقونة، ألوان) — ملفات Design canvas + سكربتات التوليد | preview.png |
| [`15-docker-white-interface`](15-docker-product-world/) | חדש — ממשק לבן عريض | حكاية Docker: Image، Compose، Volumes، Registry، وMCP | [docker-story.mp4](15-docker-product-world/docker-story.mp4) |

## ما لم يُرفع (اجلبه عند التشغيل)
- `public/` لكل مثال: الخطوط (OFL — من google/fonts أو `skills/motion-storytelling/template/public/fonts`)، أصوات React Bits المولّدة WAV (`render/getsfx.py`)، الشعارات، النماذج والصور.
- ملفات مشتقة من React Bits (`silkShader.ts`، `aurora.ts`، `lightRays.ts`) — رخصة MIT + Commons Clause تمنع إعادة التوزيع؛ أعد نقلها من المستودع الأصلي (القسم 13a في SKILL.md). الأمثلة 05–10 تستوردها.
- موك آب الهاتف (مثال 13): `public/device/iphone17pro-silver.png` من https://github.com/jamesjingyi/mockup-device-frames.
- نماذج Kenney (11، 12): `public/models/*.glb` + `Textures/colormap.png` من KenneyNL/Starter-Kit-Racing (CC0).
- three.js: استنساخ جزئي من mrdoob/three.js (القسم 8d)؛ مسارات الـalias في `render/build.mjs`.
- الإطارات ومجلدات dist غير مرفوعة؛ مثال 15 يضم MP4 النهائي بنسبة 16:9 لمراجعته في GitHub.

### محتوى public الأصلي لكل مثال

- `01-paper-post-explainer`: brand-mark.png (1) character-original.jpg (1) character.png (1) fonts (6) sfx.wav (1)
- `02-smart-purchase`: brand-mark-white.png (1) brand-mark.png (1) fonts (2) sfx.wav (1)
- `03-expiry-pulse`: brand-mark-white.png (1) fonts (5) sfx.wav (1)
- `04-supabase-story-archive`: fonts (7) sfx.wav (1)
- `05-supabase-newspaper`: brand (3) fonts (7) sfx (21)
- `06-roles-illustrated-tale`: brand (1) fonts (2) sfx (37)
- `07-anthropic-ipo-article`: fonts (5) sfx (22)
- `08-claude-freestyle`: fonts (2) sfx (20)
- `09-almutamakkin-ad`: fonts (2) sfx (20)
- `10-almutamakkin-live-ui`: fonts (2) sfx (22)
- `11-threejs-city-test`: fonts (2) models (3)
- `12-presto-product-world`: fonts (1) models (3) sfx (20)
- `13-remote-barcode`: device (1) fonts (1) sfx (15)

## التشغيل
راجع القسم 10 في `skills/motion-storytelling/SKILL.md`: `node render/build.mjs` ← `python3 render/serve.py` ← `python3 render/stills.py` للتحقق ← `python3 render/render.py` ← `python3 render/mix.py` ثم ffmpeg للدمج.
مسارات مطلقة مثل `/home/claude/remotion` و`/home/claude/reactbits` داخل build.mjs وsounds-entry.js تشير لاستنساخات GitHub محلية — عدّلها لبيئتك.
