import React from "react";

/**
 * Nest Design System — Tag Component
 * Figma: node 1057-127 in Nest Components
 *
 * Variants:  filled | tinted | outlined
 * Colors:    primary | secondary | success | warning | error | neutral
 * Sizes:     xs | sm | md
 */

export type TagVariant = "filled" | "tinted" | "outlined";
export type TagColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";
export type TagSize = "xs" | "sm" | "md";

interface TagProps {
  label: string;
  variant?: TagVariant;
  color?: TagColor;
  size?: TagSize;
  /** Optional leading dot indicator */
  dot?: boolean;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/* ── Token maps ──────────────────────────────────────────────────────────── */

const BG_FILLED: Record<TagColor, string> = {
  primary:   "var(--color-primary)",
  secondary: "var(--color-secondary)",
  success:   "#469E59",
  warning:   "#F19E2B",
  error:     "#DB382A",
  neutral:   "#1A1A1A",
};

const TEXT_FILLED: Record<TagColor, string> = {
  primary:   "var(--color-primary-foreground)",
  secondary: "var(--color-secondary-foreground)",
  success:   "#FFFFFF",
  warning:   "#FFFFFF",
  error:     "#FFFFFF",
  neutral:   "#FFFFFF",
};

const BG_TINTED: Record<TagColor, string> = {
  primary:   "#FDEEEF",   // primaryVariant
  secondary: "#EFECEF",   // secondaryVariant
  success:   "#CEE4DA",   // extendedGreen
  warning:   "#FFEBC2",   // extendedMustard
  error:     "#FDE8E6",
  neutral:   "#F2F2F2",   // surfaceBg
};

const TEXT_TINTED: Record<TagColor, string> = {
  primary:   "#BC474C",   // primaryHover
  secondary: "#5E455A",   // secondaryDefault
  success:   "#2D6B3A",
  warning:   "#A86B00",
  error:     "#9B1B10",
  neutral:   "#1A1A1A",
};

const BORDER_OUTLINED: Record<TagColor, string> = {
  primary:   "var(--color-primary)",
  secondary: "var(--color-secondary)",
  success:   "#469E59",
  warning:   "#F19E2B",
  error:     "#DB382A",
  neutral:   "#CCCCCC",
};

const TEXT_OUTLINED: Record<TagColor, string> = {
  primary:   "var(--color-primary)",
  secondary: "var(--color-secondary)",
  success:   "#469E59",
  warning:   "#A86B00",
  error:     "#DB382A",
  neutral:   "#666666",
};

const DOT_COLOR: Record<TagColor, string> = {
  primary:   "#BC474C",
  secondary: "#5E455A",
  success:   "#469E59",
  warning:   "#F19E2B",
  error:     "#DB382A",
  neutral:   "#999999",
};

/* ── Size specs ──────────────────────────────────────────────────────────── */

const SIZE: Record<TagSize, { padding: string; fontSize: string; gap: number; dotSize: number; lineHeight: string }> = {
  xs: { padding: "2px 8px",  fontSize: "10px", gap: 4, dotSize: 5,  lineHeight: "16px" },
  sm: { padding: "4px 10px", fontSize: "12px", gap: 5, dotSize: 6,  lineHeight: "18px" },
  md: { padding: "6px 12px", fontSize: "13px", gap: 6, dotSize: 7,  lineHeight: "20px" },
};

/* ── Component ───────────────────────────────────────────────────────────── */

export function Tag({
  label,
  variant = "tinted",
  color = "primary",
  size = "sm",
  dot = false,
  icon,
  style,
  className,
}: TagProps) {
  const sz = SIZE[size];

  /* Resolve background, text and border for each variant */
  let bg = "transparent";
  let textColor = "inherit";
  let border = "1.5px solid transparent";

  if (variant === "filled") {
    bg        = BG_FILLED[color];
    textColor = TEXT_FILLED[color];
  } else if (variant === "tinted") {
    bg        = BG_TINTED[color];
    textColor = TEXT_TINTED[color];
  } else {
    /* outlined */
    bg        = "transparent";
    textColor = TEXT_OUTLINED[color];
    border    = `1.5px solid ${BORDER_OUTLINED[color]}`;
  }

  const rootStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: sz.gap,
    padding: sz.padding,
    borderRadius: 100,           // full pill — Nest DS convention
    border,
    background: bg,
    color: textColor,
    fontFamily: "var(--font-gilroy)",   // Poppins via --font-gilroy
    fontSize: sz.fontSize,
    fontWeight: 600,
    lineHeight: sz.lineHeight,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    userSelect: "none",
    ...style,
  };

  const dotStyle: React.CSSProperties = {
    width: sz.dotSize,
    height: sz.dotSize,
    borderRadius: "50%",
    background: variant === "filled" ? "rgba(255,255,255,0.7)" : DOT_COLOR[color],
    flexShrink: 0,
  };

  return (
    <span style={rootStyle} className={className}>
      {dot && <span style={dotStyle} />}
      {icon && <span style={{ display: "flex", alignItems: "center", fontSize: "0.9em" }}>{icon}</span>}
      {label}
    </span>
  );
}
