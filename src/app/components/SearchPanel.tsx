import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ── Design Tokens ── */
const T = {
  primaryDefault: "#EB595F",
  primaryVariant: "#FDEEEF",
  primaryHover: "#BC474C",
  secondaryDefault: "#5E455A",
  surfaceDefault: "#FFFFFF",
  surfaceVariant: "#E6E6E6",
  surfaceBg: "#F2F2F2",
  onSurfaceDefault: "#1A1A1A",
  onSurfaceSecondary: "#666666",
  onSurfaceDisabled: "#999999",
  onSurfaceBorder: "#CCCCCC",
  extendedMustard: "#FFEBC2",
  tertiaryGreen: "#469E59",
  tertiaryYellow: "#F19E2B",
};

/* ════════════════════════════════════════
   COLOR UTILITIES
════════════════════════════════════════ */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
function getColorFamily(hex: string): string {
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

/** Compute perceptual distance between two RGB colours */
function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/* ── 11 Interior-relevant colour families ── */
const COLOR_FAMILIES_CONFIG: Array<{
  family: string;
  displayName: string;
  fallbackHex: string;   // shown when no Gemini data available
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

/* ════════════════════════════════════════
   KEYWORD MAPS
════════════════════════════════════════ */
const ROOM_KEYWORDS: Record<string, string[]> = {
  "living-room": ["living", "lounge", "hall", "drawing room", "drawing"],
  bedroom:       ["bedroom", "bed room", "master bed", "sleeping", "master bedroom"],
  kitchen:       ["kitchen", "cook", "chef", "culinary", "cooking"],
  bath:          ["bath", "bathroom", "washroom", "toilet", "spa", "lavatory"],
  balcony:       ["balcony", "outdoor", "terrace", "patio", "open air"],
  "study-room":  ["study", "office", "work", "library", "workstation"],
  "kids-room":   ["kids", "children", "child", "nursery", "playroom"],
};

const COLOR_STYLE_MAP: Record<string, string[]> = {
  grey:       ["minimal", "japandi", "scandi", "contemporary", "quiet luxury", "modern zen", "modern"],
  gray:       ["minimal", "japandi", "scandi", "contemporary", "quiet luxury", "modern zen", "modern"],
  white:      ["minimal", "clean", "scandi", "japandi"],
  beige:      ["warm", "boho", "natural", "transitional", "earthy"],
  cream:      ["warm", "boho", "natural", "transitional"],
  warm:       ["warm", "boho", "earthy", "rustic"],
  wooden:     ["japandi", "natural", "warm", "rustic", "warm boho"],
  wood:       ["japandi", "natural", "warm", "rustic", "warm boho"],
  walnut:     ["japandi", "natural", "modern zen"],
  teak:       ["japandi", "natural", "tropical"],
  oak:        ["japandi", "natural", "scandi"],
  rattan:     ["boho", "coastal", "natural", "warm boho"],
  cane:       ["boho", "coastal", "natural"],
  marble:     ["luxury", "modern zen", "quiet luxury"],
  stone:      ["nature", "rustic", "japandi", "natural"],
  concrete:   ["modern", "minimal", "industrial"],
  minimal:    ["minimal", "clean", "simple", "japandi"],
  minimalist: ["minimal", "clean", "simple", "japandi"],
  japandi:    ["japandi"],
  coastal:    ["coastal", "blue", "marine"],
  boho:       ["warm boho", "bohemian", "earthy"],
  bohemian:   ["warm boho", "bohemian", "earthy"],
  modern:     ["modern", "minimal", "contemporary"],
  dark:       ["modern zen", "quiet luxury", "moody"],
  nature:     ["nature", "forest", "botanical"],
  green:      ["nature", "forest", "botanical"],
  blue:       ["coastal", "ocean", "marine"],
  terracotta: ["warm boho", "earthy", "rustic"],
  velvet:     ["quiet luxury", "modern zen"],
  linen:      ["japandi", "natural", "minimal"],
  brass:      ["quiet luxury", "warm", "modern zen"],
  gold:       ["quiet luxury", "luxury"],
  black:      ["modern zen", "quiet luxury", "minimal"],
  industrial: ["industrial", "loft", "modern"],
};

const MATERIAL_KEYWORDS = [
  "wood", "wooden", "walnut", "teak", "oak", "rattan", "cane", "marble",
  "stone", "concrete", "velvet", "linen", "leather", "brass", "gold",
  "glass", "metal", "steel", "ceramic", "terracotta", "cotton", "wool",
  "jute", "bamboo", "fabric", "suede", "wicker", "travertine", "bouclé",
  "boucle", "slate", "granite", "quartz", "lacquer", "acrylic", "resin",
];

const POPULAR_SEARCHES = [
  { label: "Grey and wooden kitchen", icon: "🍳" },
  { label: "Minimal bedroom",          icon: "🛏️" },
  { label: "Warm boho living room",    icon: "🛋️" },
  { label: "Japandi bathroom",         icon: "🚿" },
  { label: "Coastal living room",      icon: "🌊" },
  { label: "Velvet bedroom",           icon: "✨" },
  { label: "Modern dark kitchen",      icon: "🔪" },
  { label: "Beige living room",        icon: "🏡" },
  { label: "Rattan balcony",           icon: "🌿" },
  { label: "Marble bathroom",          icon: "💎" },
];

const ROOM_CHIPS = [
  { label: "All Rooms",   slug: "all",        emoji: "🏠" },
  { label: "Living Room", slug: "living-room", emoji: "🛋️" },
  { label: "Bedroom",     slug: "bedroom",     emoji: "🛏️" },
  { label: "Kitchen",     slug: "kitchen",     emoji: "🍳" },
  { label: "Bathroom",    slug: "bath",        emoji: "🚿" },
  { label: "Balcony",     slug: "balcony",     emoji: "🌿" },
  { label: "Study",       slug: "study-room",  emoji: "📚" },
  { label: "Kids Room",   slug: "kids-room",   emoji: "🧸" },
];

/* ════════════════════════════════════════
   QUERY PARSER
════════════════════════════════════════ */
function parseQuery(query: string) {
  const lower = query.toLowerCase().trim();

  let detectedRoom: string | null = null;
  for (const [slug, keywords] of Object.entries(ROOM_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) { detectedRoom = slug; break; }
  }

  const matchedStyles: Set<string> = new Set();
  for (const [keyword, styles] of Object.entries(COLOR_STYLE_MAP)) {
    if (lower.includes(keyword)) styles.forEach((s) => matchedStyles.add(s.toLowerCase()));
  }

  const detectedMaterials = MATERIAL_KEYWORDS.filter((m) => lower.includes(m));

  const stopWords = new Set(["and", "the", "for", "with", "room", "look", "style", "from"]);
  const words = lower.split(/\s+/).filter((w) => w.length >= 3 && !stopWords.has(w));

  return { detectedRoom, matchedStyles: Array.from(matchedStyles), detectedMaterials, words, rawQuery: lower };
}

/* ════════════════════════════════════════
   LOOK SCORER
════════════════════════════════════════ */
function scoreLook(look: any, parsed: ReturnType<typeof parseQuery>): number {
  let score = 0;
  const lookName     = (look.name      ?? "").toLowerCase();
  const lookStyle    = (look.styleSlug ?? "").toLowerCase();
  const lookRoomSlug = (look.roomSlug  ?? "").toLowerCase();
  const lookRoomName = (look.room      ?? "").toLowerCase();
  const lookMaterials: string[] = look.materials ?? [];
  const lookMoodWords: string[] = look.moodWords ?? [];

  if (parsed.detectedRoom &&
    (lookRoomSlug === parsed.detectedRoom ||
     lookRoomName.includes(parsed.detectedRoom.replace("-", " ")))) score += 12;

  for (const style of parsed.matchedStyles) {
    if (lookStyle.includes(style)) { score += 6; break; }
  }

  for (const queryMat of parsed.detectedMaterials) {
    if (lookMaterials.some((m) => m.includes(queryMat) || queryMat.includes(m))) {
      score += 5;
      if (parsed.detectedMaterials.indexOf(queryMat) >= 2) break;
    }
  }

  let moodMatches = 0;
  for (const word of parsed.words) {
    if (lookMoodWords.some((mw) => mw.includes(word) || word.includes(mw))) {
      score += 2; moodMatches++;
      if (moodMatches >= 3) break;
    }
  }

  for (const word of parsed.words) {
    if (lookName.includes(word))     score += 3;
    if (lookStyle.includes(word))    score += 2;
    if (lookRoomName.includes(word)) score += 1;
  }

  return score;
}

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface MbEntry {
  materials: string[];
  mood_words: string[];
  palette: string[];
}

interface PaletteSwatch {
  family: string;
  displayName: string;
  hex: string;         // representative hex from actual Gemini data
  count: number;       // number of looks with this colour family
  lookIds: Set<string>;
}

export interface SearchLook {
  id: string; img: string; name: string;
  tag: string; price: string; items: string; room: string;
}

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLook: (look: SearchLook) => void;
  /** Called when user submits a search — gallery will receive and filter */
  onSubmitSearch?: (query: string) => void;
  isDesktop?: boolean;
  /** Called when user taps "Match my Look" — opens the Image Match modal */
  onMatchLook?: () => void;
}

/* ════════════════════════════════════════
   SWATCH PICKER COMPONENT
════════════════════════════════════════ */
interface SwatchPickerProps {
  swatches: PaletteSwatch[];
  selected: string;
  onSelect: (family: string) => void;
  isDesktop?: boolean;
}

function SwatchPicker({ swatches, selected, onSelect, isDesktop }: SwatchPickerProps) {
  const size = isDesktop ? 30 : 27;
  const fontSize = isDesktop ? 9 : 8;

  return (
    <div
      style={{
        display: "flex",
        gap: isDesktop ? 10 : 8,
        overflowX: "auto",
        padding: isDesktop ? "10px 6px 12px" : "8px 6px 10px",
        scrollbarWidth: "none",
        alignItems: "flex-start",
      }}
    >
      {/* ── "All" swatch ── */}
      <button
        onClick={() => onSelect("all")}
        style={{
          flexShrink: 0, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 5,
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}
      >
        <div
          style={{
            width: size, height: size, borderRadius: "50%",
            background: "conic-gradient(#F5F0E8 0deg, #E8D5B7 60deg, #A0A0A0 120deg, #8B5E3C 180deg, #7A9E7E 240deg, #5B8DB8 300deg, #F5F0E8 360deg)",
            boxShadow: selected === "all"
              ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${T.primaryDefault}`
              : "0 1px 4px rgba(0,0,0,0.18)",
            transition: "all 0.2s ease",
            transform: selected === "all" ? "scale(1.12)" : "scale(1)",
          }}
        />
        <span
          style={{
            fontSize, fontFamily: "'Roboto',sans-serif",
            color: selected === "all" ? T.primaryHover : T.onSurfaceDisabled,
            fontWeight: selected === "all" ? 700 : 400,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          All
        </span>
      </button>

      {/* ── Colour family swatches ── */}
      {swatches.map((sw) => (
        <button
          key={sw.family}
          onClick={() => onSelect(sw.family === selected ? "all" : sw.family)}
          title={`${sw.displayName} · ${sw.count} look${sw.count !== 1 ? "s" : ""}`}
          style={{
            flexShrink: 0, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 5,
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <div
            style={{
              width: size, height: size, borderRadius: "50%",
              background: sw.hex,
              border: sw.family === "white-cream" || sw.family === "beige-sand"
                ? `1px solid ${T.surfaceVariant}` : "none",
              boxShadow: selected === sw.family
                ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${T.primaryDefault}`
                : "0 1px 4px rgba(0,0,0,0.18)",
              transition: "all 0.2s ease",
              transform: selected === sw.family ? "scale(1.15)" : "scale(1)",
              position: "relative",
            }}
          >
            {/* Checkmark on selected */}
            {selected === sw.family && (
              <div
                style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.22)",
                  fontSize: size * 0.4, color: "#fff",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
            )}
          </div>
          <span
            style={{
              fontSize, fontFamily: "'Roboto',sans-serif",
              color: selected === sw.family ? T.primaryHover : T.onSurfaceDisabled,
              fontWeight: selected === sw.family ? 700 : 400,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {sw.displayName}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   SEARCH PANEL COMPONENT
════════════════════════════════════════ */
export function SearchPanel({ isOpen, onClose, onSelectLook, onSubmitSearch, isDesktop, onMatchLook }: SearchPanelProps) {
  const [query, setQuery]                   = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Load recent searches ── */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("lb_recent_searches") || "[]");
      setRecentSearches(Array.isArray(stored) ? stored.slice(0, 5) : []);
    } catch { /* ignore */ }
  }, []);

  const saveRecent = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const updated = [q, ...prev.filter((r) => r !== q)].slice(0, 5);
      try { localStorage.setItem("lb_recent_searches", JSON.stringify(updated)); } catch { /* */ }
      return updated;
    });
  }, []);

  /* ── Auto-focus + reset ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  /* ── Submit: save recent → pass query to gallery → close ── */
  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed) saveRecent(trimmed);
    onSubmitSearch?.(trimmed);
    onClose();
  }, [onSubmitSearch, onClose, saveRecent]);

  if (!isOpen) return null;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     DESKTOP LAYOUT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (isDesktop) {
    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.38)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "72px 24px 24px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "var(--card)", borderRadius: "var(--radius)",
            width: "100%", maxWidth: 620, maxHeight: "80vh",
            display: "flex", flexDirection: "column", overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Search input ── */}
          <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "var(--background)", borderRadius: "calc(var(--radius) + 2px)",
                padding: "12px 16px",
                border: `1.5px solid ${query ? "var(--primary)" : "var(--border)"}`,
                transition: "border-color 0.2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "Enter") handleSubmit(query);
                }}
                placeholder='Try "marble kitchen", "walnut bedroom", "warm boho"…'
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 15, fontFamily: "var(--font-gilroy)",
                  color: "var(--foreground)", minWidth: 0,
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--muted)", border: "none",
                    cursor: "pointer", fontSize: 11, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "var(--muted-foreground)", flexShrink: 0,
                  }}
                >✕</button>
              )}
              <button
                onClick={onClose}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: "var(--muted-foreground)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 500, padding: "0 4px", flexShrink: 0,
                }}
              >Cancel</button>
            </div>
          </div>

          {/* ── Scrollable suggestions body ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 24px" }}>
            <SearchSuggestionsBody
              recentSearches={recentSearches}
              query={query}
              onSubmit={handleSubmit}
              onClearRecent={() => { setRecentSearches([]); localStorage.removeItem("lb_recent_searches"); }}
              onMatchLook={onMatchLook}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     MOBILE LAYOUT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "var(--card)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "slideDown 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes slideDown { from { transform: translateY(-12px); opacity:0 } to { transform: translateY(0); opacity:1 } }
      `}</style>

      {/* ── Fixed header ── */}
      <div style={{ padding: "54px 16px 0", background: "var(--card)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              background: "var(--background)", borderRadius: "var(--radius)",
              padding: "11px 12px",
              border: `1.5px solid ${query ? "var(--primary)" : "transparent"}`,
              transition: "border-color 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
                if (e.key === "Enter") handleSubmit(query);
              }}
              placeholder='Try "marble kitchen", "blue coastal"…'
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 14, fontFamily: "var(--font-gilroy)",
                color: "var(--foreground)", minWidth: 0,
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "var(--muted)", border: "none",
                  cursor: "pointer", fontSize: 11, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "var(--muted-foreground)", flexShrink: 0,
                }}
              >✕</button>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-roboto)",
              fontWeight: 600, padding: "0 4px", flexShrink: 0, whiteSpace: "nowrap",
            }}
          >Cancel</button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--muted)", flexShrink: 0, marginTop: 14 }} />

      {/* ── Scrollable suggestions body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>
        <SearchSuggestionsBody
          recentSearches={recentSearches}
          query={query}
          onSubmit={handleSubmit}
          onClearRecent={() => { setRecentSearches([]); localStorage.removeItem("lb_recent_searches"); }}
          onMatchLook={onMatchLook}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   LOOK CARD
════════════════════════════════════════ */
interface LookCardProps {
  look: any;
  onSelect: (look: any) => void;
  highlightMaterials?: string[];
  highlightColorFamily?: string;
  isAiAnalyzed?: boolean;
}

function LookCard({
  look, onSelect,
  highlightMaterials = [],
  highlightColorFamily = "all",
  isAiAnalyzed = false,
}: LookCardProps) {
  const [hovered, setHovered] = useState(false);

  const matchedMaterials = useMemo(
    () => !highlightMaterials.length || !look.materials?.length ? [] :
      look.materials.filter((mat: string) =>
        highlightMaterials.some((qm) => mat.includes(qm) || qm.includes(mat.split(" ").pop() ?? mat))
      ),
    [look.materials, highlightMaterials]
  );

  const unmatchedMaterials = useMemo(() => {
    const matched = new Set(matchedMaterials);
    return (look.materials ?? []).filter((m: string) => !matched.has(m)).slice(0, 2);
  }, [look.materials, matchedMaterials]);

  // Which palette colours belong to the selected colour family?
  const paletteMatchFlags: boolean[] = useMemo(
    () => (look.palette ?? []).map((hex: string) =>
      highlightColorFamily !== "all" && getColorFamily(hex) === highlightColorFamily
    ),
    [look.palette, highlightColorFamily]
  );

  const hasColorMatch = paletteMatchFlags.some(Boolean);

  return (
    <div
      onClick={() => onSelect(look)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surfaceDefault, borderRadius: 16, overflow: "hidden",
        cursor: "pointer",
        border: `1.5px solid ${hovered ? T.primaryDefault : hasColorMatch ? "rgba(235,89,95,0.3)" : T.surfaceVariant}`,
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.18s ease",
      }}
    >
      {/* ── Image ── */}
      <div style={{ width: "100%", paddingTop: "75%", position: "relative", overflow: "hidden" }}>
        {look.img ? (
          <img
            src={look.img}
            alt={look.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.3s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />
        )}

        {/* Style tag badge */}
        {look.tag && (
          <div
            style={{
              position: "absolute", top: 8, left: 8,
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
              borderRadius: 6, padding: "2px 8px",
              fontSize: 9, fontWeight: 700, color: T.onSurfaceSecondary,
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {look.tag}
          </div>
        )}

        {/* AI badge */}
        {isAiAnalyzed && (
          <div
            style={{
              position: "absolute", top: 8, right: 8,
              background: "linear-gradient(135deg,rgba(235,89,95,0.9),rgba(241,158,43,0.9))",
              backdropFilter: "blur(6px)",
              borderRadius: 6, padding: "2px 7px",
              fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 3,
            }}
          >
            <span>✨</span> AI
          </div>
        )}

        {/* Room badge */}
        <div
          style={{
            position: "absolute", bottom: 8, right: 8,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            borderRadius: 5, padding: "2px 7px",
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em",
          }}
        >
          {look.room}
        </div>

        {/* ── Palette dots strip ── */}
        {(look.palette ?? []).length > 0 && (
          <div
            style={{
              position: "absolute", bottom: 8, left: 8,
              display: "flex", gap: 3, alignItems: "center",
            }}
          >
            {(look.palette as string[]).slice(0, 5).map((hex: string, i: number) => {
              const isMatch = paletteMatchFlags[i];
              return (
                <div
                  key={i}
                  style={{
                    width: isMatch ? 13 : 10,
                    height: isMatch ? 13 : 10,
                    borderRadius: "50%",
                    background: hex,
                    border: isMatch
                      ? `2px solid #fff`
                      : "1.5px solid rgba(255,255,255,0.6)",
                    boxShadow: isMatch
                      ? `0 0 0 1.5px ${T.primaryDefault}, 0 2px 4px rgba(0,0,0,0.3)`
                      : "0 1px 3px rgba(0,0,0,0.25)",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 13, fontWeight: 600, color: T.onSurfaceDefault,
            marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {look.name}
        </div>
        <div style={{ fontSize: 10, color: T.onSurfaceSecondary, marginBottom: 6 }}>{look.items}</div>

        {/* Material chips */}
        {(matchedMaterials.length > 0 || unmatchedMaterials.length > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 7 }}>
            {matchedMaterials.map((mat: string, i: number) => (
              <span
                key={i}
                style={{
                  fontSize: 8, fontWeight: 700,
                  background: "linear-gradient(90deg,#FDEEEF,#FFF8E7)",
                  border: `1px solid ${T.primaryVariant}`, color: T.primaryHover,
                  borderRadius: 4, padding: "1px 5px",
                  fontFamily: "'Roboto',sans-serif", textTransform: "capitalize",
                  display: "flex", alignItems: "center", gap: 2,
                }}
              >
                ✓ {mat}
              </span>
            ))}
            {unmatchedMaterials.map((mat: string, i: number) => (
              <span
                key={`u${i}`}
                style={{
                  fontSize: 8, background: T.surfaceBg,
                  border: `1px solid ${T.onSurfaceBorder}`, color: T.onSurfaceDisabled,
                  borderRadius: 4, padding: "1px 5px",
                  fontFamily: "'Roboto',sans-serif", textTransform: "capitalize",
                }}
              >
                {mat}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.onSurfaceDefault }}>{look.price}</span>
          <span
            style={{
              fontSize: 10, fontWeight: 600, color: T.primaryDefault,
              background: T.primaryVariant, padding: "2px 8px", borderRadius: 6,
            }}
          >
            Explore →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SKELETON
════════════════════════════════════════ */
function SkeletonGrid({ cols }: { cols: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: cols === 3 ? 14 : 12 }}>
      {Array.from({ length: cols * 2 }).map((_, i) => (
        <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: T.surfaceDefault, border: `1.5px solid ${T.surfaceVariant}` }}>
          <div
            style={{
              paddingTop: "75%",
              background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
              backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
            }}
          />
          <div style={{ padding: "10px 12px 12px" }}>
            <div style={{ height: 12, width: "80%", borderRadius: 6, background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", marginBottom: 6 }} />
            <div style={{ height: 10, width: "50%", borderRadius: 6, background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════ */
function EmptyState({ query, colorName, onClear }: { query: string; colorName: string | null; onClear: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>
        {colorName ? "🎨" : "🔍"}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: T.onSurfaceDefault, marginBottom: 8 }}>
        {colorName && !query
          ? `No looks with ${colorName} tones yet`
          : `No results for "${query}"${colorName ? ` in ${colorName} tones` : ""}`}
      </div>
      <div style={{ fontSize: 13, color: T.onSurfaceSecondary, lineHeight: 1.6, marginBottom: 20 }}>
        {colorName
          ? "More looks will appear as Gemini analyses them. Try a different colour or clear the filter."
          : "Try room types like \"kitchen\" or materials like\n\"marble\", \"walnut\", \"rattan\", or \"velvet\""}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {["Marble kitchen", "Walnut bedroom", "Rattan boho", "Velvet living room"].map((s) => (
          <button
            key={s}
            onClick={onClear}
            style={{
              background: T.surfaceBg, border: `1px solid ${T.onSurfaceBorder}`,
              borderRadius: 20, padding: "6px 14px", fontSize: 12,
              cursor: "pointer", color: T.onSurfaceSecondary, fontFamily: "'Roboto',sans-serif",
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        onClick={onClear}
        style={{
          background: T.primaryDefault, color: "white", border: "none",
          borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "'Roboto',sans-serif",
        }}
      >
        {colorName && !query ? "Clear colour filter" : "Clear Search"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════
   SEARCH POPUP BODY
   Shows: recent searches · popular searches · search tips
   Filters (colour, materials, rooms) live in the gallery bar.
════════════════════════════════════════ */
function SearchSuggestionsBody({
  recentSearches, query, onSubmit, onClearRecent, onMatchLook,
}: {
  recentSearches: string[];
  query: string;
  onSubmit: (q: string) => void;
  onClearRecent: () => void;
  onMatchLook?: () => void;
}) {
  const sectionLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "var(--muted-foreground)",
    fontFamily: "var(--font-roboto)", marginBottom: 10,
  };

  return (
    <div style={{ paddingTop: 16 }}>

      {/* ── Match my Look banner ── */}
      {onMatchLook && (
        <button
          onClick={onMatchLook}
          style={{
            width: "100%", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14,
            background: "linear-gradient(110deg, #2C1810 0%, #3D1F1F 50%, #2C1810 100%)",
            border: "1px solid rgba(235,89,95,0.35)",
            borderRadius: "var(--radius)", padding: "14px 18px",
            cursor: "pointer", textAlign: "left",
            boxShadow: "0 4px 20px rgba(235,89,95,0.12)",
            transition: "all 0.2s ease",
            position: "relative", overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(235,89,95,0.22)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(235,89,95,0.65)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(235,89,95,0.12)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(235,89,95,0.35)";
          }}
        >
          {/* Subtle glow orb */}
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 80, height: 80, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(235,89,95,0.28) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Camera icon circle */}
          <div style={{
            flexShrink: 0,
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(235,89,95,0.18)",
            border: "1.5px solid rgba(235,89,95,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EB595F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#FFFFFF",
              fontFamily: "var(--font-gilroy)", marginBottom: 3,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              Match my Look
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                background: "rgba(235,89,95,0.9)", color: "#fff",
                borderRadius: 4, padding: "2px 6px", textTransform: "uppercase",
              }}>AI</span>
            </div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-roboto)", lineHeight: 1.45,
            }}>
              Upload a photo · Gemini finds your style
            </div>
          </div>
          {/* Arrow */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      )}

      {/* ── Recent Searches ── */}
      {recentSearches.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={sectionLabel}>Recent</span>
            <button
              onClick={onClearRecent}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: "var(--primary)", fontFamily: "var(--font-roboto)", fontWeight: 500,
              }}
            >Clear all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentSearches.map((r, i) => (
              <button
                key={i}
                onClick={() => onSubmit(r)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 8px", background: "none", border: "none",
                  borderBottom: i < recentSearches.length - 1 ? "1px solid var(--muted)" : "none",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  borderRadius: 8, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "var(--font-gilroy)", flex: 1 }}>{r}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M7 17 17 7M7 7h10v10"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Popular Searches ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={sectionLabel}>Popular Searches</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {POPULAR_SEARCHES.map((s) => (
            <button
              key={s.label}
              onClick={() => onSubmit(s.label)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "var(--background)", border: "1px solid var(--border)",
                borderRadius: "calc(var(--radius) + 8px)", padding: "7px 14px",
                fontSize: 13, cursor: "pointer", color: "var(--foreground)",
                fontFamily: "var(--font-roboto)", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = T.primaryVariant;
                el.style.borderColor = T.primaryDefault;
                el.style.color = T.primaryHover;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "var(--background)";
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--foreground)";
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ fontSize: 12 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Tips ── */}
      <div
        style={{
          background: "var(--background)", borderRadius: "var(--radius)",
          padding: "16px 18px", border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 11, fontWeight: 700, color: "var(--primary)",
            marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-roboto)", letterSpacing: "0.04em", textTransform: "uppercase",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Search Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "🏠", tip: "Use room types — \"kitchen\", \"bedroom\", \"balcony\"" },
            { icon: "🪵", tip: "Try materials — \"marble\", \"rattan\", \"velvet\", \"travertine\"" },
            { icon: "🎨", tip: "Name a style — \"japandi\", \"coastal\", \"minimal\", \"boho\"" },
            { icon: "✨", tip: "Combine them — \"grey kitchen\" or \"warm walnut bedroom\"" },
            { icon: "🎯", tip: "Use colour filters above the looks for palette-based browsing" },
          ].map(({ icon, tip }, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 12, color: "var(--muted-foreground)",
                fontFamily: "var(--font-roboto)", lineHeight: 1.55,
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}