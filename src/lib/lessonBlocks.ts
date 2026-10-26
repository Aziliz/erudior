// Maps, timelines and simulations in lesson Markdown (```map, ```timeline, ```sim blocks).
// Like worked examples, each block is swapped for a placeholder before Markdown runs and its
// HTML (built from escaped text and fields already sanitized by `md`) is put back afterwards.
// The static HTML reads on its own (prerendered pages, print, no JavaScript); the Markdown
// component then hydrates timelines (timeline.ts) and mounts maps and simulations
// (components/LessonWidgets.tsx, lazy-loaded).

import { hash } from "./blockUtil";
import { MAP_BLOCK, mapBlockProblems, renderMapBlock } from "./mapSpec";
import { renderTimeline, TIMELINE_BLOCK, timelineProblems } from "./timeline";
import { renderSim, SIM_BLOCK, simProblems } from "./sims";

const ANY_BLOCK = /```(map|timeline|sim)\b/;

export function protectLessonBlocks(src: string, md: (src: string) => string): { text: string; restore: (html: string) => string } {
  if (!ANY_BLOCK.test(src)) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const slot = (html: string) => {
    out.push(html);
    return `\n\nXLBLOCKX${out.length - 1}XLBLOCKX\n\n`;
  };
  const key = (whole: string) => `${out.length + 1}-${hash(whole)}`;
  const text = src
    .replace(MAP_BLOCK, (whole, _info: string, body: string) => slot(renderMapBlock(body, md, key(whole))))
    .replace(TIMELINE_BLOCK, (whole, _info: string, body: string) => slot(renderTimeline(body, md, key(whole))))
    .replace(SIM_BLOCK, (whole, info: string, body: string) => slot(renderSim(info, body, md, key(whole))));
  if (!out.length) return { text: src, restore: (h) => h };
  return {
    text,
    restore: (html) => html.replace(/<p>XLBLOCKX(\d+)XLBLOCKX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XLBLOCKX(\d+)XLBLOCKX/g, (_m, n) => out[Number(n)]),
  };
}

/** Authoring problems for every map, timeline and sim block in a Markdown text. */
export function lessonBlockProblems(md: string): string[] {
  return [...mapBlockProblems(md), ...timelineProblems(md), ...simProblems(md)];
}
