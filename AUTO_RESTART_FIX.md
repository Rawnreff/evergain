# Auto-Restart Bug Fix

## Problem
When starting a session from the "Next Session" button in index.tsx, after ending the session it would automatically restart the same session.

## Root Cause
The logger.tsx had a useEffect that monitored the `autoStart` URL parameter:

```typescript
useEffect(() => {
    if (!checkingSession && !activeSession && autoStart) {
        startSession(autoStart as string);
    }
}, [checkingSession, activeSession, autoStart]);
```

When the user ended a session:
1. `activeSession` was set to `null`
2. The useEffect detected `!activeSession && autoStart` was true
3. It automatically called `startSession()` again
4. This created an infinite loop of starting sessions

## Solution
Added a `hasAutoStarted` flag to ensure the auto-start logic only runs once:

```typescript
const [hasAutoStarted, setHasAutoStarted] = useState(false);

useEffect(() => {
    if (!checkingSession && !activeSession && autoStart && !hasAutoStarted) {
        console.log('🚀 Auto-starting session:', autoStart);
        setHasAutoStarted(true);
        startSession(autoStart as string);
    }
}, [checkingSession, activeSession, autoStart, hasAutoStarted]);
```

Also improved the `endSession()` function to properly clear all session-related state:
- Clear activeSession
- Clear selectedExercise
- Clear availableExercises
- Clear previousSet
- Clear workoutSets
- Reset all input fields (weight, reps, RPE, notes, sets)

## Testing
To test the fix:
1. Go to index.tsx (Dashboard)
2. Click "Start" button on "Next Session" card
3. Logger should auto-start the session
4. Log some sets
5. Click "Finish Workout" and confirm
6. Session should end and NOT auto-restart

## Files Modified
- `evergain/app/(tabs)/logger.tsx`
