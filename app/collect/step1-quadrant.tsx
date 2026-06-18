import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import StepIndicator from '../../components/StepIndicator';
import { FEEDBACK_QUADRANTS, QUADRANT_INFO, QuadrantType } from '../../constants/questions';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function Step1Quadrant() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleSelect = (quadrant: QuadrantType) => {
    router.push({
      pathname: '/collect/step2-role',
      params: { quadrant }
    });
  };

  return (
    <View style={styles.container}>
      <StepIndicator totalSteps={4} currentStep={0} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            What area are you exploring?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose the type of feedback you want to collect.
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {FEEDBACK_QUADRANTS.map((quadrant, index) => {
            const info = QUADRANT_INFO[quadrant];
            const qColors = colors[quadrant];
            
            return (
              <Animated.View 
                key={quadrant}
                entering={FadeInRight.delay(index * 100).duration(400).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleSelect(quadrant)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    { 
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    }
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: qColors.bg }]}>
                    <Ionicons name={info.icon as any} size={24} color={qColors.accent} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: qColors.accent }]}>
                      {info.title}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                      {info.subtitle.split(' · ')[1]} {/* Just show the "Known to others" part */}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.h3,
    marginBottom: 2,
  },
  optionSubtitle: {
    ...Typography.caption,
  },
});
