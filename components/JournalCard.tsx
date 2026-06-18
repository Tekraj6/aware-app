import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

interface JournalCardProps {
  prompt: string;
  content: string;
  date: string;
  onPress: () => void;
  index?: number;
}

export default function JournalCard({
  prompt,
  content,
  date,
  onPress,
  index = 0,
}: JournalCardProps) {
  const { colors } = useTheme();
  const qColors = colors.hidden;

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
            <Ionicons name="journal" size={12} color={qColors.accent} />
            <Text style={[styles.badgeText, { color: qColors.accent }]}>
              Reflection
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formattedDate}
          </Text>
        </View>
        <Text
          style={[styles.prompt, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {prompt}
        </Text>
        <Text
          style={[styles.content, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {content}
        </Text>
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
  prompt: {
    ...Typography.bodySmall,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  content: {
    ...Typography.body,
  },
});
