import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { getRoleLabel } from '../constants/roles';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

interface FeedbackCardProps {
  id: string;
  quadrant: 'open' | 'blindspot';
  role: string;
  question: string;
  response: string;
  date: string;
  onPress: () => void;
  index?: number;
}

export default function FeedbackCard({
  quadrant,
  role,
  question,
  response,
  date,
  onPress,
  index = 0,
}: FeedbackCardProps) {
  const { colors } = useTheme();
  const qColors = colors[quadrant as QuadrantType];
  const info = QUADRANT_INFO[quadrant as QuadrantType];

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).duration(400).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: qColors.bg }]}>
            <Ionicons name={info.icon as any} size={12} color={qColors.accent} />
            <Text style={[styles.badgeText, { color: qColors.accent }]}>
              {getRoleLabel(role)}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formattedDate}
          </Text>
        </View>
        <Text
          style={[styles.question, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {question}
        </Text>
        <Text
          style={[styles.response, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {response}
        </Text>
        <View style={styles.footer}>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  date: {
    ...Typography.caption,
  },
  question: {
    ...Typography.bodySmall,
    marginBottom: 4,
  },
  response: {
    ...Typography.body,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
  },
});
