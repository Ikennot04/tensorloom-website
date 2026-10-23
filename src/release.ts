// Edit this file for each release. It is public, so no secrets belong here.
// URLs are pinned to the version tag, so the file, version and SHA-256 always change together.

export type DownloadFile = {
  label: string;
  note: string;
  file: string;
  tag: string; // GitHub release tag that holds this file
  size: string;
  sha256: string;
  primary?: boolean;
};

export const RELEASE = {
  version: "0.1.0",
  repo: "https://github.com/cedrickcuencaalegsao/tesnsor-loom",
  signed: { windows: false, mac: false },
  files: {
    windows: [
      {
        label: "Installer (.exe)",
        note: "Windows 10 or 11, 64-bit",
        file: "tensorloom_0.1.0_x64-setup.exe",
        tag: "tensor-loom-v0.1.0",
        size: "9.3 MB",
        sha256: "3238bfcf50ff53f5a77bb349b0a77f34fc1476337c3aec9dfa61b6b742464828",
        primary: true,
      },
    ] as DownloadFile[],
    mac: [
      {
        label: "Apple silicon (.dmg)",
        note: "M1 and newer",
        file: "tensorloom_0.1.0_aarch64.dmg",
        tag: "v0.1.0",
        size: "14.2 MB",
        sha256: "d5113625eb118377d3797813e35fbed702cd9daa372e001dbd53a16c2882a8f0",
        primary: true,
      },
    ] as DownloadFile[],
  },
};

// Pinned to each file's release tag, so the file and the SHA-256 shown always match.
export const downloadUrl = (f: DownloadFile) =>
  `${RELEASE.repo}/releases/download/${encodeURIComponent(f.tag)}/${encodeURIComponent(f.file)}`;

export const releasePage = (f: DownloadFile) => `${RELEASE.repo}/releases/tag/${encodeURIComponent(f.tag)}`;

export type OS = "windows" | "mac" | "mobile" | "other";

export function detectOS(): OS {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || navigator.platform || "";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return "mobile";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) return "mac";
  return "other";
}

export const OS_NAME = { windows: "Windows", mac: "macOS" } as const;
