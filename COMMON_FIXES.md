# Common Hotspot Fixes

Quick solutions for frequently encountered hotspot positioning issues.

## Issue Patterns & Solutions

### Issue #1: Sofa hotspot is too far right
**Symptoms:** Hotspot #1 appears over the coffee table instead of the sofa  
**Solution:** Decrease the `left` value by 8-12%

```typescript
// Before
{ bottom: "34%", left: "30%", n: 1, key: "sofa" },

// After
{ bottom: "34%", left: "20%", n: 1, key: "sofa" },
```

---

### Issue #2: Table hotspot is on the floor/rug
**Symptoms:** Hotspot appears too low, below the table  
**Solution:** Increase the `bottom` value by 6-10%

```typescript
// Before
{ bottom: "16%", left: "42%", n: 2, key: "table" },

// After
{ bottom: "22%", left: "42%", n: 2, key: "table" },
```

---

### Issue #3: Plant hotspot is off-screen (right edge)
**Symptoms:** Hotspot is cut off or invisible on the right  
**Solution:** Increase the `right` value (moves it left)

```typescript
// Before
{ bottom: "36%", right: "4%", n: 4, key: "plant" },

// After
{ bottom: "36%", right: "14%", n: 4, key: "plant" },
```

---

### Issue #4: Mirror hotspot is too low (appears on vanity)
**Symptoms:** Mirror hotspot overlaps with vanity hotspot  
**Solution:** Switch from `bottom` to `top` and adjust

```typescript
// Before
{ bottom: "60%", left: "32%", n: 2, key: "mirror" },

// After
{ top: "18%", left: "32%", n: 2, key: "mirror" },
```

---

### Issue #5: TV hotspot is too high (in ceiling area)
**Symptoms:** Hotspot appears above the TV unit  
**Solution:** Increase the `top` value (moves it down)

```typescript
// Before
{ top: "14%", left: "28%", n: 3, key: "tv" },

// After
{ top: "24%", left: "28%", n: 3, key: "tv" },
```

---

### Issue #6: Pendant light hotspot is in wrong room area
**Symptoms:** Pendant hotspot is not centered over island/table  
**Solution:** Adjust the `left` value to match the island position

```typescript
// Before
{ top: "12%", left: "32%", n: 4, key: "pendant" },

// After (island is more right-centered)
{ top: "12%", left: "48%", n: 4, key: "pendant" },
```

---

### Issue #7: Bed hotspot is too close to left edge
**Symptoms:** Bed appears centered but hotspot is on left side  
**Solution:** Increase the `left` value to move toward bed center

```typescript
// Before
{ bottom: "32%", left: "18%", n: 1, key: "bed" },

// After
{ bottom: "32%", left: "28%", n: 1, key: "bed" },
```

---

### Issue #8: Multiple hotspots overlapping
**Symptoms:** Two hotspots are on top of each other  
**Solution:** Spread them apart by adjusting in opposite directions

```typescript
// Before - Overlapping
{ bottom: "28%", left: "24%", n: 1, key: "sofa" },
{ bottom: "26%", left: "26%", n: 2, key: "table" },

// After - Separated
{ bottom: "34%", left: "20%", n: 1, key: "sofa" },
{ bottom: "20%", left: "44%", n: 2, key: "table" },
```

---

### Issue #9: Hotspot is hidden behind the image gradient overlay
**Symptoms:** Hotspot is too close to top edge, covered by dark gradient  
**Solution:** Move it down by decreasing `top` or increasing `bottom`

```typescript
// Before - Too high
{ top: "8%", left: "40%", n: 2, key: "mirror" },

// After - Visible area
{ top: "18%", left: "40%", n: 2, key: "mirror" },
```

---

### Issue #10: Rug hotspot appears on furniture
**Symptoms:** Rug hotspot is same height as table/sofa  
**Solution:** Rugs should be lowest; decrease `bottom` value

