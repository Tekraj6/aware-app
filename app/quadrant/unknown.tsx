import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getRealizations, addRealization, RealizationEntry } from '../../storage/dataStore';
import RealizationCard from '../../components/RealizationCard';
import EmptyState from '../../components/EmptyState';
import { QUADRANT_INFO } from '../../constants/questions';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

type TagType = 'self-discovered' | 'others-pointed-out';

export default function UnknownAreaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const info = QUADRANT_INFO.unknown;
  const qColors = colors.unknown;

  const [realizations, setRealizations] = useState<RealizationEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType>('self-discovered');
  const [content, setContent] = useState('');

  useFocusEffect(
    useCallback(() => {
      getRealizations().then(setRealizations);
    }, [])
  );

  const handleSave = async () => {
    if (!content.trim()) return;
    
    const newEntry = await addRealization({
      content: content.trim(),
      tag: selectedTag,
    });
    
    setRealizations(prev => [newEntry, ...prev]);
    setModalVisible(false);
    setContent('');
    setSelectedTag('self-discovered');
  };

  const TagSelector = ({ type, label, icon, activeColor }: { type: TagType, label: string, icon: string, activeColor: string }) => {
    const isActive = selectedTag === type;
    return (
      <TouchableOpacity
        onPress={() => setSelectedTag(type)}
        style={[
          styles.tagOption,
          { 
            backgroundColor: isActive ? activeColor : colors.card,
            borderColor: isActive ? activeColor : colors.cardBorder,
          }
        ]}
      >
        <Ionicons name={icon as any} size={16} color={isActive ? activeColor.replace('1B', '66').replace('2A', '64') : colors.textSecondary} />
        <Text style={[
          styles.tagOptionText, 
          { color: isActive ? activeColor.replace('1B', '66').replace('2A', '64') : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Surprises</Text>
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
              {realizations.length} {info.signalLabel}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.actionRow}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Realizations</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={[styles.addText, { color: qColors.accent }]}>+ Add Discovery</Text>
            </TouchableOpacity>
          </View>

          {realizations.length === 0 ? (
            <EmptyState
              icon="bulb-outline"
              title="No Discoveries Yet"
              message="When you or someone else discovers something completely new about you, log it here."
            />
          ) : (
            realizations.map((entry, index) => (
              <RealizationCard
                key={entry.id}
                {...entry}
                index={index}
                onPress={() => router.push(`/feedback/${entry.id}?type=realization`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Realization Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>New Realization</Text>
              <TouchableOpacity onPress={handleSave} disabled={!content.trim()}>
                <Text style={[styles.modalSave, { color: !content.trim() ? colors.textTertiary : qColors.accent }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>How did you discover this?</Text>
              <View style={styles.tagSelectorContainer}>
                <TagSelector 
                  type="self-discovered" 
                  label="I realized it" 
                  icon="sparkles" 
                  activeColor={colors.tagSelfDiscovered} 
                />
                <TagSelector 
                  type="others-pointed-out" 
                  label="Someone pointed it out" 
                  icon="people" 
                  activeColor={colors.tagOthersPointedOut} 
                />
              </View>
              
              <TextInput
                style={[
                  styles.textInput, 
                  { color: colors.textPrimary, backgroundColor: colors.card, borderColor: colors.cardBorder }
                ]}
                placeholder="What did you discover about yourself?"
                placeholderTextColor={colors.textTertiary}
                multiline
                autoFocus
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  scrollContent: { paddingBottom: Spacing.xxl },
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
  
  // Modal styles
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: { ...Typography.h3 },
  modalCancel: { ...Typography.body },
  modalSave: { ...Typography.button },
  modalContent: { padding: Spacing.lg },
  label: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  tagSelectorContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  tagOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  tagOptionText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  textInput: {
    ...Typography.body,
    minHeight: 150,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
});
