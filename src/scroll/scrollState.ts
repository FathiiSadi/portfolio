/* Single source of truth for the journey.
   Lenis writes here every frame; the camera rig, HUD and scenes read from it.
   Plain mutable singleton — read inside rAF/useFrame, no React re-renders. */

export const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'arena', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

interface SectionRect {
  top: number;
  height: number;
}

export const scrollState = {
  /** overall page progress 0..1 (lenis) */
  progress: 0,
  /** lenis velocity — drives aberration/grain intensity */
  velocity: 0,
  /** pointer in NDC (-1..1), updated on mousemove */
  pointer: { x: 0, y: 0 },
  /** measured px rects per section */
  rects: {} as Record<SectionId, SectionRect>,
  /** total scrollable distance in px */
  total: 1,
  /** viewport height px */
  vh: 1,
  /** bumped on every measure so consumers can rebuild caches */
  measureId: 0,
  /** true once the loader has finished — scenes hold their intro until then */
  started: false,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Scroll fraction at which the section's center crosses the viewport center. */
export function stationFrac(id: SectionId): number {
  const r = scrollState.rects[id];
  if (!r) return 0;
  return clamp01((r.top + r.height / 2 - scrollState.vh / 2) / scrollState.total);
}

/** Scroll fraction at a normalized point through the section's visible window
    (0 = top edge enters viewport bottom, 1 = bottom edge leaves viewport top). */
export function fracAt(id: SectionId, localT: number): number {
  const r = scrollState.rects[id];
  if (!r) return 0;
  return clamp01((r.top - scrollState.vh + localT * (r.height + scrollState.vh)) / scrollState.total);
}

/** 0..1 — how far the viewport top has scrolled through the section. */
export function exitProgress(id: SectionId): number {
  const r = scrollState.rects[id];
  if (!r || r.height <= 0) return 0;
  return clamp01((scrollState.progress * scrollState.total - r.top) / r.height);
}

/** 0..1 — full pass: section entering viewport → section fully gone. */
export function viewProgress(id: SectionId): number {
  const r = scrollState.rects[id];
  if (!r) return 0;
  const s = scrollState.progress * scrollState.total;
  return clamp01((s - (r.top - scrollState.vh)) / (r.height + scrollState.vh));
}

/** Measure section DOM offsets. Call on mount + resize + after fonts settle. */
export function measureSections(): void {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  if (total <= 0) return;
  scrollState.total = total;
  scrollState.vh = window.innerHeight;
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrollState.rects[id] = { top: el.offsetTop, height: el.offsetHeight };
  });
  scrollState.measureId++;
}

/* ── Chapter store (React-facing, powers the HUD) ─────────────────── */

export interface Chapter {
  index: number;
  code: string;
  name: string;
}

export const CHAPTERS: Record<SectionId, Chapter> = {
  hero: { index: 1, code: 'CH.01', name: 'SIGNAL' },
  about: { index: 2, code: 'CH.02', name: 'ORIGIN' },
  skills: { index: 3, code: 'CH.03', name: 'ARSENAL' },
  projects: { index: 4, code: 'CH.04', name: 'WORK' },
  arena: { index: 5, code: 'CH.05', name: 'ARENA' },
  contact: { index: 6, code: 'CH.06', name: 'TRANSMIT' },
};

type Listener = () => void;
let currentChapter: Chapter = CHAPTERS.hero;
const listeners = new Set<Listener>();

export function setChapter(id: SectionId): void {
  const next = CHAPTERS[id];
  if (next === currentChapter) return;
  currentChapter = next;
  listeners.forEach((l) => l());
}

export function subscribeChapter(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getChapter(): Chapter {
  return currentChapter;
}
