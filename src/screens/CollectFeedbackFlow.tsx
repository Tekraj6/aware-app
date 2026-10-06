import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import PrimaryButton from '../components/PrimaryButton';
import {
  FEEDBACK_QUADRANTS,
  QUADRANT_INFO,
  QUESTIONS,
  QuadrantType,
} from '../constants/questions';
import { ROLES, RoleId } from '../constants/roles';
import { addFeedback } from '../storage/dataStore';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import Icon from '../components/Icon';

interface CollectFeedbackFlowProps {
  initialQuadrant?: 'open' | 'blindspot';
  onClose: () => void;
  onSaved: () => void;
}

export default function CollectFeedbackFlow({
  initialQuadrant,
  onClose,
  onSaved,
}: CollectFeedbackFlowProps) {
  const { colors } = useTheme();

  const [step, setStep] = useState<number>(initialQuadrant ? 1 : 0);
  const [selectedQuadrant, setSelectedQuadrant] = useState<'open' | 'blindspot'>(
    initialQuadrant || 'open'
  );
  const [selectedRole, setSelectedRole] = useState<string>('bestfriend');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [isEditingQuestionInResponse, setIsEditingQuestionInResponse] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const qColors = colors[selectedQuadrant] || colors.accent;
  const currentQuestions = QUESTIONS[selectedQuadrant] || [];

  const handleSelectQuadrant = (q: QuadrantType) => {
    setSelectedQuadrant(q as 'open' | 'blindspot');
    setStep(1);
  };

  const handleSelectRole = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleSelectQuestion = (qText: string) => {
    setSelectedQuestion(qText);
    setStep(3);
  };

  const handleSaveFeedback = async () => {
    if (!response.trim() || !selectedQuestion.trim()) return;
    setSaving(true);
    try {
      await addFeedback({
        quadrant: selectedQuadrant,
        role: selectedRole,
        question: selectedQuestion.trim(),
        response: response.trim(),
      });
      setStep(4); // Saved celebration step
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Error saving feedback');
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    onSaved();
    onClose();
  };

  const handleBack = () => {
    if (initialQuadrant && step <= 1) {
      onClose();
      return;
    }
    if (step > 0 && step < 4) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.background,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 56,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: Spacing.md,
          paddingRight: Spacing.md,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        {step > 0 && step < 4 ? (
          <button
            onClick={handleBack}
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
        ) : (
          <div style={{ width: 40 }} />
        )}

        <button
          onClick={onClose}
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
          <Icon name="close" size={24} color={colors.textPrimary} />
        </button>
      </div>

      {/* Progress Dots */}
      {step < 4 && (
        <StepIndicator
          totalSteps={initialQuadrant ? 3 : 4}
          currentStep={initialQuadrant ? Math.max(0, step - 1) : step}
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: Spacing.xl, display: 'flex', flexDirection: 'column' }}>
        {/* Step 0: Choose Quadrant */}
        {step === 0 && (
          <div>
            <h1
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                lineHeight: Typography.h2.lineHeight,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
                marginTop: 0,
              }}
            >
              What area are you exploring?
            </h1>
            <p
              style={{
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.xl,
                marginTop: 0,
              }}
            >
              Choose the type of feedback you want to collect.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
              {FEEDBACK_QUADRANTS.map((quadrant) => {
                const info = QUADRANT_INFO[quadrant];
                const qColor = colors[quadrant];

                return (
                  <div
                    key={quadrant}
                    onClick={() => handleSelectQuadrant(quadrant)}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: Spacing.lg,
                      borderRadius: BorderRadius.lg,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: colors.card,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'transform 0.15s ease',
                    }}
                    className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: Spacing.md,
                        backgroundColor: qColor.bg,
                      }}
                    >
                      <Icon name={info.icon} size={24} color={qColor.accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: Typography.h3.fontSize,
                          fontWeight: Typography.h3.fontWeight,
                          color: qColor.accent,
                          marginBottom: 2,
                        }}
                      >
                        {info.title}
                      </div>
                      <div
                        style={{
                          fontSize: Typography.caption.fontSize,
                          color: colors.textSecondary,
                        }}
                      >
                        {info.subtitle.split(' · ')[1]}
                      </div>
                    </div>
                    <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Choose Role */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                lineHeight: Typography.h2.lineHeight,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
                marginTop: 0,
              }}
            >
              Who are you asking?
            </h1>
            <p
              style={{
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.xl,
                marginTop: 0,
              }}
            >
              Select the relationship. Different roles offer different perspectives.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: Spacing.md,
                paddingBottom: Spacing.xl,
              }}
            >
              {ROLES.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  role="button"
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: Spacing.lg,
                    borderRadius: BorderRadius.lg,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: colors.card,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing.md,
                      backgroundColor: colors.accentLight,
                    }}
                  >
                    <Icon name={role.icon} size={24} color={colors.accent} />
                  </div>
                  <span
                    style={{
                      fontSize: Typography.bodySmall.fontSize,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      textAlign: 'center',
                    }}
                  >
                    {role.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Question */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                lineHeight: Typography.h2.lineHeight,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
                marginTop: 0,
              }}
            >
              Questions to ask
            </h1>
            <p
              style={{
                fontSize: Typography.body.fontSize,
                lineHeight: Typography.body.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.lg,
                marginTop: 0,
              }}
            >
              Questions are guides. Type your own custom question below or pick a guide question to get started.
            </p>

            {/* Custom Question Card */}
            <div
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: BorderRadius.lg,
                padding: Spacing.lg,
                marginBottom: Spacing.xl,
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: Typography.h3.fontSize,
                  fontWeight: Typography.h3.fontWeight,
                  color: colors.textPrimary,
                  marginBottom: Spacing.xs,
                }}
              >
                Ask your own question
              </label>
              <p
                style={{
                  fontSize: Typography.caption.fontSize,
                  color: colors.textSecondary,
                  marginBottom: Spacing.sm,
                  marginTop: 0,
                }}
              >
                Type any custom question you want to ask your {selectedRole}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                <input
                  type="text"
                  value={customQuestionInput}
                  onChange={(e) => setCustomQuestionInput(e.target.value)}
                  placeholder="e.g. What is one habit of mine you've noticed?"
                  style={{
                    width: '100%',
                    fontSize: Typography.body.fontSize,
                    padding: Spacing.md,
                    borderRadius: BorderRadius.md,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customQuestionInput.trim()) {
                      e.preventDefault();
                      handleSelectQuestion(customQuestionInput.trim());
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!customQuestionInput.trim()}
                  onClick={() => handleSelectQuestion(customQuestionInput.trim())}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: qColors.accent,
                    color: '#fff',
                    border: 'none',
                    padding: `${Spacing.sm}px ${Spacing.lg}px`,
                    borderRadius: BorderRadius.md,
                    fontWeight: 600,
                    fontSize: Typography.bodySmall.fontSize,
                    cursor: !customQuestionInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: !customQuestionInput.trim() ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  Use Custom Question &rarr;
                </button>
              </div>
            </div>

            <div
              style={{
                fontSize: Typography.h3.fontSize,
                fontWeight: Typography.h3.fontWeight,
                color: colors.textPrimary,
                marginBottom: Spacing.md,
              }}
            >
              Guide Questions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md, paddingBottom: Spacing.xl }}>
              {currentQuestions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => handleSelectQuestion(question.text)}
                  role="button"
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: Spacing.lg,
                    borderRadius: BorderRadius.lg,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: colors.card,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: Spacing.md,
                      backgroundColor: qColors.bg,
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="chatbubble-outline" size={20} color={qColors.accent} />
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: Typography.body.fontSize,
                      fontWeight: 500,
                      color: colors.textPrimary,
                      marginRight: Spacing.md,
                    }}
                  >
                    {question.text}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs }}>
                    <button
                      type="button"
                      title="Customize this question"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomQuestionInput(question.text);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: colors.textTertiary,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      className="hover:opacity-75"
                    >
                      <Icon name="pencil" size={16} color={colors.textSecondary} />
                    </button>
                    <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Enter Response */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div>
              <h1
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  lineHeight: Typography.h2.lineHeight,
                  color: colors.textPrimary,
                  marginBottom: Spacing.xs,
                  marginTop: 0,
                }}
              >
                Log their response
              </h1>
              <p
                style={{
                  fontSize: Typography.body.fontSize,
                  lineHeight: Typography.body.lineHeight,
                  color: colors.textSecondary,
                  marginBottom: Spacing.xl,
                  marginTop: 0,
                }}
              >
                Type out what they said. Be as honest and accurate as possible.
              </p>

              {/* Question summary banner with inline edit option */}
              <div
                style={{
                  padding: Spacing.lg,
                  borderRadius: BorderRadius.lg,
                  border: `1px solid ${qColors.accent}33`,
                  backgroundColor: qColors.bg,
                  marginBottom: Spacing.xl,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: Spacing.sm,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      color: qColors.accent,
                    }}
                  >
                    QUESTION FOR {selectedRole.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingQuestionInResponse(!isEditingQuestionInResponse)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      color: qColors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Icon name="pencil" size={12} color={qColors.accent} />
                    {isEditingQuestionInResponse ? 'Done' : 'Edit question'}
                  </button>
                </div>

                {isEditingQuestionInResponse ? (
                  <input
                    type="text"
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      fontSize: Typography.body.fontSize,
                      fontWeight: 600,
                      padding: Spacing.sm,
                      borderRadius: BorderRadius.sm,
                      border: `1px solid ${qColors.accent}`,
                      backgroundColor: colors.card,
                      color: colors.textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: Typography.h3.fontSize,
                      fontWeight: Typography.h3.fontWeight,
                      lineHeight: Typography.h3.lineHeight,
                      color: qColors.accent,
                    }}
                  >
                    {selectedQuestion}
                  </div>
                )}
              </div>

              <textarea
                autoFocus
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="What did they say?"
                rows={7}
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
            </div>

            <div style={{ paddingTop: Spacing.xl, paddingBottom: Spacing.md }}>
              <PrimaryButton
                title="Save Feedback"
                onPress={handleSaveFeedback}
                disabled={!response.trim() || saving}
                loading={saving}
                style={{ backgroundColor: qColors.accent }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Success confirmation */}
        {step === 4 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              paddingLeft: Spacing.lg,
              paddingRight: Spacing.lg,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: qColors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing.xl,
              }}
            >
              <Icon name="checkmark-circle" size={80} color={qColors.accent} />
            </div>

            <h1
              style={{
                fontSize: Typography.h1.fontSize,
                fontWeight: Typography.h1.fontWeight,
                color: colors.textPrimary,
                marginBottom: Spacing.sm,
                marginTop: 0,
              }}
            >
              Feedback Saved
            </h1>
            <p
              style={{
                fontSize: Typography.body.fontSize,
                lineHeight: '24px',
                color: colors.textSecondary,
                marginBottom: Spacing.xxl,
                maxWidth: 320,
              }}
            >
              You've added a new insight to your {QUADRANT_INFO[selectedQuadrant]?.title || 'profile'}. Keep exploring to increase your self-awareness.
            </p>

            <div style={{ width: '100%', maxWidth: 320 }}>
              <PrimaryButton
                title="Done"
                onPress={handleDone}
                style={{ backgroundColor: qColors.accent }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
