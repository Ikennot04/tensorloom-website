import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Decorative curve only; the numbers are an illustration, not real results.
export default function LossCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [loss, setLoss] = useState(reduce ? 0.021 : 0.912);
  const [epoch, setEpoch] = useState(reduce ? 200 : 0);

  useEffect(() => {
    if (!seen || reduce) return;
    const a = animate(0, 1, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        setEpoch(Math.round(t * 200));
        setLoss(0.021 + (0.912 - 0.021) * Math.pow(1 - t, 3));
      },
    });
    return () => a.stop();
  }, [seen, reduce]);

  return (
    <div ref={ref} className="neo-inset mt-5 p-3">
      <div className="mb-1 flex justify-between text-xs font-semibold text-secondary tabular-nums">
        <span>Epoch {epoch}</span>
        <span>Loss {loss.toFixed(3)}</span>
      </div>
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-24 w-full" aria-hidden="true">
        <motion.path
          d="M0,8 C40,18 60,58 110,70 S200,88 260,93 S360,97 400,98"
          fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={seen ? { pathLength: 1 } : undefined}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
