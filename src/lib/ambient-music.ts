/**
 * سرير موسيقي هادئ مولّد داخل المتصفّح (Web Audio API).
 *
 * لماذا مولّد بدل ملف صوتي؟
 *   - لا تنزيل ولا اتصال بالشبكة ولا حقوق ملكية.
 *   - لا يتكرّر بشكل مسموع: النغمات تُختار عشوائيًا من سُلّم واحد،
 *     فلا تشعر السامعة بـ«اللفّة» التي تفضح المقاطع القصيرة.
 *
 * إن وضعتَ ملفًا في public/audio/theme.m4a فسيُستخدم هو بدلًا من هذا.
 */

/** سُلّم خماسي دافئ (ري كبير) — لا نغمة ناشزة مهما كان الترتيب */
const MELODY_HZ = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 739.99];
const DRONE_HZ = [73.42, 110.0];

const MASTER_LEVEL = 0.16;
const FADE_IN_SECONDS = 3;
const FADE_OUT_SECONDS = 1.4;

export interface AmbientBed {
  start: () => Promise<void>;
  stop: () => void;
}

export function createAmbientBed(): AmbientBed {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: number | null = null;
  let stopped = false;

  /** نغمة واحدة بمهاد طويل — لا نقرات ولا حوافّ حادّة */
  function playNote(at: number, frequency: number, velocity: number) {
    if (!context || !master) return;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const tone = context.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    // انحراف بسيط جدًا يعطي دفء الآلة الحقيقية
    oscillator.detune.value = (Math.random() - 0.5) * 8;

    tone.type = 'lowpass';
    tone.frequency.value = 1800;
    tone.Q.value = 0.4;

    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(velocity, at + 1.1);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + 4.5);

    oscillator.connect(tone).connect(envelope).connect(master);
    oscillator.start(at);
    oscillator.stop(at + 4.8);
  }

  /** طبقة سفلية ثابتة تملأ الفراغ بين النغمات */
  function startDrone() {
    if (!context || !master) return;

    for (const frequency of DRONE_HZ) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const tone = context.createBiquadFilter();
      const shimmer = context.createOscillator();
      const shimmerDepth = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      tone.type = 'lowpass';
      tone.frequency.value = 420;

      envelope.gain.setValueAtTime(0.0001, context.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.07, context.currentTime + FADE_IN_SECONDS);

      // تموّج بطيء جدًا حتى لا تبدو الطبقة ميّتة
      shimmer.type = 'sine';
      shimmer.frequency.value = 0.06;
      shimmerDepth.gain.value = 0.02;
      shimmer.connect(shimmerDepth).connect(envelope.gain);

      oscillator.connect(tone).connect(envelope).connect(master);
      oscillator.start();
      shimmer.start();
    }
  }

  function scheduleNextNote() {
    if (stopped || !context) return;

    const now = context.currentTime;
    playNote(now + 0.05, MELODY_HZ[Math.floor(Math.random() * MELODY_HZ.length)], 0.1);

    // أحيانًا نغمة مرافقة أعلى بقليل — تعطي إحساس الثنائية
    if (Math.random() < 0.35) {
      playNote(now + 0.9, MELODY_HZ[Math.floor(Math.random() * MELODY_HZ.length)], 0.055);
    }

    timer = window.setTimeout(scheduleNextNote, 2400 + Math.random() * 2600);
  }

  return {
    async start() {
      if (context) {
        await context.resume();
        return;
      }

      stopped = false;
      context = new AudioContext();
      master = context.createGain();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(
        MASTER_LEVEL,
        context.currentTime + FADE_IN_SECONDS,
      );
      master.connect(context.destination);

      startDrone();
      scheduleNextNote();
    },

    stop() {
      stopped = true;

      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }

      if (!context || !master) return;

      const closing = context;
      master.gain.cancelScheduledValues(closing.currentTime);
      master.gain.setValueAtTime(master.gain.value, closing.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, closing.currentTime + FADE_OUT_SECONDS);

      window.setTimeout(() => {
        void closing.close();
      }, FADE_OUT_SECONDS * 1000 + 120);

      context = null;
      master = null;
    },
  };
}
