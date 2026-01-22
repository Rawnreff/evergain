import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Header Profile Info */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={Colors.gradientPrimary}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || 'U'}</Text>
                    </LinearGradient>
                    <TouchableOpacity style={styles.editBadge}>
                        <IconSymbol name="gearshape.fill" size={14} color={Colors.textInverted} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{user?.full_name || 'User'}</Text>
                <Text style={styles.joined}>Member since {new Date(user?.created_at || Date.now()).getFullYear()}</Text>
            </View>

            {/* Stats Summary */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>42</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>96</Text>
                    <Text style={styles.statLabel}>Integrity</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>12.5k</Text>
                    <Text style={styles.statLabel}>Vol (kg)</Text>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: '#E0F2FE' }]}>
                        <IconSymbol name="person.fill" size={20} color="#0284C7" />
                    </View>
                    <Text style={styles.menuText}>Personal Details</Text>
                    <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: '#F3E8FF' }]}>
                        <IconSymbol name="bell.fill" size={20} color="#9333EA" />
                    </View>
                    <Text style={styles.menuText}>Notifications</Text>
                    <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: '#DCFCE7' }]}>
                        <IconSymbol name="shield.fill" size={20} color="#16A34A" />
                    </View>
                    <Text style={styles.menuText}>Privacy & Security</Text>
                    <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>More</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: Colors.surface }]}>
                        <IconSymbol name="heart.text.square.fill" size={20} color={Colors.textSecondary} />
                    </View>
                    <Text style={styles.menuText}>My Badges</Text>
                    <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <IconSymbol name="arrow.right.square.fill" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>EverGain v1.0.0 (Beta)</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '800',
        color: Colors.textInverted,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    joined: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
        marginBottom: 32,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            }
        })
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: Colors.border,
        alignSelf: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.surface,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#FAC7C7',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
    version: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 24,
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
});
