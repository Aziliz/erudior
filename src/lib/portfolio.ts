// Photos of paper work for a student's portfolio: one file per student (portfolio-<id>),
// kept apart from the records so the records stay small. Images are resized on the way in.

import type { PortfolioPhoto } from "./reports";
import { loadState, saveState } from "./storage";
import { uid } from "./util";

export async function loadPhotos(studentId: string): Promise<PortfolioPhoto[]> {
  const text = await loadState(`portfolio-${studentId}`);
  if (!text) return [];
  try {
    return (JSON.parse(text) as { photos: PortfolioPhoto[] }).photos ?? [];
  } catch {
    return [];
  }
}

export async function savePhotos(studentId: string, photos: PortfolioPhoto[]): Promise<void> {
  await saveState(`portfolio-${studentId}`, JSON.stringify({ format: "examiner-portfolio", version: 1, photos }));
}

/** Read an image file and shrink it to at most `max` pixels on the long side, as JPEG. */
export async function shrinkImage(file: Blob, max = 1600, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

export const newPhoto = (p: Omit<PortfolioPhoto, "id">): PortfolioPhoto => ({ ...p, id: uid("p") });
