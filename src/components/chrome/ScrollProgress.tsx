'use client';

import { useEffect, useRef } from 'react';

/**
 * شريط تقدّم رفيع أعلى الصفحة، يمتدّ من اليمين إلى اليسار مع اتجاه القراءة.
 *
 * لا حالة React ولا إعادة تصيير: نكتب التحويل مباشرة على العنصر داخل
 * requestAnimationFrame، فلا يكلّف التمرير شيئًا تقريبًا.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;

      if (ref.current) {
        ref.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={ref} className="bb-progress" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />;
}
