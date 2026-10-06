// ============= Types =============

export interface UserProfile {
  name: string;
  photoUri: string | null;
  createdAt: string;
}

export interface FeedbackEntry {
  id: string;
  quadrant: 'open' | 'blindspot';
  role: string;
  question: string;
  response: string;
  date: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  content: string;
  date: string;
  updatedAt: string;
}

export interface RealizationEntry {
  id: string;
  content: string;
  tag: 'self-discovered' | 'others-pointed-out';
  date: string;
  updatedAt: string;
}

// ============= Storage Keys =============

const KEYS = {
  PROFILE: '@aware_profile',
  FEEDBACK: '@aware_feedback',
  JOURNAL: '@aware_journal',
  REALIZATIONS: '@aware_realizations',
  ONBOARDED: '@aware_onboarded',
};

// ============= Helper Storage =============

function getItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage', e);
  }
}

// ============= UUID Helper =============

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ============= Profile =============

export async function getProfile(): Promise<UserProfile | null> {
  const data = getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function isOnboarded(): Promise<boolean> {
  const val = getItem(KEYS.ONBOARDED);
  return val === 'true';
}

export async function setOnboarded(): Promise<void> {
  setItem(KEYS.ONBOARDED, 'true');
}

// ============= Feedback =============

export async function getFeedback(): Promise<FeedbackEntry[]> {
  const data = getItem(KEYS.FEEDBACK);
  return data ? JSON.parse(data) : [];
}

export async function addFeedback(
  entry: Omit<FeedbackEntry, 'id' | 'date' | 'updatedAt'>
): Promise<FeedbackEntry> {
  const entries = await getFeedback();
  const now = new Date().toISOString();
  const newEntry: FeedbackEntry = {
    ...entry,
    id: generateId(),
    date: now,
    updatedAt: now,
  };
  entries.unshift(newEntry);
  setItem(KEYS.FEEDBACK, JSON.stringify(entries));
  return newEntry;
}

export async function updateFeedback(
  id: string,
  updates: Partial<Pick<FeedbackEntry, 'response' | 'question' | 'role'>>
): Promise<void> {
  const entries = await getFeedback();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(KEYS.FEEDBACK, JSON.stringify(entries));
  }
}

export async function deleteFeedback(id: string): Promise<void> {
  const entries = await getFeedback();
  const filtered = entries.filter((e) => e.id !== id);
  setItem(KEYS.FEEDBACK, JSON.stringify(filtered));
}

// ============= Journal =============

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const data = getItem(KEYS.JOURNAL);
  return data ? JSON.parse(data) : [];
}

export async function addJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'date' | 'updatedAt'>
): Promise<JournalEntry> {
  const entries = await getJournalEntries();
  const now = new Date().toISOString();
  const newEntry: JournalEntry = {
    ...entry,
    id: generateId(),
    date: now,
    updatedAt: now,
  };
  entries.unshift(newEntry);
  setItem(KEYS.JOURNAL, JSON.stringify(entries));
  return newEntry;
}

export async function updateJournalEntry(
  id: string,
  updates: Partial<Pick<JournalEntry, 'content'>>
): Promise<void> {
  const entries = await getJournalEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(KEYS.JOURNAL, JSON.stringify(entries));
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const entries = await getJournalEntries();
  const filtered = entries.filter((e) => e.id !== id);
  setItem(KEYS.JOURNAL, JSON.stringify(filtered));
}

// ============= Realizations =============

export async function getRealizations(): Promise<RealizationEntry[]> {
  const data = getItem(KEYS.REALIZATIONS);
  return data ? JSON.parse(data) : [];
}

export async function addRealization(
  entry: Omit<RealizationEntry, 'id' | 'date' | 'updatedAt'>
): Promise<RealizationEntry> {
  const entries = await getRealizations();
  const now = new Date().toISOString();
  const newEntry: RealizationEntry = {
    ...entry,
    id: generateId(),
    date: now,
    updatedAt: now,
  };
  entries.unshift(newEntry);
  setItem(KEYS.REALIZATIONS, JSON.stringify(entries));
  return newEntry;
}

export async function updateRealization(
  id: string,
  updates: Partial<Pick<RealizationEntry, 'content' | 'tag'>>
): Promise<void> {
  const entries = await getRealizations();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(KEYS.REALIZATIONS, JSON.stringify(entries));
  }
}

export async function deleteRealization(id: string): Promise<void> {
  const entries = await getRealizations();
  const filtered = entries.filter((e) => e.id !== id);
  setItem(KEYS.REALIZATIONS, JSON.stringify(filtered));
}

// ============= Stats =============

export async function getStats(): Promise<{
  feedbackCount: number;
  journalCount: number;
  realizationCount: number;
  openCount: number;
  blindspotCount: number;
}> {
  const [feedback, journal, realizations] = await Promise.all([
    getFeedback(),
    getJournalEntries(),
    getRealizations(),
  ]);
  return {
    feedbackCount: feedback.length,
    journalCount: journal.length,
    realizationCount: realizations.length,
    openCount: feedback.filter((f) => f.quadrant === 'open').length,
    blindspotCount: feedback.filter((f) => f.quadrant === 'blindspot').length,
  };
}

// ============= Export & Reset =============

export async function exportAllData(): Promise<string> {
  const [profile, feedback, journal, realizations] = await Promise.all([
    getProfile(),
    getFeedback(),
    getJournalEntries(),
    getRealizations(),
  ]);
  return JSON.stringify(
    { profile, feedback, journal, realizations, exportedAt: new Date().toISOString() },
    null,
    2
  );
}

export async function resetAllData(): Promise<void> {
  removeItem(KEYS.PROFILE);
  removeItem(KEYS.FEEDBACK);
  removeItem(KEYS.JOURNAL);
  removeItem(KEYS.REALIZATIONS);
  removeItem(KEYS.ONBOARDED);
}
