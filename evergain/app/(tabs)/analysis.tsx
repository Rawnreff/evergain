import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

const screenWidth = Dimensions.get('window').width;

// Mock Data for Graph
const dataPoints = [60, 65, 70, 72, 75, 75, 80]; // Progress over sessions

export default function AnalysisScreen() {
    const maxVal = Math.max(...dataPoints);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>AI Analyst</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>BETA</Text>
                    </View>
                </View>

                {/* 1. Stagnation Alert (Conditional) */}
                <View style={styles.alertCard}>
                    <View style={styles.alertIconBox}>
                        <IconSymbol name="waveform.path.ecg" size={20} color={Colors.warning} />
                    </View>
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>Potential Plateau Detected</Text>
                        <Text style={styles.alertText}>Your Bench Press load hasn't increased in 3 sessions. Consider checking form or increasing volume.</Text>
                    </View>
                </View>

                {/* 2. 1RM Predictor Graph */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>1RM Prediction</Text>
                        <Text style={styles.cardSubtitle}>Bench Press</Text>
                    </View>

                    <View style={styles.graphContainer}>
                        {dataPoints.map((value, index) => {
                            const height = (value / maxVal) * 150;
                            return (
                                <View key={index} style={styles.barContainer}>
                                    <LinearGradient
                                        colors={index === dataPoints.length - 1 ? Colors.gradientPrimary : [Colors.surface, Colors.textSecondary]}
                                        style={[styles.bar, { height: height }]}
                                    />
                                    <Text style={styles.barLabel}>{value}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={styles.graphLabel}>Last 7 Sessions</Text>
                </View>

                {/* 3. Load Adjustment Advice */}
                <Text style={styles.sectionTitle}>Recommendations</Text>

                <View style={styles.recommendationCard}>
                    <LinearGradient
                        colors={Colors.gradientHealth}
                        style={styles.recIconBox}
                    >
                        <IconSymbol name="plus.circle.fill" size={24} color={Colors.textInverted} />
                    </LinearGradient>
                    <View style={styles.recContent}>
                        <Text style={styles.recTitle}>Increase Load</Text>
                        <Text style={styles.recText}>Add +2.5kg to your Squat next session. Your RPE was consistently below 7.</Text>
                    </View>
                </View>

                <View style={styles.recommendationCard}>
                    <View style={[styles.recIconBox, { backgroundColor: Colors.surface }]}>
                        <IconSymbol name="heart.text.square.fill" size={24} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.recContent}>
                        <Text style={styles.recTitle}>Deload Week</Text>
                        <Text style={styles.recText}>Accumulated fatigue is high. Consider reducing intensity by 40% next week.</Text>
                    </View>
                </View>

            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginRight: 10,
    },
    badge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        color: Colors.textInverted,
        fontSize: 10,
        fontWeight: 'bold',
    },
    alertCard: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7', // Light Amber
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    alertIconBox: {
        marginRight: 12,
        marginTop: 2,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D97706', // Amber 600
        marginBottom: 4,
    },
    alertText: {
        fontSize: 14,
        color: '#92400E', // Amber 800
        lineHeight: 20,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
            },
            android: {
                elevation: 8,
            }
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
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    graphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        marginBottom: 16,
    },
    barContainer: {
        alignItems: 'center',
        width: (screenWidth - 96) / 7, // approximate width
    },
    bar: {
        width: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    graphLabel: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    recommendationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
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
    recIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    recContent: {
        flex: 1,
    },
    recTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    recText: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
});
