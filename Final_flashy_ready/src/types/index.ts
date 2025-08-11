export interface FlashcardDeck {
  id: string;
  name: string;
  tags: string[];
  coverColor: string;
  cards: Flashcard[];
  createdAt: Date;
  lastStudied?: Date;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  image?: string;
  difficulty: number;
  nextReview?: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  autosaves: { content: string; timestamp: Date }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  tags: string[];
  notes?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  subtasks: SubTask[];
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  milestones: Milestone[];
  progress: number;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  dueDate: Date;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number; // 1-5 scale
  note?: string;
}

export interface StudyStats {
  totalStudyTime: number; // in minutes
  streak: number;
  flashcardsReviewed: number;
  quizzesTaken: number;
  notesCreated: number;
  goalsCompleted: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  avatar: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  studyStats: StudyStats;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  soundEnabled: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
  attempts: QuizAttempt[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  date: Date;
  score: number;
  answers: { questionId: string; answer: string; correct: boolean }[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  saved: boolean;
}