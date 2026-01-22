# Logger Integration Test Guide

## Prerequisites
1. ✅ Backend server running on port 8080
2. ✅ MongoDB running
3. ✅ Database seeded with exercises
4. ✅ Mobile app connected to backend

## Test Checklist

### 1. Start Session ✅
- [ ] Open app
- [ ] Click "Start Workout Session"
- [ ] Select "Hypertrophy" session
- [ ] Verify exercises load successfully
- [ ] Verify first exercise auto-selected

### 2. Previous Set Display ✅
- [ ] Check "Previous: No previous set" shows initially
- [ ] Select different exercise
- [ ] Verify previous set updates

### 3. Log First Set ✅
- [ ] Enter weight: 60
- [ ] Enter reps: 10
- [ ] Enter RPE: 7
- [ ] Click "Log Set"
- [ ] Verify success alert shows: "Cable Crossover\n60kg × 10 reps @ RPE 7"
- [ ] Verify rest timer starts automatically
- [ ] Verify inputs cleared
- [ ] Verify set counter shows "Set 2"
- [ ] Verify previous set shows "60kg × 10 @ RPE 7"

### 4. Repeat Set ✅
- [ ] Click "Repeat Set" button
- [ ] Verify weight filled: 60
- [ ] Verify reps filled: 10
- [ ] Verify RPE filled: 7
- [ ] Verify alert shows "Set Repeated"

### 5. Log Second Set ✅
- [ ] Modify weight to 65
- [ ] Keep reps at 10
- [ ] Click "Log Set"
- [ ] Verify success alert
- [ ] Verify previous set updates to "65kg × 10 @ RPE 7"
- [ ] Verify set counter shows "Set 3"

### 6. Add Note ✅
- [ ] Click "Add Note" button
- [ ] Enter note: "Felt strong today"
- [ ] Click "Save Note"
- [ ] Verify "Note added" indicator appears
- [ ] Verify note button color changes to primary

### 7. Log Set with Note ✅
- [ ] Enter weight: 70
- [ ] Enter reps: 8
- [ ] Enter RPE: 9
- [ ] Click "Log Set"
- [ ] Verify set logged successfully
- [ ] Verify note indicator disappears

### 8. Switch Exercise ✅
- [ ] Click exercise selector
- [ ] Select "Bench Press"
- [ ] Verify previous set shows "No previous set"
- [ ] Verify set counter shows "Set 1"
- [ ] Log a set for Bench Press
- [ ] Switch back to Cable Crossover
- [ ] Verify previous set shows last Cable Crossover set
- [ ] Verify set counter shows "Set 4"

### 9. Session Stats ✅
- [ ] Check session card shows updated stats
- [ ] Verify total sets count increases
- [ ] Verify total volume increases

### 10. End Session ✅
- [ ] Click "Finish Workout"
- [ ] Verify confirmation dialog
- [ ] Click "End Session"
- [ ] Verify completion alert shows:
  - Duration (e.g., "5.2 min")
  - Total Sets (e.g., "6")
  - Total Volume (e.g., "3840 kg")
- [ ] Verify stats match actual logged sets

### 11. Rest Timer ✅
- [ ] Log a set
- [ ] Verify rest timer starts automatically
- [ ] Verify timer counts down
- [ ] Verify timer button shows active state
- [ ] Click timer to stop early
- [ ] Verify timer stops

### 12. Quick Actions ✅
- [ ] Verify "Start Rest" button works
- [ ] Verify "Repeat Set" disabled when no previous set
- [ ] Verify "Repeat Set" enabled after logging set
- [ ] Verify "Add Note" button opens modal
- [ ] Verify note indicator shows when note added

## Expected Results

### Backend Logs:
```
✅ Logged workout set: Cable Crossover - 60.0kg x 10
✅ Updated session stats: 1 sets, 600.0 kg
✅ Logged workout set: Cable Crossover - 65.0kg x 10
✅ Updated session stats: 2 sets, 1250.0 kg
...
```

### Frontend Console:
```
🚀 Logger screen mounted
📡 API_URL: http://192.168.1.4:8080/api
Loading exercises for session: Hypertrophy
Exercises loaded: 34 exercises
```

## Common Issues & Solutions

### Issue: "Failed to load exercises"
**Solution:** 
- Check backend is running
- Verify API_URL in logger.tsx matches your IP
- Run: `cd backend && python app.py`

### Issue: "Failed to log set"
**Solution:**
- Check backend logs for errors
- Verify MongoDB is running
- Test API: `python test_workout_sets_api.py`

### Issue: Previous set not showing
**Solution:**
- Check browser/app console for errors
- Verify API endpoint returns data
- Test: `curl "http://192.168.1.4:8080/api/workout-sets/last-set?session_id=XXX&exercise_name=Cable%20Crossover"`

### Issue: Session stats not updating
**Solution:**
- Check backend logs
- Verify update_session_stats() is called
- Check MongoDB sessions collection

## Success Criteria

✅ All 12 test sections pass
✅ No console errors
✅ Backend logs show successful operations
✅ Session stats accurate
✅ Previous set tracking works
✅ Repeat set functionality works
✅ Notes can be added and saved
✅ Rest timer auto-starts
✅ UI responsive and smooth

## Performance Checks

- [ ] Set logging < 500ms
- [ ] Exercise switching < 300ms
- [ ] Previous set loading < 200ms
- [ ] No UI freezing
- [ ] Smooth animations

## Final Verification

Run complete workout simulation:
1. Start Hypertrophy session
2. Log 3 sets of Cable Crossover (60kg, 65kg, 70kg)
3. Switch to Bench Press
4. Log 3 sets of Bench Press (80kg, 85kg, 90kg)
5. Add notes to some sets
6. Use repeat set feature
7. End session
8. Verify final stats:
   - Total Sets: 6
   - Total Volume: (60×10 + 65×10 + 70×10 + 80×10 + 85×10 + 90×10) = 5100 kg

If all checks pass: **✅ INTEGRATION SUCCESSFUL!**
