import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const RestTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setSeconds(0);
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>REST TIMER</Text>
            <Text style={styles.time}>{formatTime(seconds)}</Text>
            <View style={styles.controls}>
                <TouchableOpacity onPress={toggleTimer} style={styles.button}>
                    <Text style={styles.buttonText}>{isActive ? 'PAUSE' : 'START'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetTimer} style={[styles.button, styles.resetButton]}>
                    <Text style={[styles.buttonText, { color: '#888' }]}>RESET</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 20
    },
    label: {
        color: '#888',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8
    },
    time: {
        color: Colors.accentAI,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        letterSpacing: 2,
        marginBottom: 12
    },
    controls: {
        flexDirection: 'row',
        gap: 16
    },
    button: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20
    },
    resetButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#333'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold'
    }
});
