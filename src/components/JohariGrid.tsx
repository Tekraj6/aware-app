import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import { BorderRadius, Spacing, Typography } from '../constants/theme';
import Icon from './Icon';

interface JohariGridProps {
  counts: Record<QuadrantType, number>;
  onPress: (quadrant: QuadrantType) => void;
}

function QuadrantCard({
  quadrant,
  count,
  onPress,
}: {
  quadrant: QuadrantType;
  count: number;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const info = QUADRANT_INFO[quadrant];
  const qColors = colors[quadrant];

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
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        border: `1px solid ${qColors.accent}33`,
        backgroundColor: qColors.bg,
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
      }}
      className="hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm"
    >
      <div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: BorderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.sm,
            backgroundColor: `${qColors.accent}26`,
          }}
        >
          <Icon name={info.icon} size={22} color={qColors.accent} />
        </div>
        <div
          style={{
            fontSize: Typography.h3.fontSize,
            fontWeight: Typography.h3.fontWeight,
            lineHeight: Typography.h3.lineHeight,
            color: qColors.accent,
            marginBottom: 2,
          }}
        >
          {info.title}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            lineHeight: '14px',
            color: `${qColors.accent}AA`,
            marginBottom: Spacing.sm,
          }}
        >
          {info.subtitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: qColors.accent,
          }}
        >
          {count}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: `${qColors.accent}99`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {info.signalLabel}
        </span>
      </div>
    </div>
  );
}

export default function JohariGrid({ counts, onPress }: JohariGridProps) {
  return (
    <div style={{ paddingLeft: Spacing.md, paddingRight: Spacing.md }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
        <QuadrantCard
          quadrant="open"
          count={counts.open}
          onPress={() => onPress('open')}
        />
        <QuadrantCard
          quadrant="blindspot"
          count={counts.blindspot}
          onPress={() => onPress('blindspot')}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.md }}>
        <QuadrantCard
          quadrant="hidden"
          count={counts.hidden}
          onPress={() => onPress('hidden')}
        />
        <QuadrantCard
          quadrant="unknown"
          count={counts.unknown}
          onPress={() => onPress('unknown')}
        />
      </div>
    </div>
  );
}
