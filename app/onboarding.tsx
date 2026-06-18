import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { saveProfile, setOnboarded } from '../storage/dataStore';
import PrimaryButton from '../components/PrimaryButton';
import { Spacing, Typography, BorderRadius } from '../constants/theme';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await saveProfile({
        name: name.trim(),
        photoUri: null,
        createdAt: new Date().toISOString(),
      });
      await setOnboarded();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving profile:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View 
          entering={FadeInUp.duration(800).springify()}
          style={styles.content}
        >
          <Text style={[styles.welcome, { color: colors.textPrimary }]}>
            Welcome to Aware
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Understand yourself. Grow yourself.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              What should we call you?
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }
              ]}
              placeholder="Your name"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(300).duration(800).springify()}
          style={styles.footer}
        >
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={!name.trim() || loading}
            loading={loading}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  welcome: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.h3,
  },
  input: {
    ...Typography.body,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.xxl,
  },
});
