import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import StepIndicator from '../../components/StepIndicator';
import PrimaryButton from '../../components/PrimaryButton';
import { QuadrantType, QUADRANT_INFO } from '../../constants/questions';
import { addFeedback } from '../../storage/dataStore';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function Step4Response() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const quadrant = params.quadrant as QuadrantType;
  const role = params.role as string;
  const question = params.question as string;

  const qColors = colors[quadrant] || colors.accent;
  
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!response.trim()) return;
    
    setLoading(true);
    try {
      await addFeedback({
        quadrant,
        role,
        question,
        response: response.trim(),
      });
      
      router.push({
        pathname: '/collect/step5-saved',
        params: { quadrant }
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator totalSteps={4} currentStep={3} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Log their response
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Type out what they said. Be as honest and accurate as possible.
            </Text>

            <View style={[styles.questionCard, { backgroundColor: qColors.bg, borderColor: qColors.accent + '20' }]}>
              <Text style={[styles.questionLabel, { color: qColors.accent }]}>QUESTION FOR {role.toUpperCase()}</Text>
              <Text style={[styles.questionText, { color: qColors.accent }]}>{question}</Text>
            </View>

            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary 
                }
              ]}
              placeholder="What did they say?"
              placeholderTextColor={colors.textTertiary}
              multiline
              autoFocus
              value={response}
              onChangeText={setResponse}
              textAlignVertical="top"
            />
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.footer}>
          <PrimaryButton
            title="Save Feedback"
            onPress={handleSave}
            disabled={!response.trim() || loading}
            loading={loading}
            style={{ backgroundColor: qColors.accent }}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  questionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  questionText: {
    ...Typography.h3,
  },
  textInput: {
    ...Typography.body,
    minHeight: 200,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: 18,
    lineHeight: 28,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.xxl,
  },
});
