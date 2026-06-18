import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getJournalEntries, addJournalEntry, JournalEntry } from '../../storage/dataStore';
import JournalCard from '../../components/JournalCard';
import EmptyState from '../../components/EmptyState';
import PrimaryButton from '../../components/PrimaryButton';
import { QUADRANT_INFO, QUESTIONS, QuadrantQuestion } from '../../constants/questions';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function HiddenAreaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const info = QUADRANT_INFO.hidden;
  const qColors = colors.hidden;
  const prompts = QUESTIONS.hidden;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<QuadrantQuestion | null>(null);
  const [reflectionText, setReflectionText] = useState('');

  useFocusEffect(
    useCallback(() => {
      getJournalEntries().then(setEntries);
    }, [])
  );

  const openPrompt = (prompt: QuadrantQuestion) => {
    setSelectedPrompt(prompt);
    setReflectionText('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedPrompt || !reflectionText.trim()) return;
    
    const newEntry = await addJournalEntry({
      prompt: selectedPrompt.text,
      content: reflectionText.trim(),
    });
    
    setEntries(prev => [newEntry, ...prev]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Private Journal</Text>
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
              {entries.length} {info.signalLabel}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
            Prompts
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsList}>
            {prompts.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                onPress={() => openPrompt(prompt)}
                style={[styles.promptCard, { backgroundColor: colors.card, borderColor: qColors.accent + '40' }]}
              >
                <Text style={[styles.promptText, { color: colors.textPrimary }]}>{prompt.text}</Text>
                <Ionicons name="pencil" size={16} color={qColors.accent} style={{ alignSelf: 'flex-end', marginTop: 8 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: Spacing.xl, marginBottom: Spacing.md }]}>
            Past Reflections
          </Text>

          {entries.length === 0 ? (
            <EmptyState
              icon="journal-outline"
              title="No Reflections Yet"
              message="Tap a prompt above to start exploring your hidden area. This is a private space for you."
            />
          ) : (
            entries.map((entry, index) => (
              <JournalCard
                key={entry.id}
                {...entry}
                index={index}
                onPress={() => router.push(`/feedback/${entry.id}?type=journal`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Reflection Modal */}
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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Reflect</Text>
              <TouchableOpacity onPress={handleSave} disabled={!reflectionText.trim()}>
                <Text style={[styles.modalSave, { color: !reflectionText.trim() ? colors.textTertiary : qColors.accent }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={[styles.modalPrompt, { color: qColors.accent }]}>
                {selectedPrompt?.text}
              </Text>
              
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="Write your reflection here... This is private and stays on your device."
                placeholderTextColor={colors.textTertiary}
                multiline
                autoFocus
                value={reflectionText}
                onChangeText={setReflectionText}
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
  sectionTitle: { ...Typography.h2 },
  promptsList: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  promptCard: {
    width: 240,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.md,
    justifyContent: 'space-between',
  },
  promptText: {
    ...Typography.body,
    fontWeight: '500',
  },
  
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
  modalPrompt: {
    ...Typography.h2,
    marginBottom: Spacing.xl,
  },
  textInput: {
    ...Typography.body,
    minHeight: 200,
    fontSize: 18,
    lineHeight: 28,
  },
});
