import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { useMemo } from "react";
import { RELEASE, detectOS, downloadUrl, OS_NAME } from "./release";
import { ease, fadeUp, stagger, inView } from "./motion";
import NetworkGraphic from "./components/NetworkGraphic";
import LossCurve from "./components/LossCurve";
import Download from "./components/Download";
import { DownloadArrow } from "./components/Icons";

const card = "neo-raised p-6 sm:p-8";
const hover = { y: -4, transition: { duration: 0.25, ease } };

function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
      className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5"
    >
      <a href="#top" className="flex items-center gap-2.5 text-lg font-extrabold text-primary no-underline">
        <img src="/icon.png" alt="" width={32} height={32} className="rounded-lg" /> TensorLoom
      </a>
      <div className="flex flex-wrap gap-5 text-sm">
        {[["Features", "#features"], ["How it works", "#how"], ["Download", "#download"]].map(([l, h]) => (
          <a key={h} href={h} className="text-secondary no-underline transition-colors hover:text-primary">{l}</a>
        ))}
        <a href={RELEASE.repo} target="_blank" rel="noopener noreferrer" className="text-secondary no-underline transition-colors hover:text-primary">GitHub</a>
      </div>
    </motion.nav>
  );
}

function Hero({ os }: { os: ReturnType<typeof detectOS> }) {
  const mine = os === "windows" || os === "mac" ? RELEASE.files[os].find((f) => f.primary) ?? RELEASE.files[os][0] : undefined;
  let label = "Download";
  let href = "#download";
  let note: React.ReactNode = <>See <a href="#download" className="text-mint">all downloads</a>.</>;
  if (mine) {
    label = `Download for ${OS_NAME[os as "windows" | "mac"]}`;
    href = downloadUrl(mine);
    note = <>v{RELEASE.version} · {mine.size} · <a href="#download" className="text-mint">Other downloads</a></>;
  } else if (os === "windows" || os === "mac") {
    label = `${OS_NAME[os]} version coming soon`;
  } else if (os === "mobile") {
    label = "See desktop downloads";
    note = "TensorLoom is a desktop app. Open this page on a Windows PC or Mac to install it.";
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease }}
      className="relative grid items-center gap-8 overflow-hidden rounded-[1.25rem] bg-primary p-7 text-white sm:p-12 lg:grid-cols-[1.3fr_1fr]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/25 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div variants={stagger(0.1, 0.2)} initial="hidden" animate="show" className="relative">
        <motion.p variants={fadeUp} className="eyebrow !text-mint">Desktop app for Windows and macOS</motion.p>
        <motion.h1 variants={fadeUp} className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
          Train neural networks on your own computer.
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-white/75 sm:text-lg">
          Load a CSV, pick a network, and watch it learn in real time. TensorLoom runs entirely on your machine, so your data never leaves it.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
          <motion.a
            href={href} {...(mine ? { download: "" } : {})}
            whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="neo-btn min-h-14 px-7 text-[1.05rem] no-underline"
          >
            <DownloadArrow /> {label}
          </motion.a>
          <motion.a href="#how" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center rounded-[.875rem] bg-white/10 px-6 font-bold text-white no-underline transition-colors hover:bg-white/20">
            See how it works
          </motion.a>
        </motion.div>
        <motion.p variants={fadeUp} className="mt-4 min-h-5 text-sm text-white/65">{note}</motion.p>
      </motion.div>
      <div className="relative mx-auto hidden w-full max-w-sm sm:block">
        <NetworkGraphic />
      </div>
    </motion.header>
  );
}

function Features() {
  const small = [
    ["Step 1", "Bring your data", "Open or paste a CSV. TensorLoom counts your columns and suggests the input size for you."],
    ["Step 2", "Design the network", "Add hidden layers, set units and activations, and choose the output, all from simple controls."],
    ["Step 3", "CPU or GPU", "Train on your processor or on a graphics card the app detects on your machine."],
  ];
  return (
    <motion.section id="features" {...inView} variants={stagger(0.09)} className="grid scroll-mt-4 gap-5 md:grid-cols-12">
      {small.map(([e, t, d]) => (
        <motion.article key={t} variants={fadeUp} whileHover={hover} className={`${card} md:col-span-4`}>
          <p className="eyebrow">{e}</p>
          <h3 className="mt-2 text-xl font-bold">{t}</h3>
          <p className="mt-2 text-[.95rem] text-secondary">{d}</p>
        </motion.article>
      ))}
      <motion.article variants={fadeUp} whileHover={hover} className={`${card} md:col-span-7`}>
        <p className="eyebrow">Live view</p>
        <h3 className="mt-2 text-xl font-bold">Watch it learn</h3>
        <p className="mt-2 text-[.95rem] text-secondary">Loss and score stream in while you train, alongside a live drawing of the network's weights and a running log.</p>
        <LossCurve />
      </motion.article>
      <motion.article variants={fadeUp} whileHover={hover} className={`${card} md:col-span-5`}>
        <p className="eyebrow">Export &amp; test</p>
        <h3 className="mt-2 text-xl font-bold">Keep your model</h3>
        <p className="mt-2 text-[.95rem] text-secondary">
          Save the trained model as <code>.json</code> or <code>.bin</code>, then load it back to predict single rows or score a whole CSV.
        </p>
        <motion.div variants={stagger(0.07, 0.3)} className="mt-5 flex flex-wrap gap-2.5">
          {[".json", ".bin", "MSE", "R²"].map((c) => (
            <motion.span key={c} variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 16 } } }} className="neo-chip">
              {c}
            </motion.span>
          ))}
        </motion.div>
      </motion.article>
    </motion.section>
  );
}

function How() {
  const steps = [
    "Download and install TensorLoom for your system.",
    "Load a CSV and set your network size.",
    <>Press <strong>Start training</strong> and watch the progress panel.</>,
    "Export the model and test it inside the app.",
  ];
  return (
    <motion.section id="how" {...inView} variants={stagger(0.12)} className={`${card} scroll-mt-4`}>
      <motion.p variants={fadeUp} className="eyebrow">How it works</motion.p>
      <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">From CSV to trained model in four steps</motion.h2>
      <div className="relative mt-7">
        <motion.div
          aria-hidden="true"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease, delay: 0.2 } } }}
          className="absolute left-[1.125rem] right-[1.125rem] top-[1.125rem] hidden h-0.5 origin-left bg-accent/40 lg:block"
        />
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li key={i} variants={fadeUp} className="flex flex-col gap-3 text-[.95rem] text-secondary">
              <motion.span
                variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: "spring", stiffness: 320, damping: 16 } } }}
                className="grid size-9 place-items-center rounded-xl bg-primary font-extrabold text-white"
              >
                {i + 1}
              </motion.span>
              <p>{s}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-accent" />;
}

export default function App() {
  const os = useMemo(detectOS, []);
  return (
    <MotionConfig reducedMotion="user">
      <ScrollBar />
      <a href="#download" className="absolute -left-[999px] focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to download</a>
      <Nav />
      <main id="top" className="mx-auto flex max-w-6xl flex-col gap-5 px-5 pb-12">
        <Hero os={os} />
        <Features />
        <How />
        <Download os={os} />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 border-t border-secondary/20 px-5 py-8 text-sm text-secondary">
        <span>TensorLoom v{RELEASE.version}</span>
        <span>MIT License</span>
        <a href={RELEASE.repo} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
      </footer>
    </MotionConfig>
  );
}
