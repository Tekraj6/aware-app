import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
  textStyle,
}: PrimaryButtonProps) {
  const { colors } = useTheme();

  const getVariantStyles = (): {
    backgroundColor: string;
    color: string;
    border?: string;
  } => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.accentLight,
          color: colors.accent,
        };
      case 'danger':
        return {
          backgroundColor: colors.dangerLight,
          color: colors.danger,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.textPrimary,
          border: `1px solid ${colors.divider}`,
        };
      default:
        return {
          backgroundColor: colors.accent,
          color: '#FFFFFF',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: Spacing.lg,
        paddingRight: Spacing.lg,
        borderRadius: BorderRadius.lg,
        minHeight: 56,
        border: variantStyles.border || 'none',
        backgroundColor: variantStyles.backgroundColor,
        color: variantStyles.color,
        fontSize: Typography.button.fontSize,
        fontWeight: Typography.button.fontWeight,
        lineHeight: Typography.button.lineHeight,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.1s ease, opacity 0.2s ease',
        userSelect: 'none',
        ...style,
      }}
      className="active:scale-[0.98] transition-all"
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      ) : (
        <>
          {icon}
          <span
            style={{
              marginLeft: icon ? Spacing.sm : 0,
              ...textStyle,
            }}
          >
            {title}
          </span>
        </>
      )}
    </button>
  );
}
