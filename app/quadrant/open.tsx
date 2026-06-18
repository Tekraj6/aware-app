import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getFeedback, FeedbackEntry } from '../../storage/dataStore';
import FeedbackCard from '../../components/FeedbackCard';
import EmptyState from '../../components/EmptyState';
import PrimaryButton from '../../components/PrimaryButton';
import { QUADRANT_INFO } from '../../constants/questions';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function OpenAreaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const info = QUADRANT_INFO.open;
  const qColors = colors.open;

  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFeedback().then(all => {
        setFeedback(all.filter(f => f.quadrant === 'open'));
      });
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Explore</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, { backgroundColor: qColors.bg, borderColor: qColors.accent + '20' }]}>
          <View style={[styles.iconContainer, { backgroundColor: qColors.accent + '20' }]}>
            <Ionicons name={info.icon as any} size={32} color={qColors.accent} />
          </View>
          <Text style={[styles.title, { color: qColors.accent }]}>{info.title}</Text>
          <Text style={[styles.subtitle, { color: qColors.accent + 'AA' }]}>{info.subtitle}</Text>
          <Text style={[styles.description, { color: qColors.accent }]}>{info.description}</Text>
          
          <View style={[styles.signalBadge, { backgroundColor: colors.card }]}>
            <Text style={[styles.signalText, { color: qColors.accent }]}>
              {feedback.length} {info.signalLabel}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.actionRow}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Insights</Text>
            <TouchableOpacity onPress={() => router.push('/collect/step1-quadrant')}>
              <Text style={[styles.addText, { color: qColors.accent }]}>+ Add Insight</Text>
            </TouchableOpacity>
          </View>

          {feedback.length === 0 ? (
            <EmptyState
              icon={info.icon}
              title={`No ${info.title} Insights`}
              message="Ask people what you're consistently good at and log their answers here."
            />
          ) : (
            feedback.map((entry, index) => (
              <FeedbackCard
                key={entry.id}
                {...entry}
                index={index}
                onPress={() => router.push(`/feedback/${entry.id}?type=feedback`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.divider }]}>
        <PrimaryButton
          title="Collect Feedback"
          onPress={() => router.push('/collect/step2-role?quadrant=open')}
          style={{ backgroundColor: qColors.accent }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: { padding: Spacing.sm },
  headerTitle: { ...Typography.h3 },
  scrollContent: { paddingBottom: 100 },
  hero: {
    margin: Spacing.md,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { ...Typography.h1, marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.lg },
  description: { ...Typography.body, textAlign: 'center', marginBottom: Spacing.lg },
  signalBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signalText: { fontSize: 14, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.md },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.h2 },
  addText: { ...Typography.button },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
});
