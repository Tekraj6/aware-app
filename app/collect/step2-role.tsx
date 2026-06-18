import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import StepIndicator from '../../components/StepIndicator';
import { ROLES, RoleId } from '../../constants/roles';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function Step2Role() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const quadrant = params.quadrant as string;

  const handleSelect = (roleId: RoleId) => {
    router.push({
      pathname: '/collect/step3-question',
      params: { quadrant, role: roleId }
    });
  };

  return (
    <View style={styles.container}>
      <StepIndicator totalSteps={4} currentStep={1} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Who are you asking?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the relationship. Different roles offer different perspectives.
          </Text>
        </Animated.View>

        <View style={styles.gridContainer}>
          {ROLES.map((role, index) => (
            <Animated.View 
              key={role.id}
              entering={FadeInRight.delay(index * 50).duration(400).springify()}
              style={styles.gridItem}
            >
              <TouchableOpacity
                onPress={() => handleSelect(role.id)}
                activeOpacity={0.7}
                style={[
                  styles.roleCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name={role.icon as any} size={24} color={colors.accent} />
                </View>
                <Text style={[styles.roleLabel, { color: colors.textPrimary }]}>
                  {role.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridItem: {
    width: '47%', // roughly half width minus gap
  },
  roleCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  roleLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
  },
});
