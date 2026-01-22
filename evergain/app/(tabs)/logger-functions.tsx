// Additional functions for logger.tsx
// Add these functions to the LoggerScreen component

// Load previous set for current exercise
const loadPreviousSet = async (sessionId: string, exerciseName: string) => {
    try {
        const response = await fetch(
            `${API_URL}/workout-sets/last-set?session_id=${sessionId}&exercise_name=${encodeURIComponent(exerciseName)}`
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.weight) {
                setPreviousSet({
                    weight: data.weight,
                    reps: data.reps,
                    rpe: data.rpe
                });
            } else {
                setPreviousSet(null);
            }
        }
    } catch (error) {
        console.error('Failed to load previous set:', error);
        setPreviousSet(null);
    }
};

// Load workout history for current session
const loadWorkoutHistory = async (sessionId: string) => {
    try {
        const response = await fetch(`${API_URL}/workout-sets/session/${sessionId}`);
        
        if (response.ok) {
            const data = await response.json();
            setWorkoutSets(data);
        }
    } catch (error) {
        console.error('Failed to load workout history:', error);
    }
};

// Get set count for current exercise
const getSetCount = async (sessionId: string, exerciseName: string): Promise<number> => {
    try {
        const response = await fetch(
            `${API_URL}/workout-sets/count?session_id=${sessionId}&exercise_name=${encodeURIComponent(exerciseName)}`
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.count;
        }
    } catch (error) {
        console.error('Failed to get set count:', error);
    }
    return 0;
};

// Updated logSet function
const logSet = async () => {
    if (!weight || !reps) {
        Alert.alert('Missing Data', 'Please enter weight and reps');
        return;
    }

    if (!selectedExercise) {
        Alert.alert('No Exercise', 'Please select an exercise');
        return;
    }

    if (!activeSession) {
        Alert.alert('No Active Session', 'Please start a workout session first');
        return;
    }

    try {
        // Prepare set data
        const setData = {
            session_id: activeSession._id,
            exercise_name: selectedExercise.name,
            weight: parseFloat(weight),
            reps: parseInt(reps),
            rpe: rpe ? parseInt(rpe) : undefined,
            notes: notes || undefined
        };

        // Log the set
        const response = await fetch(`${API_URL}/workout-sets/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(setData)
        });

        if (response.ok) {
            const loggedSet = await response.json();
            
            // Show success message
            Alert.alert(
                'Set Logged! 💪',
                `${selectedExercise.name}\n${weight}kg × ${reps} reps${rpe ? ` @ RPE ${rpe}` : ''}`,
                [{ text: 'OK' }]
            );

            // Update previous set
            setPreviousSet({
                weight: parseFloat(weight),
                reps: parseInt(reps),
                rpe: rpe ? parseInt(rpe) : undefined
            });

            // Reload workout history
            loadWorkoutHistory(activeSession._id);

            // Update session stats
            setActiveSession(prev => prev ? {
                ...prev,
                total_sets: prev.total_sets + 1,
                total_volume: prev.total_volume + (parseFloat(weight) * parseInt(reps))
            } : null);

            // Start rest timer automatically
            setRestTimer(restDuration);
            setIsResting(true);

            // Clear inputs for next set
            setWeight('');
            setReps('');
            setRPE('');
            setNotes('');
            
            // Update set counter
            const newCount = await getSetCount(activeSession._id, selectedExercise.name);
            setSets(String(newCount + 1));
        } else {
            const error = await response.json();
            Alert.alert('Error', error.error || 'Failed to log set');
        }
    } catch (error) {
        console.error('Failed to log set:', error);
        Alert.alert('Error', 'Failed to log set. Please try again.');
    }
};

// Repeat last set
const repeatLastSet = () => {
    if (!previousSet) {
        Alert.alert('No Previous Set', 'No previous set to repeat');
        return;
    }

    setWeight(String(previousSet.weight));
    setReps(String(previousSet.reps));
    if (previousSet.rpe) {
        setRPE(String(previousSet.rpe));
    }
    
    Alert.alert('Set Repeated', 'Values filled from previous set');
};

// Add note
const addNote = () => {
    setNoteModalVisible(true);
};

// Save note
const saveNote = (noteText: string) => {
    setNotes(noteText);
    setNoteModalVisible(false);
    if (noteText) {
        Alert.alert('Note Added', 'Note will be saved with your next set');
    }
};

// Format previous set display
const formatPreviousSet = (): string => {
    if (!previousSet) {
        return 'No previous set';
    }
    
    let text = `${previousSet.weight}kg × ${previousSet.reps}`;
    if (previousSet.rpe) {
        text += ` @ RPE ${previousSet.rpe}`;
    }
    return text;
};

// Update the exercise selection to load previous set
const selectExercise = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExercisePickerVisible(false);
    
    if (activeSession) {
        // Load previous set for this exercise
        await loadPreviousSet(activeSession._id, exercise.name);
        
        // Update set counter
        const count = await getSetCount(activeSession._id, exercise.name);
        setSets(String(count + 1));
    }
};
