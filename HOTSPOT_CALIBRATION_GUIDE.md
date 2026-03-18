# Hotspot Calibration Guide

This guide will help you fine-tune the hotspot coordinates for all 24 looks in the LookBook app.

## Overview

The app currently has hotspot coordinates configured for:
- **6 Living Room looks**: Quiet Luxury, Desert Bloom, Wabi Sabi, Blue Lagoon, Forest Breath, Simply Chic
- **6 Bedroom looks**: Serene Slumber, Dream Weaver, Still Waters, Ocean Lullaby, Green Canopy, Pure Rest
- **6 Bath looks**: Marble Sanctuary, Earthy Escape, Onsen Ritual, Shore Wash, Stone & Moss, Clean Slate
- **6 Kitchen looks**: Chef's Canvas, Harvest Table, Umami Space, Aqua Kitchen, Garden Kitchen, Clean Cook

## Coordinate System

Hotspots use CSS positioning with percentage values:
- **bottom**: Distance from bottom edge (e.g., `"34%"`)
- **top**: Distance from top edge (e.g., `"30%"`)
- **left**: Distance from left edge (e.g., `"22%"`)
- **right**: Distance from right edge (e.g., `"14%"`)

⚠️ **Important**: Each hotspot should use EITHER (bottom OR top) AND (left OR right). Never use bottom+top or left+right together.

## Current Hotspot Coordinates

### Living Room

#### Quiet Luxury
```typescript
{ bottom: "34%", left: "22%", n: 1, key: "sofa" },
{ bottom: "22%", left: "46%", n: 2, key: "table" },
{ top: "30%", right: "14%", n: 3, key: "tv" },
{ bottom: "30%", right: "20%", n: 4, key: "plant" },
```

#### Desert Bloom
```typescript
{ bottom: "30%", left: "18%", n: 1, key: "sofa" },
{ bottom: "14%", left: "40%", n: 2, key: "rug" },
{ bottom: "40%", right: "12%", n: 3, key: "plant" },
{ bottom: "20%", left: "54%", n: 4, key: "table" },
```

#### Wabi Sabi
```typescript
{ bottom: "28%", left: "20%", n: 1, key: "sofa" },
{ bottom: "16%", left: "42%", n: 2, key: "table" },
{ top: "32%", right: "18%", n: 3, key: "plant" },
{ bottom: "10%", left: "32%", n: 4, key: "rug" },
```

#### Blue Lagoon
```typescript
{ bottom: "32%", left: "16%", n: 1, key: "sofa" },
{ bottom: "18%", left: "44%", n: 2, key: "table" },
{ top: "22%", left: "28%", n: 3, key: "tv" },
{ bottom: "36%", right: "14%", n: 4, key: "plant" },
```

#### Forest Breath
```typescript
{ bottom: "30%", left: "24%", n: 1, key: "sofa" },
{ bottom: "38%", right: "10%", n: 2, key: "plant" },
{ bottom: "18%", left: "46%", n: 3, key: "table" },
{ bottom: "10%", left: "28%", n: 4, key: "rug" },
```

#### Simply Chic
```typescript
{ bottom: "32%", left: "22%", n: 1, key: "sofa" },
{ bottom: "20%", left: "44%", n: 2, key: "table" },
{ top: "24%", left: "30%", n: 3, key: "tv" },
{ bottom: "32%", right: "16%", n: 4, key: "plant" },
```

### Bedroom

#### Serene Slumber
```typescript
{ bottom: "32%", left: "30%", n: 1, key: "bed" },
{ bottom: "28%", left: "10%", n: 2, key: "nightstand" },
{ bottom: "40%", right: "16%", n: 3, key: "lamp" },
{ top: "18%", left: "14%", n: 4, key: "wardrobe" },
```

#### Dream Weaver
```typescript
{ bottom: "30%", left: "26%", n: 1, key: "bed" },
{ bottom: "36%", right: "14%", n: 2, key: "lamp" },
{ bottom: "24%", left: "12%", n: 3, key: "nightstand" },
{ bottom: "10%", left: "34%", n: 4, key: "rug" },
```

