import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { InsightRing } from '@/components/InsightRing';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.1.4:8080/api';

interface Session {
  _id: string;
  session_type: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  total_sets: number;
  total_volume: number;
  is_active: boolean;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({ workouts: 0, volume: 0, duration: 0 });
  const [nextSessionType, setNextSessionType] = useState('Push');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions/history?user_id=default_user&limit=50`);
      if (response.ok) {
        const data: Session[] = await response.json();
        setRecentSessions(data.slice(0, 3)); // Keep top 3 for display

        // Calculate Stats
        const totalWorkouts = data.length;
        const totalVolume = data.reduce((acc, curr) => acc + (curr.total_volume || 0), 0);
        const totalDuration = data.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);

        setStats({
          workouts: totalWorkouts,
          volume: totalVolume,
          duration: totalDuration
        });

        // Predict Next Session
        if (data.length > 0) {
          const lastSession = data[0];
          const type = lastSession.session_type;
          if (type === 'Push') setNextSessionType('Pull');
          else if (type === 'Pull') setNextSessionType('Legs');
          else if (type === 'Legs') setNextSessionType('Push');
          else setNextSessionType('Push'); // Default fallback
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const formatGMT7 = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const startNextSession = () => {
    // Navigate to logger and auto-start session
    router.push({
      pathname: '/(tabs)/logger',
      params: { autoStart: nextSessionType }
    });
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

        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.username}>{user?.full_name || 'Athlete'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || 'U'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 1: Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(stats.volume / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Kg Lifted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(stats.duration / 60).toFixed(1)}h</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Section 2: Progressive Insight Ring */}
        <View style={styles.insightSection}>
          <InsightRing progress={0.82} text="82%" subtext="Weekly Target" />
        </View>

        {/* Section 3: Daily AI Quote */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={Colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiQuoteCard}
          >
            <View style={styles.badge}>
              <IconSymbol name="waveform.path.ecg" size={16} color={Colors.textInverted} />
              <Text style={styles.badgeText}>AI Insight</Text>
            </View>
            <Text style={styles.quoteText}>
              "Consistency is the code to success. Keep logging, keep lifting, keep evolving."
            </Text>
            <View style={styles.quoteFooter}>
              <Text style={styles.quoteAuthor}>- EverGain AI</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Section 4: Next Recommended Session */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Session</Text>
          <TouchableOpacity onPress={() => router.push('/logger')}>
            <Text style={styles.seeAll}>See Plan</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={startNextSession}>
          <View style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionIconBox}>
                <IconSymbol name="plus.circle.fill" size={28} color={Colors.primary} />
              </View>
              <View style={styles.sessionText}>
                <Text style={styles.sessionTitle}>{nextSessionType}</Text>
                <Text style={styles.sessionSubtitle}>Recommended Next Workout</Text>
              </View>
            </View>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
              <IconSymbol name="chevron.right" size={16} color={Colors.textInverted} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Section 5: Recent Activity */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : recentSessions.length === 0 ? (
          <Text style={{ color: Colors.textSecondary, textAlign: 'center', marginTop: 10 }}>No recent activity.</Text>
        ) : (
          <View style={styles.recentActivityList}>
            {recentSessions.map((session) => (
              <View key={session._id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <IconSymbol name="clock.fill" size={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{session.session_type}</Text>
                  <Text style={styles.activityDate}>{getRelativeTime(session.started_at)} • {formatGMT7(session.started_at)}</Text>
                </View>
                <View style={[styles.activityStatus, !session.is_active && { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.activityStatusText, !session.is_active && { color: '#059669' }]}>
                    {session.is_active ? 'Active' : 'Completed'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

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
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  insightSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cardContainer: {
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      }
    })
  },
  aiQuoteCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.textInverted,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  quoteText: {
    fontSize: 18,
    color: Colors.textInverted,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  quoteFooter: {
    alignItems: 'flex-end',
  },
  quoteAuthor: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      }
    })
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sessionText: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: Colors.textInverted,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recentActivityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activityStatus: {
    backgroundColor: 'rgba(198, 255, 94, 0.2)', // Light green bg
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 12,
    color: '#8ABF00', // Darker green text
    fontWeight: '600',
  },
});
