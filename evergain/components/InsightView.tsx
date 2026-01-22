import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { WorkoutResponse } from '../services/api';

interface InsightViewProps {
    data: WorkoutResponse | null;
}

export const InsightView: React.FC<InsightViewProps> = ({ data }) => {
    if (!data) return null;

    return (
        <View style={[styles.container, { borderColor: data.color }]}>
            <Text style={[styles.status, { color: data.color }]}>
                STATUS: {data.progress_state.toUpperCase()}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.adviceHeader}>AI COACH INSIGHT</Text>
            <Text style={styles.advice}>{data.advice}</Text>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>NEW WEIGHT</Text>
                    <Text style={styles.statValue}>{data.weight}kg</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>FEELING</Text>
                    <Text style={styles.statValue}>{data.feeling}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.insightBox,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        marginTop: 24,
        width: '100%',
    },
    status: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter', // Assuming defaults for now
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 12,
    },
    adviceHeader: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    advice: {
        color: Colors.text,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 8,
        width: '48%',
    },
    statLabel: {
        color: '#666',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
