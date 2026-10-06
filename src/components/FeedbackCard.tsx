import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getRoleLabel } from '../constants/roles';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import { BorderRadius, Spacing, Typography } from '../constants/theme';
import Icon from './Icon';

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
    <div
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }}
      style={{
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        border: `1px solid ${colors.cardBorder}`,
        backgroundColor: colors.card,
        marginBottom: Spacing.sm,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
      }}
      className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: Spacing.sm,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: Spacing.sm,
            paddingRight: Spacing.sm,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: BorderRadius.full,
            gap: 4,
            backgroundColor: qColors.bg,
          }}
        >
          <Icon name={info.icon} size={12} color={qColors.accent} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: qColors.accent,
            }}
          >
            {getRoleLabel(role)}
          </span>
        </div>
        <span
          style={{
            fontSize: Typography.caption.fontSize,
            lineHeight: Typography.caption.lineHeight,
            color: colors.textTertiary,
          }}
        >
          {formattedDate}
        </span>
      </div>

      <div
        style={{
          fontSize: Typography.bodySmall.fontSize,
          lineHeight: Typography.bodySmall.lineHeight,
          color: colors.textSecondary,
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {question}
      </div>

      <div
        style={{
          fontSize: Typography.body.fontSize,
          fontWeight: 500,
          lineHeight: Typography.body.lineHeight,
          color: colors.textPrimary,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {response}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: Spacing.xs,
        }}
      >
        <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
      </div>
    </div>
  );
}
