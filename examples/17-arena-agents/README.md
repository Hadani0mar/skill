# فيديو Arena × الوكلاء

**فيديو MP4 فعلي وقابل للتشغيل** بأسلوب **#7 «حكاية مصوّرة»**. يحكي الفكرة باختصار: «عندك فكرة؟ أنا مساعدك على Arena. الفكرة منك… ونرتّبوها سوا.» تعدد الزوايا هنا معالجة بصرية مجازية، وليس وصفاً لواجهة Arena أو وعداً بميزة بعينها.

## تشغيل الفيديو

> يتطلب فتح الرابط تسجيل الدخول إلى GitHub بحساب لديه صلاحية على المستودع، لأنه خاص حالياً.

- [▶ مشاهدة/فتح الفيديو MP4 من GitHub](https://github.com/Hadani0mar/skill/blob/arena/ae396c96-skill/examples/17-arena-agents/arena-agents.mp4?raw=true)
- [فتح ملف MP4](arena-agents.mp4)
- [معاينة PNG ثابتة](preview.png) — صورة مرجعية فقط وليست الفيديو.

**المواصفات:** 15 ثانية · عمودي 9:16 · 540×960 · 30 إطاراً/ثانية · H.264 + AAC.

## محتويات المثال

- `arena-agents.mp4` — ملف الفيديو النهائي.
- `preview.png` و`preview.svg` — معاينة ثابتة قابلة للمراجعة والتحرير.
- `video-src/src/Video.tsx` — مشاهد Remotion وانتقالات الصفحات.
- `video-src/render-video.mjs` — تجميع ورندر الفيديو.
- `video-src/render-sounds.mjs` — مزج مؤثرات React Bits في ملف WAV.
- `video-src/src/illustration.json` و`assets/connecting-teams.svg` — رسم unDraw المستخدم في المشاهد.
- `public/fonts/ReadexPro-variable.ttf` — خط Readex Pro، ورخصته OFL في `assets/fonts/`.
- `public/sfx/mix.wav` — المزيج الصوتي المستخدم في الفيديو.
- `research/` — لوحة القصة، ومصادر الأصول ومراجعة المعاينة.

## الاتجاه الفني

أرضية عاجية فاتحة، بنفسجي/ليلكي مفاهيمي، خط Readex Pro، رسم فريق متصل، وعناوين عربية بحركة ظهور مستوحاة من React Bits. مؤثرات الصوت مبنية من وصفات `calm`, `unfold`, `swish`, `glimmer`, `stamp`, و`emblem`. لا يُستخدم شعار رسمي لـArena؛ يظهر الاسم كتابةً فقط.

## إعادة البناء

من هذا المجلد:

```sh
npm ci
npm run video:render
```

لإعادة توليد ملف الصوت من نسخة محلية من مستودع React Bits، ثم إعادة الرندر:

```sh
REACT_BITS_ROOT=/path/to/react-bits npm run video:sounds
npm run video:render
```

تُكتب النتيجة إلى `arena-agents.mp4`. أما `npm run preview` فيعيد إنشاء المعاينة الثابتة فقط.
