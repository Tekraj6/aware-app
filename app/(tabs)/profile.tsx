import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../context/ThemeContext';
import { getProfile, getStats, saveProfile, exportAllData, resetAllData, UserProfile } from '../../storage/dataStore';
import PrimaryButton from '../../components/PrimaryButton';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function ProfileTab() {
  const { colors, mode, setMode, isDark } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    feedbackCount: 0,
    journalCount: 0,
    realizationCount: 0,
  });

  const loadData = async () => {
    try {
      const p = await getProfile();
      setProfile(p);
      const s = await getStats();
      setStats(s);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri && profile) {
      const newProfile = { ...profile, photoUri: result.assets[0].uri };
      await saveProfile(newProfile);
      setProfile(newProfile);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const fileUri = `${FileSystem.documentDirectory}aware_export.json`;
      await FileSystem.writeAsStringAsync(fileUri, data);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Aware Data',
        });
      } else {
        Alert.alert('Export Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Error', 'Failed to export your data');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your feedback, journals, and profile data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const StatBox = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
    <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Ionicons name={icon as any} size={24} color={colors.accent} />
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.accentLight }]}>
              {profile?.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarInitial, { color: colors.accent }]}>
                  {profile?.name.charAt(0).toUpperCase() || '?'}
                </Text>
              )}
              <View style={[styles.editBadge, { backgroundColor: colors.accent }]}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{profile?.name}</Text>
          <Text style={[styles.joinDate, { color: colors.textTertiary }]}>
            Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatBox label="Feedback" value={stats.feedbackCount} icon="chatbubbles" />
          <StatBox label="Reflections" value={stats.journalCount} icon="journal" />
          <StatBox label="Realizations" value={stats.realizationCount} icon="bulb" />
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Preferences</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => setMode(val ? 'dark' : 'light')}
              trackColor={{ false: colors.cardBorder, true: colors.accent }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : isDark ? colors.accentLight : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Data</Text>
          
          <PrimaryButton
            title="Export My Data"
            onPress={handleExport}
            variant="secondary"
            icon={<Ionicons name="download-outline" size={20} color={colors.accent} />}
            style={{ marginBottom: Spacing.md }}
          />
          
          <PrimaryButton
            title="Reset All Data"
            onPress={handleReset}
            variant="danger"
            icon={<Ionicons name="warning-outline" size={20} color={colors.danger} />}
          />
        </View>

        {/* Educational Info */}
        <View style={[styles.infoSection, { backgroundColor: colors.accentLight, borderColor: colors.accent + '20' }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={[styles.infoTitle, { color: colors.accent }]}>The Johari Window</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.accent + 'DD' }]}>
            Aware is based on the Johari Window, a psychological framework created in 1955 by Joseph Luft and Harry Ingham. It helps you understand your relationship with yourself and others.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: { ...Typography.h1 },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: { ...Typography.h2, marginBottom: 4 },
  joinDate: { ...Typography.caption },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h2,
    marginTop: Spacing.sm,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  settingsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingText: { ...Typography.body, fontWeight: '500' },
  infoSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoTitle: { ...Typography.h3 },
  infoText: { ...Typography.bodySmall, lineHeight: 22 },
});
