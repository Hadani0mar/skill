# فيديو شرح المتمكن — Remotion

## التشغيل
```bash
npm install
npm run studio     # معاينة وتعديل حي
npm run render     # يصدّر out/almutamakkin-explainer.mp4
```
الصوت (نقرات الكتابة + الانتقالات + خلفية هادئة) ملف منفصل `public/sfx.wav`؛ لو تبي تدمجه داخل Remotion أضف `<Audio src={staticFile('sfx.wav')} />` في `src/Video.tsx`.

## الملفات
| الملف | الدور |
|---|---|
| `src/theme.ts` | الألوان، أوقات المشاهد، وجمل الراوي (عدّلها هنا) |
| `src/components/Narrator.tsx` | الشخصية: الحجم والموقع لكل مشهد، الفم، الرمش، فقاعة الكلام |
| `src/components/Text.tsx` | تأثير الكتابة، دخول الكلمات، الهايلايت الأصفر، خط الفاصل |
| `src/components/Frame.tsx` | الورق، الحساب فوق، وشريط «شارك المنفعة» تحت |
| `src/scenes/*` | المشاهد التسعة |
| `src/icons.json` | أيقونات Fluent Emoji (إيضاحية ملونة، رخصة MIT) |
| `public/fonts` | IBM Plex Sans Arabic (رخصة OFL) |

## المصدر
الشاشات والنصوص مأخوذة من `almutamakkin-expo-v3` على فرع `feat/expo-v3-identity` (آخر commit `0644627`، 2026-10-27).
الأرقام والأسماء (سالم، المورد النور، 48,750 د.ل…) بيانات تجريبية للعرض فقط.
