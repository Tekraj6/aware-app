import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import StepIndicator from '../../components/StepIndicator';
import { QUESTIONS, QuadrantType, QUADRANT_INFO } from '../../constants/questions';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function Step3Question() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const quadrant = params.quadrant as QuadrantType;
  const role = params.role as string;

  const questions = QUESTIONS[quadrant] || [];
  const qColors = colors[quadrant] || colors.accent;
  const info = QUADRANT_INFO[quadrant];

  const handleSelect = (questionText: string) => {
    router.push({
      pathname: '/collect/step4-response',
      params: { quadrant, role, question: questionText }
    });
  };

  return (
    <View style={styles.container}>
      <StepIndicator totalSteps={4} currentStep={2} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Questions you can ask
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose a question that directs the conversation to areas you want to explore with your {role}.
          </Text>
        </Animated.View>

        <View style={styles.questionsContainer}>
          {questions.map((question, index) => (
            <Animated.View 
              key={question.id}
              entering={FadeInRight.delay(index * 80).duration(400).springify()}
            >
              <TouchableOpacity
                onPress={() => handleSelect(question.text)}
                activeOpacity={0.7}
                style={[
                  styles.questionCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: qColors.bg }]}>
                  <Ionicons name="chatbubble-outline" size={20} color={qColors.accent} />
                </View>
                <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                  {question.text}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  questionsContainer: {
    gap: Spacing.md,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  questionText: {
    flex: 1,
    ...Typography.body,
    fontWeight: '500',
    marginRight: Spacing.md,
  },
});
