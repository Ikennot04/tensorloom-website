import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { RELEASE, downloadUrl, releasePage, OS_NAME, type DownloadFile, type OS } from "../release";
import { fadeUp, stagger, inView, ease } from "../motion";
import { AppleIcon, DownloadArrow, WindowsIcon } from "./Icons";

function FileButton({ f }: { f: DownloadFile }) {
  return (
    <motion.a
      href={downloadUrl(f)}
      download
      variants={fadeUp}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${f.primary ? "neo-btn" : "neo-btn-ghost"} w-full flex-wrap justify-between px-5 py-4 text-left no-underline`}
    >
      <span className="flex items-center gap-2"><DownloadArrow />{f.label}{f.prerelease && <span className="rounded-full bg-white/25 px-2 py-0.5 text-[.7rem] font-bold uppercase tracking-wide">Pre-release</span>}</span>
      <span className="text-xs font-medium opacity-85">{[f.note, f.size].filter(Boolean).join(" \u00b7 ")}</span>
    </motion.a>
  );
}

function OsCard({ os, name, req, icon, files, current }: {
  os: "windows" | "mac"; name: string; req: string; icon: ReactNode; files: DownloadFile[]; current: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      id={`card-${os}`}
      variants={fadeUp}
      className={`neo-raised relative flex flex-col gap-5 border-2 p-6 sm:p-8 ${current ? "border-accent/55" : "border-transparent"}`}
    >
      {current && !reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.25rem] border-2 border-accent"
          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.015, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-secondary">{req}</p>
        </div>
        {current && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease }}
            className="ml-auto rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-[#22705c]"
          >
            Your system
          </motion.span>
        )}
      </div>
      {files.length ? (
        <motion.div variants={stagger(0.08)} className="flex flex-col gap-3">
          {files.map((f) => <FileButton key={f.file} f={f} />)}
        </motion.div>
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl border-[1.5px] border-dashed border-secondary/40 px-5 py-4">
          <strong>Coming soon</strong>
          <span className="text-sm text-secondary">
            The {name} version is being prepared. Check back shortly, or watch the{" "}
            <a href={`${RELEASE.repo}/releases`} target="_blank" rel="noopener noreferrer">releases page</a>.
          </span>
        </div>
      )}
    </motion.article>
  );
}

function CopyHash({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); })}
      className="neo-btn-ghost shrink-0 px-3 py-1.5 text-xs"
      aria-label="Copy SHA-256"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={done ? "y" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
          {done ? "Copied" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function VerifyPanel() {
  const [open, setOpen] = useState(false);
  const all = [...RELEASE.files.windows, ...RELEASE.files.mac].filter((f) => f.sha256);
  return (
    <motion.div variants={fadeUp} className="neo-raised p-6 sm:p-8">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 text-left font-bold">
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.25, ease }} aria-hidden="true">&#9656;</motion.span>
        Verify your download and first-run tips
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <h4 className="mt-5 font-bold">SHA-256 checksums for v{RELEASE.version}</h4>
            <p className="mt-1 text-sm text-secondary">
              Compare these with the file you downloaded. On Windows run <code>Get-FileHash .\file -Algorithm SHA256</code> in PowerShell.
              On macOS run <code>shasum -a 256 file</code> in Terminal.
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {all.map((f) => (
                <li key={f.file} className="neo-inset flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <code className="font-semibold">{f.file}</code>
                    <code className="mt-1 block break-all text-secondary">{f.sha256}</code>
                  </div>
                  <CopyHash value={f.sha256} />
                </li>
              ))}
            </ul>
            <h4 className="mt-5 font-bold">Windows says "Windows protected your PC"</h4>
            <p className="mt-1 text-sm text-secondary">
              {RELEASE.signed.windows
                ? "This release is code-signed, so Windows should open it without a warning."
                : "This early release isn't code-signed yet, so SmartScreen may show a warning. If the checksum matches, choose More info, then Run anyway."}
            </p>
            <h4 className="mt-5 font-bold">macOS says the app "can't be opened"</h4>
            <p className="mt-1 text-sm text-secondary">
              {RELEASE.signed.mac
                ? "This release is signed and notarized by Apple, so it should open normally."
                : "This early release isn't notarized by Apple yet, so Gatekeeper may block it the first time. If the checksum matches, open System Settings, go to Privacy & Security, and choose Open Anyway for TensorLoom."}
            </p>
            <p className="mt-4 text-sm text-secondary">
              Release pages:{" "}
              {[...RELEASE.files.windows, ...RELEASE.files.mac].map((f, i) => (
                <span key={f.file}>
                  {i > 0 && " \u00b7 "}
                  <a href={releasePage(f)} target="_blank" rel="noopener noreferrer">{f.file.endsWith(".dmg") ? "macOS" : "Windows"} ({f.tag})</a>
                </span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Download({ os }: { os: OS }) {
  return (
    <motion.section id="download" {...inView} variants={stagger(0.1)} className="flex scroll-mt-4 flex-col gap-5 pt-8">
      <motion.header variants={fadeUp} className="text-center">
        <p className="eyebrow">Download</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Get TensorLoom v{RELEASE.version}</h2>
        <p className="mt-2 text-secondary">Free to download. Pick your system below.</p>
      </motion.header>
      <div className="grid gap-5 md:grid-cols-2">
        <OsCard os="windows" name={OS_NAME.windows} req="Windows 10 or 11, 64-bit" icon={<WindowsIcon />} files={RELEASE.files.windows} current={os === "windows"} />
        <OsCard os="mac" name={OS_NAME.mac} req="macOS on Apple silicon (M1 and newer)" icon={<AppleIcon />} files={RELEASE.files.mac} current={os === "mac"} />
      </div>
      <VerifyPanel />
    </motion.section>
  );
}
