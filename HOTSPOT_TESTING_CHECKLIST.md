# Hotspot Testing Checklist

Use this checklist to systematically test and calibrate all 24 looks.

## Testing Status

### Living Room Looks
- [ ] **Quiet Luxury** - Sofa (1), Table (2), TV (3), Plant (4)
  - Notes: _________________________________________
- [ ] **Desert Bloom** - Sofa (1), Rug (2), Plant (3), Table (4)
  - Notes: _________________________________________
- [ ] **Wabi Sabi** - Sofa (1), Table (2), Plant (3), Rug (4)
  - Notes: _________________________________________
- [ ] **Blue Lagoon** - Sofa (1), Table (2), TV (3), Plant (4)
  - Notes: _________________________________________
- [ ] **Forest Breath** - Sofa (1), Plant (2), Table (3), Rug (4)
  - Notes: _________________________________________
- [ ] **Simply Chic** - Sofa (1), Table (2), TV (3), Plant (4)
  - Notes: _________________________________________

### Bedroom Looks
- [ ] **Serene Slumber** - Bed (1), Nightstand (2), Lamp (3), Wardrobe (4)
  - Notes: _________________________________________
- [ ] **Dream Weaver** - Bed (1), Lamp (2), Nightstand (3), Rug (4)
  - Notes: _________________________________________
- [ ] **Still Waters** - Bed (1), Nightstand (2), Wardrobe (3), Plant (4)
  - Notes: _________________________________________
- [ ] **Ocean Lullaby** - Bed (1), Nightstand (2), Lamp (3), Rug (4)
  - Notes: _________________________________________
- [ ] **Green Canopy** - Bed (1), Plant (2), Lamp (3), Nightstand (4)
  - Notes: _________________________________________
- [ ] **Pure Rest** - Bed (1), Nightstand (2), Lamp (3), Wardrobe (4)
  - Notes: _________________________________________

### Bath Looks
- [ ] **Marble Sanctuary** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Earthy Escape** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Onsen Ritual** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Shore Wash** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Stone & Moss** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Clean Slate** - Vanity (1), Mirror (2), Towel Rail (3), Pendant (4)
  - Notes: _________________________________________

### Kitchen Looks
- [ ] **Chef's Canvas** - Counter (1), Cabinet (2), Stool (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Harvest Table** - Counter (1), Cabinet (2), Stool (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Umami Space** - Counter (1), Cabinet (2), Stool (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Aqua Kitchen** - Counter (1), Cabinet (2), Stool (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Garden Kitchen** - Counter (1), Cabinet (2), Plant (3), Pendant (4)
  - Notes: _________________________________________
- [ ] **Clean Cook** - Counter (1), Cabinet (2), Stool (3), Pendant (4)
  - Notes: _________________________________________

## Quick Adjustment Reference

### Common Patterns by Item Type

**Sofas/Beds** (typically bottom-left or bottom-center)
- Usually: `bottom: "28-34%", left: "20-30%"`

**Tables/Counters** (typically bottom-center)
- Usually: `bottom: "18-26%", left: "32-46%"`

**Plants** (often right side or corners)
- Usually: `bottom: "30-40%", right: "10-20%"`
- Or: `top: "20-30%", right: "12-20%"`

**TV/Mirrors** (typically top-center or top-right)
- Usually: `top: "16-30%", left: "28-40%"`
- Or: `top: "16-30%", right: "18-24%"`

**Rugs** (typically bottom-center, lower than furniture)
- Usually: `bottom: "10-20%", left: "28-40%"`

**Lamps** (typically mid-right or corners)
- Usually: `bottom: "36-40%", right: "14-22%"`
- Or: `top: "20-24%", right: "18-24%"`

**Nightstands** (typically left side, near bed)
- Usually: `bottom: "24-28%", left: "8-12%"`

**Wardrobes** (typically top-left)
- Usually: `top: "18-22%", left: "10-16%"`

**Cabinets** (kitchen, typically top)
- Usually: `top: "14-20%", left: "18-24%"`

**Stools** (kitchen, typically bottom-right)
- Usually: `bottom: "12-14%", right: "16-22%"`

**Pendants** (typically top-center)
- Usually: `top: "10-14%", left: "44-52%"`

**Towel Rails** (bath, typically right side)
- Usually: `bottom: "30-34%", right: "10-14%"`

## Adjustment Workflow

For each look:

1. **Navigate** to Gallery → Select room tab → Tap look card
2. **Observe** hotspot positions on the Explorer image
3. **Note** which hotspots need adjustment:
   - ✅ Correct position (on the item)
   - ⬆️ Move up (increase bottom% or decrease top%)
   - ⬇️ Move down (decrease bottom% or increase top%)
   - ⬅️ Move left (decrease left% or increase right%)
   - ➡️ Move right (increase left% or decrease right%)
4. **Edit** `/src/app/App.tsx` line 814+ (lookHotspots object)
5. **Test** again and iterate

## Priority Order

**Phase 1: Hero Looks** (4 looks)
1. Quiet Luxury (Living Room)
2. Serene Slumber (Bedroom)
3. Marble Sanctuary (Bath)
4. Chef's Canvas (Kitchen)

**Phase 2: Secondary Featured** (8 looks)
5. Desert Bloom
6. Blue Lagoon
7. Dream Weaver
8. Ocean Lullaby
9. Earthy Escape
10. Shore Wash
11. Harvest Table
12. Aqua Kitchen

**Phase 3: Complete Coverage** (12 remaining looks)
- All remaining looks in each category

## Calibration Quality Standards

**Excellent** ✨
- Hotspot is directly over the furniture item
- Clearly indicates which item it represents
- Doesn't overlap with other hotspots
- Visible against the image background

**Good** ✅
- Hotspot is near the furniture item
- User can understand which item it represents
- Minor overlap acceptable if intentional

**Needs Adjustment** ⚠️
- Hotspot is not on or near the correct item
- Confusing which item it represents
- Hotspot is off-screen or in wrong quadrant

---

## Example Adjustment Log

```
Look: Quiet Luxury
Date: 2026-02-23
Issue: Hotspot #2 (Table) is too far left
Change: left: "46%" → left: "52%"
Result: ✅ Now positioned correctly over coffee table

Look: Serene Slumber
Date: 2026-02-23
Issue: Hotspot #3 (Lamp) is too high
Change: bottom: "40%" → bottom: "34%"
Result: ✅ Now at correct height on floor lamp
```

---

**Tips:**
- Test on actual device screen size (390x844px typical mobile)
- Check in both light and dark environments
- Ensure hotspots don't overlap with top navigation buttons
- Remember the image height is 406px in the UI
