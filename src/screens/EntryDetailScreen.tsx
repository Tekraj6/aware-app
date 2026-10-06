import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getFeedback,
  updateFeedback,
  deleteFeedback,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  getRealizations,
  updateRealization,
  deleteRealization,
  FeedbackEntry,
  JournalEntry,
  RealizationEntry,
} from '../storage/dataStore';
import PrimaryButton from '../components/PrimaryButton';
import { QUADRANT_INFO, QuadrantType } from '../constants/questions';
import { getRoleLabel } from '../constants/roles';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import Icon from '../components/Icon';

interface EntryDetailScreenProps {
  id: string;
  type: 'feedback' | 'journal' | 'realization';
  onBack: () => void;
}

export default function EntryDetailScreen({ id, type, onBack }: EntryDetailScreenProps) {
  const { colors } = useTheme();

  const [entry, setEntry] = useState<FeedbackEntry | JournalEntry | RealizationEntry | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const loadEntry = async () => {
    if (type === 'feedback') {
      const all = await getFeedback();
      const item = all.find((e) => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.response);
      }
    } else if (type === 'journal') {
      const all = await getJournalEntries();
      const item = all.find((e) => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.content);
      }
    } else if (type === 'realization') {
      const all = await getRealizations();
      const item = all.find((e) => e.id === id);
      if (item) {
        setEntry(item);
        setEditContent(item.content);
      }
    }
  };

  useEffect(() => {
    loadEntry();
  }, [id, type]);

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
      alert('Failed to update entry');
    }
  };

  const handleDelete = async () => {
    try {
      if (type === 'feedback') await deleteFeedback(id);
      else if (type === 'journal') await deleteJournalEntry(id);
      else if (type === 'realization') await deleteRealization(id);
      setShowDeleteConfirm(false);
      onBack();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (!entry) return null;

  let qColors = colors.accent;
  let bgColors = colors.accentLight;
  let iconName = 'journal';
  let title = 'Entry';
  let subtitle = '';
  const date = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (type === 'feedback') {
    const fEntry = entry as FeedbackEntry;
    const qInfo = colors[fEntry.quadrant as QuadrantType];
    qColors = qInfo?.accent || colors.accent;
    bgColors = qInfo?.bg || colors.accentLight;
    iconName = QUADRANT_INFO[fEntry.quadrant as QuadrantType]?.icon || 'eye';
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        paddingBottom: Spacing.xxl * 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: Spacing.md,
          paddingRight: Spacing.md,
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.sm,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: Spacing.sm,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.sm }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: Spacing.sm,
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
            }}
            title={isEditing ? 'Cancel Edit' : 'Edit'}
          >
            <Icon name={isEditing ? 'close' : 'pencil'} size={22} color={colors.textSecondary} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: Spacing.sm,
              color: colors.danger,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Delete"
          >
            <Icon name="trash-outline" size={22} color={colors.danger} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: Spacing.xl }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.lg,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: bgColors,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Spacing.md,
            }}
          >
            <Icon name={iconName} size={24} color={qColors} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: qColors,
                marginBottom: 4,
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                fontSize: Typography.caption.fontSize,
                color: colors.textTertiary,
              }}
            >
              {date}
            </div>
          </div>
        </div>

        <h1
          style={{
            fontSize: Typography.h2.fontSize,
            fontWeight: Typography.h2.fontWeight,
            lineHeight: Typography.h2.lineHeight,
            color: colors.textPrimary,
            marginBottom: Spacing.xl,
            marginTop: 0,
          }}
        >
          {title}
        </h1>

        {isEditing ? (
          <div>
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                fontSize: 18,
                lineHeight: '28px',
                padding: Spacing.lg,
                borderRadius: BorderRadius.lg,
                border: `1px solid ${colors.cardBorder}`,
                backgroundColor: colors.card,
                color: colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ marginTop: Spacing.lg }}>
              <PrimaryButton
                title="Save Changes"
                onPress={handleSave}
                style={{ backgroundColor: qColors }}
                disabled={!editContent.trim()}
              />
            </div>
          </div>
        ) : (
          <p
            style={{
              fontSize: 18,
              lineHeight: '28px',
              color: colors.textSecondary,
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}
          >
            {type === 'feedback'
              ? (entry as FeedbackEntry).response
              : type === 'journal'
              ? (entry as JournalEntry).content
              : (entry as RealizationEntry).content}
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: Spacing.lg,
          }}
        >
          <div
            style={{
              backgroundColor: colors.card,
              borderRadius: BorderRadius.xl,
              padding: Spacing.xl,
              maxWidth: 360,
              width: '100%',
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                color: colors.textPrimary,
                marginTop: 0,
                marginBottom: Spacing.sm,
              }}
            >
              Delete Entry
            </h3>
            <p
              style={{
                fontSize: Typography.bodySmall.fontSize,
                lineHeight: Typography.bodySmall.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.xl,
              }}
            >
              Are you sure you want to delete this entry? This cannot be undone.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
              <PrimaryButton
                title="Delete"
                onPress={handleDelete}
                variant="danger"
              />
              <PrimaryButton
                title="Cancel"
                onPress={() => setShowDeleteConfirm(false)}
                variant="ghost"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
