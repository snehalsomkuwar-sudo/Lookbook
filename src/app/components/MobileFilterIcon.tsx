import React, { useState, useEffect } from "react";
import type { PaletteSwatch } from "../utils/colorUtils";

/* ════════════════════════════════════════
   MOBILE FILTER ICON + BOTTOM SHEET
   Replaces the horizontally-scrolling GalleryFilterBar on mobile.

   • Filter icon button with active-count badge in the header row.
   • Clicking opens a bottom sheet with colour swatches, material chips,
     style-tag chips and a "Clear all" row.
   • Active-filter pills are shown inside the sheet header so the user
     always knows what's applied.
   • All colours/typography use CSS variables from theme.css / global.css.
════════════════════════════════════════ */

export interface MobileFilterIconProps {
  searchQuery: string;
  onClearSearch: () => void;

  colorFamily: string;
  onColorFamily: (f: string) => void;

  material: string;
  onMaterial: (m: string) => void;

  paletteSwatches: PaletteSwatch[];
  topMaterials: string[];

  styleTags?: string[];
  styleTag?: string;
  onStyleTag?: (t: string) => void;

  /** New: Price range filter [min, max] */
  priceRange?: [number, number];
  onPriceRange?: (range: [number, number]) => void;

  /** New: Multiple color selection */
  selectedColors?: string[];
  onSelectedColors?: (colors: string[]) => void;

  /** New: Multiple theme selection */
  selectedThemes?: string[];
  onSelectedThemes?: (themes: string[]) => void;

  /** New: predefined style options */
  styleOptions?: string[];

  /** New: Color scheme filter */
  colorScheme?: string[];
  onColorScheme?: (v: string[]) => void;

  /** New: Layout filter */
  layout?: string[];
  onLayout?: (v: string[]) => void;

  /** New: Budget tier */
  budgetTier?: string;
  onBudgetTier?: (label: string) => void;
  budgetTiers?: { label: string; range: [number, number] }[];

  onClearAll: () => void;
}

/* ── helpers ──────────────────────────────────────────────────── */
function ActivePill({
  label,
  colorDot,
  onClear,
}: {
  label: string;
  colorDot?: string;
  onClear: () => void;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "var(--primary)",
        borderRadius: 99,
        padding: "2px 7px 2px 6px",
        flexShrink: 0,
      }}
    >
      {colorDot && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: colorDot,
            border: "1px solid rgba(255,255,255,0.4)",
            display: "inline-block",
          }}
        />
      )}
      <span
        style={{
          fontSize: 10,
          fontFamily: "var(--font-roboto)",
          fontWeight: 600,
          color: "var(--primary-foreground)",
          maxWidth: 80,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <button
        onClick={onClear}
        style={{
          background: "rgba(255,255,255,0.28)",
          border: "none",
          cursor: "pointer",
          width: 13,
          height: 13,
          borderRadius: "50%",
          flexShrink: 0,
          fontSize: 9,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-foreground)",
          padding: 0,
          lineHeight: 1,
        }}
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}

