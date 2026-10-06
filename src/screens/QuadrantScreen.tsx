import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getFeedback,
  addFeedback,
  getJournalEntries,
  addJournalEntry,
  getRealizations,
  addRealization,
  FeedbackEntry,
  JournalEntry,
  RealizationEntry,
} from '../storage/dataStore';
import FeedbackCard from '../components/FeedbackCard';
import JournalCard from '../components/JournalCard';
import RealizationCard from '../components/RealizationCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import {
  QUADRANT_INFO,
  QUESTIONS,
  QuadrantType,
  QuadrantQuestion,
} from '../constants/questions';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import Icon from '../components/Icon';

interface QuadrantScreenProps {
  quadrant: QuadrantType;
  onBack: () => void;
  onSelectItem: (id: string, type: 'feedback' | 'journal' | 'realization') => void;
  onCollectFeedback: (quadrant: 'open' | 'blindspot') => void;
}

type TagType = 'self-discovered' | 'others-pointed-out';

export default function QuadrantScreen({
  quadrant,
  onBack,
  onSelectItem,
  onCollectFeedback,
}: QuadrantScreenProps) {
  const { colors } = useTheme();
  const info = QUADRANT_INFO[quadrant];
  const qColors = colors[quadrant];

  // Open & Blindspot state
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [openAreaModalOpen, setOpenAreaModalOpen] = useState(false);
  const [strengthTitle, setStrengthTitle] = useState('');
  const [strengthDescription, setStrengthDescription] = useState('');

  // Hidden Area state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<QuadrantQuestion | null>(null);
  const [promptText, setPromptText] = useState('');
  const [reflectionText, setReflectionText] = useState('');

  // Unknown Area state
  const [realizations, setRealizations] = useState<RealizationEntry[]>([]);
  const [realizationModalOpen, setRealizationModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType>('self-discovered');
  const [realizationContent, setRealizationContent] = useState('');

  const loadData = async () => {
    if (quadrant === 'open' || quadrant === 'blindspot') {
      const all = await getFeedback();
      setFeedback(all.filter((f) => f.quadrant === quadrant));
    } else if (quadrant === 'hidden') {
      const entries = await getJournalEntries();
      setJournalEntries(entries);
    } else if (quadrant === 'unknown') {
      const all = await getRealizations();
      setRealizations(all);
    }
  };

  useEffect(() => {
    loadData();
  }, [quadrant]);

  // Hidden Area handlers
  const openPrompt = (prompt: QuadrantQuestion) => {
    setSelectedPrompt(prompt);
    setPromptText(prompt.text);
    setReflectionText('');
    setJournalModalOpen(true);
  };

  const openCustomPrompt = () => {
    setSelectedPrompt(null);
    setPromptText('');
    setReflectionText('');
    setJournalModalOpen(true);
  };

  const handleSaveJournal = async () => {
    const finalPrompt = promptText.trim() || selectedPrompt?.text || 'Private Reflection';
    if (!reflectionText.trim()) return;
    const newEntry = await addJournalEntry({
      prompt: finalPrompt,
      content: reflectionText.trim(),
    });
    setJournalEntries((prev) => [newEntry, ...prev]);
    setJournalModalOpen(false);
    setPromptText('');
    setReflectionText('');
    setSelectedPrompt(null);
  };

  // Unknown Area handlers
  const handleSaveRealization = async () => {
    if (!realizationContent.trim()) return;
    const newEntry = await addRealization({
      content: realizationContent.trim(),
      tag: selectedTag,
    });
    setRealizations((prev) => [newEntry, ...prev]);
    setRealizationModalOpen(false);
    setRealizationContent('');
    setSelectedTag('self-discovered');
  };

  // Open Area handler
  const handleSaveOpenStrength = async () => {
    if (!strengthTitle.trim()) return;
    const newEntry = await addFeedback({
      quadrant: 'open',
      role: 'Self & Others',
      question: strengthTitle.trim(),
      response: strengthDescription.trim() || strengthTitle.trim(),
    });
    setFeedback((prev) => [newEntry, ...prev]);
    setOpenAreaModalOpen(false);
    setStrengthTitle('');
    setStrengthDescription('');
  };

  const headerTitle =
    quadrant === 'hidden'
      ? 'Private Journal'
      : quadrant === 'unknown'
      ? 'Surprises'
      : 'Explore';

  const count =
    quadrant === 'hidden'
      ? journalEntries.length
      : quadrant === 'unknown'
      ? realizations.length
      : feedback.length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        paddingBottom: Spacing.xxl * 3,
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: Spacing.md,
          paddingRight: Spacing.md,
          paddingTop: Spacing.md,
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
        <span
          style={{
            fontSize: Typography.h3.fontSize,
            fontWeight: Typography.h3.fontWeight,
            color: colors.textPrimary,
          }}
        >
          {headerTitle}
        </span>
        <div style={{ width: 40 }} />
      </div>

      {/* Hero Header */}
      <div
        style={{
          margin: Spacing.md,
          padding: Spacing.xl,
          borderRadius: BorderRadius.xl,
          border: `1px solid ${qColors.accent}33`,
          backgroundColor: qColors.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: `${qColors.accent}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.md,
          }}
        >
          <Icon name={info.icon} size={32} color={qColors.accent} />
        </div>
        <h1
          style={{
            fontSize: Typography.h1.fontSize,
            fontWeight: Typography.h1.fontWeight,
            lineHeight: Typography.h1.lineHeight,
            color: qColors.accent,
            marginBottom: 4,
            marginTop: 0,
          }}
        >
          {info.title}
        </h1>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: `${qColors.accent}AA`,
            marginBottom: Spacing.lg,
          }}
        >
          {info.subtitle}
        </div>
        <p
          style={{
            fontSize: Typography.body.fontSize,
            lineHeight: Typography.body.lineHeight,
            color: qColors.accent,
            marginBottom: Spacing.lg,
            marginTop: 0,
          }}
        >
          {info.description}
        </p>

        <div
          style={{
            paddingLeft: Spacing.lg,
            paddingRight: Spacing.lg,
            paddingTop: Spacing.sm,
            paddingBottom: Spacing.sm,
            borderRadius: BorderRadius.full,
            backgroundColor: colors.card,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: qColors.accent,
            }}
          >
            {count} {info.signalLabel}
          </span>
        </div>
      </div>

      {/* Quadrant Specific Content */}
      <div style={{ paddingLeft: Spacing.md, paddingRight: Spacing.md }}>
        {/* Open Area */}
        {quadrant === 'open' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}
            >
              <h2
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Strengths &amp; Qualities
              </h2>
              <button
                onClick={() => setOpenAreaModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: Typography.button.fontSize,
                  fontWeight: Typography.button.fontWeight,
                  color: qColors.accent,
                }}
              >
                + Add Strength &amp; Quality
              </button>
            </div>

            {feedback.length === 0 ? (
              <EmptyState
                icon={info.icon}
                title="No Strengths & Qualities Yet"
                message="Add strengths, skills, and qualities that both you and others recognize about you."
              />
            ) : (
              feedback.map((entry, index) => (
                <FeedbackCard
                  key={entry.id}
                  {...entry}
                  index={index}
                  onPress={() => onSelectItem(entry.id, 'feedback')}
                />
              ))
            )}
          </div>
        )}

        {/* Blind Spot */}
        {quadrant === 'blindspot' && (
          <div>
            <div
              style={{
                marginBottom: Spacing.md,
              }}
            >
              <h2
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Themes
              </h2>
            </div>

            {feedback.length === 0 ? (
              <EmptyState
                icon={info.icon}
                title={`No ${info.title} Feedback`}
                message="Ask people what habits might be holding you back and log their answers here."
              />
            ) : (
              feedback.map((entry, index) => (
                <FeedbackCard
                  key={entry.id}
                  {...entry}
                  index={index}
                  onPress={() => onSelectItem(entry.id, 'feedback')}
                />
              ))
            )}
          </div>
        )}

        {/* Hidden Area */}
        {quadrant === 'hidden' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.xs,
              }}
            >
              <h2
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Guide Prompts
              </h2>
              <button
                onClick={openCustomPrompt}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: Typography.button.fontSize,
                  fontWeight: Typography.button.fontWeight,
                  color: qColors.accent,
                }}
              >
                + Custom Reflection
              </button>
            </div>

            <p
              style={{
                fontSize: Typography.bodySmall.fontSize,
                color: colors.textSecondary,
                marginBottom: Spacing.md,
                marginTop: 0,
              }}
            >
              Prompts are guides to inspire reflection. Tap any prompt to use or customize it, or write your own.
            </p>

            {/* Horizontal scrollable prompt cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: Spacing.md,
                overflowX: 'auto',
                paddingBottom: Spacing.sm,
                marginBottom: Spacing.lg,
              }}
            >
              {/* Custom Reflection Card */}
              <div
                onClick={openCustomPrompt}
                role="button"
                tabIndex={0}
                style={{
                  minWidth: 200,
                  maxWidth: 220,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.md,
                  border: `1px dashed ${qColors.accent}`,
                  backgroundColor: `${qColors.accent}10`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: qColors.accent,
                      marginBottom: 6,
                      textTransform: 'uppercase',
                    }}
                  >
                    Your Own Topic
                  </div>
                  <span
                    style={{
                      fontSize: Typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    Write a custom prompt or free reflection
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: Spacing.md }}>
                  <Icon name="pencil" size={16} color={qColors.accent} />
                </div>
              </div>

              {QUESTIONS.hidden.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => openPrompt(prompt)}
                  role="button"
                  tabIndex={0}
                  style={{
                    minWidth: 220,
                    maxWidth: 240,
                    padding: Spacing.md,
                    borderRadius: BorderRadius.md,
                    border: `1px solid ${qColors.accent}66`,
                    backgroundColor: colors.card,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <span
                    style={{
                      fontSize: Typography.body.fontSize,
                      fontWeight: 500,
                      color: colors.textPrimary,
                      marginBottom: Spacing.md,
                    }}
                  >
                    {prompt.text}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Icon name="pencil" size={16} color={qColors.accent} />
                  </div>
                </div>
              ))}
            </div>

            <h2
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                color: colors.textPrimary,
                marginBottom: Spacing.md,
                marginTop: Spacing.xl,
              }}
            >
              Past Reflections
            </h2>

            {journalEntries.length === 0 ? (
              <EmptyState
                icon="journal-outline"
                title="No Reflections Yet"
                message="Tap a prompt above to start exploring your hidden area. This is a private space for you."
              />
            ) : (
              journalEntries.map((entry, index) => (
                <JournalCard
                  key={entry.id}
                  {...entry}
                  index={index}
                  onPress={() => onSelectItem(entry.id, 'journal')}
                />
              ))
            )}
          </div>
        )}

        {/* Unknown Area */}
        {quadrant === 'unknown' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}
            >
              <h2
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Realizations
              </h2>
              <button
                onClick={() => setRealizationModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: Typography.button.fontSize,
                  fontWeight: Typography.button.fontWeight,
                  color: qColors.accent,
                }}
              >
                + Add Discovery
              </button>
            </div>

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
                  onPress={() => onSelectItem(entry.id, 'realization')}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button for Blindspot ONLY */}
      {quadrant === 'blindspot' && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: 480,
            margin: '0 auto',
            padding: Spacing.lg,
            backgroundColor: colors.background,
            borderTop: `1px solid ${colors.divider}`,
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          <PrimaryButton
            title="Collect Feedback"
            onPress={() => onCollectFeedback(quadrant)}
            style={{ backgroundColor: qColors.accent }}
          />
        </div>
      )}

      {/* Hidden Area Reflection Modal */}
      {journalModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: BorderRadius.xl,
              borderTopRightRadius: BorderRadius.xl,
              padding: Spacing.lg,
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: Spacing.md,
                borderBottom: `1px solid ${colors.divider}`,
                marginBottom: Spacing.lg,
              }}
            >
              <button
                onClick={() => setJournalModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textSecondary,
                  fontSize: Typography.body.fontSize,
                }}
              >
                Cancel
              </button>
              <span
                style={{
                  fontSize: Typography.h3.fontSize,
                  fontWeight: Typography.h3.fontWeight,
                  color: colors.textPrimary,
                }}
              >
                Reflect
              </span>
              <button
                onClick={handleSaveJournal}
                disabled={!reflectionText.trim()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: !reflectionText.trim() ? 'not-allowed' : 'pointer',
                  color: !reflectionText.trim() ? colors.textTertiary : qColors.accent,
                  fontSize: Typography.button.fontSize,
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>

            <div style={{ marginBottom: Spacing.md }}>
              <label
                style={{
                  display: 'block',
                  fontSize: Typography.bodySmall.fontSize,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: Spacing.xs,
                }}
              >
                Prompt / Topic
              </label>
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. What fear do I rarely discuss? Or enter a custom topic"
                style={{
                  width: '100%',
                  fontSize: Typography.h3.fontSize,
                  fontWeight: 600,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.md,
                  border: `1px solid ${colors.cardBorder}`,
                  backgroundColor: colors.card,
                  color: qColors.accent,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <label
              style={{
                display: 'block',
                fontSize: Typography.bodySmall.fontSize,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              Your Reflection
            </label>
            <textarea
              autoFocus
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Write your reflection here... This is private and stays on your device."
              rows={8}
              style={{
                width: '100%',
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
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
          </div>
        </div>
      )}

      {/* Unknown Area Realization Modal */}
      {realizationModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: BorderRadius.xl,
              borderTopRightRadius: BorderRadius.xl,
              padding: Spacing.lg,
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: Spacing.md,
                borderBottom: `1px solid ${colors.divider}`,
                marginBottom: Spacing.lg,
              }}
            >
              <button
                onClick={() => setRealizationModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textSecondary,
                  fontSize: Typography.body.fontSize,
                }}
              >
                Cancel
              </button>
              <span
                style={{
                  fontSize: Typography.h3.fontSize,
                  fontWeight: Typography.h3.fontWeight,
                  color: colors.textPrimary,
                }}
              >
                New Realization
              </span>
              <button
                onClick={handleSaveRealization}
                disabled={!realizationContent.trim()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: !realizationContent.trim() ? 'not-allowed' : 'pointer',
                  color: !realizationContent.trim() ? colors.textTertiary : qColors.accent,
                  fontSize: Typography.button.fontSize,
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>

            <div
              style={{
                fontSize: Typography.h3.fontSize,
                fontWeight: Typography.h3.fontWeight,
                color: colors.textPrimary,
                marginBottom: Spacing.md,
              }}
            >
              How did you discover this?
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl }}>
              <button
                type="button"
                onClick={() => setSelectedTag('self-discovered')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: Spacing.xs,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.md,
                  border: `1px solid ${selectedTag === 'self-discovered' ? colors.tagSelfDiscoveredText : colors.cardBorder}`,
                  backgroundColor: selectedTag === 'self-discovered' ? colors.tagSelfDiscovered : colors.card,
                  color: selectedTag === 'self-discovered' ? colors.tagSelfDiscoveredText : colors.textSecondary,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: Typography.bodySmall.fontSize,
                }}
              >
                <Icon name="sparkles" size={16} />
                <span>I realized it</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTag('others-pointed-out')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: Spacing.xs,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.md,
                  border: `1px solid ${selectedTag === 'others-pointed-out' ? colors.tagOthersPointedOutText : colors.cardBorder}`,
                  backgroundColor: selectedTag === 'others-pointed-out' ? colors.tagOthersPointedOut : colors.card,
                  color: selectedTag === 'others-pointed-out' ? colors.tagOthersPointedOutText : colors.textSecondary,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: Typography.bodySmall.fontSize,
                }}
              >
                <Icon name="people" size={16} />
                <span>Someone pointed it out</span>
              </button>
            </div>

            <textarea
              autoFocus
              value={realizationContent}
              onChange={(e) => setRealizationContent(e.target.value)}
              placeholder="What did you discover about yourself?"
              rows={6}
              style={{
                width: '100%',
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
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
          </div>
        </div>
      )}

      {/* Open Area Add Strength & Quality Modal */}
      {openAreaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: BorderRadius.xl,
              borderTopRightRadius: BorderRadius.xl,
              padding: Spacing.lg,
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: Spacing.md,
                borderBottom: `1px solid ${colors.divider}`,
                marginBottom: Spacing.lg,
              }}
            >
              <button
                onClick={() => setOpenAreaModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textSecondary,
                  fontSize: Typography.body.fontSize,
                }}
              >
                Cancel
              </button>
              <span
                style={{
                  fontSize: Typography.h3.fontSize,
                  fontWeight: Typography.h3.fontWeight,
                  color: colors.textPrimary,
                }}
              >
                Add Strength &amp; Quality
              </span>
              <button
                onClick={handleSaveOpenStrength}
                disabled={!strengthTitle.trim()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: !strengthTitle.trim() ? 'not-allowed' : 'pointer',
                  color: !strengthTitle.trim() ? colors.textTertiary : qColors.accent,
                  fontSize: Typography.button.fontSize,
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>

            <p
              style={{
                fontSize: Typography.bodySmall.fontSize,
                lineHeight: Typography.bodySmall.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.lg,
                marginTop: 0,
              }}
            >
              Qualities and strengths that both you and others recognize about you.
            </p>

            <label
              style={{
                display: 'block',
                fontSize: Typography.bodySmall.fontSize,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              Strength or Quality
            </label>
            <input
              autoFocus
              type="text"
              value={strengthTitle}
              onChange={(e) => setStrengthTitle(e.target.value)}
              placeholder="e.g. Calm under pressure, Empathetic, Reliable"
              style={{
                width: '100%',
                fontSize: Typography.body.fontSize,
                padding: Spacing.md,
                borderRadius: BorderRadius.md,
                border: `1px solid ${colors.cardBorder}`,
                backgroundColor: colors.card,
                color: colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: Spacing.md,
              }}
            />

            <label
              style={{
                display: 'block',
                fontSize: Typography.bodySmall.fontSize,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              How do both you and others see this? (Optional)
            </label>
            <textarea
              value={strengthDescription}
              onChange={(e) => setStrengthDescription(e.target.value)}
              placeholder="e.g. Friends often point out my patience in tough situations, and I feel naturally grounded."
              rows={4}
              style={{
                width: '100%',
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
                padding: Spacing.md,
                borderRadius: BorderRadius.md,
                border: `1px solid ${colors.cardBorder}`,
                backgroundColor: colors.card,
                color: colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: Spacing.lg,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
