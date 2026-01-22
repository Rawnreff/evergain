// Premium Light Theme Palette - Health & Energy Focus
export const Colors = {
  // Main Brand Colors
  primary: '#4F46E5', // Royal Indigo - Primary Action / Brand
  secondary: '#0EA5E9', // Electric Cyan - Accents / AI / Future
  tertiary: '#10B981', // Emerald - Health / Success / Gains

  // Backgrounds
  background: '#F8FAFC', // Ultra Light Slate - Main App Background (Clean)
  card: '#FFFFFF', // Pure White - Cards / Elevated Areas
  surface: '#F1F5F9', // Light Slate - Secondary Backgrounds / Inputs

  // Typography
  textPrimary: '#0F172A', // Slate 900 - Headings / Main Text
  textSecondary: '#64748B', // Slate 500 - Subtitles / Hints
  textInverted: '#FFFFFF', // White - Text on primary buttons/gradients

  // Functional
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  border: '#E2E8F0', // Slate 200 - Subtle borders

  // UI Specific
  tabBar: '#FFFFFF',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#4F46E5',

  // Gradients (Arrays for expo-linear-gradient)
  gradientPrimary: ['#4F46E5', '#6366F1'] as const, // Indigo Flow
  gradientHealth: ['#10B981', '#34D399'] as const, // Emerald Vitality
  gradientAI: ['#0EA5E9', '#38BDF8'] as const, // Cyan Future
  gradientSurface: ['#FFFFFF', '#F8FAFC'] as const, // Subtle card lift
};
