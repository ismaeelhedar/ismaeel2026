import localFont from 'next/font/local';

/**
 * خط الموقع: تجوّل (Tajawal) وحده — في كل حرف من الموقع، عناوين ونصًّا وأرقامًا.
 *
 * لماذا عائلتان؟
 * ملفات fontsource مقسّمة حسب النطاق (arabic / latin). المتصفّح يختار الخط لكل
 * حرف على حدة، فنضع اللاتيني أولًا ليأخذ الأرقام (1، 2، 3) ثم يسقط تلقائيًا إلى
 * الملف العربي لبقية الحروف — ونفس الخط في الحالتين فلا يظهر أي فرق.
 *
 * كل الأوزان في نداء واحد لكل نطاق، وهذا مقصود: لو فرّقناها إلى عائلات مستقلّة
 * لاختار المتصفّح العائلة الأولى وركّب منها الأوزان الناقصة تركيبًا صناعيًا
 * بدل استعمال الملف الصحيح.
 *
 * أربعة أوزان: 400 نصّ · 500 تأكيد خفيف · 700 عناوين · 800 العناوين الكبرى.
 * المجموع 96 كيلوبايت لكل خطوط الموقع.
 */

const latin = localFont({
  src: [
    { path: './tajawal-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './tajawal-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './tajawal-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './tajawal-latin-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-latin',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const arabic = localFont({
  src: [
    { path: './tajawal-arabic-400.woff2', weight: '400', style: 'normal' },
    { path: './tajawal-arabic-500.woff2', weight: '500', style: 'normal' },
    { path: './tajawal-arabic-700.woff2', weight: '700', style: 'normal' },
    { path: './tajawal-arabic-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/** تُضاف على <body> ثم تُقرأ من خلال --font-display / --font-body في Tailwind */
export const fontVariables = `${latin.variable} ${arabic.variable}`;
