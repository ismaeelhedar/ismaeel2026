/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  محتوى الموقع — كل ما يمكن تعديله موجود في هذا الملف وحده.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  لإضافة صورة:
 *    1. ضع الملف في public/photos/   (مثال: public/photos/dinner.jpg)
 *    2. شغّل:  npm run photos
 *    3. أضف سطرًا هنا:  { slug: 'dinner', alt: 'وصف عربي للصورة' }
 *
 *  ملاحظة عن الحقل alt: هو وصفٌ للصورة تقرأه قارئات الشاشة فقط ولا يظهر على
 *  الشاشة إطلاقًا — لذلك يبقى وصفيًا دقيقًا. أما كل نصّ *مرئي* في الموقع
 *  فهو كلام، لا وصف.
 */

export type FocalPoint = 'top' | 'center' | 'bottom';

export interface PhotoRef {
  /** اسم الملف في public/photos/ بدون امتداد */
  slug: string;
  /** وصف للصورة — لقارئات الشاشة فقط، لا يظهر على الشاشة */
  alt: string;
  /** نقطة التركيز عند القصّ */
  focus?: FocalPoint;
}

export interface Chapter {
  id: string;
  /** التاريخ بكلمات عربية — مثال: "ربيع 2019" */
  date: string;
  title: string;
  /** كلام، لا وصف للصور */
  body: string;
  photos: PhotoRef[];
}

