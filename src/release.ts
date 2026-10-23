// Edit this file for each release. It is public, so no secrets belong here.
// URLs are pinned to the version tag, so the file, version and SHA-256 always change together.

export type DownloadFile = {
  label: string;
  note: string;
  file: string;
  size: string;
  sha256: string;
  primary?: boolean;
};

export const RELEASE = {
  version: "0.1.0",
  repo: "https://github.com/Ikennot04/tesnsor-loom",
  signed: { windows: false, mac: false },
  files: {
    windows: [
      {
        label: "Installer (.exe)",
        note: "Recommended for most people",
        file: "tensorloom_0.1.0_x64-setup.exe",
        size: "9.3 MB",
        sha256: "3238bfcf50ff53f5a77bb349b0a77f34fc1476337c3aec9dfa61b6b742464828",
        primary: true,
      },
      {
        label: "MSI package (.msi)",
        note: "For IT-managed installs",
        file: "tensorloom_0.1.0_x64_en-US.msi",
        size: "14.6 MB",
        sha256: "62d3f30fa805ad5fa27b9e2751609137d8af1e5609cc70d7fcbe54756a811ba1",
      },
    ] as DownloadFile[],
    // Fill in once the macOS build from the GitHub Actions macOS runner is published.
    mac: [
      // { label: "Apple silicon (.dmg)", note: "M1 and newer", file: "tensorloom_0.1.0_aarch64.dmg", size: "", sha256: "", primary: true },
      // { label: "Intel (.dmg)", note: "Older Intel Macs", file: "tensorloom_0.1.0_x64.dmg", size: "", sha256: "" },
    ] as DownloadFile[],
  },
};

export const downloadUrl = (f: DownloadFile) =>
  `${RELEASE.repo}/releases/download/v${RELEASE.version}/${encodeURIComponent(f.file)}`;

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
