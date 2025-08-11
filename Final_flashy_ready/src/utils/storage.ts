import { FlashcardDeck, Note, CalendarEvent, Task, Goal, MoodEntry, UserProfile, Quiz, PomodoroSettings } from '../types';

export const storage = {
  // Flashcards
  getDecks: (): FlashcardDeck[] => {
    const stored = localStorage.getItem('studysync_decks');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveDecks: (decks: FlashcardDeck[]) => {
    localStorage.setItem('studysync_decks', JSON.stringify(decks));
  },

  // Notes
  getNotes: (): Note[] => {
    const stored = localStorage.getItem('studysync_notes');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveNotes: (notes: Note[]) => {
    localStorage.setItem('studysync_notes', JSON.stringify(notes));
  },

  // Calendar Events
  getEvents: (): CalendarEvent[] => {
    const stored = localStorage.getItem('studysync_events');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveEvents: (events: CalendarEvent[]) => {
    localStorage.setItem('studysync_events', JSON.stringify(events));
  },

  // Tasks
  getTasks: (): Task[] => {
    const stored = localStorage.getItem('studysync_tasks');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem('studysync_tasks', JSON.stringify(tasks));
  },

  // Goals
  getGoals: (): Goal[] => {
    const stored = localStorage.getItem('studysync_goals');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveGoals: (goals: Goal[]) => {
    localStorage.setItem('studysync_goals', JSON.stringify(goals));
  },

  // Mood entries
  getMoodEntries: (): MoodEntry[] => {
    const stored = localStorage.getItem('studysync_mood');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveMoodEntries: (entries: MoodEntry[]) => {
    localStorage.setItem('studysync_mood', JSON.stringify(entries));
  },

  // User profile
  getProfile: (): UserProfile | null => {
    const stored = localStorage.getItem('studysync_profile');
    return stored ? JSON.parse(stored) : null;
  },
  
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem('studysync_profile', JSON.stringify(profile));
  },

  // Quizzes
  getQuizzes: (): Quiz[] => {
    const stored = localStorage.getItem('studysync_quizzes');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveQuizzes: (quizzes: Quiz[]) => {
    localStorage.setItem('studysync_quizzes', JSON.stringify(quizzes));
  },

  // Pomodoro settings
  getPomodoroSettings: (): PomodoroSettings => {
    const stored = localStorage.getItem('studysync_pomodoro');
    return stored ? JSON.parse(stored) : {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      cycles: 4,
      soundEnabled: true
    };
  },
  
  savePomodoroSettings: (settings: PomodoroSettings) => {
    localStorage.setItem('studysync_pomodoro', JSON.stringify(settings));
  },

  // Export all data
  exportAllData: () => {
    return {
      decks: storage.getDecks(),
      notes: storage.getNotes(),
      events: storage.getEvents(),
      tasks: storage.getTasks(),
      goals: storage.getGoals(),
      moodEntries: storage.getMoodEntries(),
      profile: storage.getProfile(),
      quizzes: storage.getQuizzes(),
      pomodoroSettings: storage.getPomodoroSettings(),
      exportedAt: new Date().toISOString()
    };
  },

  // Import all data
  importAllData: (data: any) => {
    try {
      if (data.decks) localStorage.setItem('studysync_decks', JSON.stringify(data.decks));
      if (data.notes) localStorage.setItem('studysync_notes', JSON.stringify(data.notes));
      if (data.events) localStorage.setItem('studysync_events', JSON.stringify(data.events));
      if (data.tasks) localStorage.setItem('studysync_tasks', JSON.stringify(data.tasks));
      if (data.goals) localStorage.setItem('studysync_goals', JSON.stringify(data.goals));
      if (data.moodEntries) localStorage.setItem('studysync_mood', JSON.stringify(data.moodEntries));
      if (data.profile) localStorage.setItem('studysync_profile', JSON.stringify(data.profile));
      if (data.quizzes) localStorage.setItem('studysync_quizzes', JSON.stringify(data.quizzes));
      if (data.pomodoroSettings) localStorage.setItem('studysync_pomodoro', JSON.stringify(data.pomodoroSettings));
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData: () => {
    const keys = [
      'studysync_decks',
      'studysync_notes', 
      'studysync_events',
      'studysync_tasks',
      'studysync_goals',
      'studysync_mood',
      'studysync_profile',
      'studysync_quizzes',
      'studysync_pomodoro'
    ];
    keys.forEach(key => localStorage.removeItem(key));
  }
};