#### Still Waters
```typescript
{ bottom: "28%", left: "28%", n: 1, key: "bed" },
{ bottom: "24%", left: "12%", n: 2, key: "nightstand" },
{ top: "20%", left: "12%", n: 3, key: "wardrobe" },
{ top: "30%", right: "20%", n: 4, key: "plant" },
```

#### Ocean Lullaby
```typescript
{ bottom: "32%", left: "22%", n: 1, key: "bed" },
{ bottom: "26%", left: "8%", n: 2, key: "nightstand" },
{ bottom: "38%", right: "18%", n: 3, key: "lamp" },
{ bottom: "10%", left: "32%", n: 4, key: "rug" },
```

#### Green Canopy
```typescript
{ bottom: "30%", left: "24%", n: 1, key: "bed" },
{ top: "20%", right: "12%", n: 2, key: "plant" },
{ bottom: "38%", right: "22%", n: 3, key: "lamp" },
{ bottom: "24%", right: "10%", n: 4, key: "nightstand" },
```

#### Pure Rest
```typescript
{ bottom: "32%", left: "28%", n: 1, key: "bed" },
{ bottom: "26%", left: "10%", n: 2, key: "nightstand" },
{ top: "22%", right: "20%", n: 3, key: "lamp" },
{ top: "20%", left: "10%", n: 4, key: "wardrobe" },
```

### Bath

#### Marble Sanctuary
```typescript
{ bottom: "22%", left: "28%", n: 1, key: "vanity" },
{ top: "16%", left: "36%", n: 2, key: "mirror" },
{ bottom: "32%", right: "10%", n: 3, key: "towelRail" },
{ top: "12%", right: "22%", n: 4, key: "pendant" },
```

#### Earthy Escape
```typescript
{ bottom: "20%", left: "24%", n: 1, key: "vanity" },
{ top: "20%", left: "30%", n: 2, key: "mirror" },
{ bottom: "30%", right: "14%", n: 3, key: "towelRail" },
{ top: "12%", left: "52%", n: 4, key: "pendant" },
```

#### Onsen Ritual
```typescript
{ bottom: "18%", left: "26%", n: 1, key: "vanity" },
{ top: "16%", left: "32%", n: 2, key: "mirror" },
{ top: "28%", right: "12%", n: 3, key: "towelRail" },
{ top: "10%", left: "48%", n: 4, key: "pendant" },
```

#### Shore Wash
```typescript
{ bottom: "22%", left: "22%", n: 1, key: "vanity" },
{ top: "18%", left: "30%", n: 2, key: "mirror" },
{ bottom: "34%", right: "12%", n: 3, key: "towelRail" },
{ top: "12%", right: "24%", n: 4, key: "pendant" },
```

#### Stone & Moss
```typescript
{ bottom: "20%", left: "26%", n: 1, key: "vanity" },
{ top: "20%", left: "34%", n: 2, key: "mirror" },
{ bottom: "30%", right: "10%", n: 3, key: "towelRail" },
{ top: "10%", left: "50%", n: 4, key: "pendant" },
```

#### Clean Slate
```typescript
{ bottom: "22%", left: "28%", n: 1, key: "vanity" },
{ top: "18%", left: "36%", n: 2, key: "mirror" },
{ bottom: "32%", right: "12%", n: 3, key: "towelRail" },
{ top: "14%", right: "20%", n: 4, key: "pendant" },
```

### Kitchen

#### Chef's Canvas
```typescript
{ bottom: "24%", left: "32%", n: 1, key: "counter" },
{ top: "18%", left: "22%", n: 2, key: "cabinet" },
{ bottom: "14%", right: "20%", n: 3, key: "stool" },
{ top: "10%", left: "46%", n: 4, key: "pendant" },
```

#### Harvest Table
```typescript
{ bottom: "26%", left: "28%", n: 1, key: "counter" },
{ top: "16%", left: "20%", n: 2, key: "cabinet" },
{ bottom: "14%", right: "18%", n: 3, key: "stool" },
{ top: "10%", left: "48%", n: 4, key: "pendant" },
```

