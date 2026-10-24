import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { isOnboarded } from './storage/dataStore';
import { QuadrantType } from './constants/questions';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import FeedbackTabScreen from './screens/FeedbackTabScreen';
import ProfileTabScreen from './screens/ProfileTabScreen';
import QuadrantScreen from './screens/QuadrantScreen';
import EntryDetailScreen from './screens/EntryDetailScreen';
import CollectFeedbackFlow from './screens/CollectFeedbackFlow';
import Icon from './components/Icon';
import { Typography } from './constants/theme';

type Tab = 'home' | 'feedback' | 'profile';

interface RouteState {
  view: 'main' | 'quadrant' | 'detail' | 'collect';
  quadrant?: QuadrantType;
  detailId?: string;
  detailType?: 'feedback' | 'journal' | 'realization';
  collectQuadrant?: 'open' | 'blindspot';
}

export default function App() {
  const { colors } = useTheme();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [route, setRoute] = useState<RouteState>({ view: 'main' });
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    async function checkStatus() {
      const isDone = await isOnboarded();
      setOnboarded(isDone);
    }
    checkStatus();
  }, []);

  if (onboarded === null) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `3px solid ${colors.accent}`,
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setOnboarded(true);
          setActiveTab('home');
          setRoute({ view: 'main' });
        }}
      />
    );
  }

  // Navigation handlers
  const handleNavigateToQuadrant = (quadrant: QuadrantType) => {
    setRoute({ view: 'quadrant', quadrant });
  };

  const handleSelectItem = (id: string, type: 'feedback' | 'journal' | 'realization') => {
    setRoute({ view: 'detail', detailId: id, detailType: type });
  };

  const handleStartCollectFeedback = (quadrant?: 'open' | 'blindspot') => {
    setRoute({ view: 'collect', collectQuadrant: quadrant });
  };

  const handleBackToMain = () => {
    setRoute({ view: 'main' });
    setRefreshKey((k) => k + 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        backgroundColor: colors.background,
        color: colors.textPrimary,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
      }}
    >
      {/* Scrollable Main Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {route.view === 'quadrant' && route.quadrant && (
          <QuadrantScreen
            key={`quadrant-${route.quadrant}-${refreshKey}`}
            quadrant={route.quadrant}
            onBack={handleBackToMain}
            onSelectItem={handleSelectItem}
            onCollectFeedback={(q) => handleStartCollectFeedback(q)}
          />
        )}

        {route.view === 'detail' && route.detailId && route.detailType && (
          <EntryDetailScreen
            key={`detail-${route.detailId}-${refreshKey}`}
            id={route.detailId}
            type={route.detailType}
            onBack={handleBackToMain}
          />
        )}

        {route.view === 'collect' && (
          <CollectFeedbackFlow
            initialQuadrant={route.collectQuadrant}
            onClose={handleBackToMain}
            onSaved={handleBackToMain}
          />
        )}

        {route.view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                key={`home-${refreshKey}`}
                onNavigateToQuadrant={handleNavigateToQuadrant}
                onStartCollectFeedback={() => handleStartCollectFeedback()}
              />
            )}
            {activeTab === 'feedback' && (
              <FeedbackTabScreen
                key={`feedback-${refreshKey}`}
                onSelectItem={handleSelectItem}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTabScreen
                key={`profile-${refreshKey}`}
                onResetToOnboarding={() => {
                  setOnboarded(false);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Tab Bar (shown when in main view) */}
      {route.view === 'main' && (
        <div
          style={{
            height: 68,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.tabBar,
            borderTop: `1px solid ${colors.tabBarBorder}`,
            paddingBottom: 8,
            paddingTop: 8,
            flexShrink: 0,
            zIndex: 100,
            userSelect: 'none',
          }}
        >
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: 0,
              color: activeTab === 'home' ? colors.tabBarActive : colors.tabBarInactive,
            }}
          >
            <Icon
              name="home"
              size={24}
              color={activeTab === 'home' ? colors.tabBarActive : colors.tabBarInactive}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                marginTop: 4,
                color: activeTab === 'home' ? colors.tabBarActive : colors.tabBarInactive,
              }}
            >
              Home
            </span>
          </button>

          {/* Feedback Tab */}
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: 0,
              color: activeTab === 'feedback' ? colors.tabBarActive : colors.tabBarInactive,
            }}
          >
            <Icon
              name="library"
              size={24}
              color={activeTab === 'feedback' ? colors.tabBarActive : colors.tabBarInactive}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                marginTop: 4,
                color: activeTab === 'feedback' ? colors.tabBarActive : colors.tabBarInactive,
              }}
            >
              Feedback
            </span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: 0,
              color: activeTab === 'profile' ? colors.tabBarActive : colors.tabBarInactive,
            }}
          >
            <Icon
              name="person"
              size={24}
              color={activeTab === 'profile' ? colors.tabBarActive : colors.tabBarInactive}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                marginTop: 4,
                color: activeTab === 'profile' ? colors.tabBarActive : colors.tabBarInactive,
              }}
            >
              Profile
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
