import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { API_CONFIG } from '@/services/apiConfig';

// Get API URL based on platform - Now using centralized config!
// To change IP: Update LOCAL_IP in evergain/services/apiConfig.ts
const API_URL = API_CONFIG.getBaseUrl(Platform.OS);

// Types
interface SessionType {
    name: string;
    description: string;
    category: string;
}

interface Exercise {
    name: string;
    muscle_group: string;
    secondary: string;
    sessions: string[];
}

interface ActiveSession {
    _id: string;
    session_type: string;
    started_at: string;
    total_sets: number;
    total_volume: number;
    is_active: boolean;
}

interface WorkoutSet {
    _id?: string;
    session_id: string;
    exercise_name: string;
    weight: number;
    reps: number;
    rpe?: number;
    notes?: string;
    set_number: number;
    timestamp: string;
    volume: number;
}

interface PreviousSet {
    weight: number;
    reps: number;
    rpe?: number;
}

export default function LoggerScreen() {
    const { autoStart } = useLocalSearchParams();

    // Session State
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [sessionDuration, setSessionDuration] = useState('00:00');
    const [hasAutoStarted, setHasAutoStarted] = useState(false);

    // Exercise State
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    // Input State
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRPE] = useState('');
    const [sets, setSets] = useState('1');
    const [volume, setVolume] = useState(0);
    const [notes, setNotes] = useState('');
    const [noteModalVisible, setNoteModalVisible] = useState(false);

    // Previous set state
    const [previousSet, setPreviousSet] = useState<PreviousSet | null>(null);

    // Workout history state
    const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
    const [historyVisible, setHistoryVisible] = useState(false);

    // Rest Timer State
    const [isResting, setIsResting] = useState(false);
    const [restTimer, setRestTimer] = useState(90); // Default 90 seconds
    const [restDuration, setRestDuration] = useState(90);
    const [customRestInput, setCustomRestInput] = useState('90');
    const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Modal States
    const [sessionPickerVisible, setSessionPickerVisible] = useState(false);
    const [exercisePickerVisible, setExercisePickerVisible] = useState(false);
    const [restTimerSettingsVisible, setRestTimerSettingsVisible] = useState(false);
    const [sessionTypes, setSessionTypes] = useState<Record<string, SessionType[]>>({});

    // Load active session on mount
    useEffect(() => {
        console.log('🚀 Logger screen mounted');
        console.log('📡 API_URL:', API_URL);
        checkActiveSession();
        loadSessionTypes();
    }, []);

    // Auto-start session logic (only once)
    useEffect(() => {
        if (!checkingSession && !activeSession && autoStart && !hasAutoStarted) {
            console.log('🚀 Auto-starting session:', autoStart);
            setHasAutoStarted(true);
            startSession(autoStart as string);
        }
    }, [checkingSession, activeSession, autoStart, hasAutoStarted]);

    // Reload session types when picker opens
    useEffect(() => {
        if (sessionPickerVisible && Object.keys(sessionTypes).length === 0) {
            console.log('📋 Session picker opened but empty, loading session types...');
            loadSessionTypes();
        }
    }, [sessionPickerVisible]);

    // Session duration timer
    useEffect(() => {
        if (!activeSession) return;

        const interval = setInterval(() => {
            const startTime = new Date(activeSession.started_at).getTime();
            const now = new Date().getTime();
            const diff = Math.floor((now - startTime) / 1000);

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            if (hours > 0) {
                setSessionDuration(`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setSessionDuration(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);


    // Rest timer countdown
    useEffect(() => {
        if (!isResting) {
            if (restIntervalRef.current) {
                clearInterval(restIntervalRef.current);
                restIntervalRef.current = null;
            }
            return;
        }

        restIntervalRef.current = setInterval(() => {
            setRestTimer((prev) => {
                if (prev <= 1) {
                    setIsResting(false);
                    // Could add notification/sound here
                    return restDuration;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (restIntervalRef.current) {
                clearInterval(restIntervalRef.current);
            }
        };
    }, [isResting, restDuration]);

    // Live volume calculator
    useEffect(() => {
        const w = parseFloat(weight) || 0;
        const r = parseFloat(reps) || 0;
        const s = parseFloat(sets) || 0;
        setVolume(w * r * s);
    }, [weight, reps, sets]);

    // API Functions
    const checkActiveSession = async () => {
        try {
            const response = await fetch(`${API_URL}/sessions/active?user_id=default_user`);
            const data = await response.json();

            if (data.active && data.session) {
                setActiveSession(data.session);
                loadExercisesForSession(data.session.session_type);
            }
        } catch (error) {
            console.error('Failed to check active session:', error);
        } finally {
            setCheckingSession(false);
        }
    };

    const loadSessionTypes = async () => {
        try {
            console.log('Loading session types from:', `${API_URL}/sessions/types/categorized`);
            const response = await fetch(`${API_URL}/sessions/types/categorized`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Session types loaded:', Object.keys(data).length, 'categories');
            setSessionTypes(data);
        } catch (error) {
            console.error('Failed to load session types:', error);
            Alert.alert(
                'Connection Error',
                'Failed to load session types. Make sure the backend server is running.\n\n' +
                'Error: ' + (error instanceof Error ? error.message : String(error))
            );
        }
    };

    const loadExercisesForSession = async (sessionType: string) => {
        try {
            console.log('Loading exercises for session:', sessionType);
            const response = await fetch(`${API_URL}/sessions/exercises?session_type=${sessionType}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Exercises loaded:', data.length, 'exercises');

            // Ensure data is an array
            const exercises = Array.isArray(data) ? data : [];
            setAvailableExercises(exercises);

            // Auto-select first exercise if none selected
            if (exercises.length > 0 && !selectedExercise) {
                setSelectedExercise(exercises[0]);
            }
        } catch (error) {
            console.error('Failed to load exercises:', error);
            // Always set to empty array on error to prevent crashes
            setAvailableExercises([]);
            Alert.alert(
                'Error Loading Exercises',
                'Could not load exercises for this session.\n\n' +
                'Error: ' + (error instanceof Error ? error.message : String(error))
            );
        }
    };

    const startSession = async (sessionType: string) => {
        try {
            const response = await fetch(`${API_URL}/sessions/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'default_user',
                    session_type: sessionType
                })
            });

            if (response.ok) {
                const session = await response.json();
                setActiveSession(session);
                loadExercisesForSession(sessionType);
                setSessionPickerVisible(false);
            } else {
                const error = await response.json();
                Alert.alert('Error', error.error || 'Failed to start session');
            }
        } catch (error) {
            console.error('Failed to start session:', error);
            Alert.alert('Error', 'Failed to start session');
        }
    };

    const endSession = async () => {
        Alert.alert(
            'End Session',
            'Are you sure you want to end this workout session?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'End Session',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/sessions/end`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ user_id: 'default_user' })
                            });

                            if (response.ok) {
                                const completedSession = await response.json();

                                // Clear all session-related state
                                setActiveSession(null);
                                setSelectedExercise(null);
                                setAvailableExercises([]);
                                setPreviousSet(null);
                                setWorkoutSets([]);
                                setWeight('');
                                setReps('');
                                setRPE('');
                                setNotes('');
                                setSets('1');

                                // Show completion alert
                                Alert.alert(
                                    'Session Complete! 🎉',
                                    `Duration: ${completedSession.duration_minutes?.toFixed(1)} min\n` +
                                    `Total Sets: ${completedSession.total_sets}\n` +
                                    `Total Volume: ${completedSession.total_volume} kg`
                                );
                            }
                        } catch (error) {
                            console.error('Failed to end session:', error);
                        }
                    }
                }
            ]
        );
    };

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

    const startRestTimer = () => {
        setRestTimer(restDuration);
        setIsResting(true);
    };

    const stopRestTimer = () => {
        setIsResting(false);
        setRestTimer(restDuration);
    };

    const updateRestDuration = () => {
        const newDuration = parseInt(customRestInput) || 90;
        setRestDuration(newDuration);
        setRestTimer(newDuration);
        setRestTimerSettingsVisible(false);
    };

    // Effect to reset state and load data when exercise changes
    useEffect(() => {
        if (activeSession && selectedExercise) {
            // Reset input fields
            setSets('1');
            setPreviousSet(null);
            setWeight('');
            setReps('');
            setRPE('');
            setNotes('');

            const fetchData = async () => {
                // Load previous set logic
                await loadPreviousSet(activeSession._id, selectedExercise.name);

                // Load set count logic
                const count = await getSetCount(activeSession._id, selectedExercise.name);
                setSets(String(count + 1));
            };

            fetchData();
        } else {
            setSets('1');
            setPreviousSet(null);
            setWeight('');
            setReps('');
        }
    }, [selectedExercise, activeSession]);

    const getCategoryColor = (category: string): string[] => {
        const colors: Record<string, string[]> = {
            'Split': ['#4F46E5', '#6366F1'],
            'Goal': ['#9333EA', '#A855F7'],
            'Isolation': ['#F59E0B', '#FBBF24'],
            'Recovery': ['#10B981', '#34D399'],
            'Specialty': ['#EC4899', '#F472B6'],
            'Full Body': ['#EF4444', '#F87171'],
            'Movement Pattern': ['#06B6D4', '#22D3EE'],
            'Regional': ['#8B5CF6', '#A78BFA'],
            'Variation': ['#64748B', '#94A3B8'],
            'Antagonist': ['#F97316', '#FB923C'],
        };
        return colors[category] || ['#6B7280', '#9CA3AF'];
    };

    const getCategoryIcon = (category: string): string => {
        const icons: Record<string, string> = {
            'Split': 'figure.strengthtraining.traditional',
            'Goal': 'target',
            'Isolation': 'scope',
            'Recovery': 'bed.double.fill',
            'Specialty': 'star.fill',
            'Full Body': 'figure.mixed.cardio',
            'Movement Pattern': 'arrow.triangle.2.circlepath',
            'Regional': 'square.grid.3x3.fill',
            'Variation': 'shuffle',
            'Antagonist': 'arrow.left.arrow.right',
        };
        return icons[category] || 'circle.fill';
    };

    // Group exercises by muscle group (with safety check)
    const groupedExercises = (Array.isArray(availableExercises) ? availableExercises : []).reduce((acc, exercise) => {
        if (!acc[exercise.muscle_group]) {
            acc[exercise.muscle_group] = [];
        }
        acc[exercise.muscle_group].push(exercise);
        return acc;
    }, {} as Record<string, Exercise[]>);

    const formatRestTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Workout Logger</Text>
                    {activeSession && (
                        <Text style={styles.headerSubtitle}>
                            {`${activeSession.session_type} • ${sessionDuration}`}
                        </Text>
                    )}
                </View>

                {/* Rest Timer Button */}
                <TouchableOpacity
                    style={[styles.timerButton, isResting && styles.timerBoxActive]}
                    onPress={() => isResting ? stopRestTimer() : setRestTimerSettingsVisible(true)}
                    onLongPress={() => setRestTimerSettingsVisible(true)}
                >
                    <IconSymbol
                        name={isResting ? "timer" : "clock.fill"}
                        size={20}
                        color={isResting ? Colors.primary : Colors.textSecondary}
                    />
                    <Text style={[styles.timerText, isResting && styles.timerTextActive]}>
                        {isResting ? formatRestTime(restTimer) : 'Rest Timer'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Session Status Card */}
                {!activeSession ? (
                    <TouchableOpacity
                        style={styles.startSessionCard}
                        onPress={() => setSessionPickerVisible(true)}
                    >
                        <LinearGradient
                            colors={Colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.startSessionGradient}
                        >
                            <IconSymbol name="play.circle.fill" size={40} color={Colors.textInverted} />
                            <Text style={styles.startSessionText}>Start Workout Session</Text>
                            <Text style={styles.startSessionSubtext}>Choose your training split</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.activeSessionCard}>
                        <View style={styles.sessionHeader}>
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionType}>{activeSession.session_type}</Text>
                                <Text style={styles.sessionStats}>
                                    {`${activeSession.total_sets} sets • ${activeSession.total_volume} kg`}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.endSessionButton}
                                onPress={endSession}
                            >
                                <IconSymbol name="stop.circle.fill" size={24} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Exercise Selector */}
                {activeSession && (
                    <TouchableOpacity
                        style={styles.exerciseSelector}
                        onPress={() => setExercisePickerVisible(true)}
                    >
                        <View style={styles.iconBox}>
                            <Text style={styles.exerciseIcon}>🏋️</Text>
                        </View>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.label}>Exercise</Text>
                            <Text style={styles.exerciseName}>
                                {selectedExercise?.name || 'Select Exercise'}
                            </Text>
                            {selectedExercise && (
                                <Text style={styles.muscleGroup}>
                                    {`${selectedExercise.muscle_group}${selectedExercise.secondary ? ` • ${selectedExercise.secondary}` : ''}`}
                                </Text>
                            )}
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                )}

                {/* Input Card */}
                {activeSession && selectedExercise && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Set {sets}</Text>
                            <Text style={styles.cardSubtitle}>{formatPreviousSet()}</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="60"
                                    placeholderTextColor={Colors.textSecondary}
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Reps</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="8"
                                    placeholderTextColor={Colors.textSecondary}
                                    keyboardType="numeric"
                                    value={reps}
                                    onChangeText={setReps}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>RPE (1-10)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="8"
                                    placeholderTextColor={Colors.textSecondary}
                                    keyboardType="numeric"
                                    value={rpe}
                                    onChangeText={setRPE}
                                />
                            </View>
                        </View>

                        {/* Note indicator */}
                        {notes && (
                            <View style={styles.noteIndicator}>
                                <IconSymbol name="note.text" size={14} color={Colors.primary} />
                                <Text style={styles.noteIndicatorText}>Note added</Text>
                            </View>
                        )}

                        {/* Live Volume Indicator */}
                        <View style={styles.volumeContainer}>
                            <LinearGradient
                                colors={Colors.gradientAI}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.volumeBadge}
                            >
                                <IconSymbol name="waveform.path.ecg" size={14} color={Colors.textInverted} />
                                <Text style={styles.volumeText}>
                                    Live Volume: {volume > 0 ? volume : '--'} kg
                                </Text>
                            </LinearGradient>
                        </View>

                        <TouchableOpacity
                            style={styles.logButton}
                            onPress={logSet}
                        >
                            <Text style={styles.logButtonText}>Log Set</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Quick Actions */}
                {activeSession && (
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={startRestTimer}
                        >
                            <IconSymbol name="timer" size={20} color={Colors.primary} />
                            <Text style={styles.quickActionText}>Start Rest</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickActionButton, !previousSet && styles.quickActionButtonDisabled]}
                            onPress={repeatLastSet}
                            disabled={!previousSet}
                        >
                            <IconSymbol name="arrow.counterclockwise" size={20} color={previousSet ? Colors.primary : Colors.textSecondary} />
                            <Text style={[styles.quickActionText, previousSet && styles.quickActionTextActive]}>Repeat Set</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={addNote}
                        >
                            <IconSymbol name="note.text" size={20} color={notes ? Colors.primary : Colors.textSecondary} />
                            <Text style={[styles.quickActionText, notes && styles.quickActionTextActive]}>Add Note</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Finish Workout Button */}
                {activeSession && (
                    <TouchableOpacity
                        style={styles.finishWorkoutButton}
                        onPress={endSession}
                    >
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.finishWorkoutGradient}
                        >
                            <IconSymbol name="flag.checkered" size={24} color="#FFFFFF" />
                            <Text style={styles.finishWorkoutText}>Finish Workout</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Session Picker Modal */}
            <Modal
                visible={sessionPickerVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setSessionPickerVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Choose Workout Session</Text>
                        <TouchableOpacity onPress={() => setSessionPickerVisible(false)}>
                            <IconSymbol name="xmark.circle.fill" size={28} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {Object.keys(sessionTypes).length === 0 ? (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 }}>
                                    Loading Sessions...
                                </Text>
                                <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 }}>
                                    Connecting to: {API_URL}
                                </Text>
                                <TouchableOpacity
                                    style={{ backgroundColor: Colors.primary, padding: 16, borderRadius: 12 }}
                                    onPress={() => {
                                        console.log('Manual retry - loading session types');
                                        loadSessionTypes();
                                    }}
                                >
                                    <Text style={{ color: Colors.textInverted, fontWeight: '700' }}>
                                        Retry Loading
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 20, textAlign: 'center' }}>
                                    Check console for error messages
                                </Text>
                            </View>
                        ) : (
                            Object.entries(sessionTypes).map(([category, types]) => (
                                <View key={category} style={styles.categorySection}>
                                    <View style={styles.categoryHeader}>
                                        <IconSymbol
                                            name={getCategoryIcon(category)}
                                            size={20}
                                            color={getCategoryColor(category)[0]}
                                        />
                                        <Text style={styles.categoryTitle}>{category}</Text>
                                    </View>

                                    <View style={styles.sessionGrid}>
                                        {types.map((type) => (
                                            <TouchableOpacity
                                                key={type.name}
                                                style={styles.sessionCard}
                                                onPress={() => startSession(type.name)}
                                            >
                                                <LinearGradient
                                                    colors={getCategoryColor(category)}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.sessionCardGradient}
                                                >
                                                    <Text style={styles.sessionCardName}>{type.name}</Text>
                                                    <Text style={styles.sessionCardDescription}>
                                                        {type.description}
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Exercise Picker Modal */}
            <Modal
                visible={exercisePickerVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setExercisePickerVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Select Exercise
                            {activeSession && (
                                <Text style={styles.modalSubtitle}>{` • ${activeSession.session_type}`}</Text>
                            )}
                        </Text>
                        <TouchableOpacity onPress={() => setExercisePickerVisible(false)}>
                            <IconSymbol name="xmark.circle.fill" size={28} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {Object.entries(groupedExercises).map(([muscleGroup, exercises]) => (
                            <View key={muscleGroup} style={styles.muscleGroupSection}>
                                <View style={styles.muscleGroupHeader}>
                                    <Text style={styles.muscleGroupTitle}>{muscleGroup}</Text>
                                    <View style={styles.muscleGroupBadge}>
                                        <Text style={styles.muscleGroupBadgeText}>
                                            {exercises.length}
                                        </Text>
                                    </View>
                                </View>

                                {exercises.map((exercise) => (
                                    <TouchableOpacity
                                        key={exercise.name}
                                        style={[
                                            styles.exerciseItem,
                                            selectedExercise?.name === exercise.name && styles.exerciseItemSelected
                                        ]}
                                        onPress={() => {
                                            setSelectedExercise(exercise);
                                            setExercisePickerVisible(false);
                                        }}
                                    >
                                        <View style={styles.exerciseItemContent}>
                                            <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                                            <View style={styles.exerciseItemTags}>
                                                <View style={styles.muscleTag}>
                                                    <Text style={styles.muscleTagText}>{exercise.muscle_group}</Text>
                                                </View>
                                                {exercise.secondary && (
                                                    <View style={[styles.muscleTag, styles.muscleTagSecondary]}>
                                                        <Text style={styles.muscleTagText}>{exercise.secondary}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        {selectedExercise?.name === exercise.name && (
                                            <IconSymbol name="checkmark.circle.fill" size={24} color={Colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Rest Timer Settings Modal */}
            <Modal
                visible={restTimerSettingsVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setRestTimerSettingsVisible(false)}
            >
                <View style={styles.restTimerModalOverlay}>
                    <View style={styles.restTimerModal}>
                        <Text style={styles.restTimerModalTitle}>Rest Timer Duration</Text>

                        <View style={styles.restTimerPresets}>
                            {[60, 90, 120, 180, 240, 300].map((seconds) => (
                                <TouchableOpacity
                                    key={seconds}
                                    style={[
                                        styles.presetButton,
                                        restDuration === seconds && styles.presetButtonActive
                                    ]}
                                    onPress={() => {
                                        setRestDuration(seconds);
                                        setCustomRestInput(String(seconds));
                                    }}
                                >
                                    <Text style={[
                                        styles.presetButtonText,
                                        restDuration === seconds && styles.presetButtonTextActive
                                    ]}>
                                        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.restTimerLabel}>Custom (seconds)</Text>
                        <TextInput
                            style={styles.restTimerInput}
                            placeholder="90"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="numeric"
                            value={customRestInput}
                            onChangeText={setCustomRestInput}
                        />

                        <View style={styles.restTimerModalButtons}>
                            <TouchableOpacity
                                style={[styles.restTimerModalButton, styles.restTimerModalButtonCancel]}
                                onPress={() => setRestTimerSettingsVisible(false)}
                            >
                                <Text style={styles.restTimerModalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.restTimerModalButton, styles.restTimerModalButtonConfirm]}
                                onPress={updateRestDuration}
                            >
                                <Text style={styles.restTimerModalButtonText}>Set Duration</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Note Modal */}
            <Modal
                visible={noteModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setNoteModalVisible(false)}
            >
                <View style={styles.restTimerModalOverlay}>
                    <View style={styles.restTimerModal}>
                        <Text style={styles.restTimerModalTitle}>Add Note</Text>

                        <TextInput
                            style={[styles.restTimerInput, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Enter your note here..."
                            placeholderTextColor={Colors.textSecondary}
                            multiline
                            numberOfLines={4}
                            value={notes}
                            onChangeText={setNotes}
                        />

                        <View style={styles.restTimerModalButtons}>
                            <TouchableOpacity
                                style={[styles.restTimerModalButton, styles.restTimerModalButtonCancel]}
                                onPress={() => {
                                    setNoteModalVisible(false);
                                    setNotes('');
                                }}
                            >
                                <Text style={styles.restTimerModalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.restTimerModalButton, styles.restTimerModalButtonConfirm]}
                                onPress={() => saveNote(notes)}
                            >
                                <Text style={styles.restTimerModalButtonText}>Save Note</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    timerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.surface,
        borderRadius: 20,
    },
    timerBoxActive: {
        backgroundColor: '#EEF2FF',
    },
    timerText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    timerTextActive: {
        color: Colors.primary,
    },
    container: {
        padding: 24,
    },
    startSessionCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
            },
            android: { elevation: 8 }
        })
    },
    startSessionGradient: {
        padding: 32,
        alignItems: 'center',
    },
    startSessionText: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textInverted,
        marginTop: 12,
    },
    startSessionSubtext: {
        fontSize: 14,
        color: Colors.textInverted,
        opacity: 0.9,
        marginTop: 4,
    },
    activeSessionCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionType: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.primary,
    },
    sessionStats: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    endSessionButton: {
        padding: 8,
    },
    exerciseSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    exerciseIcon: {
        fontSize: 20,
    },
    exerciseInfo: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    muscleGroup: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
            },
            android: { elevation: 8 }
        })
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    inputGroup: {
        flex: 1,
        marginHorizontal: 6,
    },
    inputLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    volumeContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    volumeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    volumeText: {
        color: Colors.textInverted,
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 8,
    },
    logButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    logButtonText: {
        color: Colors.textInverted,
        fontSize: 16,
        fontWeight: '700',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    quickActionButton: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 4,
    },
    quickActionTextActive: {
        color: Colors.primary,
    },
    quickActionButtonDisabled: {
        opacity: 0.5,
    },
    noteIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
        marginBottom: 16,
    },
    noteIndicatorText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
        marginLeft: 6,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    modalContent: {
        flex: 1,
        padding: 24,
    },
    categorySection: {
        marginBottom: 32,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginLeft: 8,
    },
    sessionGrid: {
        gap: 12,
    },
    sessionCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    sessionCardGradient: {
        padding: 20,
    },
    sessionCardName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textInverted,
    },
    sessionCardDescription: {
        fontSize: 14,
        color: Colors.textInverted,
        opacity: 0.9,
        marginTop: 4,
    },
    muscleGroupSection: {
        marginBottom: 24,
    },
    muscleGroupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    muscleGroupTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    muscleGroupBadge: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    muscleGroupBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textInverted,
    },
    exerciseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    exerciseItemSelected: {
        borderColor: Colors.primary,
        borderWidth: 2,
        backgroundColor: '#EEF2FF',
    },
    exerciseItemContent: {
        flex: 1,
    },
    exerciseItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    exerciseItemTags: {
        flexDirection: 'row',
        gap: 6,
    },
    muscleTag: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    muscleTagSecondary: {
        backgroundColor: Colors.secondary,
    },
    muscleTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textInverted,
    },
    restTimerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    restTimerModal: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    restTimerModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    restTimerPresets: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    presetButton: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
    },
    presetButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    presetButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    presetButtonTextActive: {
        color: Colors.textInverted,
    },
    restTimerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    restTimerInput: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 20,
    },
    restTimerModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    restTimerModalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    restTimerModalButtonCancel: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    restTimerModalButtonConfirm: {
        backgroundColor: Colors.primary,
    },
    restTimerModalButtonTextCancel: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    restTimerModalButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textInverted,
    },
    finishWorkoutButton: {
        marginTop: 16,
        marginBottom: 82,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    finishWorkoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        gap: 12,
    },
    finishWorkoutText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});
