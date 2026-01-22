import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { WorkoutInput as IWorkoutInput } from '../services/api';

interface WorkoutInputProps {
    onSubmit: (data: IWorkoutInput) => void;
    isLoading: boolean;
    onValuesChange?: (weight: number, reps: number, sets: number) => void;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({ onSubmit, isLoading, onValuesChange }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [feeling, setFeeling] = useState('');

    // Effect to notify parent of changes
    useEffect(() => {
        if (onValuesChange) {
            const w = parseFloat(weight) || 0;
            const r = parseInt(reps) || 0;
            const s = parseInt(sets) || 0;
            onValuesChange(w, r, s);
        }
    }, [weight, reps, sets, onValuesChange]);

    const handleSubmit = () => {
        onSubmit({
            weight: parseFloat(weight),
            reps: parseInt(reps),
            sets: parseInt(sets),
            feeling,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>WEIGHT (KG)</Text>
            <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="0.0"
                placeholderTextColor="#555"
            />

            <View style={styles.row}>
                <View style={styles.half}>
                    <Text style={styles.label}>REPS</Text>
                    <TextInput
                        style={styles.input}
                        value={reps}
                        onChangeText={setReps}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.half}>
                    <Text style={styles.label}>SETS</Text>
                    <TextInput
                        style={styles.input}
                        value={sets}
                        onChangeText={setSets}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#555"
                    />
                </View>
            </View>

            <Text style={styles.label}>FEELING</Text>
            <TextInput
                style={styles.input}
                value={feeling}
                onChangeText={setFeeling}
                placeholder="e.g. Easy, Hard, Grind"
                placeholderTextColor="#555"
            />

            <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
                <LinearGradient
                    colors={['#00D1FF', '#C6FF5E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>FINISH WORKOUT</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    half: {
        width: '48%',
    },
    button: {
        marginTop: 32,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});
