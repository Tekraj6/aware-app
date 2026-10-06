export type QuadrantType = 'open' | 'blindspot' | 'hidden' | 'unknown';

export interface QuadrantQuestion {
  id: string;
  text: string;
  quadrant: QuadrantType;
}

export const QUADRANT_INFO: Record<
  QuadrantType,
  {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    signalLabel: string;
  }
> = {
  open: {
    title: 'Open Area',
    subtitle: 'Known to self · Known to others',
    description:
      'Identify strengths and qualities that both you and others recognize. This area grows as you share more and receive feedback.',
    icon: 'eye',
    signalLabel: 'insights discovered',
  },
  blindspot: {
    title: 'Blind Spot',
    subtitle: 'Unknown to self · Known to others',
    description:
      'Learn what others see that you do not. These are qualities, habits, or patterns that others notice but you may be unaware of.',
    icon: 'glasses',
    signalLabel: 'feedback themes uncovered',
  },
  hidden: {
    title: 'Hidden Area',
    subtitle: 'Known to self · Unknown to others',
    description:
      'Reveal things only you know. This is your private space for honest self-reflection on fears, dreams, and truths you keep inside.',
    icon: 'lock-closed',
    signalLabel: 'personal reflections shared',
  },
  unknown: {
    title: 'Unknown Area',
    subtitle: 'Unknown to self · Unknown to others',
    description:
      'Explore surprising realizations about yourself. Capture belief-shattering moments and unexpected discoveries — things that surprised both you and others.',
    icon: 'help-circle',
    signalLabel: 'emerging patterns detected',
  },
};

export const QUESTIONS: Record<QuadrantType, QuadrantQuestion[]> = {
  open: [
    {
      id: 'open-1',
      text: 'What am I consistently good at?',
      quadrant: 'open',
    },
    {
      id: 'open-2',
      text: 'What do people rely on me for?',
      quadrant: 'open',
    },
    {
      id: 'open-3',
      text: 'What is a defining strength of mine?',
      quadrant: 'open',
    },
    {
      id: 'open-4',
      text: 'What positive trait do people first notice about me?',
      quadrant: 'open',
    },
    {
      id: 'open-5',
      text: 'What value do I bring to a group?',
      quadrant: 'open',
    },
  ],
  blindspot: [
    {
      id: 'blind-1',
      text: "What is something about me that I don't see?",
      quadrant: 'blindspot',
    },
    {
      id: 'blind-2',
      text: 'What habit may be holding me back?',
      quadrant: 'blindspot',
    },
    {
      id: 'blind-3',
      text: 'What strength do I underestimate?',
      quadrant: 'blindspot',
    },
    {
      id: 'blind-4',
      text: 'When am I hardest to deal with?',
      quadrant: 'blindspot',
    },
    {
      id: 'blind-5',
      text: 'What should I do more often?',
      quadrant: 'blindspot',
    },
  ],
  hidden: [
    {
      id: 'hidden-1',
      text: 'What fear do I rarely discuss?',
      quadrant: 'hidden',
    },
    {
      id: 'hidden-2',
      text: 'What do I wish people understood about me?',
      quadrant: 'hidden',
    },
    {
      id: 'hidden-3',
      text: 'What am I pretending not to know?',
      quadrant: 'hidden',
    },
    {
      id: 'hidden-4',
      text: 'What dream am I avoiding?',
      quadrant: 'hidden',
    },
    {
      id: 'hidden-5',
      text: 'What truth about myself am I not ready to face?',
      quadrant: 'hidden',
    },
  ],
  unknown: [
    {
      id: 'unknown-1',
      text: 'What surprised me about myself recently?',
      quadrant: 'unknown',
    },
    {
      id: 'unknown-2',
      text: 'What belief did I let go of?',
      quadrant: 'unknown',
    },
    {
      id: 'unknown-3',
      text: 'What did someone see in me that I never saw?',
      quadrant: 'unknown',
    },
    {
      id: 'unknown-4',
      text: 'When did I react in a way that surprised me?',
      quadrant: 'unknown',
    },
    {
      id: 'unknown-5',
      text: 'What new side of myself have I discovered?',
      quadrant: 'unknown',
    },
  ],
};

// Feedback-collectible quadrants (Hidden is journal-only, Unknown is realizations)
export const FEEDBACK_QUADRANTS: QuadrantType[] = ['blindspot', 'open'];