function SwatchBtn({
  swatch,
  selected,
  onClick,
  multiSelect = false,
}: {
  swatch: PaletteSwatch;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={`${swatch.displayName} · ${swatch.count} look${swatch.count !== 1 ? "s" : ""}`}
      style={{
        width: selected ? 30 : 26,
        height: selected ? 30 : 26,
        borderRadius: "50%",
        background: swatch.hex,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
        outline: "none",
        boxShadow: selected
          ? "0 0 0 2.5px var(--background), 0 0 0 4.5px var(--primary)"
          : "0 0 0 1.5px var(--border)",
        transition: "all 0.15s",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-pressed={selected}
      aria-label={`Filter by ${swatch.displayName}`}
    >
      {selected && multiSelect && (
        <span style={{ 
          fontSize: 12, 
          color: "white", 
          textShadow: "0 0 2px rgba(0,0,0,0.5)",
          lineHeight: 1,
        }}>
          ✓
        </span>
      )}
    </button>
  );
}

/* Representative colors for each Color Scheme option */
const COLOR_SCHEME_SWATCHES: Record<string, string> = {
  "White/Neutral":  "#F2EFE8",
  "Dark/Moody":     "#2C2C2C",
  "Wood Tones":     "#8B5E3C",
  "Earthy/Warm":    "#C4834A",
  "Cool Tones":     "#7BA7C4",
  "Bold/Colorful":  "conic-gradient(#E74C3C, #F39C12, #2ECC71, #3498DB, #9B59B6, #E74C3C)",
  "Black & White":  "linear-gradient(to right, #1A1A1A 50%, #F0EFE9 50%)",
  "Two-Tone":       "linear-gradient(to right, #B5A89A 50%, #6B8E8E 50%)",
};

function Chip({
  label,
  selected,
  onClick,
  accent,
  swatchColor,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  accent?: boolean;
  swatchColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: swatchColor ? "0 12px 0 8px" : "0 12px",
        height: 30,
        borderRadius: 99,
        border: `1.5px solid ${
          selected ? (accent ? "var(--accent)" : "var(--primary)") : "var(--border)"
        }`,
        background: selected
          ? accent
            ? "var(--accent)"
            : "var(--primary)"
          : "transparent",
        color: selected ? "var(--primary-foreground)" : "var(--foreground)",
        fontSize: 12,
        fontFamily: "var(--font-roboto)",
        fontWeight: selected ? 600 : 400,
        cursor: "pointer",
        textTransform: "capitalize" as const,
        whiteSpace: "nowrap",
        outline: "none",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      aria-pressed={selected}
    >
      {swatchColor && (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: swatchColor,
            flexShrink: 0,
            border: selected
              ? "1.5px solid rgba(255,255,255,0.5)"
              : "1.5px solid var(--border)",
            display: "inline-block",
          }}
        />
      )}
      {label}
    </button>
  );
}

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export function MobileFilterIcon({
  searchQuery,
  onClearSearch,
  colorFamily,
  onColorFamily,
  material,
  onMaterial,
  paletteSwatches,
  topMaterials,
  styleTags = [],
  styleTag = "",
  onStyleTag,
  priceRange = [0, 10000000],
  onPriceRange,
  selectedColors = [],
  onSelectedColors,
  selectedThemes = [],
  onSelectedThemes,
  styleOptions = [],
  colorScheme = [],
  onColorScheme,
  layout = [],
  onLayout,
  budgetTier = "",
  onBudgetTier,
  budgetTiers = [],
  onClearAll,
}: MobileFilterIconProps) {
  const [open, setOpen] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);

  const hasSearch    = searchQuery.trim().length > 0;
  const hasColor     = colorFamily !== "all";
  const hasMaterial  = material.trim().length > 0;
  const hasStyleTag  = styleTag.trim().length > 0;
  const hasPriceFilter = priceRange[0] > 0 || priceRange[1] < 10000000;
  const hasMultiColor = selectedColors.length > 0;
  const hasThemes = selectedThemes.length > 0;
  const hasColorScheme = colorScheme.length > 0;
  const hasLayout = layout.length > 0;
  const hasBudgetTier = budgetTier.length > 0;
  // Don't double-count: budget tier chip already represents the price range
  const activeCount  = [hasSearch, hasColor, hasMaterial, hasStyleTag, hasBudgetTier ? false : hasPriceFilter, hasMultiColor, hasThemes, hasColorScheme, hasLayout, hasBudgetTier].filter(Boolean).length;
  const hasActive    = activeCount > 0;

  const hasGeminiData = paletteSwatches.length > 0 || topMaterials.length > 0;
  const showStyleTags = styleTags.length > 0 && !hasGeminiData;
  const selectedSwatch = paletteSwatches.find((s) => s.family === colorFamily) ?? null;

  /* Close sheet on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* Prevent body scroll while sheet is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Filter icon button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open filters"
        style={{
          flexShrink: 0,
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: 30,
          padding: "0 10px",
          border: `1.5px solid ${hasActive ? "var(--primary)" : "var(--border)"}`,
          borderRadius: 99,
          background: hasActive ? "var(--primary)" : "transparent",
          cursor: "pointer",
          outline: "none",
          position: "relative",
          transition: "all 0.15s",
        }}
      >
        {/* Funnel / filter icon */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hasActive ? "var(--primary-foreground)" : "var(--foreground)"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>

        {/* Active-count badge */}
        {hasActive && (
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-roboto)",
              fontWeight: 700,
              color: "var(--primary-foreground)",
              lineHeight: 1,
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── Bottom sheet ── */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1101,
          background: "var(--background)",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
          padding: "0 0 env(safe-area-inset-bottom,0px)",
          /* Slide up when open, hidden below viewport when closed */
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
          willChange: "transform",
          maxHeight: "82dvh",
          display: "flex",
          flexDirection: "column",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Filter options"
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "var(--border)" }} />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px 10px",
            flexShrink: 0,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-gilroy)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Filter looks
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasActive && (
              <button
                onClick={() => { onClearAll(); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 500,
                  color: "var(--muted-foreground)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--border)",
                  textUnderlineOffset: 2,
                  padding: "2px 4px",
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--muted)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--muted-foreground)",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "16px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Active filters row */}
          {hasActive && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Active filters
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {hasSearch && (
                  <ActivePill
                    label={`"${searchQuery.length > 20 ? searchQuery.slice(0, 18) + "…" : searchQuery}"`}
                    onClear={onClearSearch}
                  />
                )}
                {hasColor && selectedSwatch && (
                  <ActivePill
                    label={selectedSwatch.displayName}
                    colorDot={selectedSwatch.hex}
                    onClear={() => onColorFamily("all")}
                  />
                )}
                {hasMaterial && (
                  <ActivePill label={material} onClear={() => onMaterial("")} />
                )}
                {hasStyleTag && (
                  <ActivePill label={styleTag} onClear={() => onStyleTag?.("")} />
                )}
                {selectedColors.map((color) => {
                  const swatch = paletteSwatches.find((s) => s.family === color);
                  return swatch ? (
                    <ActivePill
                      key={color}
                      label={swatch.displayName}
                      colorDot={swatch.hex}
                      onClear={() => onSelectedColors?.(selectedColors.filter((c) => c !== color))}
                    />
                  ) : null;
                })}
                {selectedThemes.map((theme) => (
                  <ActivePill
                    key={theme}
                    label={theme}
                    onClear={() => onSelectedThemes?.(selectedThemes.filter((t) => t !== theme))}
                  />
                ))}
                {hasBudgetTier && (
                  <ActivePill
                    label={budgetTier}
                    onClear={() => onBudgetTier?.(budgetTier)}
                  />
                )}
                {colorScheme.map((s) => (
                  <ActivePill
                    key={s}
                    label={s}
                    onClear={() => onColorScheme?.(colorScheme.filter((c) => c !== s))}
                  />
                ))}
                {layout.map((l) => (
                  <ActivePill
                    key={l}
                    label={l}
                    onClear={() => onLayout?.(layout.filter((x) => x !== l))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Budget Range */}
          {budgetTiers.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>
                Budget Range
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {budgetTiers.map((tier) => (
                  <Chip
                    key={tier.label}
                    label={tier.label}
                    selected={budgetTier === tier.label}
                    onClick={() => onBudgetTier?.(tier.label)}
                    accent
                  />
                ))}
              </div>
            </div>
          )}

          {/* Colour swatches (now with multi-select support) */}
          {paletteSwatches.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Colour palette {onSelectedColors && <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span>}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                {paletteSwatches.map((s) => {
                  const isMultiSelected = selectedColors.includes(s.family);
                  const isSingleSelected = colorFamily === s.family;
                  return (
                    <SwatchBtn
                      key={s.family}
                      swatch={s}
                      selected={isMultiSelected || isSingleSelected}
                      multiSelect={onSelectedColors !== undefined}
                      onClick={() => {
                        // If multi-select is enabled, toggle in the array
                        if (onSelectedColors) {
                          if (isMultiSelected) {
                            onSelectedColors(selectedColors.filter((c) => c !== s.family));
                          } else {
                            onSelectedColors([...selectedColors, s.family]);
                          }
                        } else {
                          // Legacy single-select behavior
                          onColorFamily(isSingleSelected ? "all" : s.family);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Material chips */}
          {topMaterials.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Material
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {topMaterials.slice(0, 8).map((mat) => (
                  <Chip
                    key={mat}
                    label={mat}
                    selected={material === mat}
                    onClick={() => onMaterial(material === mat ? "" : mat)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Style & Aesthetic */}
          {styleOptions.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>
                Style & Aesthetic <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {styleOptions.map((tag) => {
                  const isSelected = selectedThemes.includes(tag);
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      selected={isSelected}
                      onClick={() => {
                        if (onSelectedThemes) {
                          onSelectedThemes(isSelected ? selectedThemes.filter(t => t !== tag) : [...selectedThemes, tag]);
                        }
                      }}
                      accent
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Scheme */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>
              Color Scheme <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {(["White/Neutral","Dark/Moody","Wood Tones","Earthy/Warm","Cool Tones","Bold/Colorful","Black & White","Two-Tone"] as const).map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={colorScheme.includes(s)}
                  onClick={() => onColorScheme?.(colorScheme.includes(s) ? colorScheme.filter(c => c !== s) : [...colorScheme, s])}
                  accent
                  swatchColor={COLOR_SCHEME_SWATCHES[s]}
                />
              ))}
            </div>
          </div>

          {/* Layout */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>
              Layout <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["L-Shaped","U-Shaped","Galley","Island","Peninsula","Open-Plan","One-Wall","Parallel"].map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={layout.includes(l)}
                  onClick={() => onLayout?.(layout.includes(l) ? layout.filter(x => x !== l) : [...layout, l])}
                  accent
                />
              ))}
            </div>
          </div>

          {/* Empty state */}
          {!hasGeminiData && !showStyleTags && !hasActive && (
            <p
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: 12,
                color: "var(--muted-foreground)",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              No filters available yet — results load after your moodboard is ready.
            </p>
          )}
        </div>

        {/* Apply / Done button */}
        <div
          style={{
            flexShrink: 0,
            padding: "12px 20px 16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              width: "100%",
              height: 44,
              borderRadius: "var(--radius-lg)",
              background: "var(--primary)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-gilroy)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--primary-foreground)",
              letterSpacing: "0.01em",
            }}
          >
            {hasActive ? `Show ${activeCount} active filter${activeCount > 1 ? "s" : ""}` : "Done"}
          </button>
        </div>
      </div>
    </>
  );
}