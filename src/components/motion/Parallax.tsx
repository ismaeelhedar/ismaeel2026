'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * انزياح بطيء مع التمرير.
 *
 * يُستخدم على مجموعات الصور فقط، بمقدار صغير (بضع عشرات من البكسلات)،
 * حتى يُحسّ العمق ولا يُلاحَظ كحيلة. مع تفضيل تقليل الحركة يتوقّف تمامًا.
 */
export function Parallax({
  children,
  amount = 34,
  className = '',
}: {
  children: ReactNode;
  /** مقدار الإزاحة بالبكسل في كل اتجاه */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
