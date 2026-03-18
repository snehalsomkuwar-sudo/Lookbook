# Coordinate Quick Reference Card

## Visual Coordinate Map

```
┌─────────────────────────────────────────────────┐
│ top: 0%                                         │ ← Top edge
│                                                 │
│  left: 0%                         right: 0%     │
│  ↓                                ↓             │
│  TL────────────TC────────────TR                │
│  │                              │               │
│  │                              │               │
│  │                              │               │
│  ML            CENTER           MR              │
│  │                              │               │
│  │                              │               │
│  │                              │               │
│  BL────────────BC────────────BR                │
│  ↑                              ↑               │
│  left: 0%                       right: 0%       │
│  bottom: 0%                     bottom: 0%      │
│                                                 │
│ bottom: 0%                                      │ ← Bottom edge
└─────────────────────────────────────────────────┘

TL = Top-Left       TC = Top-Center      TR = Top-Right
ML = Middle-Left    CENTER              MR = Middle-Right
BL = Bottom-Left    BC = Bottom-Center  BR = Bottom-Right
```

## Common Position Templates

### Top-Left Corner
```typescript
{ top: "20%", left: "12%" }
```

### Top-Center
```typescript
{ top: "16%", left: "40%" }
```

### Top-Right Corner
```typescript
{ top: "18%", right: "16%" }
```

### Middle-Left
```typescript
{ bottom: "50%", left: "10%" }
```

### Center (approximate)
```typescript
{ bottom: "50%", left: "50%" }
```

### Middle-Right
```typescript
{ bottom: "48%", right: "12%" }
```

### Bottom-Left Corner
```typescript
{ bottom: "24%", left: "12%" }
```

### Bottom-Center
```typescript
{ bottom: "18%", left: "42%" }
```

### Bottom-Right Corner
```typescript
{ bottom: "22%", right: "16%" }
```

## Movement Cheat Sheet

```
Starting Position: { bottom: "30%", left: "20%" }

MOVE UP (+10%)     → { bottom: "40%", left: "20%" }
MOVE DOWN (-10%)   → { bottom: "20%", left: "20%" }
MOVE RIGHT (+10%)  → { bottom: "30%", left: "30%" }
MOVE LEFT (-10%)   → { bottom: "30%", left: "10%" }
```

```
Starting Position: { top: "20%", right: "15%" }

MOVE DOWN (+10%)   → { top: "30%", right: "15%" }
MOVE UP (-10%)     → { top: "10%", right: "15%" }
MOVE LEFT (+10%)   → { top: "20%", right: "25%" }
MOVE RIGHT (-10%)  → { top: "20%", right: "5%" }
```

## Percentage to Pixel Conversion (406px height)

The Explorer screen image is **406px tall** and **100% width** of mobile screen (~390px).

### Vertical (height: 406px)
- **10%** ≈ 40px
- **20%** ≈ 81px
- **25%** ≈ 101px
- **30%** ≈ 122px
- **40%** ≈ 162px
- **50%** ≈ 203px
- **60%** ≈ 244px

### Horizontal (width: ~390px)
- **10%** ≈ 39px
- **20%** ≈ 78px
- **25%** ≈ 97px
- **30%** ≈ 117px
- **40%** ≈ 156px
- **50%** ≈ 195px
- **60%** ≈ 234px

## Fine-Tuning Increments

| Adjustment Size | Percentage Change | Approximate Pixels |
|----------------|-------------------|-------------------|
| Tiny nudge     | ±1-2%            | ±4-8px           |
| Small shift    | ±3-5%            | ±12-20px         |
| Medium move    | ±6-10%           | ±24-40px         |
| Large reposition | ±15-25%        | ±60-100px        |

## Property Combinations

### ✅ Valid Combinations
- `bottom + left`
- `bottom + right`
- `top + left`
- `top + right`

### ❌ Invalid Combinations (Don't Use)
- `bottom + top` (conflicting vertical anchors)
- `left + right` (conflicting horizontal anchors)
- Only `bottom` or only `top` (missing horizontal position)
- Only `left` or only `right` (missing vertical position)

## Item Type Positioning Guide

### Living Room

| Item      | Typical Position                   | Reasoning                              |
|-----------|-----------------------------------|----------------------------------------|
| **Sofa**  | `bottom: 28-34%, left: 16-30%`   | Large, usually bottom-left/center      |
| **Table** | `bottom: 16-24%, left: 38-52%`   | Center, lower (in front of sofa)       |
| **TV**    | `top: 20-30%, left: 24-32%`      | Wall-mounted, upper area               |
| **Plant** | `bottom: 30-40%, right: 10-20%`  | Corner or side accent                  |
| **Rug**   | `bottom: 10-20%, left: 28-40%`   | Floor level, center                    |

### Bedroom

