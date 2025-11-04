# 🧪 **QUICK TEST - SEARCH PERSISTENCE & AUTO-SAVE**

## ✅ **5 Minute Test**

### **Test Setup**

- Browser: Open DevTools (F12)
- Backend: Running on port 5000
- Frontend: Running on http://localhost:3000
- Logged in: Yes (as any user)

---

## 🧪 **Test 1: Search Persistence (localStorage)**

### **Steps:**

1. **Navigate to search page:**

   ```
   URL: http://localhost:3000/search
   ```

2. **Perform a search:**

   ```
   From: Delhi
   To: Mumbai
   Click: Search

   Expected: 3 routes displayed with AQI data
   ```

3. **Verify localStorage is saving:**

   ```
   Open DevTools (F12)
   → Application tab
   → LocalStorage
   → Find "lastSearch" key

   Expected: Should contain full search data (JSON)
   ```

4. **Navigate away:**

   ```
   Click: Dashboard link
   Navigate to: http://localhost:3000/dashboard

   Expected: Search data cleared from page
   ```

5. **Return to search page:**

   ```
   Click: Search link
   Navigate to: http://localhost:3000/search

   ✅ EXPECTED: Previous search RESTORED!
       - Delhi should show in "From"
       - Mumbai should show in "Destination"
       - Route cards should show
       - Selected route should be marked
   ```

6. **Refresh page:**

   ```
   Press: F5 (hard refresh)

   ✅ EXPECTED: Search still there!
       - All data restored
       - Routes showing
   ```

7. **Check console:**

   ```
   Open Console tab (F12)

   ✅ EXPECTED TO SEE:
       "📂 Restoring previous search: {...}"
       "💾 Search state saved to localStorage"
   ```

---

## 💾 **Test 2: Auto-Save to Database**

### **Steps:**

1. **Open fresh search:**

   ```
   URL: http://localhost:3000/search
   Clear previous search (optional)
   ```

2. **Search new route:**

   ```
   From: Bangalore
   To: Hyderabad
   Click: Search
   ```

3. **Check console for save confirmation:**

   ```
   Open DevTools Console (F12)

   ✅ EXPECTED LOGS:
       "✅ Search saved to history"

   Wait 1-2 seconds for API call to complete
   ```

4. **Select a route:**

   ```
   Click: One of the 3 route cards
       (Fastest ⚡ / Balanced ⚖️ / Healthiest 🌿)

   Expected: Card highlights with "✓ SELECTED"
   ```

5. **Verify route selection saved:**

   ```
   Check Console

   ✅ EXPECTED LOG:
       "📍 Route selected: [route-type], saving to database..."
       "✅ Route selection saved to history"
   ```

---

## 📂 **Test 3: View History**

### **Steps:**

1. **Navigate to history:**

   ```
   URL: http://localhost:3000/search-history
   ```

2. **Verify both searches appear:**

   ```
   ✅ EXPECTED: Should see TWO searches
       1. Bangalore → Hyderabad (most recent)
       2. Delhi → Mumbai (older)
   ```

3. **Verify search details:**

   ```
   Look at Bangalore → Hyderabad search:

   ✅ EXPECTED:
       - From city: Bangalore
       - To city: Hyderabad
       - Date/Time: Recent timestamp
       - Air quality data: Both cities
       - 3 Route options visible
       - Selected route marked with ✓
   ```

4. **Check air quality display:**

   ```
   Each search should show:

   ✅ Source (Bangalore):
       - AQI score with color badge
       - Temperature
       - Humidity

   ✅ Destination (Hyderabad):
       - AQI score with color badge
       - Temperature
       - Humidity
   ```

5. **Verify route options:**

   ```
   Each route card should show:

   ✅ Fastest ⚡:
       - Distance (km)
       - Time (hours:minutes)
       - Avg AQI
       - Pollution level
       - Description

   ✅ Balanced ⚖️:
       - Distance (km)
       - Time
       - Avg AQI
       - Pollution level
       - ✓ SELECTED marker

   ✅ Healthiest 🌿:
       - Distance (km)
       - Time
       - Avg AQI
       - Pollution level
       - Description
   ```

