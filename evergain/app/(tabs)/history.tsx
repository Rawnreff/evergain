import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFocusEffect } from '@react-navigation/native';
import { API_CONFIG } from '@/services/apiConfig';

// Get API URL based on platform
const API_URL = API_CONFIG.getBaseUrl(Platform.OS);

interface ExerciseLog {
    exercise: string;
    sets: number;
    total_reps: number;
    total_volume: number;
    max_weight: number;
}

interface WorkoutSet {
    _id: string;
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

interface Session {
    _id: string;
    session_type: string;
    started_at: string;
    ended_at: string;
    duration_minutes?: number;
    total_sets: number;
    total_volume: number;
    is_active: boolean;
    exercises_performed: ExerciseLog[];
}

export default function HistoryScreen() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Detail Modal State
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchHistory = async () => {
        try {
            console.log('Fetching session history...');
            const response = await fetch(`${API_URL}/sessions/history?user_id=default_user&limit=20`);

            if (response.ok) {
                const data = await response.json();
                console.log(`Loaded ${data.length} sessions`);
                setSessions(data);
            } else {
                console.error('Failed to fetch history:', response.status);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            Alert.alert('Connection Error', 'Failed to load history. Check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload history when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchHistory();
    }, []);

    const openSessionDetail = async (session: Session) => {
        setSelectedSession(session);
        setDetailVisible(true);
        setLoadingDetail(true);

        // Fetch workout sets for this session
        try {
            const response = await fetch(`${API_URL}/sessions/${session._id}/workout-sets`);
            if (response.ok) {
                const sets = await response.json();
                setWorkoutSets(sets);
            }
        } catch (error) {
            console.error('Error fetching workout sets:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            full: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    // Calculate aggregated stats
    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((sum, s) => sum + (s.total_volume || 0), 0);
    const avgDuration = sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length
        : 0;

    // Helper to group workout sets by exercise
    const getGroupedWorkoutSets = (sets: WorkoutSet[]) => {
        return sets.reduce((acc, set) => {
            if (!acc[set.exercise_name]) {
                acc[set.exercise_name] = [];
            }
            acc[set.exercise_name].push(set);
            return acc;
        }, {} as Record<string, WorkoutSet[]>);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>History & Reports</Text>
                </View>

                {/* 1. Overview Card */}
                <View style={styles.card}>
                    <LinearGradient
                        colors={Colors.gradientAI}
                        style={styles.reportHeader}
                    >
                        <Text style={styles.reportTitle}>Overview</Text>
                        <Text style={styles.reportSubtitle}>Your training summary</Text>
                    </LinearGradient>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalSessions.toString()}</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}k</Text>
                            <Text style={styles.statLabel}>Vol (kg)</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{Math.round(avgDuration).toString()}m</Text>
                            <Text style={styles.statLabel}>Avg Duration</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Recent Sessions Log */}
                <Text style={styles.sectionTitle}>Recent Sessions</Text>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                ) : sessions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={{ opacity: 0.5, marginBottom: 16 }}>
                            <IconSymbol name="clock.fill" size={48} color={Colors.textSecondary} />
                        </View>
                        <Text style={styles.emptyStateText}>No sessions found yet.</Text>
                        <Text style={styles.emptyStateSubtext}>Start a workout in the Logger tab!</Text>
                    </View>
                ) : (
                    <View style={styles.logList}>
                        {sessions.map((session) => {
                            const date = formatDate(session.started_at);
                            return (
                                <TouchableOpacity
                                    key={session._id}
                                    style={styles.logItem}
                                    onPress={() => openSessionDetail(session)}
                                >
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateDay}>{date.day}</Text>
                                        <Text style={styles.dateMonth}>{date.month}</Text>
                                    </View>
                                    <View style={styles.logContent}>
                                        <Text style={styles.logTitle}>{session.session_type}</Text>
                                        <View style={styles.sessionMeta}>
                                            <View style={[styles.statusBadge, session.is_active ? { backgroundColor: '#ECFDF5' } : { backgroundColor: '#F3F4F6' }]}>
                                                <View style={[styles.statusDot, session.is_active ? { backgroundColor: Colors.success } : { backgroundColor: Colors.textSecondary }]} />
                                                <Text style={[styles.statusText, session.is_active ? { color: '#059669' } : { color: Colors.textSecondary }]}>
                                                    {session.is_active ? 'Active' : 'Completed'}
                                                </Text>
                                            </View>
                                            {!session.is_active && session.duration_minutes && (
                                                <Text style={styles.durationText}>
                                                    {`• ${session.duration_minutes.toFixed(0)} min`}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={styles.volumeSubtext}>
                                            {`${session.total_sets} sets • ${session.total_volume} kg`}
                                        </Text>
                                    </View>
                                    <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

            </ScrollView>

            {/* Session Detail Modal */}
            <Modal
                visible={detailVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setDetailVisible(false)}
            >
                {selectedSession && (
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>{selectedSession.session_type}</Text>
                                <Text style={styles.modalSubtitle}>
                                    {`${formatDate(selectedSession.started_at).full} • ${selectedSession.duration_minutes?.toFixed(0) || '0'} min`}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setDetailVisible(false)}>
                                <IconSymbol name="xmark.circle.fill" size={30} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            {/* Summary Stats */}
                            <View style={styles.detailStats}>
                                <View style={styles.detailStatItem}>
                                    <Text style={styles.detailStatValue}>{selectedSession.total_sets}</Text>
                                    <Text style={styles.detailStatLabel}>Total Sets</Text>
                                </View>
                                <View style={styles.detailStatDivider} />
                                <View style={styles.detailStatItem}>
                                    <Text style={styles.detailStatValue}>{selectedSession.total_volume} kg</Text>
                                    <Text style={styles.detailStatLabel}>Volume</Text>
                                </View>
                                <View style={styles.detailStatDivider} />
                                <View style={styles.detailStatItem}>
                                    <Text style={styles.detailStatValue}>{selectedSession.exercises_performed?.length || '0'}</Text>
                                    <Text style={styles.detailStatLabel}>Exercises</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>Workout Log</Text>

                            {loadingDetail ? (
                                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                            ) : workoutSets.length > 0 ? (
                                Object.entries(getGroupedWorkoutSets(workoutSets)).map(([exerciseName, sets], index) => (
                                    <View key={index} style={styles.exerciseCard}>
                                        <View style={styles.exerciseHeader}>
                                            <View style={{ marginRight: 8 }}>
                                                <IconSymbol name="dumbbell.fill" size={16} color={Colors.primary} />
                                            </View>
                                            <Text style={styles.exerciseName}>{exerciseName}</Text>
                                            <Text style={styles.exerciseSetCount}>{sets.length} sets</Text>
                                        </View>

                                        <View style={styles.setTable}>
                                            <View style={styles.setTableHeader}>
                                                <Text style={[styles.setCol, styles.setColNum]}>Set</Text>
                                                <Text style={[styles.setCol, styles.setColWeight]}>kg</Text>
                                                <Text style={[styles.setCol, styles.setColReps]}>Reps</Text>
                                                <Text style={[styles.setCol, styles.setColRPE]}>RPE</Text>
                                            </View>
                                            {sets.map((set, i) => (
                                                <View key={i} style={[styles.setRow, i % 2 === 0 && styles.setRowAlt]}>
                                                    <Text style={[styles.setCol, styles.setColNum]}>{set.set_number}</Text>
                                                    <Text style={[styles.setCol, styles.setColWeight]}>{set.weight}</Text>
                                                    <Text style={[styles.setCol, styles.setColReps]}>{set.reps}</Text>
                                                    <Text style={[styles.setCol, styles.setColRPE]}>{set.rpe != null ? set.rpe : '-'}</Text>
                                                </View>
                                            ))}
                                            {sets[0].notes && (
                                                <View style={styles.notesRow}>
                                                    <IconSymbol name="note.text" size={12} color={Colors.textSecondary} />
                                                    <Text style={styles.notesText}>{sets[0].notes}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyDetail}>
                                    <Text style={styles.emptyDetailText}>No exercises logged in this session.</Text>
                                </View>
                            )}

                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </SafeAreaView>
                )}
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        padding: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        marginBottom: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
            },
            android: {
                elevation: 4,
            }
        })
    },
    reportHeader: {
        padding: 24,
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textInverted,
        marginBottom: 4,
    },
    reportSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        padding: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    logList: {
        gap: 16,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            }
        })
    },
    dateBox: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        padding: 12,
        borderRadius: 12,
        marginRight: 16,
        minWidth: 56,
        height: 56,
    },
    dateDay: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    logContent: {
        flex: 1,
    },
    logTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    sessionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    durationText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginLeft: 4,
    },
    volumeSubtext: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    modalContent: {
        padding: 24,
    },
    detailStats: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    detailStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    detailStatLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    detailStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.border,
    },
    exerciseCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
    },
    exerciseSetCount: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    setTable: {
        padding: 8,
    },
    setTableHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    setRow: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    setRowAlt: {
        backgroundColor: Colors.surface,
    },
    setCol: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.textPrimary,
    },
    setColNum: { flex: 1, color: Colors.textSecondary },
    setColWeight: { flex: 2, fontWeight: '600' },
    setColReps: { flex: 2, fontWeight: '600' },
    setColRPE: { flex: 1, color: Colors.textSecondary },
    notesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        marginTop: 8,
    },
    notesText: {
        fontSize: 12,
        color: '#92400E',
        marginLeft: 6,
        flex: 1,
    },
    emptyDetail: {
        alignItems: 'center',
        padding: 32,
    },
    emptyDetailText: {
        fontSize: 14,
        color: Colors.textSecondary,
    }
});
