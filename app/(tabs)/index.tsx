import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { getProfile, getStats, UserProfile } from '../../storage/dataStore';
import JohariGrid from '../../components/JohariGrid';
import QuoteCard from '../../components/QuoteCard';
import PrimaryButton from '../../components/PrimaryButton';
import { getRandomQuote, Quote } from '../../constants/quotes';
import { Spacing, Typography } from '../../constants/theme';
import { QuadrantType } from '../../constants/questions';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quote, setQuote] = useState<Quote>(getRandomQuote());
  const [refreshing, setRefreshing] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setQuote(getRandomQuote());
    setRefreshing(false);
  }, []);

  const handleQuadrantPress = (quadrant: QuadrantType) => {
    router.push(`/quadrant/${quadrant}`);
  };

  const handleCollectFeedback = () => {
    router.push('/collect/step1-quadrant');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>
            Hello, {profile?.name || 'Explorer'} 👋
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Understand yourself. Grow yourself.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: Spacing.md }]}>
            Johari Window
          </Text>
          <JohariGrid counts={counts} onPress={handleQuadrantPress} />
        </View>

        <View style={styles.section}>
          <QuoteCard quote={quote} />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Collect Feedback"
            onPress={handleCollectFeedback}
            icon={<Text style={{ fontSize: 20, color: '#fff', marginRight: 8 }}>💬</Text>}
          />
          <Text style={[styles.footerHint, { color: colors.textTertiary }]}>
            Invite people who know you well
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  greeting: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  footerHint: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
