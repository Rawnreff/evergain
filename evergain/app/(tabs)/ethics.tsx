import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EthicsScreen() {
    const [integrityScore, setIntegrityScore] = useState(94);
    const [goodForm, setGoodForm] = useState(false);
    const [noEgo, setNoEgo] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Character & Ethics</Text>
                </View>

                {/* 1. Integrity Score */}
                <View style={styles.scoreContainer}>
                    <LinearGradient
                        colors={Colors.gradientPrimary}
                        style={styles.scoreCircle}
                    >
                        <Text style={styles.scoreValue}>{integrityScore}</Text>
                        <Text style={styles.scoreLabel}>Integrity Score</Text>
                    </LinearGradient>
                    <Text style={styles.scoreDescription}>
                        You are in the top 5% of disciplined athletes. Keep maintaining your form standards.
                    </Text>
                </View>

                {/* 2. Post-Workout Integrity Check */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Post-Session Reflection</Text>

                    <View style={styles.checkItem}>
                        <View style={styles.checkTextContainer}>
                            <Text style={styles.checkLabel}>Technique Integrity</Text>
                            <Text style={styles.checkDesc}>I performed every rep with full range of motion and control.</Text>
                        </View>
                        <Switch
                            value={goodForm}
                            onValueChange={setGoodForm}
                            trackColor={{ false: Colors.surface, true: Colors.success }}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.checkItem}>
                        <View style={styles.checkTextContainer}>
                            <Text style={styles.checkLabel}>Anti-Ego Lifting</Text>
                            <Text style={styles.checkDesc}>I chose weights I could handle, not to impress others.</Text>
                        </View>
                        <Switch
                            value={noEgo}
                            onValueChange={setNoEgo}
                            trackColor={{ false: Colors.surface, true: Colors.success }}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitText}>Submit Reflection</Text>
                    </TouchableOpacity>
                </View>

                {/* 3. Moral Badges */}
                <Text style={styles.sectionTitle}>Earned Badges</Text>
                <View style={styles.badgeGrid}>
                    <View style={styles.badgeItem}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#DBEAFE' }]}>
                            <IconSymbol name="heart.text.square.fill" size={32} color="#2563EB" />
                        </View>
                        <Text style={styles.badgeName}>Technique Titan</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#ECFDF5' }]}>
                            <IconSymbol name="waveform.path.ecg" size={32} color="#059669" />
                        </View>
                        <Text style={styles.badgeName}>Consistent</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
                            <IconSymbol name="clock.fill" size={32} color="#D97706" />
                        </View>
                        <Text style={styles.badgeName}>Early Riser</Text>
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
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    scoreCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
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
    scoreValue: {
        fontSize: 56,
        fontWeight: '800',
        color: Colors.textInverted,
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    scoreDescription: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 24,
        paddingHorizontal: 24,
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 20,
    },
    checkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    checkLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    checkDesc: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    submitText: {
        color: Colors.textInverted,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    badgeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badgeItem: {
        alignItems: 'center',
        width: '30%',
    },
    badgeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    badgeName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
});
