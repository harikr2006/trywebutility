export interface SemverInfo {
  valid: boolean;
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
  buildMeta: string;
  error: string | null;
}

const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/;

export function parseSemver(version: string): SemverInfo {
  const v = version.trim().replace(/^v/, "");
  const match = SEMVER_RE.exec(v);
  if (!match) {
    return { valid: false, major: 0, minor: 0, patch: 0, prerelease: "", buildMeta: "", error: "Invalid semver string" };
  }
  return {
    valid: true,
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] ?? "",
    buildMeta: match[5] ?? "",
    error: null,
  };
}

export function compareSemver(a: string, b: string): number {
  const av = parseSemver(a);
  const bv = parseSemver(b);
  if (!av.valid || !bv.valid) return 0;
  if (av.major !== bv.major) return av.major - bv.major;
  if (av.minor !== bv.minor) return av.minor - bv.minor;
  if (av.patch !== bv.patch) return av.patch - bv.patch;
  if (!av.prerelease && bv.prerelease) return 1;
  if (av.prerelease && !bv.prerelease) return -1;
  return av.prerelease.localeCompare(bv.prerelease);
}