```typescript
// Before - Same level as table
{ bottom: "22%", left: "34%", n: 4, key: "rug" },

// After - Floor level
{ bottom: "12%", left: "34%", n: 4, key: "rug" },
```

---

### Issue #11: Nightstand hotspot is in the middle of the bed
**Symptoms:** Nightstand hotspot doesn't align with bedside table  
**Solution:** Move it to the edge (left or right) of the bed

```typescript
// Before - Too centered
{ bottom: "28%", left: "28%", n: 2, key: "nightstand" },

// After - Beside bed
{ bottom: "28%", left: "10%", n: 2, key: "nightstand" },
```

---

### Issue #12: Towel rail hotspot is on the bathtub
**Symptoms:** Towel rail hotspot is positioned incorrectly  
**Solution:** Move to right wall area

```typescript
// Before - Wrong location
{ bottom: "20%", left: "30%", n: 3, key: "towelRail" },

// After - Right wall
{ bottom: "32%", right: "12%", n: 3, key: "towelRail" },
```

---

### Issue #13: Bar stool hotspot is too far from island counter
**Symptoms:** Stool hotspot is not near seating area  
**Solution:** Align it with counter position

```typescript
// Before - Disconnected
{ bottom: "14%", right: "32%", n: 3, key: "stool" },

// After - Near counter
{ bottom: "14%", right: "18%", n: 3, key: "stool" },
```

---

### Issue #14: Wardrobe hotspot is in the foreground
**Symptoms:** Wardrobe appears in background but hotspot is low  
**Solution:** Use `top` positioning for background elements

```typescript
// Before - Wrong depth perception
{ bottom: "40%", left: "12%", n: 4, key: "wardrobe" },

// After - Background positioning
{ top: "20%", left: "12%", n: 4, key: "wardrobe" },
```

---

### Issue #15: Cabinet hotspot is at counter height
**Symptoms:** Upper cabinet hotspot is too low  
**Solution:** Move to upper area with `top` positioning

```typescript
// Before - Counter level
{ bottom: "50%", left: "22%", n: 2, key: "cabinet" },

// After - Upper cabinets
{ top: "18%", left: "22%", n: 2, key: "cabinet" },
```

---

## Room-Specific Adjustment Patterns

### Living Room Quick Fixes

**Pattern:** Sofa → Table → TV → Plant (left to right, various heights)

```typescript
// Optimal spacing example
[
  { bottom: "32%", left: "20%", n: 1, key: "sofa" },     // Left, mid-height
  { bottom: "20%", left: "44%", n: 2, key: "table" },    // Center, lower
  { top: "26%", left: "30%", n: 3, key: "tv" },          // Center-left, upper
  { bottom: "34%", right: "16%", n: 4, key: "plant" },   // Right, mid-height
]
```

### Bedroom Quick Fixes

**Pattern:** Bed (center) → Nightstand (left) → Lamp (right) → Wardrobe (back-left)

```typescript
// Optimal spacing example
[
  { bottom: "30%", left: "26%", n: 1, key: "bed" },        // Center
  { bottom: "26%", left: "10%", n: 2, key: "nightstand" }, // Bedside left
  { bottom: "38%", right: "16%", n: 3, key: "lamp" },      // Bedside right
  { top: "20%", left: "12%", n: 4, key: "wardrobe" },      // Background
]
```

### Bath Quick Fixes

**Pattern:** Vanity (low-center) → Mirror (high-center) → Towel Rail (right) → Pendant (high-center-right)

```typescript
// Optimal spacing example
[
  { bottom: "22%", left: "26%", n: 1, key: "vanity" },     // Lower center
  { top: "18%", left: "34%", n: 2, key: "mirror" },        // Upper center
  { bottom: "32%", right: "12%", n: 3, key: "towelRail" }, // Right wall
  { top: "12%", left: "50%", n: 4, key: "pendant" },       // Upper right-center
]
```

### Kitchen Quick Fixes

