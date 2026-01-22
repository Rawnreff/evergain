import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const AIQuote = ({ quote = "Strength is about control, not ego. Perform every rep with intention." }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>DAILY AI WISDOM</Text>
            <Text style={styles.quote}>"{quote}"</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.insightBox,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        borderLeftWidth: 4,
        borderLeftColor: Colors.accentAI,
    },
    label: {
        color: Colors.accentAI,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
    },
    quote: {
        color: '#E0E0E0',
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 22,
    },
});
