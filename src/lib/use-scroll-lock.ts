'use client';

import { useEffect } from 'react';

/**
 * يقفل تمرير الصفحة خلف نافذة منبثقة.
 *
 * على iOS لا يكفي overflow: hidden وحده، لذلك نثبّت <body> في مكانه
 * ونحفظ موضع التمرير ثم نعيده عند الإغلاق — فلا تقفز الصفحة.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
