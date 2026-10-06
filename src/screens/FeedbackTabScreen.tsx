import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getFeedback,
  getRealizations,
  getJournalEntries,
  FeedbackEntry,
  RealizationEntry,
  JournalEntry,
} from '../storage/dataStore';
import FeedbackCard from '../components/FeedbackCard';
import RealizationCard from '../components/RealizationCard';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import Icon from '../components/Icon';

interface FeedbackTabScreenProps {
  onSelectItem: (id: string, type: 'feedback' | 'realization' | 'journal') => void;
}

export default function FeedbackTabScreen({ onSelectItem }: FeedbackTabScreenProps) {
  const { colors } = useTheme();

  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [realizations, setRealizations] = useState<RealizationEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [expandedSection, setExpandedSection] = useState<QuadrantType | null>(null);

  const loadData = async () => {
    try {
      const f = await getFeedback();
      setFeedback(f);

      const r = await getRealizations();
      setRealizations(r);

      const j = await getJournalEntries();
      setJournals(j);
    } catch (error) {
      console.error('Error loading feedback tab data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEntries = feedback.filter((f) => f.quadrant === 'open');
  const blindspotEntries = feedback.filter((f) => f.quadrant === 'blindspot');

  const toggleSection = (section: QuadrantType) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSection = (
    quadrant: QuadrantType,
    title: string,
    count: number,
    content: React.ReactNode,
    emptyTitle: string,
    emptyMessage: string
  ) => {
    const isExpanded = expandedSection === quadrant;
    const qColors = colors[quadrant];
    const info = QUADRANT_INFO[quadrant];

    return (
      <div
        key={quadrant}
        style={{
          marginBottom: Spacing.md,
          borderRadius: BorderRadius.lg,
          border: `1px solid ${colors.cardBorder}`,
          backgroundColor: colors.card,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          onClick={() => toggleSection(quadrant)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSection(quadrant);
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: Spacing.lg,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          className="hover:opacity-90"
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: Spacing.sm,
                backgroundColor: qColors.bg,
              }}
            >
              <Icon name={info.icon} size={20} color={qColors.accent} />
            </div>
            <span
              style={{
                fontSize: Typography.h3.fontSize,
                fontWeight: Typography.h3.fontWeight,
                lineHeight: Typography.h3.lineHeight,
                color: qColors.accent,
                marginRight: Spacing.sm,
              }}
            >
              {title}
            </span>
            <div
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 12,
                backgroundColor: qColors.bg,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: qColors.accent,
                }}
              >
                {count}
              </span>
            </div>
          </div>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.textTertiary}
          />
        </div>

        {isExpanded && (
          <div
            style={{
              paddingLeft: Spacing.md,
              paddingRight: Spacing.md,
              paddingBottom: Spacing.md,
              borderTop: `1px solid ${colors.divider}`,
              paddingTop: Spacing.md,
            }}
          >
            {count === 0 ? (
              <EmptyState icon={info.icon} title={emptyTitle} message={emptyMessage} />
            ) : (
              content
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        paddingBottom: Spacing.xxl * 2,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          paddingLeft: Spacing.lg,
          paddingRight: Spacing.lg,
          paddingTop: Spacing.lg,
          paddingBottom: Spacing.md,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        <h1
          style={{
            fontSize: Typography.h1.fontSize,
            fontWeight: Typography.h1.fontWeight,
            lineHeight: Typography.h1.lineHeight,
            color: colors.textPrimary,
            margin: 0,
          }}
        >
          Feedback &amp; Insights
        </h1>
      </div>

      <div style={{ padding: Spacing.md }}>
        {renderSection(
          'open',
          'Open Area',
          openEntries.length,
          openEntries.map((entry, index) => (
            <FeedbackCard
              key={entry.id}
              {...entry}
              index={index}
              onPress={() => onSelectItem(entry.id, 'feedback')}
            />
          )),
          'No Open Area Feedback',
          "Tap 'Collect Feedback' on the home screen to start exploring this area."
        )}

        {renderSection(
          'blindspot',
          'Blind Spot',
          blindspotEntries.length,
          blindspotEntries.map((entry, index) => (
            <FeedbackCard
              key={entry.id}
              {...entry}
              index={index}
              onPress={() => onSelectItem(entry.id, 'feedback')}
            />
          )),
          'No Blind Spot Feedback',
          "Tap 'Collect Feedback' on the home screen to start exploring this area."
        )}

        {renderSection(
          'hidden',
          'Hidden Area',
          journals.length,
          journals.map((entry, index) => (
            <JournalCard
              key={entry.id}
              {...entry}
              index={index}
              onPress={() => onSelectItem(entry.id, 'journal')}
            />
          )),
          'No Journal Entries',
          'Your hidden area is for things only you know. Start reflecting privately.'
        )}

        {renderSection(
          'unknown',
          'Unknown Area',
          realizations.length,
          realizations.map((entry, index) => (
            <RealizationCard
              key={entry.id}
              {...entry}
              index={index}
              onPress={() => onSelectItem(entry.id, 'realization')}
            />
          )),
          'No Realizations',
          'When you discover something completely new about yourself, capture it here.'
        )}
      </div>
    </div>
  );
}
