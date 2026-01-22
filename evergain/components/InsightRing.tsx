import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface InsightRingProps {
    progress?: number; // 0.0 to 1.0
    text?: string;
    subtext?: string;
}

export function InsightRing({ progress = 0.75, text = "75%", subtext = "Weekly Goal" }: InsightRingProps) {
    // Animation for the "fill" - Simplified as a bar or just opacity/scale for now since full ring requires SVG
    // But we can simulate a ring with a rotating gradient for visual flair
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withDelay(500, withTiming(360, { duration: 2000 }));
    }, []);

    return (
        <View style={styles.container}>
            {/* Outer Glow Ring */}
            <LinearGradient
                colors={Colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.outerRing}
            >
                {/* Inner Cutout to make it a ring */}
                <View style={styles.innerCircle}>
                    <Text style={styles.progressText}>{text}</Text>
                    <Text style={styles.subText}>{subtext}</Text>
                </View>
            </LinearGradient>

            {/* Decorative Dots */}
            <View style={[styles.dot, { top: 10, alignSelf: 'center' }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            }
        })
    },
    outerRing: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15, // Thickness of the ring
    },
    innerCircle: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background, // Match background to simulate transparency
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        fontSize: 42,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -1,
    },
    subText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondary,
    }
});
