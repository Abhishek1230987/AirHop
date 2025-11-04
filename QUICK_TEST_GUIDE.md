# 🚀 **QUICK TEST GUIDE - Route Changes Fix**

## ⏱️ **30-Second Test**

```
1. Go to: http://localhost:3001/search
2. Search: Delhi → Mumbai
3. Open F12 (DevTools) → Console
4. Click each route and WATCH:
   ✅ Distance changes
   ✅ Color changes (Red → Yellow → Green)
   ✅ Console shows "Waypoint X" for each route
```

---

## 🎯 **Expected Results**

| Route         | Distance  | Color     | Console Shows            |
| ------------- | --------- | --------- | ------------------------ |
| ⚡ Fastest    | ~1,425 km | 🔴 Red    | 0 waypoints              |
| ⚖️ Balanced   | ~1,497 km | 🟡 Yellow | 1 waypoint at 50%        |
| 🌿 Healthiest | ~1,639 km | 🟢 Green  | 2 waypoints at 35% & 70% |

---

## ✅ **What Changed**

**Waypoint Deviations INCREASED:**

- Low → 35% perpendicular (was 15%)
- Moderate → 20% perpendicular (was 5%)

**Result:** Different routes = Different distances = Visible map changes

---

## 📊 **Test Scenario**

```
Start: Delhi (28.7041°N, 77.1025°E)
End: Mumbai (19.0760°N, 72.8777°E)
Expected distances:
  - Fastest: 1,425 km
  - Balanced: 1,497 km (+72)
  - Healthiest: 1,639 km (+214)
```

---

## 🔍 **Console Check**

When clicking routes, you should see (for each route):

```
🗺️ ========== ROUTE CALCULATION START ==========
📍 Start: lat=28.7041, lng=77.1025
📍 End: lat=19.0760, lng=72.8777
🌍 Pollution Level: [high/moderate/low]
🛣️ Total waypoints: [0/1/2]
   Waypoint 1: lat=..., lng=...
   Waypoint 2: lat=..., lng=...
✅ Route calculated successfully!
   Distance: XXXX.X km
   Duration: XXhXXm
🗺️ ========== ROUTE CALCULATION END ==========
```

---

## 🎨 **Map Check**

- [ ] Default route shows (usually Balanced 🟡)
- [ ] Click Fastest ⚡ → Map turns 🔴 RED
- [ ] Click Healthiest 🌿 → Map turns 🟢 GREEN
- [ ] Click Balanced ⚖️ → Map turns 🟡 YELLOW
- [ ] All colors change instantly (no loading delay)
- [ ] Distance numbers are different for each route

**All checked? ✅ FIX IS WORKING!**

---

## 🆘 **If It's Not Working**

1. **Hard refresh:** `Ctrl+Shift+R`
2. **Check if frontend is running:**
   ```
   Port 3001 should be active
   ```
3. **Restart frontend:**
   ```
   Kill current process
   Run: pnpm dev
   ```
4. **Check console errors:** F12 → Console → Red text = errors

---

## ✨ **What You'll Notice**

✅ **Healthiest route is clearly longest** (+15%)
✅ **Balanced route is in the middle** (+5%)
✅ **Fastest route is shortest** (base)
✅ **Map colors are obviously different**
✅ **Changes happen instantly** when clicking
✅ **Each route takes different time**

**This shows the pollution-awareness system is working!** 🌍💨🚗
