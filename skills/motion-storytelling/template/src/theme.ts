// Visual language taken from the reference posts:
// warm paper background, black IBM Plex Sans Arabic, one yellow marker highlight,
// green social accents, a thin "hook" divider line, handle on top, share row at the bottom.
export const C = {
  paper: '#f3f2ee',
  paperDeep: '#ebe9e3',
  ink: '#111111',
  inkSoft: '#3a3a3a',
  muted: '#8a8a86',
  highlight: '#ffc95c',
  green: '#22b97c',
  greenSoft: '#e3f6ec',
  card: '#ffffff',
  line: '#e2dfd8',
  // Tokens from almutamakkin-expo-v3/src/theme/tokens.ts (app UI cut-aways)
  appScaffold: '#faf9f5',
  appSunken: '#f5f0e8',
  appBorder: '#e6dfd8',
  appText: '#141413',
  appSubtle: '#6c6a64',
  appPrimary: '#cc785c',
  appPrimaryStrong: '#a9583e',
  appSuccess: '#5db872',
  appWarning: '#e8a55a',
  appDanger: '#c64545',
  appInfo: '#5db8a6',
  brandNavy: '#1f2a5c',
};

export const FONT = "'IBM Plex Sans Arabic', sans-serif";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Scene start times (seconds). The narrator's lines are timed against these.
export const SCENES = [
  {id: 'hook', start: 0},
  {id: 'problem', start: 5},
  {id: 'bridge', start: 11},
  {id: 'home', start: 19},
  {id: 'inventory', start: 28},
  {id: 'finance', start: 38},
  {id: 'agent', start: 47},
  {id: 'team', start: 55},
  {id: 'outro', start: 62},
] as const;
export const END = 70;
export const TRANSITION = 18; // frames

// Narration typed in the speech bubble (Libyan dialect, short lines).
export const LINES: {t0: number; t1: number; text: string; hl?: string}[] = [
  {t0: 0.8, t1: 4.6, text: 'أهلاً! أنا هنا باش نحكيلك على تطبيق المتمكن', hl: 'المتمكن'},
  {t0: 5.5, t1: 10.6, text: 'صاحب المتجر يبي يعرف شن صاير في محله… حتى وهو بعيد عليه.', hl: 'بعيد'},
  {t0: 11.6, t1: 18.6, text: 'المتمكن يربط جوالك بقاعدة متجرك عن طريق جسر آمن على جهاز الويندوز.', hl: 'جسر آمن'},
  {t0: 19.6, t1: 27.6, text: 'من الرئيسية تشوف الوردية، النواقص، والمنتجات المنتهية… في نظرة وحدة.', hl: 'نظرة وحدة'},
  {t0: 28.6, t1: 37.6, text: 'في المخزون: بحث بالباركود، طباعة ملصقات، تتبع الأصناف، وحتى صور تلقائية.', hl: 'صور تلقائية'},
  {t0: 38.6, t1: 46.6, text: 'والمالية فيها ديون العملاء والموردين، تسوية الورديات، وطلبية شراء ذكية.', hl: 'طلبية شراء ذكية'},
  {t0: 47.6, t1: 54.6, text: 'تبي تعرف حاجة؟ اسأل شات الوكيل بلغتك، ويرد عليك من بيانات متجرك.', hl: 'شات الوكيل'},
  {t0: 55.6, t1: 61.6, text: 'موظفينك يدخلوا بأدوارهم، وبلاغاتك توصل لفريق الدعم مع إشعار فوري.', hl: 'إشعار فوري'},
  {t0: 62.6, t1: 68.4, text: 'المتمكن… أدِر متجرك بوضوح وثقة. جرّبه اليوم!', hl: 'بوضوح وثقة'},
];

export const sec = (s: number) => Math.round(s * FPS);
