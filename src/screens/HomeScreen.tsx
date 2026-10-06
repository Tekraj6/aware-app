import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getProfile, getStats, UserProfile } from '../storage/dataStore';
import JohariGrid from '../components/JohariGrid';
import QuoteCard from '../components/QuoteCard';
import PrimaryButton from '../components/PrimaryButton';
import { getRandomQuote, Quote } from '../constants/quotes';
import { Spacing, Typography } from '../constants/theme';
import { QuadrantType } from '../constants/questions';

interface HomeScreenProps {
  onNavigateToQuadrant: (quadrant: QuadrantType) => void;
  onStartCollectFeedback: () => void;
}

export default function HomeScreen({
  onNavigateToQuadrant,
  onStartCollectFeedback,
}: HomeScreenProps) {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quote, setQuote] = useState<Quote>(getRandomQuote());
  const [counts, setCounts] = useState<Record<QuadrantType, number>>({
    open: 0,
    blindspot: 0,
    hidden: 0,
    unknown: 0,
  });

  const loadData = async () => {
    try {
      const p = await getProfile();
      setProfile(p);
      const stats = await getStats();
      setCounts({
        open: stats.openCount,
        blindspot: stats.blindspotCount,
        hidden: stats.journalCount,
        unknown: stats.realizationCount,
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      {/* Header */}
      <div
        style={{
          paddingLeft: Spacing.lg,
          paddingRight: Spacing.lg,
          paddingTop: Spacing.xl,
          paddingBottom: Spacing.lg,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: Typography.h1.fontSize,
            fontWeight: Typography.h1.fontWeight,
            lineHeight: Typography.h1.lineHeight,
            color: colors.textPrimary,
            marginBottom: Spacing.xs,
            marginTop: 0,
          }}
        >
          Hello, {profile?.name || 'Explorer'} 👋
        </h1>
        <p
          style={{
            fontSize: Typography.body.fontSize,
            lineHeight: Typography.body.lineHeight,
            color: colors.textSecondary,
            margin: 0,
          }}
        >
          Understand yourself. Grow yourself.
        </p>
      </div>

      {/* Johari Grid Section */}
      <div style={{ marginBottom: Spacing.xl }}>
        <h2
          style={{
            fontSize: Typography.h3.fontSize,
            fontWeight: Typography.h3.fontWeight,
            lineHeight: Typography.h3.lineHeight,
            color: colors.textPrimary,
            marginBottom: Spacing.md,
            textAlign: 'center',
            marginTop: 0,
          }}
        >
          Johari Window
        </h2>
        <JohariGrid counts={counts} onPress={onNavigateToQuadrant} />
      </div>

      {/* Quote Section */}
      <div style={{ marginBottom: Spacing.xl }}>
        <QuoteCard quote={quote} />
      </div>

      {/* Footer Action */}
      <div
        style={{
          paddingLeft: Spacing.xl,
          paddingRight: Spacing.xl,
          paddingTop: Spacing.md,
        }}
      >
        <PrimaryButton
          title="Collect Feedback"
          onPress={onStartCollectFeedback}
          icon={<span style={{ fontSize: 20, marginRight: 8 }}>💬</span>}
        />
        <p
          style={{
            fontSize: Typography.caption.fontSize,
            lineHeight: Typography.caption.lineHeight,
            color: colors.textTertiary,
            textAlign: 'center',
            marginTop: Spacing.md,
            marginBottom: 0,
          }}
        >
          Invite people who know you well
        </p>
      </div>
    </div>
  );
}
