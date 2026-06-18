import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import { QuadrantType, QUADRANT_INFO } from '../../constants/questions';
import { Spacing, Typography } from '../../constants/theme';

export default function Step5Saved() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const quadrant = params.quadrant as QuadrantType;

  const qColors = colors[quadrant] || colors.accent;
  const info = QUADRANT_INFO[quadrant];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleDone = () => {
    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: qColors.bg }]}>
            <Ionicons name="checkmark-circle" size={80} color={qColors.accent} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(600)}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Feedback Saved
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You've added a new insight to your {info?.title || 'profile'}. Keep exploring to increase your self-awareness.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.footer}>
        <PrimaryButton
          title="Done"
          onPress={handleDone}
          style={{ backgroundColor: qColors.accent }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
});
