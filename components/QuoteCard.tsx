import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Quote } from '../constants/quotes';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(800).delay(400)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={20}
        color={colors.accent}
        style={styles.quoteIcon}
      />
      <Text style={[styles.quoteText, { color: colors.textPrimary }]}>
        "{quote.text}"
      </Text>
      <Text style={[styles.author, { color: colors.accent }]}>
        — {quote.author}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  quoteIcon: {
    marginBottom: Spacing.sm,
  },
  quoteText: {
    ...Typography.quote,
    marginBottom: Spacing.sm,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
  },
});
