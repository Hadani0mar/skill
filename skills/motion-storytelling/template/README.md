# فيديو شرح المتمكن — Remotion

## التشغيل
```bash
npm install
npm run studio     # معاينة وتعديل حي
npm run render     # يصدّر out/almutamakkin-explainer.mp4
```
الصوت يُولَّد بـ `python3 render/sfx.py` إلى `out/sfx.wav` (أو بأصوات React Bits حسب المهارة، القسم 13b)، ثم أضف ادمجه مع الفيديو بـ ffmpeg (أو انسخه إلى `public/` وأضف `<Audio src={staticFile('sfx.wav')} />`).

## الملفات
| الملف | الدور |
|---|---|
| `src/theme.ts` | الألوان، أوقات المشاهد، وجمل الراوي (عدّلها هنا) |
| `src/components/Narrator.tsx` | الشخصية: الحجم والموقع لكل مشهد، الفم، الرمش، فقاعة الكلام |
| `src/components/Text.tsx` | تأثير الكتابة، دخول الكلمات، الهايلايت الأصفر، خط الفاصل |
| `src/components/Frame.tsx` | الورق، الحساب فوق، وشريط «شارك المنفعة» تحت |
| `src/components/ShaderLayer.tsx` | طبقة WebGL مقادة بالإطار لخلفيات React Bits (القسم 13a في المهارة) |
| `src/scenes/*` | المشاهد التسعة |
| `src/icons.json` | أيقونات Fluent UI System Icons — Color (رخصة MIT) |
| `public/fonts` | IBM Plex Sans Arabic (رخصة OFL) |

## المصدر
الشاشات والنصوص مأخوذة من `almutamakkin-expo-v3` على فرع `feat/expo-v3-identity` (آخر commit `0644627`، 2026-10-27).
الأرقام والأسماء (سالم، المورد النور، 48,750 د.ل…) بيانات تجريبية للعرض فقط.
