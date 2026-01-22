import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

export const NextSessionCard = ({ title = "Upper Body Power", duration = "45 min" }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.label}>NEXT SESSION</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.meta}>{duration} • Focus: Hypertrophy</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    label: {
        color: '#888',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    meta: {
        color: '#666',
        fontSize: 12,
    },
    button: {
        backgroundColor: Colors.accentGain,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
