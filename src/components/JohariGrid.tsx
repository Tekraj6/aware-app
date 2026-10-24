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
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: 168,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        border: `1px solid ${qColors.accent}33`,
        backgroundColor: qColors.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
        boxSizing: 'border-box',
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
            fontSize: 15,
            fontWeight: Typography.h3.fontWeight,
            lineHeight: Typography.h3.lineHeight,
            color: qColors.accent,
            marginBottom: 2,
            wordBreak: 'normal',
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
            minHeight: 28,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
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
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: qColors.accent,
            lineHeight: 1,
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
    <div
      style={{
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: Spacing.md,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
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
