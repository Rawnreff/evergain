import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.tabIconDefault,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarBackground: () => (
                    <View style={styles.blurContainer}>
                        {Platform.OS === 'ios' ? (
                            <BlurView
                                intensity={60}
                                tint="systemThinMaterialLight"
                                style={StyleSheet.absoluteFill}
                            />
                        ) : (
                            // Android works best with just the translucent background + soft tint if supported
                            <BlurView
                                intensity={30}
                                tint="light"
                                style={StyleSheet.absoluteFill}
                                experimentalBlurMethod='dimezisBlurView'
                            />
                        )}
                    </View>
                ),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="logger"
                options={{
                    title: 'Logger',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="plus.circle.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="analysis"
                options={{
                    title: 'AI Analysis',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="waveform.path.ecg" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ethics"
                options={{
                    title: 'Character',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="heart.text.square.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        height: 70,
        borderRadius: 35,
        marginHorizontal: 16,
        bottom: 24,
        backgroundColor: 'transparent', // Important: transparent so BlurView shows through
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1, // Softer shadow for light theme
        shadowRadius: 20,
    },
    tabBarItem: {
        paddingTop: 8,
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 35,
        overflow: 'hidden',
        backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
        // Android needs more opacity to look good since blur is subtle
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.1)', // Dark border for contrast on light background
    }
});
