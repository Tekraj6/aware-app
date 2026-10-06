import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { saveProfile, setOnboarded } from '../storage/dataStore';
import PrimaryButton from '../components/PrimaryButton';
import { Spacing, Typography, BorderRadius } from '../constants/theme';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await saveProfile({
        name: name.trim(),
        photoUri: null,
        createdAt: new Date().toISOString(),
      });
      await setOnboarded();
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: Spacing.xl,
        backgroundColor: colors.background,
        maxWidth: 480,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
          Welcome to Aware
        </h1>
        <p
          style={{
            fontSize: Typography.body.fontSize,
            lineHeight: Typography.body.lineHeight,
            color: colors.textSecondary,
            marginBottom: Spacing.xxl,
            marginTop: 0,
          }}
        >
          Understand yourself. Grow yourself.
        </p>

        <form onSubmit={handleContinue}>
          <label
            htmlFor="onboarding-name"
            style={{
              display: 'block',
              fontSize: Typography.h3.fontSize,
              fontWeight: Typography.h3.fontWeight,
              lineHeight: Typography.h3.lineHeight,
              color: colors.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            What should we call you?
          </label>
          <input
            id="onboarding-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            style={{
              width: '100%',
              fontSize: Typography.body.fontSize,
              padding: Spacing.lg,
              borderRadius: BorderRadius.lg,
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: colors.card,
              color: colors.textPrimary,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = colors.accent)}
            onBlur={(e) => (e.target.style.borderColor = colors.cardBorder)}
          />
        </form>
      </div>

      <div style={{ paddingTop: Spacing.xl, paddingBottom: Spacing.md }}>
        <PrimaryButton
          title="Continue"
          onPress={() => handleContinue()}
          disabled={!name.trim() || loading}
          loading={loading}
        />
      </div>
    </div>
  );
}