**Pattern:** Counter (center-low) → Cabinet (center-high) → Stool (right-low) → Pendant (center-high)

```typescript
// Optimal spacing example
[
  { bottom: "24%", left: "30%", n: 1, key: "counter" },  // Island, lower
  { top: "18%", left: "22%", n: 2, key: "cabinet" },     // Upper cabinets
  { bottom: "14%", right: "18%", n: 3, key: "stool" },   // Seating area
  { top: "12%", left: "46%", n: 4, key: "pendant" },     // Over island
]
```

---

## Emergency Reset Values

If hotspots are completely mispositioned, start with these conservative defaults:

### Living Room Reset
```typescript
"Look Name": [
  { bottom: "32%", left: "22%", n: 1, key: "sofa" },
  { bottom: "20%", left: "44%", n: 2, key: "table" },
  { top: "24%", left: "30%", n: 3, key: "tv" },
  { bottom: "34%", right: "16%", n: 4, key: "plant" },
],
```

### Bedroom Reset
```typescript
"Look Name": [
  { bottom: "30%", left: "26%", n: 1, key: "bed" },
  { bottom: "26%", left: "10%", n: 2, key: "nightstand" },
  { bottom: "38%", right: "16%", n: 3, key: "lamp" },
  { top: "20%", left: "12%", n: 4, key: "wardrobe" },
],
```

### Bath Reset
```typescript
"Look Name": [
  { bottom: "22%", left: "26%", n: 1, key: "vanity" },
  { top: "18%", left: "34%", n: 2, key: "mirror" },
  { bottom: "32%", right: "12%", n: 3, key: "towelRail" },
  { top: "12%", left: "50%", n: 4, key: "pendant" },
],
```

### Kitchen Reset
```typescript
"Look Name": [
  { bottom: "24%", left: "30%", n: 1, key: "counter" },
  { top: "18%", left: "22%", n: 2, key: "cabinet" },
  { bottom: "14%", right: "18%", n: 3, key: "stool" },
  { top: "12%", left: "46%", n: 4, key: "pendant" },
],
```

---

## Diagnostic Questions

When a hotspot is mispositioned, ask:

1. **Is it in the right quadrant?** (Top-left, top-right, bottom-left, bottom-right)
   - If no → Change `top`/`bottom` or `left`/`right` property
2. **Is it close to the item but slightly off?**
   - If yes → Adjust by 3-8%
3. **Is it far from the item?**
   - If yes → Adjust by 15-25%
4. **Is it overlapping another hotspot?**
   - If yes → Move in opposite direction from other hotspot
5. **Is it too close to screen edge?**
   - If yes → Increase `left`/`right`/`top`/`bottom` value to move away from edge

---

## Testing Command Line

After making changes:

1. Save `/src/app/App.tsx`
2. Wait for auto-reload (~2 seconds)
3. Navigate: Splash → Property → Quiz (complete) → DNA → Gallery
4. Select room tab (Living Room / Bedroom / Bath / Kitchen)
5. Tap the look card you adjusted
6. Check hotspot positions on Explorer screen
7. Repeat until all 4 hotspots are correctly positioned

---

## Which Looks Need Immediate Attention?

Based on typical Unsplash image compositions, these looks are most likely to need calibration:

**High Priority:**
- Living Room: "Desert Bloom" (complex composition)
- Bedroom: "Green Canopy" (plant positioning)
- Bath: "Onsen Ritual" (Asian aesthetic may have different layouts)
- Kitchen: "Garden Kitchen" (plant instead of stool)

**Medium Priority:**
- All remaining looks in each category

**Low Priority:**
- Looks with simple, standard furniture arrangements

---

**Ready to adjust?** Just tell me:
1. Which look name (e.g., "Quiet Luxury")
2. Which hotspot number (1, 2, 3, or 4)
3. What the issue is (too high, too left, overlapping, etc.)

And I'll provide the exact code change!
