'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { observeOnce } from '@/lib/reveal-observer';

type Tag = 'div' | 'li' | 'section' | 'figure' | 'header' | 'span';

interface AppearProps {
  children: ReactNode;
  /** تأخير بالمللي ثانية لترتيب ظهور العناصر */
  delay?: number;
  /** مسافة الصعود بالبكسل */
  rise?: number;
  /** ضبابية البداية — تعطي إحساس «دخول البؤرة» */
  blur?: number;
  /** تكبير البداية، مثلًا 0.96 لدخول ناعم */
  scale?: number;
  className?: string;
  as?: Tag;
}

/**
 * غلاف الظهور عند التمرير.
 *
 * الحركة كلها CSS، والجافاسكربت هنا لا يفعل شيئًا سوى قلب سمة واحدة
 * (`data-visible`) عند دخول العنصر الشاشة. هذا يُبقي خيط العرض فارغًا
 * أثناء التمرير — وهو ما يجعل الحركة ناعمة على الهاتف.
 *
 * السمة نفسها تشغّل كذلك كشف الكلمات داخل العنصر (انظر Words).
 */
export function Appear({
  children,
  delay = 0,
  rise = 28,
  blur = 0,
  scale = 1,
  className = '',
  as: Tag = 'div',
}: AppearProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeOnce(element, () => setVisible(true));
  }, []);

  const style = {
    '--bb-delay': `${delay}ms`,
    '--bb-rise': `${rise}px`,
    '--bb-start-blur': `${blur}px`,
    '--bb-start-scale': scale,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      data-visible={visible}
      className={`bb-appear ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