| Item          | Typical Position                   | Reasoning                          |
|---------------|-----------------------------------|------------------------------------|
| **Bed**       | `bottom: 28-34%, left: 22-30%`   | Center-left, large item            |
| **Nightstand**| `bottom: 24-28%, left: 8-14%`    | Beside bed, left side              |
| **Lamp**      | `bottom: 36-40%, right: 14-22%`  | Beside bed or corner               |
| **Wardrobe**  | `top: 18-24%, left: 10-16%`      | Background, left wall              |
| **Rug**       | `bottom: 10-16%, left: 30-38%`   | Floor, front of bed                |

### Bath

| Item          | Typical Position                   | Reasoning                          |
|---------------|-----------------------------------|------------------------------------|
| **Vanity**    | `bottom: 18-24%, left: 22-30%`   | Sink area, lower portion           |
| **Mirror**    | `top: 14-22%, left: 28-38%`      | Above vanity, upper area           |
| **Towel Rail**| `bottom: 28-36%, right: 8-14%`   | Side wall, accessible height       |
| **Pendant**   | `top: 8-14%, left: 44-54%`       | Ceiling fixture, upper center      |

### Kitchen

| Item        | Typical Position                   | Reasoning                            |
|-------------|-----------------------------------|--------------------------------------|
| **Counter** | `bottom: 20-28%, left: 26-34%`   | Island/work surface, center-left     |
| **Cabinet** | `top: 14-20%, left: 18-26%`      | Upper cabinets, wall-mounted         |
| **Stool**   | `bottom: 12-16%, right: 14-22%`  | Bar seating, lower right             |
| **Pendant** | `top: 8-14%, left: 42-52%`       | Ceiling fixture over island          |
| **Plant**   | `bottom: 32-36%, right: 12-16%`  | Counter accent, right side           |

## Real Examples from Current Config

### Example 1: "Quiet Luxury" (Living Room)
```typescript
"Quiet Luxury": [
  { bottom: "34%", left: "22%", n: 1, key: "sofa" },     // Lower-left
  { bottom: "22%", left: "46%", n: 2, key: "table" },    // Center-low
  { top: "30%", right: "14%", n: 3, key: "tv" },         // Upper-right
  { bottom: "30%", right: "20%", n: 4, key: "plant" },   // Mid-right
]
```

### Example 2: "Serene Slumber" (Bedroom)
```typescript
"Serene Slumber": [
  { bottom: "32%", left: "30%", n: 1, key: "bed" },        // Center
  { bottom: "28%", left: "10%", n: 2, key: "nightstand" }, // Left side
  { bottom: "40%", right: "16%", n: 3, key: "lamp" },      // Right side
  { top: "18%", left: "14%", n: 4, key: "wardrobe" },      // Upper-left
]
```

### Example 3: "Marble Sanctuary" (Bath)
```typescript
"Marble Sanctuary": [
  { bottom: "22%", left: "28%", n: 1, key: "vanity" },     // Lower center
  { top: "16%", left: "36%", n: 2, key: "mirror" },        // Upper center
  { bottom: "32%", right: "10%", n: 3, key: "towelRail" }, // Right side
  { top: "12%", right: "22%", n: 4, key: "pendant" },      // Upper right
]
```

## Testing Grid Overlay

Mentally divide the image into a 10×10 grid:

```
      10   20   30   40   50   60   70   80   90  100 (left %)
    ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
100 │    │    │    │    │    │    │    │    │    │    │ ← bottom: 100%
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 90 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 80 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 70 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 60 │    │    │    │    │ C  │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 50 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 40 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 30 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 20 │    │    │    │    │    │    │    │    │    │    │
    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 10 │    │    │    │    │    │    │    │    │    │    │
    └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ ← bottom: 0%
  ↑ left: 0%                                    left: 100% ↑
```

(C = Center: `bottom: "50%", left: "50%"`)

## Copy-Paste Template

Use this template to add new hotspots or modify existing ones:

```typescript
"Look Name": [
  { bottom: "XX%", left: "XX%", n: 1, key: "itemKey" },
  { bottom: "XX%", left: "XX%", n: 2, key: "itemKey" },
  { top: "XX%", right: "XX%", n: 3, key: "itemKey" },
  { bottom: "XX%", right: "XX%", n: 4, key: "itemKey" },
],
```

---

## Pro Tips

1. **Start with defaults**: Begin with typical positions for each item type, then fine-tune
2. **Use consistent patterns**: Similar looks should have similar hotspot patterns
3. **Check visual hierarchy**: Important items (sofa, bed, vanity, counter) should be easily clickable
4. **Mind the safe zones**: Keep hotspots away from top nav buttons (top 80px) and bottom CTA bar
5. **Test on mobile**: Hotspot dots are 26px, so leave enough space between them (~40px minimum)
6. **Iterate in small steps**: Make 2-5% adjustments rather than large jumps

---

**Quick Edit Command:**

1. Open `/src/app/App.tsx`
2. Navigate to line 814 (or search for `lookHotspots`)
3. Find your look name in quotes (e.g., `"Quiet Luxury":`)
4. Adjust the percentage values
5. Save and refresh the app to test
