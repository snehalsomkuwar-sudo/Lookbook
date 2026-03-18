# Hotspot Calibration Toolkit

## 📚 Documentation Files Overview

Your complete toolkit for fine-tuning hotspot coordinates across all 24 looks:

### 1. **HOTSPOT_CALIBRATION_GUIDE.md** 
📖 **Master Reference Guide**
- Complete coordinate listing for all 24 looks
- Coordinate system explanation
- Step-by-step calibration workflow
- Which looks to prioritize

**Use when:** You need to see all current coordinates or understand the system

---

### 2. **HOTSPOT_TESTING_CHECKLIST.md**
✅ **Testing & Progress Tracker**
- Checkboxes for all 24 looks
- Notes section for each look
- Priority testing phases
- Quality standards guide

**Use when:** You're systematically testing and want to track progress

---

### 3. **COORDINATE_QUICK_REFERENCE.md**
🎯 **Visual Positioning Guide**
- ASCII coordinate map
- Common position templates
- Movement cheat sheet
- Percentage-to-pixel conversion
- Copy-paste templates

**Use when:** You need to quickly position a hotspot in a specific area

---

### 4. **COMMON_FIXES.md**
🔧 **Problem-Solution Database**
- 15 common positioning issues with solutions
- Room-specific adjustment patterns
- Emergency reset values
- Diagnostic questions

**Use when:** A hotspot is mispositioned and you need a quick fix

---

## 🚀 Quick Start Workflow

### For First-Time Calibration:

1. **Read:** `HOTSPOT_CALIBRATION_GUIDE.md` (sections: Overview, Coordinate System)
2. **Reference:** Keep `COORDINATE_QUICK_REFERENCE.md` open while working
3. **Track:** Use `HOTSPOT_TESTING_CHECKLIST.md` to mark completed looks
4. **Fix:** Consult `COMMON_FIXES.md` when you encounter issues

### For Quick Adjustments:

1. **Identify the issue** (hotspot too high, too left, overlapping, etc.)
2. **Check** `COMMON_FIXES.md` for that specific issue pattern
3. **Apply** the suggested coordinate change
4. **Test** and iterate if needed

---

## 📍 File to Edit

All hotspot coordinates are in:
```
/src/app/App.tsx
Lines: 814-963
Object name: lookHotspots
```

---

## 🎨 Current Status

**✅ Implemented:**
- 24 look-specific hotspot configurations (all rooms)
- Automatic hotspot positioning based on selected look
- No manual editing required by end users

**🔄 Needs Calibration:**
- Coordinate fine-tuning based on actual Unsplash images
- Visual testing across all 24 looks
- Adjustments for optimal user experience

---

## 💡 Calibration Philosophy

The current coordinates are **educated guesses** based on:
- Typical interior design photo compositions
- Standard furniture placement patterns
- Mobile screen ergonomics

They will need **visual testing and fine-tuning** because:
- Each Unsplash image has unique composition
- Furniture positions vary by style and photographer
- Some items may be partially obscured or off-center

---

## 🔍 How to Request Changes

If you find hotspots that need adjustment, just tell me:

**Template:**
```
Look: [Look Name]
Room: [Living Room / Bedroom / Bath / Kitchen]
Hotspot: [Number 1-4] ([Item Name])
Issue: [Description - too high, too left, overlapping, etc.]
```

**Example:**
```
Look: Quiet Luxury
Room: Living Room
Hotspot: 2 (Table)
Issue: Too far right, should be more centered over coffee table
```

And I'll provide the exact code change, or you can make it yourself using the guides!

---

## 📊 Calibration Priority

### Phase 1: Hero Looks (4 looks) - **Highest Impact**
1. Quiet Luxury (Living Room)
2. Serene Slumber (Bedroom)  
3. Marble Sanctuary (Bath)
4. Chef's Canvas (Kitchen)

### Phase 2: Featured Looks (8 looks) - **High Impact**
5. Desert Bloom (Living Room)
6. Blue Lagoon (Living Room)
7. Dream Weaver (Bedroom)
8. Ocean Lullaby (Bedroom)
9. Earthy Escape (Bath)
10. Shore Wash (Bath)
11. Harvest Table (Kitchen)
12. Aqua Kitchen (Kitchen)

### Phase 3: Complete Coverage (12 looks) - **Medium Impact**
- All remaining looks across all rooms

---

## 🛠️ Tools at Your Disposal

### Editing Tools:
- **Direct edit:** Modify `/src/app/App.tsx` manually
- **AI assistance:** Ask me to make specific coordinate changes
- **Batch updates:** I can update multiple looks at once

### Reference Tools:
- **Visual grid:** ASCII coordinate map in Quick Reference
- **Position templates:** Pre-configured positions for common areas
- **Item-type guides:** Typical positions by furniture type

### Testing Tools:
- **Checklist:** Track which looks you've tested
- **Quality standards:** Know when calibration is "good enough"
- **Issue patterns:** Quickly diagnose common problems

---

## 🎯 Expected Time Investment

- **Per look:** 5-10 minutes (initial test + adjustments)
- **Per room (6 looks):** 30-60 minutes
- **All 24 looks:** 2-4 hours total

**Pro tip:** Test all looks in one room before moving to the next room, as you'll develop familiarity with the positioning patterns.

---

## 📱 Testing Environment

**Recommended:**
- Browser: Chrome/Edge with mobile device emulator
- Screen size: 390×844px (iPhone 12/13/14 standard)
- Image area: Full width × 406px height
- Hotspot size: 26×26px dots

**Alternative:**
- Test on actual mobile device for real-world validation

---

## ❓ FAQ

**Q: Can hotspots be draggable for user customization?**  
A: No. The hotspots are fixed per look to provide a curated, professional experience. Draggable hotspots would be a developer-only calibration tool.

**Q: What if I accidentally break the configuration?**  
A: Check `COMMON_FIXES.md` → "Emergency Reset Values" section for safe defaults.

**Q: Do all 4 hotspots need to be visible on every look?**  
A: Yes. Each look should have exactly 4 hotspots positioned over distinct furniture items.

**Q: Can I change the items associated with hotspots?**  
A: The item keys (sofa, table, plant, etc.) are tied to the item database. Changing them requires updating both `lookHotspots` and the room configs.

**Q: How precise do coordinates need to be?**  
A: Hotspots should be clearly on/near their associated items. ±5% tolerance is acceptable if the association is obvious.

---

## 🎉 Success Criteria

A look is **fully calibrated** when:

✅ All 4 hotspots are visible (not off-screen)  
✅ Each hotspot is on or near its correct furniture item  
✅ No hotspots overlap or are too close (<40px apart)  
✅ Hotspots don't obscure critical UI elements (top nav, back button)  
✅ The association between hotspot and item is immediately clear to users  

---

## 📞 Need Help?

**For specific coordinate adjustments:**
- Tell me the look name and issue, I'll provide the fix

**For general questions:**
- Refer to the relevant guide document

**For batch updates:**
- Give me a list of changes, I can apply them all at once

**For visual validation:**
- Test the app and share screenshots if needed

---

## 🚦 Getting Started Now

**Easiest path:**

1. Open the app in your browser
2. Navigate to Gallery → Living Room → Tap "Quiet Luxury"
3. Look at where the 4 hotspot dots appear on the Explorer image
4. If they're mispositioned, tell me which hotspots need adjusting
5. I'll update the coordinates for you
6. Refresh and verify the changes
7. Repeat for remaining looks

---

**Ready to calibrate? Let me know which look you want to start with!** 🎨