export interface SiteContent {
  name: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  opening: {
    whisper: string;
    displayName: string;
    lines: string[];
    cta: string;
    scrollHint: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    note: string;
    chapters: Chapter[];
  };
  gallery: {
    eyebrow: string;
    heading: string;
    note: string;
    photos: PhotoRef[];
    ui: {
      open: string;
      close: string;
      next: string;
      previous: string;
      counter: (current: number, total: number) => string;
      dialogLabel: string;
    };
  };
  counter: {
    eyebrow: string;
    heading: string;
    note: string;
    /** تاريخ البداية بصيغة ISO مع المنطقة الزمنية */
    since: string;
    /** التاريخ نفسه مكتوبًا بالعربية، كما يظهر تحت العدّاد */
    sinceLabel: string;
    units: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
  reasons: {
    eyebrow: string;
    heading: string;
    note: string;
    items: string[];
  };
  game: {
    eyebrow: string;
    heading: string;
    intro: string;
    ui: {
      moves: string;
      restart: string;
      cardBack: string;
      matched: string;
      finishing: string;
    };
    pairs: PhotoRef[];
  };
  reveal: {
    building: string;
    greeting: string;
    product: string;
    color: string;
    storage: string;
    footnote: string;
    continue: string;
    photo: PhotoRef;
  };
  letter: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    signature: string;
    photo: PhotoRef;
  };
  audio: {
    enable: string;
    disable: string;
    /** ملف اختياري في public/audio/ — إن لم يوجد تُستخدم نغمة مولّدة داخليًا */
    src: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  photoMissing: string;
}

export const content: SiteContent = {
  name: 'غالية',

  meta: {
    title: 'إلى غالية',
    description: 'كلامٌ ما قدرت قوله وجهًا لوجه، وصورٌ ما حبّيت أنساها، ومفاجأة في آخر الطريق.',
    ogTitle: 'إلى غالية 🤍',
    ogDescription: 'كل اللي ما قلته لكِ… مكتوبٌ هنا.',
  },

  opening: {
    whisper: 'إلى التي',
    displayName: 'غالية حبيبي',
    lines: [
      'في هذي الدنيا كلّها، ما في قلبٌ يشبه قلبكِ.',
      'وكل يومٍ يمرّ، أحبّكِ فيه أكثر من الذي قبله.',
      'هذي الصفحة كتبتُها لكِ… خذي وقتكِ معها.',
    ],
    cta: 'ابدئي',
    scrollHint: 'انزلي برفق',
  },

  story: {
    eyebrow: 'الفصل الأول',
    heading: 'كيف صرنا نحن',
    note: 'خمسة فصول، وكل فصلٍ منها كان يمكن أن يكون الحكاية كلها.',
    chapters: [
      {
        id: 'engagement',
        date: 'خريف 2023',
        title: 'يوم قلتِ نعم',
        body: 'ما كنتُ أعرف أن كلمةً واحدة تقدر تقلب عمرًا كاملًا. قلتِها، فانقلب كل شيء. ومن تلك اللحظة صار للأيام طعمٌ لم أعرفه قبلكِ.',
        photos: [
          { slug: 'engagement-selfie', alt: 'الاثنان في يوم الخطوبة يبتسمان للكاميرا', focus: 'center' },
          { slug: 'engagement-ring', alt: 'يدها على صدره والخاتم يلمع', focus: 'center' },
          { slug: 'home-formal', alt: 'الاثنان واقفان باللون الأسود داخل البيت', focus: 'center' },
        ],
      },
      {
        id: 'damascus',
        date: 'ليالٍ من 2024',
        title: 'والمدينة تحتنا',
        body: 'كانت دمشق كلها مضاءة تحت أقدامنا، وأنا ما رأيتُ ضوءًا واحدًا. في وجهكِ نورٌ لا يترك لأحدٍ أن ينظر إلى سواكِ.',
        photos: [
          { slug: 'qasioun-night', alt: 'الاثنان ليلًا وأضواء المدينة خلفهما', focus: 'center' },
          { slug: 'cafe-balcony', alt: 'صورة ذاتية على شرفة مقهى بلباس سماوي', focus: 'center' },
          { slug: 'night-street', alt: 'الاثنان ينظران إلى بعضهما تحت شجرة مضاءة', focus: 'center' },
        ],
      },
      {
        id: 'mountain',
        date: 'ربيع 2024',
        title: 'لا موعد ولا خطّة',
        body: 'ما كان في شيء مرتّب ذلك اليوم. لا موعدٌ ولا سبب. كنتِ معي فقط — وهذا وحده كفى ليصير اليوم أجمل أيام السنة.',
        photos: [
          { slug: 'chalet-deck', alt: 'الاثنان على ممشى خشبي بين أشجار السرو', focus: 'center' },
          { slug: 'chalet-shoulder', alt: 'رأسها على كتفه وهما يضحكان', focus: 'top' },
          { slug: 'mountain-table', alt: 'الاثنان على طاولة تطلّ على الوادي', focus: 'center' },
        ],
      },
      {
        id: 'nikah',
        date: 'صيف 2025',
        title: 'قلتُ قبلت',
        body: 'وقّعنا على ورقة، لكن الوعد كان مكتوبًا قبلها بسنين. قلتُ «قبلت»، وفي قلبي كنتُ أقول: أخيرًا صارت لي.',
        photos: [
          { slug: 'katb-kitab-kiss', alt: 'قبلة على جبينها أمام جدار الورد الأحمر', focus: 'center' },
          { slug: 'katb-kitab-book', alt: 'الاثنان يحملان دفتر العقد', focus: 'center' },
          { slug: 'katb-kitab-family', alt: 'صورة جماعية للعائلة في يوم العقد', focus: 'center' },
        ],
      },
      {
        id: 'everyday',
        date: 'كل يومٍ من يومها',
        title: 'وبعدها… كل يوم',
        body: 'ليس كل حبٍّ يحتاج مناسبة. هناك حبٌّ يعيش في أصغر التفاصيل: في فنجان قهوة، وفي طريقٍ طويل، وفي ضحكةٍ ليس لها سبب.',
        photos: [
          { slug: 'car-sunset', alt: 'صورة ذاتية داخل السيارة والشمس تغرب', focus: 'center' },
          { slug: 'mirror-selfie', alt: 'صورة في المرآة ويداه حول خصرها', focus: 'center' },
          { slug: 'car-sunset-2', alt: 'الاثنان في السيارة وهي ترسل قبلة', focus: 'center' },
        ],
      },
    ],
  },

  gallery: {
    eyebrow: 'الألبوم',
    heading: 'لحظاتٌ لا تتكرّر',
    note: 'كل صورةٍ هنا فيها يومٌ لن يعود… لكنه لن يذهب أيضًا.',
    photos: [
      { slug: 'katb-kitab-kiss', alt: 'قبلة على الجبين أمام الورد الأحمر' },
      { slug: 'qasioun-night', alt: 'الاثنان وأضواء المدينة خلفهما' },
      { slug: 'chalet-deck', alt: 'على الممشى الخشبي بين أشجار السرو' },
      { slug: 'engagement-selfie', alt: 'صورة ذاتية في يوم الخطوبة' },
      { slug: 'mountain-selfie', alt: 'صورة ذاتية في مطعم يطلّ على الوادي' },
      { slug: 'katb-kitab-roses', alt: 'الاثنان يحملان باقة ورد أحمر كبيرة' },
      { slug: 'cafe-balcony', alt: 'على شرفة المقهى بلباس سماوي' },
      { slug: 'car-sunset', alt: 'داخل السيارة وقت الغروب' },
      { slug: 'chalet-shoulder', alt: 'رأسها على كتفه' },
      { slug: 'katb-kitab-embrace', alt: 'عناق أمام جدار الورد' },
      { slug: 'night-street', alt: 'الاثنان ينظران إلى بعضهما ليلًا' },
      { slug: 'engagement-ring', alt: 'الخاتم يلمع ويدها على صدره' },
      { slug: 'mountain-table', alt: 'على طاولة تطلّ على الجبل' },
      { slug: 'mirror-selfie', alt: 'صورة في المرآة' },
      { slug: 'katb-kitab-book', alt: 'دفتر العقد بين أيديهما' },
      { slug: 'cafe-balcony-2', alt: 'صورة أخرى على شرفة المقهى' },
      { slug: 'chalet-railing', alt: 'الاثنان يستندان على سياج خشبي' },
      { slug: 'katb-kitab-family', alt: 'صورة العائلة في يوم العقد' },
      { slug: 'car-sunset-2', alt: 'ضحكة داخل السيارة والشمس تغرب' },
      { slug: 'home-formal', alt: 'الاثنان باللون الأسود داخل البيت' },
      { slug: 'chalet-deck-2', alt: 'وقفة أخرى على الممشى الخشبي' },
    ],
    ui: {
      open: 'تكبير الصورة',
      close: 'إغلاق',
      next: 'الصورة التالية',
      previous: 'الصورة السابقة',
      counter: (current, total) => `${current} من ${total}`,
      dialogLabel: 'عارض الصور',
    },
  },

  counter: {
    eyebrow: 'منذ ذلك اليوم',
    heading: 'وما زلتُ أعدّ',
    note: 'لا لأنني أنتظر شيئًا… بل لأن كل ثانيةٍ معكِ تستحقّ أن تُحسَب.',
    // 19 نيسان 2026 — غيّر الساعة إن أردت دقّة أكبر
    since: '2026-04-19T00:00:00+03:00',
    sinceLabel: '19 نيسان 2026',
    units: {
      days: 'يوم',
      hours: 'ساعة',
      minutes: 'دقيقة',
      seconds: 'ثانية',
    },
  },

  reasons: {
    eyebrow: 'ولأنّكِ تسألين دائمًا',
    heading: 'لماذا أحبّكِ',
    note: 'الأسباب أكثر، لكن الصفحة لا تتّسع.',
    items: [
      'لأنّ صوتكِ يُهدّئني قبل أن أفهم ما تقولين.',
      'لأنّكِ تضحكين من قلبكِ، فيضحك البيت كلّه معكِ.',
      'لأنّكِ تعرفين متى أصمت ولماذا، بلا أن أشرح.',
      'لأنّ يدكِ في يدي تجعل أيّ طريقٍ أقصر.',
      'لأنّكِ صبرتِ عليّ في أيامٍ ما كنتُ فيها سهلًا.',
      'لأنّ أجمل ما فيّ… هو أنّكِ اخترتِني.',
    ],
  },

  game: {
    eyebrow: 'وقفة صغيرة',
    heading: 'قبل آخر شيء',
    intro: 'لعبةٌ قصيرة لا خسارة فيها ولا وقت. اقلبي البطاقات ولمّي كل صورتين متشابهتين.',
    ui: {
      moves: 'محاولات',
      restart: 'من جديد',
      cardBack: 'بطاقة مقلوبة — اضغطي لكشفها',
      matched: 'تطابقت',
      finishing: 'لحظة…',
    },
    pairs: [
      { slug: 'engagement-selfie', alt: 'بطاقة: يوم الخطوبة' },
      { slug: 'qasioun-night', alt: 'بطاقة: ليلة المدينة' },
      { slug: 'katb-kitab-kiss', alt: 'بطاقة: يوم العقد' },
    ],
  },

  reveal: {
    building: 'انتظري لحظة…',
    greeting: 'مبروك يا غالية 🤍',
    product: 'ربحتِ iPhone 17 Pro Max',
    color: 'فضّي',
    storage: '256GB',
    footnote: 'ليست مزحة. صار لكِ من زمان، وكنتُ أنتظر الطريقة التي تليق بكِ لأقولها.',
    continue: 'بقيت كلمة أخيرة',
    photo: {
      slug: 'gift-iphone',
      alt: 'هاتف فضّي مع علبته',
    },
  },

  letter: {
    eyebrow: 'وأخيرًا',
    heading: 'رسالةٌ منّي',
    paragraphs: [
      'يا غالية،',
      'ما صنعتُ هذي الصفحة من أجل الهدية. الهدية كانت حجّةً حتى أجلس وأرتّب كل هذا، وأتذكّر كيف صرنا نحن.',
      'أجمل ما فينا ليس المناسبات الكبيرة، بل الأيام العادية التي لم ننتبه وقتها أنها أهمّ ما نملك.',
      'شكرًا لأنكِ صبرتِ عليّ، وضحكتِ معي، وبقيتِ إلى جانبي حين لم يكن هناك سببٌ واضحٌ للبقاء.',
      'كل سنةٍ وأنتِ حبيبتي… وكل سنةٍ وأنا أحبّكِ أكثر.',
    ],
    signature: 'إلى الأبد — إسماعيل',
    photo: {
      slug: 'illustration',
      alt: 'رسمة للاثنين يتحدّثان في ليلة صيف',
    },
  },

  audio: {
    enable: 'تشغيل الموسيقى',
    disable: 'إيقاف الموسيقى',
    src: '/audio/theme.m4a',
  },

  notFound: {
    title: 'لم نجد هذي الصفحة',
    body: 'يبدو أن الرابط ناقصٌ أو قديم. ارجعي إلى البداية وكل شيء في مكانه.',
    back: 'إلى البداية',
  },

  photoMissing: 'الصورة غير متوفّرة',
};