#### Umami Space
```typescript
{ bottom: "22%", left: "34%", n: 1, key: "counter" },
{ top: "14%", left: "24%", n: 2, key: "cabinet" },
{ bottom: "12%", right: "22%", n: 3, key: "stool" },
{ top: "10%", left: "50%", n: 4, key: "pendant" },
```

#### Aqua Kitchen
```typescript
{ bottom: "24%", left: "30%", n: 1, key: "counter" },
{ top: "18%", left: "18%", n: 2, key: "cabinet" },
{ bottom: "14%", right: "16%", n: 3, key: "stool" },
{ top: "12%", left: "44%", n: 4, key: "pendant" },
```

#### Garden Kitchen
```typescript
{ bottom: "26%", left: "32%", n: 1, key: "counter" },
{ top: "20%", left: "20%", n: 2, key: "cabinet" },
{ bottom: "34%", right: "14%", n: 3, key: "plant" },
{ top: "10%", left: "46%", n: 4, key: "pendant" },
```

#### Clean Cook
```typescript
{ bottom: "22%", left: "30%", n: 1, key: "counter" },
{ top: "18%", left: "22%", n: 2, key: "cabinet" },
{ bottom: "14%", right: "18%", n: 3, key: "stool" },
{ top: "12%", left: "46%", n: 4, key: "pendant" },
```

## How to Adjust Coordinates

### Method 1: Visual Testing (Recommended)
1. Open the app in your browser
2. Navigate to Look Gallery → Tap a Look card → View Explorer screen
3. Visually inspect where the numbered hotspot dots appear on the image
4. Note which items need adjustment
5. Edit `/src/app/App.tsx` and find the `lookHotspots` object (starts around line 814)
6. Adjust the percentage values based on where you want the hotspot to appear

### Method 2: Grid Overlay Mental Model
Think of the image as a 100×100 grid:
- **Left 0%** = far left edge
- **Left 50%** = horizontal center
- **Left 100%** = far right edge
- **Bottom 0%** = bottom edge
- **Bottom 50%** = vertical center
- **Bottom 100%** = top edge

### Adjustment Tips

**Moving a hotspot:**
- **Left/Right**: Increase left% to move right, decrease to move left
- **Up/Down**: Increase bottom% to move up, decrease to move down
- **When using right**: Increase right% to move left, decrease to move right
- **When using top**: Increase top% to move down, decrease to move up

**Typical adjustments:**
- Small nudge: ±2%
- Medium shift: ±5-8%
- Large repositioning: ±10-20%

## Testing Workflow

1. **Choose a look** to calibrate (e.g., "Quiet Luxury")
2. **Open the Explorer screen** for that look
3. **Screenshot the current state** for reference
4. **Make adjustments** in `/src/app/App.tsx`
5. **Refresh the app** and check the new positions
6. **Iterate** until hotspots are precisely positioned over the furniture items
7. **Move to the next look**

## Common Issues

### Hotspot is off-screen
- Check that you're using valid percentages (0-100%)
- Verify you're not mixing incompatible properties (e.g., both left and right)

### Hotspot is in the wrong quadrant
- Double-check if you should be using top vs bottom or left vs right
- Remember: `bottom: "80%"` means "80% up from the bottom" (near the top)

### All hotspots are clustered
- Ensure each hotspot has unique coordinate values
- Spread them across the image based on actual furniture positions

## Which Looks to Prioritize

Focus calibration efforts on:
1. **Living Room** - "Quiet Luxury" and "Desert Bloom" (most likely to be showcased)
2. **Bedroom** - "Serene Slumber" (hero look)
3. **Kitchen** - "Chef's Canvas" (hero look)
4. **Bath** - "Marble Sanctuary" (hero look)

Then expand to the remaining looks as needed.

## File Location

All hotspot coordinates are defined in:
**`/src/app/App.tsx`** - Lines 814-963

Look for the `lookHotspots` object. The structure is:
```typescript
const lookHotspots: Record<string, {...}[]> = {
  "Look Name": [
    { bottom: "X%", left: "Y%", n: 1, key: "item" },
    // ...
  ],
};
```

---

**Need help?** Simply tell me which specific look(s) and hotspot(s) need adjustment, and I can update the coordinates for you!
