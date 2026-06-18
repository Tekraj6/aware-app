import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import { BorderRadius, Spacing, Typography } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface JohariGridProps {
  counts: Record<QuadrantType, number>;
  onPress: (quadrant: QuadrantType) => void;
}

function QuadrantCard({
  quadrant,
  count,
  onPress,
  index,
}: {
  quadrant: QuadrantType;
  count: number;
  onPress: () => void;
  index: number;
}) {
  const { colors } = useTheme();
  const info = QUADRANT_INFO[quadrant];
  const qColors = colors[quadrant];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)
        .duration(500)
        .springify()
        .damping(15)}
      style={{ flex: 1 }}
    >
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.card,
          {
            backgroundColor: qColors.bg,
            borderColor: qColors.accent + '20',
          },
          animatedStyle,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: qColors.accent + '20' }]}>
          <Ionicons
            name={info.icon as any}
            size={22}
            color={qColors.accent}
          />
        </View>
        <Text style={[styles.title, { color: qColors.accent }]}>
          {info.title}
        </Text>
        <Text style={[styles.subtitle, { color: qColors.accent + 'AA' }]}>
          {info.subtitle}
        </Text>
        <View style={styles.signalContainer}>
          <Text style={[styles.signalCount, { color: qColors.accent }]}>
            {count}
          </Text>
          <Text
            style={[styles.signalLabel, { color: qColors.accent + '99' }]}
            numberOfLines={1}
          >
            {info.signalLabel}
          </Text>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
}

export default function JohariGrid({ counts, onPress }: JohariGridProps) {
  const quadrants: QuadrantType[] = ['open', 'blindspot', 'hidden', 'unknown'];

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <QuadrantCard
          quadrant="open"
          count={counts.open}
          onPress={() => onPress('open')}
          index={0}
        />
        <View style={{ width: Spacing.md }} />
        <QuadrantCard
          quadrant="blindspot"
          count={counts.blindspot}
          onPress={() => onPress('blindspot')}
          index={1}
        />
      </View>
      <View style={{ height: Spacing.md }} />
      <View style={styles.row}>
        <QuadrantCard
          quadrant="hidden"
          count={counts.hidden}
          onPress={() => onPress('hidden')}
          index={2}
        />
        <View style={{ width: Spacing.md }} />
        <QuadrantCard
          quadrant="unknown"
          count={counts.unknown}
          onPress={() => onPress('unknown')}
          index={3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    marginBottom: Spacing.sm,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  signalCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  signalLabel: {
    fontSize: 10,
    fontWeight: '500',
    flex: 1,
  },
});
