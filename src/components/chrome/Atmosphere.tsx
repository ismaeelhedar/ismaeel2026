import type { CSSProperties } from 'react';

/**
 * طبقات الجوّ — كلها مكوّنات خادم بصفر جافاسكربت.
 * الشفق والحُبيبات والتظليل هي ما يفصل الموقع عن أي قالب جاهز.
 */

/** الشفق: أربع كتل ضوئية ضخمة تنجرف ببطء خلف الصفحة كلها */
export function Aurora() {
  return (
    <div className="bb-aurora" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

/** الحُبيبات والتظليل الجانبي — فوق كل شيء وبلا تفاعل */
export function Atmosphere() {
  return (
    <>
      <div className="bb-grain" aria-hidden="true" />
      <div className="bb-vignette" aria-hidden="true" />
    </>
  );
}

/** ذرّات غبار تصعد ببطء — للافتتاح وحده */
export function Motes({ count = 18 }: { count?: number }) {
  // قيم ثابتة محسوبة من الفهرس: نفس النتيجة على الخادم والمتصفّح
  const motes = Array.from({ length: count }, (_, index) => {
    const spread = (index * 37) % 100;
    const size = 1.5 + ((index * 13) % 5) * 0.5;
    return {
      key: index,
      style: {
        insetInlineStart: `${spread}%`,
        inlineSize: `${size}px`,
        blockSize: `${size}px`,
        '--bb-mote-duration': `${16 + ((index * 7) % 14)}s`,
        '--bb-mote-delay': `${((index * 11) % 20) * 0.6}s`,
        '--bb-mote-x': `${((index % 5) - 2) * 14}px`,
        '--bb-mote-opacity': 0.25 + ((index * 3) % 5) * 0.09,
      } as CSSProperties,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {motes.map((mote) => (
        <span key={mote.key} className="bb-mote" style={mote.style} />
      ))}
    </div>
  );
}

interface BerryGlowProps {
  size?: string;
  opacity?: number;
  className?: string;
  color?: string;
}

/** توهّج توتيّ دائري واسع وناعم خلف العناصر المهمة */
export function BerryGlow({ size = '30rem', opacity = 0.25, className = '', color }: BerryGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`bb-bloom-glow ${className}`}
      style={{
        inlineSize: size,
        blockSize: size,
        opacity,
        ...(color ? { background: `radial-gradient(circle, ${color} 0%, transparent 70%)` } : null),
      }}
    />
  );
}
