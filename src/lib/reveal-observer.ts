'use client';

/**
 * مراقب تقاطع واحد مشترك لكل عناصر الظهور في الصفحة.
 *
 * البديل — مراقب لكل عنصر — يعني عشرات المراقبين على خيط واحد أثناء التمرير.
 * هنا مراقب واحد فقط، وكل عنصر يُلغى تسجيله فور ظهوره، فلا يبقى شيء يعمل
 * بعد أن تمرّ على القسم.
 */

type Callback = () => void;

let observer: IntersectionObserver | null = null;
const pending = new Map<Element, Callback>();

function ensureObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const callback = pending.get(entry.target);
        pending.delete(entry.target);
        observer?.unobserve(entry.target);
        callback?.();
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  return observer;
}

/** يسجّل عنصرًا ليُنادى مرّة واحدة عند دخوله الشاشة. يُرجع دالة إلغاء. */
export function observeOnce(element: Element, callback: Callback): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    // متصفّح قديم جدًا — نُظهر المحتوى فورًا بدل إخفائه للأبد
    callback();
    return () => {};
  }

  const instance = ensureObserver();
  pending.set(element, callback);
  instance.observe(element);

  return () => {
    pending.delete(element);
    instance.unobserve(element);
  };
}
