import React, { useState } from "react";
import type { PaletteSwatch } from "../utils/colorUtils";

/* ════════════════════════════════════════
   GALLERY FILTER BAR
   Sits INLINE inside a flex row: [title] [←this scrolls→] [count]

   Chip priority order:
   1. Active filter badges (search query, colour, material, style tag)
   2. Divider
   3. Colour swatches  (Gemini-derived — shown when mbData has loaded)
   4. Material chips   (Gemini-derived — shown when mbData has loaded)
   5. Style-tag chips  (derived from look.tag — ALWAYS available, shown
                        when no Gemini swatches/materials exist yet)

   This means filters are visible immediately for the browse flow even
   before Gemini data arrives.

   All colours use CSS variables from theme.css / global.css.
════════════════════════════════════════ */

export interface GalleryFilterBarProps {
  searchQuery: string;
  onClearSearch: () => void;

  colorFamily: string;
  onColorFamily: (f: string) => void;

  material: string;
  onMaterial: (m: string) => void;

  /** Gemini-derived palette swatches (empty until Gemini load) */
  paletteSwatches: PaletteSwatch[];

  /** Gemini-derived material strings (empty until Gemini load) */
  topMaterials: string[];

  /** Style-tag chips from look.tag — always available without Gemini */
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

  styleOptions?: string[];
  colorScheme?: string[];
  onColorScheme?: (v: string[]) => void;
  layout?: string[];
  onLayout?: (v: string[]) => void;
  budgetTier?: string;
  onBudgetTier?: (label: string) => void;
  budgetTiers?: { label: string; range: [number, number] }[];

  onClearAll: () => void;
  isDesktop?: boolean;
}

/* ── Active-filter badge (closeable pill) ──────────────────── */
function ActiveBadge({
  label,
  colorDot,
  icon,
  onClear,
}: {
  label: string;
  colorDot?: string;
  icon?: string;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexShrink: 0,
        background: "var(--primary)",
        borderRadius: 99,
        padding: "3px 8px 3px 7px",
        height: 24,
      }}
    >
      {colorDot && (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: colorDot,
            border: "1.5px solid rgba(255,255,255,0.45)",
            flexShrink: 0,
          }}
        />
      )}
      {icon && !colorDot && (
        <span style={{ fontSize: 10, lineHeight: 1 }}>{icon}</span>
      )}
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-roboto)",
          fontWeight: 600,
          color: "var(--primary-foreground)",
          maxWidth: 90,
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
          width: 14,
          height: 14,
          borderRadius: "50%",
          flexShrink: 0,
          fontSize: 9,
          display: "flex",
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
    </div>
  );
}

