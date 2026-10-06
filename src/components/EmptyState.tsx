import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Spacing, Typography } from '../constants/theme';
import Icon from './Icon';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.xxl,
        paddingLeft: Spacing.xl,
        paddingRight: Spacing.xl,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacing.md,
          backgroundColor: colors.accentLight,
        }}
      >
        <Icon name={icon} size={32} color={colors.accent} />
      </div>
      <div
        style={{
          fontSize: Typography.h3.fontSize,
          fontWeight: Typography.h3.fontWeight,
          lineHeight: Typography.h3.lineHeight,
          color: colors.textPrimary,
          marginBottom: Spacing.sm,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: Typography.bodySmall.fontSize,
          lineHeight: '22px',
          color: colors.textSecondary,
          maxWidth: 320,
        }}
      >
        {message}
      </div>
    </div>
  );
}
