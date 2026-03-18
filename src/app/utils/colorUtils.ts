/* ════════════════════════════════════════
   SHARED COLOUR UTILITIES
   Used by GalleryFilterBar and SearchPanel
════════════════════════════════════════ */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const cmax = Math.max(rn, gn, bn);
  const cmin = Math.min(rn, gn, bn);
  const delta = cmax - cmin;
  const l = ((cmax + cmin) / 2) * 100;
  const s = delta === 0 ? 0 : (delta / (1 - Math.abs(2 * l / 100 - 1))) * 100;
  let h = 0;
  if (delta !== 0) {
    if (cmax === rn)      h = 60 * (((gn - bn) / delta) % 6);
    else if (cmax === gn) h = 60 * ((bn - rn) / delta + 2);
    else                  h = 60 * ((rn - gn) / delta + 4);
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

/** Maps any #rrggbb hex to one of the 11 interior-design colour families */
export function getColorFamily(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "other";
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (l >= 88 && s < 20)                          return "white-cream";
  if (l <= 20)                                     return "dark-charcoal";
  if (s < 13)                                      return "grey-stone";
  if (h >= 22 && h < 58 && l >= 62 && s < 42)     return "beige-sand";
  if ((h >= 325 || h < 12) && l >= 55 && s >= 22) return "pink-blush";
  if (h >= 5  && h < 35  && s >= 42)              return "terracotta-rust";
  if (h >= 10 && h < 48  && l < 55  && s >= 20)  return "brown-walnut";
  if (h >= 42 && h < 75  && s >= 30)              return "yellow-gold";
  if (h >= 70 && h < 170)                          return "green-sage";
  if (h >= 165 && h < 262)                         return "blue-teal";
  if (h >= 258 && h < 330)                         return "purple-mauve";
  return "other";
}

/** Perceptual distance between two RGB triples */
export function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number }
): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/* ── 11 interior-design colour families ── */
export const COLOR_FAMILIES_CONFIG: Array<{
  family: string;
  displayName: string;
  fallbackHex: string;
}> = [
  { family: "white-cream",     displayName: "Cream",      fallbackHex: "#F5F0E8" },
  { family: "beige-sand",      displayName: "Beige",      fallbackHex: "#E8D5B7" },
  { family: "grey-stone",      displayName: "Stone",      fallbackHex: "#A0A0A0" },
  { family: "dark-charcoal",   displayName: "Dark",       fallbackHex: "#3A3A3A" },
  { family: "brown-walnut",    displayName: "Walnut",     fallbackHex: "#8B5E3C" },
  { family: "terracotta-rust", displayName: "Terracotta", fallbackHex: "#C66B45" },
  { family: "yellow-gold",     displayName: "Gold",       fallbackHex: "#D4AF37" },
  { family: "green-sage",      displayName: "Sage",       fallbackHex: "#7A9E7E" },
  { family: "blue-teal",       displayName: "Blue",       fallbackHex: "#5B8DB8" },
  { family: "purple-mauve",    displayName: "Mauve",      fallbackHex: "#9B7AA0" },
  { family: "pink-blush",      displayName: "Blush",      fallbackHex: "#E8B4B8" },
];

export interface PaletteSwatch {
  family: string;
  displayName: string;
  hex: string;       // representative hex from actual data
  count: number;     // number of looks that have this colour family
}

/**
 * Derives palette swatches from a moodboard data map.
 * mbData: Record<lookId, { palette: string[]; materials: string[]; mood_words: string[] }>
 */
export function computePaletteSwatches(
  mbData: Record<string, { palette: string[]; materials: string[]; mood_words: string[] }>
): PaletteSwatch[] {
  if (Object.keys(mbData).length === 0) return [];

  const familyData: Record<string, { hexes: string[]; lookIds: Set<string> }> = {};
  Object.entries(mbData).forEach(([lookId, { palette }]) => {
    palette.forEach((hex) => {
      const fam = getColorFamily(hex);
      if (fam === "other") return;
      if (!familyData[fam]) familyData[fam] = { hexes: [], lookIds: new Set() };
      familyData[fam].hexes.push(hex);
      familyData[fam].lookIds.add(lookId);
    });
  });

  return COLOR_FAMILIES_CONFIG
    .filter(({ family }) => (familyData[family]?.lookIds.size ?? 0) >= 1)
    .map(({ family, displayName, fallbackHex }) => {
      const fd = familyData[family];
      if (!fd || fd.hexes.length === 0) {
        return { family, displayName, hex: fallbackHex, count: 0 };
      }
      // Representative hex: closest to the average RGB of all hexes in this family
      const rgbs = fd.hexes.map((h) => hexToRgb(h)!).filter(Boolean);
      const avgR = rgbs.reduce((s, c) => s + c.r, 0) / rgbs.length;
      const avgG = rgbs.reduce((s, c) => s + c.g, 0) / rgbs.length;
      const avgB = rgbs.reduce((s, c) => s + c.b, 0) / rgbs.length;
      const avg = { r: avgR, g: avgG, b: avgB };
      const closestHex = fd.hexes.reduce((best, hex) => {
        const rgb = hexToRgb(hex)!;
        return colorDistance(rgb, avg) < colorDistance(hexToRgb(best)!, avg) ? hex : best;
      }, fd.hexes[0]);

      return { family, displayName, hex: closestHex, count: fd.lookIds.size };
    })
    .filter((sw) => sw.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Derives top N material strings from moodboard data */
export function computeTopMaterials(
  mbData: Record<string, { palette: string[]; materials: string[]; mood_words: string[] }>,
  limit = 8
): string[] {
  const counts: Record<string, number> = {};
  Object.values(mbData).forEach(({ materials }) => {
    materials.forEach((m) => { counts[m.trim()] = (counts[m.trim()] || 0) + 1; });
  });
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([m]) => m);
}
