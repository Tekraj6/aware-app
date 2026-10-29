import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getProfile,
  getStats,
  saveProfile,
  getFeedback,
  getJournalEntries,
  getRealizations,
  exportAllData,
  resetAllData,
  UserProfile,
} from '../storage/dataStore';
import { generateJohariPdf } from '../utils/exportPdf';
import {
  downloadFileToDevice,
  openDownloadedFile,
  shareDownloadedFile,
  ExportResult,
} from '../utils/fileDownloader';
import PrimaryButton from '../components/PrimaryButton';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import Icon from '../components/Icon';

interface ProfileTabScreenProps {
  onResetToOnboarding: () => void;
}

export default function ProfileTabScreen({ onResetToOnboarding }: ProfileTabScreenProps) {
  const { colors, mode, setMode, isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    feedbackCount: 0,
    journalCount: 0,
    realizationCount: 0,
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Uri = reader.result as string;
        const newProfile = { ...profile, photoUri: base64Uri };
        await saveProfile(newProfile);
        setProfile(newProfile);
      };
      reader.readAsDataURL(file);
    }
  };

  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const [f, j, r] = await Promise.all([
        getFeedback(),
        getJournalEntries(),
        getRealizations(),
      ]);
      const res = await generateJohariPdf({
        profile,
        feedback: f,
        journal: j,
        realizations: r,
      });
      setExportResult(res);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to generate PDF report');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExport = async () => {
    setExportingJson(true);
    try {
      const data = await exportAllData();
      const res = await downloadFileToDevice({
        filename: 'aware_export.json',
        data: data,
        mimeType: 'application/json',
        isBase64: false,
        title: 'Aware Data Backup (JSON)',
      });
      setExportResult(res);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export your data');
    } finally {
      setExportingJson(false);
    }
  };

  const handleReset = async () => {
    await resetAllData();
    setShowResetConfirm(false);
    onResetToOnboarding();
  };

  const StatBox = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '14px 6px',
        borderRadius: BorderRadius.lg,
        border: `1px solid ${colors.cardBorder}`,
        backgroundColor: colors.card,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Icon name={icon} size={22} color={colors.accent} />
      <div
        style={{
          fontSize: Typography.h2.fontSize,
          fontWeight: Typography.h2.fontWeight,
          lineHeight: Typography.h2.lineHeight,
          color: colors.textPrimary,
          marginTop: Spacing.xs,
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: colors.textSecondary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        paddingBottom: 120,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingLeft: Spacing.lg,
          paddingRight: Spacing.lg,
          paddingTop: Spacing.lg,
          paddingBottom: Spacing.md,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        <h1
          style={{
            fontSize: Typography.h1.fontSize,
            fontWeight: Typography.h1.fontWeight,
            lineHeight: Typography.h1.lineHeight,
            color: colors.textPrimary,
            margin: 0,
          }}
        >
          Profile
        </h1>
      </div>

      <div
        style={{
          padding: Spacing.md,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Profile Avatar & Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: Spacing.lg,
            marginBottom: Spacing.lg,
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePickImage}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            title="Change photo"
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Spacing.md,
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              overflow: 'visible',
            }}
          >
            {profile?.photoUri ? (
              <img
                src={profile.photoUri}
                alt="Profile"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: colors.accent,
                }}
              >
                {profile?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #fff',
              }}
            >
              <Icon name="camera" size={12} color="#fff" />
            </div>
          </div>

          <div
            style={{
              fontSize: Typography.h2.fontSize,
              fontWeight: Typography.h2.fontWeight,
              lineHeight: Typography.h2.lineHeight,
              color: colors.textPrimary,
              marginBottom: 4,
            }}
          >
            {profile?.name}
          </div>
          <div
            style={{
              fontSize: Typography.caption.fontSize,
              lineHeight: Typography.caption.lineHeight,
              color: colors.textTertiary,
            }}
          >
            Joined{' '}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : 'Recently'}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: Spacing.sm,
            marginBottom: Spacing.xl,
          }}
        >
          <StatBox label="Feedback" value={stats.feedbackCount} icon="chatbubbles" />
          <StatBox label="Reflections" value={stats.journalCount} icon="journal" />
          <StatBox label="Realizations" value={stats.realizationCount} icon="bulb" />
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: Spacing.xl }}>
          <h2
            style={{
              fontSize: Typography.h3.fontSize,
              fontWeight: Typography.h3.fontWeight,
              lineHeight: Typography.h3.lineHeight,
              color: colors.textPrimary,
              marginBottom: Spacing.md,
              marginLeft: Spacing.xs,
              marginTop: 0,
            }}
          >
            Preferences
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: Spacing.lg,
              borderRadius: BorderRadius.lg,
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: colors.card,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
              }}
            >
              <Icon name="moon" size={20} color={colors.textSecondary} />
              <span
                style={{
                  fontSize: Typography.body.fontSize,
                  fontWeight: 500,
                  color: colors.textPrimary,
                }}
              >
                Dark Mode
              </span>
            </div>

            {/* Custom Toggle Switch */}
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 48,
                height: 28,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isDark}
                onChange={(e) => setMode(e.target.checked ? 'dark' : 'light')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isDark ? colors.accent : colors.cardBorder,
                  borderRadius: 28,
                  transition: '0.2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    content: '""',
                    height: 22,
                    width: 22,
                    left: isDark ? 23 : 3,
                    bottom: 3,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Data Actions */}
        <div style={{ marginBottom: Spacing.xl }}>
          <h2
            style={{
              fontSize: Typography.h3.fontSize,
              fontWeight: Typography.h3.fontWeight,
              lineHeight: Typography.h3.lineHeight,
              color: colors.textPrimary,
              marginBottom: Spacing.md,
              marginLeft: Spacing.xs,
              marginTop: 0,
            }}
          >
            Data
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm, marginBottom: Spacing.md }}>
            <PrimaryButton
              title="Export PDF Report (4 Categories)"
              onPress={handleExportPdf}
              loading={exportingPdf}
              variant="primary"
              icon={<Icon name="pdf" size={20} color="#fff" />}
            />

            <PrimaryButton
              title="Export as JSON"
              onPress={handleExport}
              loading={exportingJson}
              variant="secondary"
              icon={<Icon name="json" size={20} color={colors.accent} />}
            />
          </div>

          <PrimaryButton
            title="Reset All Data"
            onPress={() => setShowResetConfirm(true)}
            variant="danger"
            icon={<Icon name="warning-outline" size={20} color={colors.danger} />}
          />
        </div>

        {/* Educational Info */}
        <div
          style={{
            padding: Spacing.lg,
            borderRadius: BorderRadius.lg,
            border: `1px solid ${colors.accent}33`,
            backgroundColor: colors.accentLight,
            marginTop: Spacing.md,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              marginBottom: Spacing.sm,
            }}
          >
            <Icon name="information-circle" size={24} color={colors.accent} />
            <span
              style={{
                fontSize: Typography.h3.fontSize,
                fontWeight: Typography.h3.fontWeight,
                color: colors.accent,
              }}
            >
              The Johari Window
            </span>
          </div>
          <p
            style={{
              fontSize: Typography.bodySmall.fontSize,
              lineHeight: '22px',
              color: `${colors.accent}DD`,
              margin: 0,
            }}
          >
            Aware is based on the Johari Window, a psychological framework created in 1955 by
            Joseph Luft and Harry Ingham. It helps you understand your relationship with yourself
            and others.
          </p>
        </div>

        {/* About Me Section */}
        <div
          style={{
            padding: Spacing.lg,
            borderRadius: BorderRadius.lg,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.card,
            marginTop: Spacing.md,
            marginBottom: Spacing.md,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: Spacing.sm,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.accentLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="sparkles" size={18} color={colors.accent} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    color: colors.accent,
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  About the Creator
                </span>
                <span
                  style={{
                    fontSize: Typography.h3.fontSize,
                    fontWeight: Typography.h3.fontWeight,
                    color: colors.textPrimary,
                  }}
                >
                  Er. Tekraj Khadka
                </span>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: Typography.bodySmall.fontSize,
              lineHeight: '24px',
              color: colors.textSecondary,
              marginTop: Spacing.xs,
              marginBottom: Spacing.md,
              textAlign: 'left',
              textWrap: 'pretty' as any,
            }}
          >
            I am deeply interested in creating meaningful digital tools that connect life and
            technology. Feedback and suggestions are always welcome.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.xs,
              padding: Spacing.md,
              borderRadius: BorderRadius.md,
              backgroundColor: colors.background,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <span
              style={{
                fontSize: Typography.caption.fontSize,
                fontWeight: 600,
                color: colors.textSecondary,
              }}
            >
              Email for feedback &amp; suggestions:
            </span>
            <a
              href="mailto:khadkatekraj150@gmail.com?subject=Aware%20App%20Feedback%20%26%20Suggestions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: Spacing.xs,
                color: colors.accent,
                textDecoration: 'none',
                fontSize: Typography.bodySmall.fontSize,
                fontWeight: 600,
                wordBreak: 'break-all',
              }}
              className="hover:underline"
            >
              <Icon name="mail" size={16} color={colors.accent} />
              <span>khadkatekraj150@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
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
              Reset All Data
            </h3>
            <p
              style={{
                fontSize: Typography.bodySmall.fontSize,
                lineHeight: Typography.bodySmall.lineHeight,
                color: colors.textSecondary,
                marginBottom: Spacing.xl,
              }}
            >
              Are you sure you want to delete all your feedback, journals, and profile data? This
              cannot be undone.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
              <PrimaryButton
                title="Delete Everything"
                onPress={handleReset}
                variant="danger"
              />
              <PrimaryButton
                title="Cancel"
                onPress={() => setShowResetConfirm(false)}
                variant="ghost"
              />
            </div>
          </div>
        </div>
      )}

      {/* Export Downloaded & Open Modal */}
      {exportResult && (
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
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: colors.card,
              borderRadius: BorderRadius.xl,
              padding: Spacing.xl,
              maxWidth: 380,
              width: '100%',
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${colors.open.accent}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: Spacing.md,
              }}
            >
              <Icon name="checkmark-circle" size={32} color={colors.open.accent} />
            </div>

            <h3
              style={{
                fontSize: Typography.h2.fontSize,
                fontWeight: Typography.h2.fontWeight,
                color: colors.textPrimary,
                marginBottom: Spacing.xs,
                marginTop: 0,
              }}
            >
              Downloaded to Device
            </h3>

            <p
              style={{
                fontSize: Typography.bodySmall.fontSize,
                lineHeight: '20px',
                color: colors.textSecondary,
                marginBottom: Spacing.lg,
                marginTop: 0,
                wordBreak: 'break-all',
              }}
            >
              <strong>{exportResult.filename}</strong> has been saved directly to your device.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
              <PrimaryButton
                title="Open File"
                onPress={() => openDownloadedFile(exportResult)}
                variant="primary"
                icon={<Icon name="open" size={18} color="#fff" />}
              />

              <PrimaryButton
                title="Share / Send"
                onPress={() => shareDownloadedFile(exportResult)}
                variant="secondary"
                icon={<Icon name="share" size={18} color={colors.accent} />}
              />

              <button
                type="button"
                onClick={() => setExportResult(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textSecondary,
                  fontSize: Typography.bodySmall.fontSize,
                  fontWeight: 600,
                  padding: `${Spacing.sm}px ${Spacing.md}px`,
                  cursor: 'pointer',
                  marginTop: Spacing.xs,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
