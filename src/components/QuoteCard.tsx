import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Quote } from '../constants/quotes';
import { BorderRadius, Spacing, Typography } from '../constants/theme';
import Icon from './Icon';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        margin: `0 ${Spacing.md}px`,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        border: `1px solid ${colors.cardBorder}`,
        backgroundColor: colors.card,
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ marginBottom: Spacing.sm }}>
        <Icon
          name="chatbubble-ellipses-outline"
          size={20}
          color={colors.accent}
        />
      </div>
      <div
        style={{
          fontSize: Typography.quote.fontSize,
          fontWeight: Typography.quote.fontWeight,
          lineHeight: Typography.quote.lineHeight,
          fontStyle: Typography.quote.fontStyle,
          color: colors.textPrimary,
          marginBottom: Spacing.sm,
        }}
      >
        "{quote.text}"
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.accent,
        }}
      >
        — {quote.author}
      </div>
    </div>
  );
}
