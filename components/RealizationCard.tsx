import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

interface RealizationCardProps {
  content: string;
  tag: 'self-discovered' | 'others-pointed-out';
  date: string;
  onPress: () => void;
  index?: number;
}

export default function RealizationCard({
  content,
  tag,
  date,
  onPress,
  index = 0,
}: RealizationCardProps) {
  const { colors } = useTheme();

  const tagConfig = {
    'self-discovered': {
      label: 'Self-discovered',
      bg: colors.tagSelfDiscovered,
      text: colors.tagSelfDiscoveredText,
      icon: 'sparkles' as const,
    },
    'others-pointed-out': {
      label: 'Others pointed out',
      bg: colors.tagOthersPointedOut,
      text: colors.tagOthersPointedOutText,
      icon: 'people' as const,
    },
  };

  const tagInfo = tagConfig[tag];

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
          <View style={[styles.tag, { backgroundColor: tagInfo.bg }]}>
            <Ionicons name={tagInfo.icon} size={12} color={tagInfo.text} />
            <Text style={[styles.tagText, { color: tagInfo.text }]}>
              {tagInfo.label}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formattedDate}
          </Text>
        </View>
        <Text
          style={[styles.content, { color: colors.textPrimary }]}
          numberOfLines={3}
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
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  date: {
    ...Typography.caption,
  },
  content: {
    ...Typography.body,
  },
});
