import { Fragment, type CSSProperties } from 'react';

/**
 * كشف النصّ كلمةً بعد كلمة.
 *
 * لماذا كلمات لا حروف؟ لأن تغليف كل حرف عربي بعنصر مستقلّ يكسر اتصال الحروف
 * فتصير «غ ا ل ي ة». التقسيم عند المسافات آمن تمامًا: كل كلمة تبقى وحدة
 * متّصلة الرسم، والنتيجة البصرية أجمل وأهدأ من تقطيع الحروف أصلًا.
 *
 * مكوّن خادم: لا جافاسكربت إطلاقًا. الحركة تعمل افتراضيًا، وتتوقّف فقط إذا
 * كان العنصر داخل غلاف Appear لم يدخل الشاشة بعد.
 */
export function Words({
  text,
  base = 0,
  className = '',
}: {
  text: string;
  /** تأخير قبل أول كلمة، بالمللي ثانية */
  base?: number;
  className?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span
      className={`bb-words ${className}`}
      style={{ '--bb-base': `${base}ms` } as CSSProperties}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="bb-word" style={{ '--i': index } as CSSProperties}>
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