/* ── Colour swatch dot (supports multi-select) ─────────────────────────────────────── */
function SwatchDot({
  swatch,
  isSelected,
  onClick,
  multiSelect = false,
}: {
  swatch: PaletteSwatch;
  isSelected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${swatch.displayName} · ${swatch.count} look${swatch.count !== 1 ? "s" : ""}`}
      style={{
        flexShrink: 0,
        width: isSelected ? 22 : 18,
        height: isSelected ? 22 : 18,
        borderRadius: "50%",
        background: swatch.hex,
        border: "none",
        cursor: "pointer",
        padding: 0,
        boxShadow: isSelected
          ? "0 0 0 2px var(--card), 0 0 0 4px var(--primary)"
          : hovered
          ? "0 0 0 2px var(--card), 0 0 0 3.5px var(--border)"
          : "0 0 0 1.5px var(--border)",
        transition: "all 0.15s",
        outline: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={`Filter by ${swatch.displayName}`}
      aria-pressed={isSelected}
    >
      {isSelected && multiSelect && (
        <span style={{ 
          fontSize: 10, 
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

/* ── Generic pill chip (materials + style tags) ─────────────── */
function PillChip({
  label,
  isSelected,
  onClick,
  accent,
  swatchColor,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  accent?: boolean;     // style-tag chips use accent colour ring when selected
  swatchColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        padding: swatchColor ? "0 10px 0 6px" : "0 10px",
        borderRadius: 99,
        border: `1.5px solid ${
          isSelected
            ? accent
              ? "var(--accent)"
              : "var(--primary)"
            : "var(--border)"
        }`,
        background: isSelected
          ? accent
            ? "var(--accent)"
            : "var(--primary)"
          : hovered
          ? "var(--muted)"
          : "transparent",
        color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
        fontSize: 11,
        fontFamily: "var(--font-roboto)",
        fontWeight: isSelected ? 600 : 400,
        cursor: "pointer",
        textTransform: "capitalize" as const,
        transition: "all 0.15s",
        outline: "none",
        height: 24,
        display: "flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
      aria-pressed={isSelected}
    >
      {swatchColor && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: swatchColor,
            flexShrink: 0,
            border: isSelected
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

/* ── Thin vertical divider ──────────────────────────────────── */
function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 14,
        background: "var(--border)",
        flexShrink: 0,
        alignSelf: "center",
        opacity: 0.6,
      }}
    />
  );
}

/* ── Price range filter button (opens dropdown) ──────────────── */
function PriceRangeButton({
  priceRange,
  onPriceRange,
  isActive,
}: {
  priceRange: [number, number];
  onPriceRange: (range: [number, number]) => void;
  isActive: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempRange, setTempRange] = useState(priceRange);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K`;
    return `₹${price}`;
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          flexShrink: 0,
          padding: "0 10px",
          borderRadius: 99,
          border: `1.5px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
          background: isActive ? "var(--primary)" : showDropdown ? "var(--muted)" : "transparent",
          color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
          fontSize: 11,
          fontFamily: "var(--font-roboto)",
          fontWeight: isActive ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.15s",
          outline: "none",
          height: 24,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          gap: 4,
        }}
      >
        💰 {isActive ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}` : "Price"}
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 1000,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 16,
            minWidth: 280,
            boxShadow: "var(--elevation-sm)",
          }}
        >
          <div style={{ marginBottom: 12, fontFamily: "var(--font-roboto)", fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>
            Price Range
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="number"
              value={tempRange[0]}
              onChange={(e) => setTempRange([parseInt(e.target.value) || 0, tempRange[1]])}
              placeholder="Min"
              style={{
                flex: 1,
                padding: "6px 8px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: 11,
                fontFamily: "var(--font-roboto)",
                background: "var(--input-background)",
                color: "var(--foreground)",
              }}
            />
            <input
              type="number"
              value={tempRange[1]}
              onChange={(e) => setTempRange([tempRange[0], parseInt(e.target.value) || 10000000])}
              placeholder="Max"
              style={{
                flex: 1,
                padding: "6px 8px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: 11,
                fontFamily: "var(--font-roboto)",
                background: "var(--input-background)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setTempRange([0, 10000000]);
                onPriceRange([0, 10000000]);
                setShowDropdown(false);
              }}
              style={{
                padding: "6px 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "transparent",
                color: "var(--foreground)",
                fontSize: 11,
                fontFamily: "var(--font-roboto)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={() => {
                onPriceRange(tempRange);
                setShowDropdown(false);
              }}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "var(--radius)",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export function GalleryFilterBar({
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
  isDesktop,
}: GalleryFilterBarProps) {
  const hasSearch       = searchQuery.trim().length > 0;
  const hasColor        = colorFamily !== "all";
  const hasMaterial     = material.trim().length > 0;
  const hasStyleTag     = styleTag.trim().length > 0;
  const hasPriceFilter  = priceRange[0] > 0 || priceRange[1] < 10000000;
  const hasMultiColor   = selectedColors.length > 0;
  const hasThemes       = selectedThemes.length > 0;
  const hasColorScheme  = colorScheme.length > 0;
  const hasLayout       = layout.length > 0;
  const hasBudgetTier   = budgetTier.length > 0;
  const hasActiveFilters = hasSearch || hasColor || hasMaterial || hasStyleTag || hasPriceFilter || hasMultiColor || hasThemes || hasColorScheme || hasLayout || hasBudgetTier;

  const selectedSwatch = paletteSwatches.find((s) => s.family === colorFamily) ?? null;

  /* Which chip groups to show */
  const hasGeminiData  = paletteSwatches.length > 0 || topMaterials.length > 0;
  /* Show style-tag fallback chips when Gemini data hasn't loaded yet */
  const showStyleTags  = styleTags.length > 0 && !hasGeminiData;

  /* If truly nothing to show — no chips, no active filter badges — render
     just an empty flex spacer so the row layout stays intact */
  const hasAnything = hasActiveFilters || hasGeminiData || showStyleTags;

  return (
    <div
      className="lbk-filter-bar"
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 6,
        overflowX: "auto",
        overflowY: "visible",
        /* Fade-out right-edge hint — only when there's content */
        maskImage: hasAnything
          ? "linear-gradient(to right, black calc(100% - 24px), transparent 100%)"
          : undefined,
        WebkitMaskImage: hasAnything
          ? "linear-gradient(to right, black calc(100% - 24px), transparent 100%)"
          : undefined,
        paddingLeft: isDesktop ? 12 : 8,
        paddingRight: hasAnything ? 28 : 0,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      {/* ── Active filter badges (always first) ── */}

      {hasSearch && (
        <ActiveBadge
          label={`"${searchQuery.length > 18 ? searchQuery.slice(0, 16) + "…" : searchQuery}"`}
          icon="🔍"
          onClear={onClearSearch}
        />
      )}

      {hasColor && selectedSwatch && (
        <ActiveBadge
          label={selectedSwatch.displayName}
          colorDot={selectedSwatch.hex}
          onClear={() => onColorFamily("all")}
        />
      )}

      {hasMaterial && (
        <ActiveBadge
          label={material}
          icon="◈"
          onClear={() => onMaterial("")}
        />
      )}

      {hasStyleTag && (
        <ActiveBadge
          label={styleTag}
          icon="✦"
          onClear={() => onStyleTag?.("")}
        />
      )}

      {/* Active badges for multi-color selection */}
      {selectedColors.map((color) => {
        const swatch = paletteSwatches.find((s) => s.family === color);
        return swatch ? (
          <ActiveBadge
            key={color}
            label={swatch.displayName}
            colorDot={swatch.hex}
            onClear={() => onSelectedColors?.(selectedColors.filter((c) => c !== color))}
          />
        ) : null;
      })}

      {/* Active badges for multi-theme selection */}
      {selectedThemes.map((theme) => (
        <ActiveBadge
          key={theme}
          label={theme}
          icon="✦"
          onClear={() => onSelectedThemes?.(selectedThemes.filter((t) => t !== theme))}
        />
      ))}

      {/* Active badges for budget tier */}
      {hasBudgetTier && (
        <ActiveBadge label={budgetTier} icon="💰" onClear={() => onBudgetTier?.(budgetTier)} />
      )}

      {/* Active badges for color scheme */}
      {colorScheme.map((s) => (
        <ActiveBadge key={s} label={s} icon="🎨" onClear={() => onColorScheme?.(colorScheme.filter(c => c !== s))} />
      ))}

      {/* Active badges for layout */}
      {layout.map((l) => (
        <ActiveBadge key={l} label={l} icon="📐" onClear={() => onLayout?.(layout.filter(x => x !== l))} />
      ))}

      {/* Divider between active badges and filter options */}
      {hasActiveFilters && (hasGeminiData || showStyleTags || budgetTiers.length > 0 || styleOptions.length > 0) && <Divider />}

      {/* ── Budget tier chips ── */}
      {budgetTiers.length > 0 && (
        <>
          {budgetTiers.map((tier) => (
            <PillChip
              key={tier.label}
              label={tier.label}
              isSelected={budgetTier === tier.label}
              onClick={() => onBudgetTier?.(tier.label)}
              accent
            />
          ))}
          <Divider />
        </>
      )}

      {/* ── Style & Aesthetic chips ── */}
      {styleOptions.length > 0 && (
        <>
          {styleOptions.map((tag) => (
            <PillChip
              key={tag}
              label={tag}
              isSelected={selectedThemes.includes(tag)}
              onClick={() => onSelectedThemes?.(selectedThemes.includes(tag) ? selectedThemes.filter(t => t !== tag) : [...selectedThemes, tag])}
              accent
            />
          ))}
          <Divider />
        </>
      )}

      {/* ── Color Scheme chips ── */}
      {(["White/Neutral","Dark/Moody","Wood Tones","Earthy/Warm","Cool Tones","Bold/Colorful","Black & White","Two-Tone"] as const).map((s) => (
        <PillChip
          key={s}
          label={s}
          isSelected={colorScheme.includes(s)}
          onClick={() => onColorScheme?.(colorScheme.includes(s) ? colorScheme.filter(c => c !== s) : [...colorScheme, s])}
          accent
          swatchColor={COLOR_SCHEME_SWATCHES[s]}
        />
      ))}

      <Divider />

      {/* ── Layout chips ── */}
      {["L-Shaped","U-Shaped","Galley","Island","Peninsula","Open-Plan","One-Wall","Parallel"].map((l) => (
        <PillChip
          key={l}
          label={l}
          isSelected={layout.includes(l)}
          onClick={() => onLayout?.(layout.includes(l) ? layout.filter(x => x !== l) : [...layout, l])}
          accent
        />
      ))}

      {/* Divider before Gemini swatches */}
      {paletteSwatches.length > 0 && <Divider />}

      {/* ── Gemini: Colour swatches (now with multi-select support) ── */}
      {paletteSwatches.map((swatch) => {
        const isMultiSelected = selectedColors.includes(swatch.family);
        const isSingleSelected = colorFamily === swatch.family;
        return (
          <SwatchDot
            key={swatch.family}
            swatch={swatch}
            isSelected={isMultiSelected || isSingleSelected}
            multiSelect={onSelectedColors !== undefined}
            onClick={() => {
              // If multi-select is enabled, toggle in the array
              if (onSelectedColors) {
                if (isMultiSelected) {
                  onSelectedColors(selectedColors.filter((c) => c !== swatch.family));
                } else {
                  onSelectedColors([...selectedColors, swatch.family]);
                }
              } else {
                // Legacy single-select behavior
                onColorFamily(isSingleSelected ? "all" : swatch.family);
              }
            }}
          />
        );
      })}

      {/* Divider between swatches and material chips */}
      {paletteSwatches.length > 0 && topMaterials.length > 0 && <Divider />}

      {/* ── Gemini: Material chips ── */}
      {topMaterials.slice(0, 6).map((mat) => (
        <PillChip
          key={mat}
          label={mat}
          isSelected={material === mat}
          onClick={() => onMaterial(material === mat ? "" : mat)}
        />
      ))}

      {/* ── Style-tag / Theme chips (multi-select when enabled) ── */}
      {(showStyleTags || hasGeminiData) && styleTags.length > 0 && (
        <>
          {/* Show divider before themes if there are materials or colors */}
          {(paletteSwatches.length > 0 || topMaterials.length > 0) && <Divider />}
          
          {styleTags.map((tag) => {
            const isMultiSelected = selectedThemes.includes(tag);
            const isSingleSelected = styleTag === tag;
            return (
              <PillChip
                key={tag}
                label={tag}
                isSelected={isMultiSelected || isSingleSelected}
                onClick={() => {
                  // If multi-select is enabled, toggle in the array
                  if (onSelectedThemes) {
                    if (isMultiSelected) {
                      onSelectedThemes(selectedThemes.filter((t) => t !== tag));
                    } else {
                      onSelectedThemes([...selectedThemes, tag]);
                    }
                  } else {
                    // Legacy single-select behavior
                    onStyleTag?.(isSingleSelected ? "" : tag);
                  }
                }}
                accent
              />
            );
          })}
        </>
      )}

      {/* ── Clear all (when something is active) ── */}
      {hasActiveFilters && (
        <>
          <Divider />
          <button
            onClick={onClearAll}
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "var(--font-roboto)",
              fontWeight: 500,
              color: "var(--muted-foreground)",
              padding: "2px 4px",
              whiteSpace: "nowrap",
              textDecoration: "underline",
              textDecorationColor: "var(--border)",
              textUnderlineOffset: 2,
            }}
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
