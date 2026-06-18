import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { 
  getFeedback, updateFeedback, deleteFeedback,
  getJournalEntries, updateJournalEntry, deleteJournalEntry,
  getRealizations, updateRealization, deleteRealization,
  FeedbackEntry, JournalEntry, RealizationEntry
} from '../../storage/dataStore';
import PrimaryButton from '../../components/PrimaryButton';
import { QUADRANT_INFO, QuadrantType } from '../../constants/questions';
import { getRoleLabel } from '../../constants/roles';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export default function EntryDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const type = params.type as 'feedback' | 'journal' | 'realization';

  const [entry, setEntry] = useState<FeedbackEntry | JournalEntry | RealizationEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadEntry();
  }, [id, type]);

  const loadEntry = async () => {
    if (type === 'feedback') {
      const all = await getFeedback();
      const item = all.find(e => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.response);
      }
    } else if (type === 'journal') {
      const all = await getJournalEntries();
      const item = all.find(e => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.content);
      }
    } else if (type === 'realization') {
      const all = await getRealizations();
      const item = all.find(e => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.content);
      }
    }
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    
    try {
      if (type === 'feedback') {
        await updateFeedback(id, { response: editContent.trim() });
      } else if (type === 'journal') {
        await updateJournalEntry(id, { content: editContent.trim() });
      } else if (type === 'realization') {
        await updateRealization(id, { content: editContent.trim() });
      }
      setIsEditing(false);
      await loadEntry();
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update entry');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (type === 'feedback') await deleteFeedback(id);
              else if (type === 'journal') await deleteJournalEntry(id);
              else if (type === 'realization') await deleteRealization(id);
              
              router.back();
            } catch (error) {
              console.error('Error deleting entry:', error);
            }
          },
        },
      ]
    );
  };

  if (!entry) return null;

  // Determine theme colors based on type and quadrant
  let qColors = colors.accent;
  let bgColors = colors.accentLight;
  let iconName = 'document-text';
  let title = 'Entry';
  let subtitle = '';
  let date = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (type === 'feedback') {
    const fEntry = entry as FeedbackEntry;
    qColors = colors[fEntry.quadrant as QuadrantType].accent;
    bgColors = colors[fEntry.quadrant as QuadrantType].bg;
    iconName = QUADRANT_INFO[fEntry.quadrant as QuadrantType].icon;
    title = fEntry.question;
    subtitle = `Feedback from ${getRoleLabel(fEntry.role)}`;
  } else if (type === 'journal') {
    const jEntry = entry as JournalEntry;
    qColors = colors.hidden.accent;
    bgColors = colors.hidden.bg;
    iconName = QUADRANT_INFO.hidden.icon;
    title = jEntry.prompt;
    subtitle = 'Private Reflection';
  } else if (type === 'realization') {
    const rEntry = entry as RealizationEntry;
    qColors = colors.unknown.accent;
    bgColors = colors.unknown.bg;
    iconName = QUADRANT_INFO.unknown.icon;
    title = rEntry.tag === 'self-discovered' ? 'Self-discovered' : 'Someone pointed it out';
    subtitle = 'Surprising Realization';
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.iconButton}>
            <Ionicons name={isEditing ? "close" : "pencil"} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.metaContainer}>
            <View style={[styles.iconContainer, { backgroundColor: bgColors }]}>
              <Ionicons name={iconName as any} size={24} color={qColors} />
            </View>
            <View style={styles.metaText}>
              <Text style={[styles.subtitle, { color: qColors }]}>{subtitle.toUpperCase()}</Text>
              <Text style={[styles.date, { color: colors.textTertiary }]}>{date}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.textPrimary }
                ]}
                multiline
                autoFocus
                value={editContent}
                onChangeText={setEditContent}
                textAlignVertical="top"
              />
              <PrimaryButton
                title="Save Changes"
                onPress={handleSave}
                style={{ marginTop: Spacing.lg, backgroundColor: qColors }}
                disabled={!editContent.trim()}
              />
            </View>
          ) : (
            <Text style={[styles.content, { color: colors.textSecondary }]}>
              {type === 'feedback' ? (entry as FeedbackEntry).response : 
               type === 'journal' ? (entry as JournalEntry).content : 
               (entry as RealizationEntry).content}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: { padding: Spacing.sm },
  scrollContent: {
    padding: Spacing.xl,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  metaText: { flex: 1 },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  date: { ...Typography.caption },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xl,
  },
  content: {
    ...Typography.body,
    fontSize: 18,
    lineHeight: 28,
  },
  editContainer: {
    marginTop: Spacing.md,
  },
  textInput: {
    ...Typography.body,
    minHeight: 200,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: 18,
    lineHeight: 28,
  },
});
