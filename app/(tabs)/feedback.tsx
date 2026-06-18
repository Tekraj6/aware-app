import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter as useExpoRouter, useFocusEffect as useExpoFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getFeedback, getRealizations, getJournalEntries, FeedbackEntry, RealizationEntry, JournalEntry } from '../../storage/dataStore';
import FeedbackCard from '../../components/FeedbackCard';
import RealizationCard from '../../components/RealizationCard';
import JournalCard from '../../components/JournalCard';
import EmptyState from '../../components/EmptyState';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { QUADRANT_INFO, QuadrantType } from '../../constants/questions';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FeedbackTab() {
  const { colors } = useTheme();
  const router = useExpoRouter();

  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [realizations, setRealizations] = useState<RealizationEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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

  useExpoFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const openEntries = feedback.filter((f) => f.quadrant === 'open');
  const blindspotEntries = feedback.filter((f) => f.quadrant === 'blindspot');

  const handlePress = (id: string, type: 'feedback' | 'realization' | 'journal') => {
    router.push(`/feedback/${id}?type=${type}`);
  };

  const toggleSection = (section: QuadrantType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection(quadrant)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconContainer, { backgroundColor: qColors.bg }]}>
              <Ionicons name={info.icon as any} size={20} color={qColors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: qColors.accent }]}>{title}</Text>
            <View style={[styles.badge, { backgroundColor: qColors.bg }]}>
              <Text style={[styles.badgeText, { color: qColors.accent }]}>{count}</Text>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={colors.textTertiary} 
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {count === 0 ? (
              <EmptyState
                icon={info.icon}
                title={emptyTitle}
                message={emptyMessage}
              />
            ) : (
              content
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Feedback & Insights</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {renderSection(
          'open', 
          'Open Area', 
          openEntries.length,
          openEntries.map((entry, index) => (
            <FeedbackCard key={entry.id} {...entry} index={index} onPress={() => handlePress(entry.id, 'feedback')} />
          )),
          "No Open Area Feedback",
          "Tap 'Collect Feedback' on the home screen to start exploring this area."
        )}

        {renderSection(
          'blindspot', 
          'Blind Spot', 
          blindspotEntries.length,
          blindspotEntries.map((entry, index) => (
            <FeedbackCard key={entry.id} {...entry} index={index} onPress={() => handlePress(entry.id, 'feedback')} />
          )),
          "No Blind Spot Feedback",
          "Tap 'Collect Feedback' on the home screen to start exploring this area."
        )}

        {renderSection(
          'hidden', 
          'Hidden Area', 
          journals.length,
          journals.map((entry, index) => (
            <JournalCard key={entry.id} {...entry} index={index} onPress={() => handlePress(entry.id, 'journal')} />
          )),
          "No Journal Entries",
          "Your hidden area is for things only you know. Start reflecting privately."
        )}

        {renderSection(
          'unknown', 
          'Unknown Area', 
          realizations.length,
          realizations.map((entry, index) => (
            <RealizationCard key={entry.id} {...entry} index={index} onPress={() => handlePress(entry.id, 'realization')} />
          )),
          "No Realizations",
          "When you discover something completely new about yourself, capture it here."
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    ...Typography.h1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    marginRight: Spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
});
