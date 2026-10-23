import { motion, useReducedMotion } from "motion/react";
import { ease } from "../motion";

const LAYERS = [3, 5, 5, 1];
const W = 320, H = 240;

const points = LAYERS.map((n, i) => {
  const x = 30 + i * ((W - 60) / (LAYERS.length - 1));
  return Array.from({ length: n }, (_, j) => ({ x, y: H / 2 + (j - (n - 1) / 2) * 40 }));
});

type Edge = { x1: number; y1: number; x2: number; y2: number; layer: number; key: string };
const edges: Edge[] = [];
points.slice(0, -1).forEach((col, i) =>
  col.forEach((a, ai) =>
    points[i + 1].forEach((b, bi) =>
      edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, layer: i, key: `${i}-${ai}-${bi}` }),
    ),
  ),
);

// A few edges per layer carry a travelling "signal" to show a forward pass.
const signals = edges.filter((_, i) => i % 3 === 0);
const PASS = 2.4; // seconds for one full forward pass
const INTRO = 1.4;

export default function NetworkGraphic() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="A neural network drawing">
      {edges.map((e) => (
        <motion.line
          key={e.key}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="rgb(255 255 255 / .2)" strokeWidth={1.2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 + e.layer * 0.25, ease }}
        />
      ))}

      {!reduce &&
        signals.map((e, i) => (
          <motion.circle
            key={`s-${e.key}`}
            r={2.6}
            fill="var(--color-mint)"
            initial={{ cx: e.x1, cy: e.y1, opacity: 0 }}
            animate={{ cx: [e.x1, e.x2], cy: [e.y1, e.y2], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: PASS / 3,
              delay: INTRO + e.layer * (PASS / 3) + (i % 4) * 0.05,
              repeat: Infinity,
              repeatDelay: PASS - PASS / 3 + 0.6,
              ease: "easeInOut",
            }}
          />
        ))}

      {points.map((col, li) =>
        col.map((p, ni) => {
          const out = li === points.length - 1;
          return (
            <motion.circle
              key={`n-${li}-${ni}`}
              cx={p.x} cy={p.y} r={9}
              fill={out ? "var(--color-accent)" : "var(--color-primary)"}
              stroke={out ? "var(--color-accent)" : "#fff"}
              strokeWidth={2}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                out && !reduce
                  ? { scale: [0, 1, 1.25, 1], opacity: 1 }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                out && !reduce
                  ? { duration: 1.2, delay: INTRO + PASS - 0.4, repeat: Infinity, repeatDelay: 1.8, times: [0, 0.1, 0.5, 1] }
                  : { type: "spring", stiffness: 260, damping: 18, delay: 0.15 + li * 0.22 + ni * 0.04 }
              }
            />
          );
        }),
      )}
    </svg>
  );
}