6. **Check selected route summary:**

   ```
   Look for summary section:

   ✅ EXPECTED:
       - Route type selected
       - Total distance
       - Total time
       - Average AQI
       - Pollution level
   ```

---

## 🗑️ **Test 4: Delete Functionality**

### **Steps:**

1. **Delete one search:**

   ```
   Find Delete button on a search card
   Click: Delete button

   Expected: Confirmation/notification
   ```

2. **Verify deletion:**

   ```
   ✅ EXPECTED: Search disappears from history
   ```

3. **Delete all searches:**

   ```
   Look for "Clear All History" button
   Click: Clear All History

   Expected: Confirmation dialog
   ```

4. **Confirm deletion:**

   ```
   Click: OK/Yes to confirm

   ✅ EXPECTED: All searches disappear
   ```

---

## 📊 **Test Results Checklist**

### **Persistence (localStorage)**

- [ ] Search restored after page navigation
- [ ] Search restored after page refresh
- [ ] Search restored after browser restart
- [ ] Console shows restore message

### **Auto-Save (Database)**

- [ ] Search saved when performed
- [ ] Route selection saved when clicked
- [ ] Console shows save confirmation
- [ ] No errors in console

### **History Display**

- [ ] All searches visible in history
- [ ] Search details correct
- [ ] Air quality data showing
- [ ] 3 route options visible
- [ ] Selected route marked
- [ ] Summary section showing

### **Deletion**

- [ ] Can delete individual searches
- [ ] Can delete all searches
- [ ] Deletion confirmed immediately
- [ ] History updates after delete

---

## 🎯 **Success Criteria**

✅ **PASS if:**

- Searches persist when navigating
- Searches persist on page refresh
- Searches appear in history
- All route details preserved
- Route selections tracked
- Can delete searches

❌ **FAIL if:**

- Search disappears on navigation
- Search lost on refresh
- Search not in history
- Data missing from history
- Route selection not saved
- Delete not working

---

## 📱 **Expected Values**

### **Sample Search: Delhi → Mumbai**

```
Source AQI: ~185 (Unhealthy)
Dest AQI: ~142 (Moderate)

Fastest ⚡:
  Distance: 1,425 km
  Time: 17h 49m
  AQI: 163 (High Pollution)

Balanced ⚖️:
  Distance: 1,497 km (≈5% longer)
  Time: 18h 42m (≈5% longer)
  AQI: 146 (Moderate Pollution)

Healthiest 🌿:
  Distance: 1,639 km (≈15% longer)
  Time: 20h 29m (≈25% longer)
  AQI: 106 (Low Pollution)
```

---

## 🔍 **Console Logs to Watch For**

### **Good Signs:**

```
✅ "📂 Restoring previous search: {...}"
✅ "💾 Search state saved to localStorage"
✅ "✅ Search saved to history"
✅ "📍 Route selected: balanced, saving to database..."
✅ "✅ Route selection saved to history"
```

### **Bad Signs:**

```
❌ "Error loading previous search:"
❌ "Failed to save search to history"
❌ "Error saving route selection:"
❌ "Not authenticated"
```

---

## 🚀 **Quick Run Through**

### **60 Second Test:**

1. Search Delhi → Mumbai (10 sec)
2. Select Balanced route (5 sec)
3. Go to Dashboard and back (15 sec)
4. Verify search persisted (10 sec)
5. Go to Search History (10 sec)
6. Verify search is there (10 sec)

**Total: ~1 minute**

---

## 📞 **If Something Breaks**

### **Search not persisting?**

```
1. Check DevTools → Console for errors
2. Check localStorage in DevTools → Application
3. Verify user is logged in
4. Try clearing localStorage and searching again
```

### **Search not saving to DB?**

```
1. Check console for "Failed to save" message
2. Verify backend is running (port 5000)
3. Check backend logs for errors
4. Verify MongoDB is connected
```

### **History not showing searches?**

```
1. Refresh history page
2. Check if searches exist in history page
3. Try logging out and back in
4. Check backend logs
```

---

**That's it! Go test! 🚀**
